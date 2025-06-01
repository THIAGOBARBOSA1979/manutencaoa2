
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, ZoomIn, ZoomOut, RotateCw, Share2, 
  FileText, Calendar, User, Eye, X
} from "lucide-react";
import { Document } from "@/services/DocumentService";

interface DocumentPreviewProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (id: string) => void;
  content?: string;
}

export function DocumentPreview({ 
  document, 
  isOpen, 
  onClose, 
  onDownload, 
  content 
}: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!document) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">{document.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {document.createdAt.toLocaleDateString()}
                  <Separator orientation="vertical" className="h-3" />
                  <User className="h-3 w-3" />
                  {document.createdBy}
                  <Separator orientation="vertical" className="h-3" />
                  <Eye className="h-3 w-3" />
                  {document.downloads} visualizações
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <Badge variant={document.type === "auto" ? "default" : "secondary"}>
              {document.type === "auto" ? "Automático" : "Manual"}
            </Badge>
            <Badge variant="outline">v{document.version}</Badge>
            {document.tags?.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
            <Button size="sm" onClick={() => onDownload(document.id)}>
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 h-[60vh]">
          <div className="p-6">
            {content ? (
              <div 
                className="bg-white border rounded-lg p-8 shadow-sm mx-auto"
                style={{ 
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'top center',
                  maxWidth: '800px'
                }}
              >
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {content}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Preview não disponível
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Este documento pode ser baixado para visualização
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => onDownload(document.id)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Documento
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
