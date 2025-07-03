import { useState } from "react";
import { FileText } from "lucide-react";
import StatsCards from "@/components/StatsCards";
import FileUploader from "@/components/FileUploader";
import AIPanel from "@/components/AIPanel";
import DocumentsList from "@/components/DocumentsList";
import PDFPreviewModal from "@/components/PDFPreviewModal";
import AISummaryModal from "@/components/AISummaryModal";
import { useDocuments } from "@/hooks/useDocuments";
import type { Document } from "@shared/schema";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [summaryDocument, setSummaryDocument] = useState<Document | null>(null);
  
  const { data: documents, isLoading } = useDocuments();

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         (filter === "with-summary" && doc.summary) ||
                         (filter === "without-summary" && !doc.summary);
    
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="text-primary text-3xl mr-3" />
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">DocuMentor</h1>
          </div>
          <h2 className="text-xl lg:text-2xl font-semibold text-foreground mb-2">
            AI-Powered Document Management
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload, analyze, and manage your PDF documents with intelligent AI-powered insights, 
            automatic categorization, and smart summarization
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Upload and AI Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FileUploader />
          <AIPanel 
            documents={documents || []}
            onDocumentSelect={(doc) => setSummaryDocument(doc)}
          />
        </div>

        {/* Documents List */}
        <DocumentsList
          documents={filteredDocuments}
          isLoading={isLoading}
          searchQuery={searchQuery}
          filter={filter}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilter}
          onPreview={(doc) => setPreviewDocument(doc)}
          onViewSummary={(doc) => setSummaryDocument(doc)}
        />

        {/* Modals */}
        <PDFPreviewModal
          document={previewDocument}
          onClose={() => setPreviewDocument(null)}
        />
        
        <AISummaryModal
          document={summaryDocument}
          onClose={() => setSummaryDocument(null)}
        />
      </div>
    </div>
  );
}
