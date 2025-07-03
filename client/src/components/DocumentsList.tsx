import { Search, Filter, Eye, Bot, Download, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteDocument } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatFileSize, getCategoryColor, getStatusColor, getStatusText } from "@/lib/utils";
import type { Document } from "@shared/schema";

interface DocumentsListProps {
  documents: Document[];
  isLoading: boolean;
  searchQuery: string;
  filter: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: string) => void;
  onPreview: (document: Document) => void;
  onViewSummary: (document: Document) => void;
}

export default function DocumentsList({
  documents,
  isLoading,
  searchQuery,
  filter,
  onSearchChange,
  onFilterChange,
  onPreview,
  onViewSummary,
}: DocumentsListProps) {
  const { toast } = useToast();
  const deleteMutation = useDeleteDocument();

  const handleDelete = (document: Document) => {
    if (window.confirm(`Are you sure you want to delete "${document.originalName}"?`)) {
      deleteMutation.mutate(document.id, {
        onSuccess: () => {
          toast({
            title: "Document deleted",
            description: "The document has been successfully deleted",
          });
        },
        onError: (error) => {
          toast({
            title: "Failed to delete document",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleDownload = (document: Document) => {
    const link = document.createElement("a");
    link.href = `/api/download/${document.serverName}`;
    link.download = document.originalName;
    link.click();
  };

  if (isLoading) {
    return (
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-shadow">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-lg font-semibold">Recent Documents</CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={filter} onValueChange={onFilterChange}>
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                <SelectItem value="with-summary">With AI Summary</SelectItem>
                <SelectItem value="without-summary">Without Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No documents found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                  <div className="p-3 bg-red-100 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {document.originalName}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(document.uploadedAt)} • {formatFileSize(document.fileSize)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge className={getStatusColor(!!document.summary)}>
                        {getStatusText(!!document.summary)}
                      </Badge>
                      {document.category && (
                        <Badge className={getCategoryColor(document.category)}>
                          {document.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPreview(document)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewSummary(document)}
                    disabled={!document.summary}
                    className="text-accent hover:bg-accent/10"
                  >
                    <Bot className="w-4 h-4 mr-1" />
                    {document.summary ? "AI Summary" : "Processing..."}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(document)}
                    className="text-green-600 hover:bg-green-50"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(document)}
                    disabled={deleteMutation.isPending}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
