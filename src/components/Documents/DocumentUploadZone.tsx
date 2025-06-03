
import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, File, X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { documentValidationService, ValidationResult } from "@/services/DocumentValidationService";
import { documentPermissionService } from "@/services/DocumentPermissionService";

interface UploadFile {
  file: File;
  id: string;
  status: 'pending' | 'validating' | 'uploading' | 'success' | 'error';
  progress: number;
  validationResult?: ValidationResult;
  error?: string;
}

interface DocumentUploadZoneProps {
  onUploadComplete: (files: UploadFile[]) => void;
  maxFiles?: number;
  userId: string;
  userRole: 'admin' | 'manager' | 'client' | 'inspector';
}

export function DocumentUploadZone({ 
  onUploadComplete, 
  maxFiles = 10,
  userId,
  userRole 
}: DocumentUploadZoneProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const permissions = documentPermissionService.getUserPermissions(userId, userRole);

  if (!permissions.canCreate) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Você não tem permissão para fazer upload de documentos.
        </AlertDescription>
      </Alert>
    );
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    if (uploadFiles.length + files.length > maxFiles) {
      toast({
        title: "Limite excedido",
        description: `Máximo de ${maxFiles} arquivos permitidos`,
        variant: "destructive"
      });
      return;
    }

    const newUploadFiles: UploadFile[] = files.map(file => ({
      file,
      id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      progress: 0
    }));

    setUploadFiles(prev => [...prev, ...newUploadFiles]);

    // Validar cada arquivo
    for (const uploadFile of newUploadFiles) {
      await validateAndUploadFile(uploadFile);
    }
  };

  const validateAndUploadFile = async (uploadFile: UploadFile) => {
    try {
      // Atualizar status para validando
      updateFileStatus(uploadFile.id, { status: 'validating', progress: 10 });

      // Validar arquivo
      const validationResult = await documentValidationService.validateFile(uploadFile.file);
      
      updateFileStatus(uploadFile.id, { 
        validationResult, 
        progress: 30,
        status: validationResult.isValid ? 'uploading' : 'error',
        error: validationResult.isValid ? undefined : validationResult.errors.join(', ')
      });

      if (!validationResult.isValid) {
        documentPermissionService.logAction(
          'validation_failed', 
          userId, 
          'create', 
          `Validação falhou: ${validationResult.errors.join(', ')}`
        );
        return;
      }

      // Simular upload
      await simulateUpload(uploadFile);

      // Log da ação
      documentPermissionService.logAction(
        uploadFile.id, 
        userId, 
        'create', 
        `Arquivo ${uploadFile.file.name} enviado com sucesso`
      );

    } catch (error) {
      updateFileStatus(uploadFile.id, { 
        status: 'error', 
        error: 'Erro durante o upload',
        progress: 0
      });

      toast({
        title: "Erro no upload",
        description: `Falha ao enviar ${uploadFile.file.name}`,
        variant: "destructive"
      });
    }
  };

  const simulateUpload = async (uploadFile: UploadFile) => {
    return new Promise<void>((resolve) => {
      let progress = 30;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        
        if (progress >= 100) {
          progress = 100;
          updateFileStatus(uploadFile.id, { status: 'success', progress });
          clearInterval(interval);
          resolve();
        } else {
          updateFileStatus(uploadFile.id, { progress });
        }
      }, 200);
    });
  };

  const updateFileStatus = (id: string, updates: Partial<UploadFile>) => {
    setUploadFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...updates } : file
    ));
  };

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== id));
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <File className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: UploadFile['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 border-green-200';
      case 'error': return 'bg-red-100 border-red-200';
      case 'validating':
      case 'uploading': return 'bg-blue-100 border-blue-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const completedUploads = uploadFiles.filter(f => f.status === 'success');
  const hasErrors = uploadFiles.some(f => f.status === 'error');

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <CardContent className="p-8 text-center">
          <Upload className={`h-12 w-12 mx-auto mb-4 ${
            isDragOver ? 'text-primary' : 'text-gray-400'
          }`} />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Arraste e solte seus arquivos aqui
            </p>
            <p className="text-sm text-muted-foreground">
              ou clique para selecionar
            </p>
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('file-input')?.click()}
              >
                Selecionar Arquivos
              </Button>
            </div>
          </div>
          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="mt-4 text-xs text-muted-foreground space-y-1">
            <p>Máximo {maxFiles} arquivos • Até 10MB cada</p>
            <p>Formatos suportados: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, TXT</p>
          </div>
        </CardContent>
      </Card>

      {uploadFiles.length > 0 && (
        <div className="space-y-3">
          {uploadFiles.map((uploadFile) => (
            <Card key={uploadFile.id} className={`${getStatusColor(uploadFile.status)} border`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(uploadFile.status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{uploadFile.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      uploadFile.status === 'success' ? 'default' :
                      uploadFile.status === 'error' ? 'destructive' : 'secondary'
                    }>
                      {uploadFile.status === 'pending' ? 'Pendente' :
                       uploadFile.status === 'validating' ? 'Validando' :
                       uploadFile.status === 'uploading' ? 'Enviando' :
                       uploadFile.status === 'success' ? 'Sucesso' : 'Erro'}
                    </Badge>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(uploadFile.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {(uploadFile.status === 'validating' || uploadFile.status === 'uploading') && (
                  <div className="mt-3">
                    <Progress value={uploadFile.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {uploadFile.progress.toFixed(0)}%
                    </p>
                  </div>
                )}

                {uploadFile.error && (
                  <Alert className="mt-3 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {uploadFile.error}
                    </AlertDescription>
                  </Alert>
                )}

                {uploadFile.validationResult?.warnings && uploadFile.validationResult.warnings.length > 0 && (
                  <Alert className="mt-3 border-yellow-200 bg-yellow-50">
                    <Info className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      {uploadFile.validationResult.warnings.join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}

          {completedUploads.length > 0 && (
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setUploadFiles([])}
              >
                Limpar Lista
              </Button>
              <Button
                onClick={() => onUploadComplete(completedUploads)}
                disabled={hasErrors || completedUploads.length === 0}
              >
                Finalizar Upload ({completedUploads.length})
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
