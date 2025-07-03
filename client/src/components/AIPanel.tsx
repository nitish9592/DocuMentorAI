import { useState } from "react";
import { Bot, Wand2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGenerateAISummary } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@shared/schema";

interface AIPanelProps {
  documents: Document[];
  onDocumentSelect: (document: Document) => void;
}

export default function AIPanel({ documents, onDocumentSelect }: AIPanelProps) {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");
  const { toast } = useToast();
  const generateSummaryMutation = useGenerateAISummary();

  const handleGenerateSummary = () => {
    if (!selectedDocumentId) {
      toast({
        title: "No document selected",
        description: "Please select a document to generate AI summary",
        variant: "destructive",
      });
      return;
    }

    const documentId = parseInt(selectedDocumentId);
    generateSummaryMutation.mutate(documentId, {
      onSuccess: (updatedDocument) => {
        toast({
          title: "AI Summary Generated",
          description: "Your document summary has been generated successfully",
        });
        onDocumentSelect(updatedDocument);
      },
      onError: (error) => {
        toast({
          title: "Failed to generate summary",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">AI Summarizer</span>
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-accent" />
            <span className="text-sm text-accent font-medium">Powered by OpenAI</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3">
              Select a document to generate AI summary:
            </p>
            <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a document..." />
              </SelectTrigger>
              <SelectContent>
                {documents.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id.toString()}>
                    {doc.originalName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={handleGenerateSummary}
            disabled={!selectedDocumentId || generateSummaryMutation.isPending}
            className="w-full btn-accent"
          >
            {generateSummaryMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                AI is analyzing your document...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate AI Summary
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
