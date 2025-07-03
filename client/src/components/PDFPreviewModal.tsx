import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Document } from "@shared/schema";

interface PDFPreviewModalProps {
  document: Document | null;
  onClose: () => void;
}

export default function PDFPreviewModal({ document, onClose }: PDFPreviewModalProps) {
  if (!document) return null;

  return (
    <Dialog open={!!document} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Document Preview</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 p-4">
          <iframe
            src={`/api/preview/${document.serverName}`}
            title="PDF Preview"
            className="w-full h-96 lg:h-[500px] border rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
