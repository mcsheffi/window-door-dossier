import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, File, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface QuoteDocumentsProps {
  quoteId?: string;
}

interface QuoteAttachment {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
}

const QuoteDocuments = ({ quoteId }: QuoteDocumentsProps) => {
  const [documents, setDocuments] = useState<QuoteAttachment[]>([]);
  const [documentName, setDocumentName] = useState("");
  const { toast } = useToast();

  const fetchDocuments = async () => {
    if (!quoteId) return;

    const { data, error } = await supabase
      .from('quote_attachments')
      .select('*')
      .eq('quote_id', quoteId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
      return;
    }

    setDocuments(data || []);
  };

  const handleFileUpload = async (file: File) => {
    if (!quoteId || !documentName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for the document",
        variant: "destructive",
      });
      return;
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('quote_attachments')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
      return;
    }

    const { error: dbError } = await supabase
      .from('quote_attachments')
      .insert({
        quote_id: quoteId,
        file_path: filePath,
        file_name: documentName,
        file_type: file.type,
      });

    if (dbError) {
      toast({
        title: "Error",
        description: "Failed to save document metadata",
        variant: "destructive",
      });
      return;
    }

    setDocumentName("");
    fetchDocuments();
    toast({
      title: "Success",
      description: "Document uploaded successfully",
    });
  };

  const handleDelete = async (id: string, filePath: string) => {
    const { error: storageError } = await supabase.storage
      .from('quote_attachments')
      .remove([filePath]);

    if (storageError) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
      return;
    }

    const { error: dbError } = await supabase
      .from('quote_attachments')
      .delete()
      .eq('id', id);

    if (dbError) {
      toast({
        title: "Error",
        description: "Failed to delete document record",
        variant: "destructive",
      });
      return;
    }

    fetchDocuments();
    toast({
      title: "Success",
      description: "Document deleted successfully",
    });
  };

  const openDocument = async (filePath: string) => {
    const { data } = await supabase.storage
      .from('quote_attachments')
      .getPublicUrl(filePath);

    window.open(data.publicUrl, '_blank');
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    input.click();
  };

  return (
    <Card className="bg-charcoal text-charcoal-foreground w-full mt-6">
      <CardHeader>
        <CardTitle>Quote Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="documentName">Document Name</Label>
            <Input
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Enter document name"
              className="bg-[#403E43] text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*,.pdf,.doc,.docx';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                };
                input.click();
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCameraCapture}
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
          </div>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 border border-charcoal-foreground/20 rounded"
              >
                <button
                  onClick={() => openDocument(doc.file_path)}
                  className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                >
                  <File className="w-4 h-4" />
                  <span>{doc.file_name}</span>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(doc.id, doc.file_path)}
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteDocuments;