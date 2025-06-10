
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Download,
  MapPin
} from "lucide-react";

export interface InspectionPhoto {
  id: string;
  fileName: string;
  description: string;
  location: string;
  category: 'evidence' | 'before' | 'after' | 'defect' | 'compliance';
  uploadedAt: Date;
  fileSize: number;
  mimeType: string;
  inspectionStepId: string;
}

interface InspectionPhotoUploadProps {
  inspectionId: string;
  stepId: string;
  stepTitle: string;
  photos: InspectionPhoto[];
  onPhotosChange: (photos: InspectionPhoto[]) => void;
  readonly?: boolean;
}

const photoCategories = [
  { value: 'evidence', label: 'Evidência', color: 'bg-blue-100 text-blue-800' },
  { value: 'before', label: 'Antes', color: 'bg-gray-100 text-gray-800' },
  { value: 'after', label: 'Depois', color: 'bg-green-100 text-green-800' },
  { value: 'defect', label: 'Defeito', color: 'bg-red-100 text-red-800' },
  { value: 'compliance', label: 'Conformidade', color: 'bg-emerald-100 text-emerald-800' }
];

export const InspectionPhotoUpload = ({
  inspectionId,
  stepId,
  stepTitle,
  photos,
  onPhotosChange,
  readonly = false
}: InspectionPhotoUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<InspectionPhoto | null>(null);
  const [newPhotoData, setNewPhotoData] = useState({
    description: '',
    location: '',
    category: 'evidence' as InspectionPhoto['category']
  });

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    setIsUploading(true);

    try {
      const newPhotos: InspectionPhoto[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Arquivo inválido",
            description: `${file.name} não é uma imagem válida.`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "Arquivo muito grande",
            description: `${file.name} excede o limite de 10MB.`,
            variant: "destructive",
          });
          continue;
        }

        const newPhoto: InspectionPhoto = {
          id: `photo-${Date.now()}-${i}`,
          fileName: file.name,
          description: newPhotoData.description || `Foto da etapa: ${stepTitle}`,
          location: newPhotoData.location || '',
          category: newPhotoData.category,
          uploadedAt: new Date(),
          fileSize: file.size,
          mimeType: file.type,
          inspectionStepId: stepId
        };

        newPhotos.push(newPhoto);
      }

      if (newPhotos.length > 0) {
        onPhotosChange([...photos, ...newPhotos]);
        toast({
          title: "Fotos adicionadas",
          description: `${newPhotos.length} foto(s) foram adicionadas com sucesso.`,
        });

        // Reset form
        setNewPhotoData({
          description: '',
          location: '',
          category: 'evidence'
        });
      }
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao fazer upload das fotos.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    onPhotosChange(photos.filter(p => p.id !== photoId));
    toast({
      title: "Foto removida",
      description: "A foto foi removida com sucesso.",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryConfig = (category: InspectionPhoto['category']) => {
    return photoCategories.find(c => c.value === category) || photoCategories[0];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Evidências Fotográficas - {stepTitle}
          <Badge variant="outline">{photos.length} foto(s)</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        {!readonly && (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    placeholder="Descreva a foto..."
                    value={newPhotoData.description}
                    onChange={(e) => setNewPhotoData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    placeholder="Ex: Banheiro social"
                    value={newPhotoData.location}
                    onChange={(e) => setNewPhotoData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <select
                    id="category"
                    className="w-full p-2 border rounded-md"
                    value={newPhotoData.category}
                    onChange={(e) => setNewPhotoData(prev => ({ 
                      ...prev, 
                      category: e.target.value as InspectionPhoto['category'] 
                    }))}
                  >
                    {photoCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-center relative">
                <Input
                  type="file"
                  className="opacity-0 absolute inset-0 z-10 cursor-pointer"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  disabled={isUploading}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  disabled={isUploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? "Fazendo upload..." : "Selecionar Fotos"}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Formatos aceitos: JPG, PNG, GIF (máximo 10MB por arquivo)
              </p>
            </div>
          </div>
        )}

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-muted/50">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma foto anexada</h3>
            <p className="text-muted-foreground">
              {readonly 
                ? "Não há fotos registradas para esta etapa."
                : "Adicione fotos para documentar esta etapa da vistoria."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => {
              const categoryConfig = getCategoryConfig(photo.category);
              return (
                <div key={photo.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      {!readonly && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemovePhoto(photo.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-medium text-sm truncate">{photo.fileName}</h4>
                      <Badge variant="outline" className={`text-xs ${categoryConfig.color}`}>
                        {categoryConfig.label}
                      </Badge>
                    </div>
                    
                    {photo.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(photo.fileSize)}</span>
                      {photo.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-20">{photo.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Photo Details Modal */}
        {selectedPhoto && (
          <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Detalhes da Foto
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-muted-foreground" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nome do arquivo</Label>
                    <p className="text-sm text-muted-foreground">{selectedPhoto.fileName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Categoria</Label>
                    <Badge variant="outline" className={`${getCategoryConfig(selectedPhoto.category).color} mt-1`}>
                      {getCategoryConfig(selectedPhoto.category).label}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tamanho</Label>
                    <p className="text-sm text-muted-foreground">{formatFileSize(selectedPhoto.fileSize)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Data do upload</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPhoto.uploadedAt.toLocaleDateString()} às {selectedPhoto.uploadedAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                {selectedPhoto.description && (
                  <div>
                    <Label className="text-sm font-medium">Descrição</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedPhoto.description}</p>
                  </div>
                )}
                
                {selectedPhoto.location && (
                  <div>
                    <Label className="text-sm font-medium">Local</Label>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedPhoto.location}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Foto
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};
