import { documents, type Document, type InsertDocument, type UpdateDocument } from "@shared/schema";

export interface IStorage {
  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentByServerName(serverName: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: UpdateDocument): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  getAllDocuments(): Promise<Document[]>;
  searchDocuments(query: string): Promise<Document[]>;
  getDocumentsByCategory(category: string): Promise<Document[]>;
  getDocumentsWithAISummary(): Promise<Document[]>;
  getDocumentsWithoutAISummary(): Promise<Document[]>;
  
  // Stats
  getDocumentStats(): Promise<{
    totalDocuments: number;
    aiSummaries: number;
    storageUsed: string;
    recentActivity: string;
  }>;
}

export class MemStorage implements IStorage {
  private documents: Map<number, Document>;
  private currentId: number;

  constructor() {
    this.documents = new Map();
    this.currentId = 1;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentByServerName(serverName: string): Promise<Document | undefined> {
    return Array.from(this.documents.values()).find(
      (doc) => doc.serverName === serverName
    );
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentId++;
    const document: Document = {
      ...insertDocument,
      id,
      uploadedAt: new Date(),
      aiSummaryGenerated: insertDocument.summary ? new Date() : null,
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, updateDocument: UpdateDocument): Promise<Document | undefined> {
    const existing = this.documents.get(id);
    if (!existing) return undefined;
    
    const updated: Document = {
      ...existing,
      ...updateDocument,
      aiSummaryGenerated: updateDocument.summary ? new Date() : existing.aiSummaryGenerated,
    };
    
    this.documents.set(id, updated);
    return updated;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  async getAllDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values()).sort(
      (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
    );
  }

  async searchDocuments(query: string): Promise<Document[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.documents.values()).filter(
      (doc) =>
        doc.originalName.toLowerCase().includes(lowerQuery) ||
        doc.summary?.toLowerCase().includes(lowerQuery) ||
        doc.category?.toLowerCase().includes(lowerQuery) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getDocumentsByCategory(category: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.category === category
    );
  }

  async getDocumentsWithAISummary(): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.summary && doc.aiSummaryGenerated
    );
  }

  async getDocumentsWithoutAISummary(): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => !doc.summary || !doc.aiSummaryGenerated
    );
  }

  async getDocumentStats(): Promise<{
    totalDocuments: number;
    aiSummaries: number;
    storageUsed: string;
    recentActivity: string;
  }> {
    const docs = Array.from(this.documents.values());
    const totalSize = docs.reduce((sum, doc) => sum + doc.fileSize, 0);
    const sizeInGB = (totalSize / (1024 * 1024 * 1024)).toFixed(1);
    
    const mostRecent = docs.sort(
      (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
    )[0];
    
    const timeDiff = mostRecent 
      ? Math.floor((Date.now() - mostRecent.uploadedAt.getTime()) / (1000 * 60 * 60))
      : 0;
    
    return {
      totalDocuments: docs.length,
      aiSummaries: docs.filter(doc => doc.summary).length,
      storageUsed: `${sizeInGB} GB`,
      recentActivity: mostRecent ? `${timeDiff} hrs ago` : "No activity",
    };
  }
}

export const storage = new MemStorage();
