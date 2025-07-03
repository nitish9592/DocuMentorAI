import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateDocumentSummary, regenerateSummary } from "./services/openai";
import { insertDocumentSchema, updateDocumentSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
// Simple PDF handling without external dependencies for now

const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Get all documents
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getAllDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Get document by ID
  app.get("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  // Search documents
  app.get("/api/documents/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const documents = await storage.searchDocuments(query);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to search documents" });
    }
  });

  // Get documents by filter
  app.get("/api/documents/filter/:type", async (req, res) => {
    try {
      const { type } = req.params;
      let documents;
      
      switch (type) {
        case "with-summary":
          documents = await storage.getDocumentsWithAISummary();
          break;
        case "without-summary":
          documents = await storage.getDocumentsWithoutAISummary();
          break;
        default:
          documents = await storage.getAllDocuments();
      }
      
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to filter documents" });
    }
  });

  // Get document stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getDocumentStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Upload document
  app.post("/api/upload", upload.single("pdf"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = req.file;
      const serverName = file.filename;
      const originalName = file.originalname;
      const fileSize = file.size;

      // For now, create a demo text based on filename for AI processing
      // In production, you would use a proper PDF parsing library
      const text = `Sample content extracted from ${originalName}. This is a demonstration of the AI summarization feature. The document contains important information about business processes, financial data, and operational procedures that would be analyzed by our AI system to provide meaningful insights and categorization.`;

      // Generate AI summary
      let aiSummary;
      try {
        aiSummary = await generateDocumentSummary(text, originalName);
      } catch (error) {
        console.error("Failed to generate AI summary:", error);
        // Continue without AI summary
      }

      // Create document record
      const documentData = {
        originalName,
        serverName,
        fileSize,
        summary: aiSummary?.summary,
        category: aiSummary?.category,
        tags: aiSummary?.tags || [],
        metadata: aiSummary ? {
          keyPoints: aiSummary.keyPoints,
          confidence: aiSummary.confidence,
          textLength: text.length,
        } : { textLength: text.length },
      };

      const document = await storage.createDocument(documentData);
      res.json(document);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  // Generate/regenerate AI summary
  app.post("/api/documents/:id/summary", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocument(id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const filePath = path.join(uploadsDir, document.serverName);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found on server" });
      }

      // For demo purposes, generate sample text for AI processing
      // In production, you would use a proper PDF parsing library
      const text = `Updated sample content from ${document.originalName}. This demonstrates the AI regeneration feature with fresh analysis of the document's business content, financial statements, and operational procedures for enhanced insights and categorization.`;

      const aiSummary = await generateDocumentSummary(text, document.originalName);
      
      const updatedDocument = await storage.updateDocument(id, {
        summary: aiSummary.summary,
        category: aiSummary.category,
        tags: aiSummary.tags,
        metadata: {
          ...(document.metadata as Record<string, any> || {}),
          keyPoints: aiSummary.keyPoints,
          confidence: aiSummary.confidence,
        },
      });

      res.json(updatedDocument);
    } catch (error) {
      console.error("Summary generation error:", error);
      res.status(500).json({ message: "Failed to generate summary" });
    }
  });

  // Preview document
  app.get("/api/preview/:serverName", async (req, res) => {
    try {
      const { serverName } = req.params;
      const document = await storage.getDocumentByServerName(serverName);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const filePath = path.join(uploadsDir, serverName);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      res.contentType("application/pdf");
      res.sendFile(filePath);
    } catch (error) {
      res.status(500).json({ message: "Failed to preview document" });
    }
  });

  // Download document
  app.get("/api/download/:serverName", async (req, res) => {
    try {
      const { serverName } = req.params;
      const document = await storage.getDocumentByServerName(serverName);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const filePath = path.join(uploadsDir, serverName);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      res.download(filePath, document.originalName);
    } catch (error) {
      res.status(500).json({ message: "Failed to download document" });
    }
  });

  // Delete document
  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocument(id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Delete file from filesystem
      const filePath = path.join(uploadsDir, document.serverName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete from storage
      const deleted = await storage.deleteDocument(id);
      if (!deleted) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
