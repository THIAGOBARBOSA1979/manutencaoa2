
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, 
  Upload, 
  X, 
  Image as ImageIcon,
  Eye,
  MapPin
} from "lucide-react";

export interface InspectionPhoto {
  id: string;
  inspectionId: string;
  inspectionStepId: string;
  fileName: string;
  url: string;
  description?: string;
  location?: string;
  timestamp: Date;
  fileSize: number;
  type: string;
}

interface InspectionPhotoUploadProps {
  inspectionId: string;
  stepId: string;
  stepTitle: string;
  photos: InspectionPhoto[];
  onPhotosChange: (photos: InspectionPhoto[]) => void;
  readonly?: boolean;
  maxPhotos?: number;
}

export const InspectionPhotoUpload = ({
  inspectionId,
  stepId,
  stepTitle,
  photos,
  onPhotosChange,
  readonly = false,
  maxPhotos = 10
}: InspectionPhotoUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<InspectionPhoto | null>(null);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    if (photos.length + files.length > maxPhotos) {
      toast({
        title: "Limite de fotos excedido",
        description: `Máximo de ${maxPhotos} fotos permitidas por etapa.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const newPhotos: InspectionPhoto[] = [];
      
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Arquivo inválido",
            description: `${file.name} não é uma imagem válida.`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Arquivo muito grande",
            description: `${file.name} excede o limite de 5MB.`,
            variant: "destructive",
          });
          continue;
        }

        // Create object URL for preview (in real app, would upload to storage)
        const url = URL.createObjectURL(file);
        
        const photo: InspectionPhoto = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          inspectionId,
          inspectionStepId: stepId,
          fileName: file.name,
          url,
          timestamp: new Date(),
          fileSize: file.size,
          type: file.type
        };

        newPhotos.push(photo);
      }

      if (newPhotos.length > 0) {
        onPhotosChange([...photos, ...newPhotos]);
        toast({
          title: "Fotos carregadas",
          description: `${newPhotos.length} foto(s) adicionada(s) com sucesso.`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Erro ao carregar as fotos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    onPhotosChange(updatedPhotos);
    
    toast({
      title: "Foto removida",
      description: "A foto foi removida com sucesso.",
    });
  };

  const updatePhotoDescription = (photoId: string, description: string) => {
    const updatedPhotos = photos.map(p => 
      p.id === photoId ? { ...p, description } : p
    );
    onPhotosChange(updatedPhotos);
  };

  const updatePhotoLocation = (photoId: string, location: string) => {
    const updatedPhotos = photos.map(p => 
      p.id === photoId ? { ...p, location } : p
    );
    onPhotosChange(updatedPhotos);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Camera className="h-5 w-5" />
          Evidências Fotográficas - {stepTitle}
          {photos.length > 0 && (
            <Badge variant="outline" className="ml-auto">
              {photos.length}/{maxPhotos}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!readonly && (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
            <div className="text-center">
              <div className="relative">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading || photos.length >= maxPhotos}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    {isUploading ? (
                      "Carregando fotos..."
                    ) : photos.length >= maxPhotos ? (
                      `Limite de ${maxPhotos} fotos atingido`
                    ) : (
                      "Clique para adicionar fotos ou arraste aqui"
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Formatos: JPG, PNG, GIF (máx. 5MB cada)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.fileName}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      setSelectedPhoto(photo);
                      setShowPhotoDialog(true);
                    }}
                  />
                </div>
                
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setSelectedPhoto(photo);
                      setShowPhotoDialog(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {!readonly && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(photo.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="mt-2 space-y-1">
                  <div className="text-xs text-muted-foreground truncate">
                    {photo.fileName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(photo.fileSize)}
                  </div>
                  {photo.description && (
                    <div className="text-xs bg-muted p-1 rounded truncate">
                      {photo.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma foto adicionada ainda</p>
          </div>
        )}

        {/* Photo Detail Dialog */}
        <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Detalhes da Foto</DialogTitle>
            </DialogHeader>
            {selectedPhoto && (
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.fileName}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="photo-description">Descrição</Label>
                    <Textarea
                      id="photo-description"
                      value={selectedPhoto.description || ''}
                      onChange={(e) => updatePhotoDescription(selectedPhoto.id, e.target.value)}
                      placeholder="Descreva o que esta foto mostra..."
                      rows={3}
                      disabled={readonly}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photo-location">Local/Observação</Label>
                    <div className="flex gap-2">
                      <MapPin className="h-4 w-4 mt-2 text-muted-foreground" />
                      <Input
                        id="photo-location"
                        value={selectedPhoto.location || ''}
                        onChange={(e) => updatePhotoLocation(selectedPhoto.id, e.target.value)}
                        placeholder="Ex: Banheiro social, Cozinha..."
                        disabled={readonly}
                      />
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Arquivo: {selectedPhoto.fileName}</div>
                      <div>Tamanho: {formatFileSize(selectedPhoto.fileSize)}</div>
                      <div>Data: {selectedPhoto.timestamp.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
