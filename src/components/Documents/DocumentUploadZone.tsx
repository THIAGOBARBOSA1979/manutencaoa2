
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, FileText, X, CheckCircle, AlertTriangle,
  File, Image, FileSpreadsheet
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentUploadZoneProps {
  onFilesUploaded: (files: File[]) => Promise<void>;
}

export function DocumentUploadZone({ onFilesUploaded }: DocumentUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simular progresso de upload
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onFilesUploaded(selectedFiles);
      
      setUploadProgress(100);
      setTimeout(() => {
        setSelectedFiles([]);
        setUploading(false);
        setUploadProgress(0);
      }, 1000);

    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Falha ao enviar os arquivos",
        variant: "destructive"
      });
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    if (type.includes('spreadsheet') || type.includes('excel')) return <FileSpreadsheet className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Documentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Zona de upload */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:border-primary/50'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !uploading && document.getElementById('file-input')?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Arraste arquivos aqui ou clique para selecionar
            </h3>
            <p className="text-muted-foreground mb-4">
              Suporte para PDF, DOC, DOCX, JPG, PNG (máx. 50MB)
            </p>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </div>

          {/* Lista de arquivos selecionados */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Arquivos Selecionados ({selectedFiles.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <span className="text-sm truncate">{file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatFileSize(file.size)}
                      </Badge>
                    </div>
                    {!uploading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progresso do upload */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enviando arquivos...</span>
                <span className="text-sm">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-pulse" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Enviar {selectedFiles.length} arquivo{selectedFiles.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
            
            {selectedFiles.length > 0 && !uploading && (
              <Button
                variant="outline"
                onClick={() => setSelectedFiles([])}
              >
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instruções e limites */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-medium mb-3">Instruções de Upload</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h5 className="font-medium text-foreground mb-2">Formatos Suportados:</h5>
              <ul className="space-y-1">
                <li>• PDF (Portable Document Format)</li>
                <li>• DOC/DOCX (Microsoft Word)</li>
                <li>• JPG/JPEG/PNG (Imagens)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-foreground mb-2">Limites:</h5>
              <ul className="space-y-1">
                <li>• Tamanho máximo: 50MB por arquivo</li>
                <li>• Múltiplos arquivos permitidos</li>
                <li>• Processamento automático de metadados</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
