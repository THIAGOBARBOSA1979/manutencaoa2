
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Save, 
  Send,
  Camera,
  Clock,
  User
} from "lucide-react";
import { ChecklistItem } from "@/services/ChecklistService";
import { InspectionPhotoUpload, InspectionPhoto } from "@/components/Inspection/InspectionPhotoUpload";

interface ChecklistExecutionProps {
  title: string;
  items: ChecklistItem[];
  onSave: (completedItems: ChecklistItem[], notes: string) => void;
  onSubmit: (completedItems: ChecklistItem[], notes: string) => void;
}

export function ChecklistExecution({ title, items, onSave, onSubmit }: ChecklistExecutionProps) {
  const { toast } = useToast();
  const [completedItems, setCompletedItems] = useState<ChecklistItem[]>(items);
  const [generalNotes, setGeneralNotes] = useState("");
  const [inspectionPhotos, setInspectionPhotos] = useState<Record<string, InspectionPhoto[]>>({});

  const completedCount = completedItems.filter(item => item.status === 'completed').length;
  const progressPercentage = (completedCount / items.length) * 100;

  const handleItemStatusChange = (itemId: string, status: ChecklistItem['status']) => {
    setCompletedItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status, completedAt: status === 'completed' ? new Date() : undefined }
        : item
    ));
  };

  const handleItemNotesChange = (itemId: string, notes: string) => {
    setCompletedItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, notes } : item
    ));
  };

  const handlePhotosChange = (itemId: string, photos: InspectionPhoto[]) => {
    setInspectionPhotos(prev => ({
      ...prev,
      [itemId]: photos
    }));
  };

  const handleSave = () => {
    onSave(completedItems, generalNotes);
    toast({
      title: "Progresso salvo",
      description: "O progresso da execução foi salvo com sucesso.",
    });
  };

  const handleSubmit = () => {
    const incompleteItems = completedItems.filter(item => item.status === 'pending');
    
    if (incompleteItems.length > 0) {
      toast({
        title: "Execução incompleta",
        description: `Ainda existem ${incompleteItems.length} item(s) pendente(s).`,
        variant: "destructive",
      });
      return;
    }

    onSubmit(completedItems, generalNotes);
    toast({
      title: "Execução finalizada",
      description: "A execução do checklist foi finalizada com sucesso.",
    });
  };

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'not_applicable':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: ChecklistItem['status']) => {
    const statusConfig = {
      pending: { label: "Pendente", className: "bg-amber-100 text-amber-800" },
      completed: { label: "Concluído", className: "bg-green-100 text-green-800" },
      failed: { label: "Falhou", className: "bg-red-100 text-red-800" },
      not_applicable: { label: "N/A", className: "bg-gray-100 text-gray-800" }
    };
    
    const config = statusConfig[status];
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <p className="text-muted-foreground mt-2">
                Executando checklist • {completedCount} de {items.length} itens concluídos
              </p>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Inspetor: João Silva</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-4">
        {completedItems.map((item, index) => (
          <Card key={item.id} className="transition-colors hover:bg-muted/50">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-medium flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">#{index + 1}</span>
                    {item.text}
                    {item.isRequired && (
                      <Badge variant="outline" className="text-xs">Obrigatório</Badge>
                    )}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  {getStatusBadge(item.status)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Status Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant={item.status === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleItemStatusChange(item.id, 'completed')}
                  className="justify-start"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Concluído
                </Button>
                <Button
                  variant={item.status === 'failed' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => handleItemStatusChange(item.id, 'failed')}
                  className="justify-start"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Falhou
                </Button>
                <Button
                  variant={item.status === 'not_applicable' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => handleItemStatusChange(item.id, 'not_applicable')}
                  className="justify-start"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  N/A
                </Button>
                <Button
                  variant={item.status === 'pending' ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => handleItemStatusChange(item.id, 'pending')}
                  className="justify-start"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Pendente
                </Button>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Observações</label>
                <Textarea
                  placeholder="Adicione observações sobre este item..."
                  value={item.notes || ''}
                  onChange={(e) => handleItemNotesChange(item.id, e.target.value)}
                  rows={2}
                />
              </div>

              {/* Photo Upload */}
              <InspectionPhotoUpload
                inspectionId="current-inspection"
                stepId={item.id}
                stepTitle={item.text}
                photos={inspectionPhotos[item.id] || []}
                onPhotosChange={(photos) => handlePhotosChange(item.id, photos)}
              />

              {item.completedAt && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Concluído em {item.completedAt.toLocaleDateString()} às {item.completedAt.toLocaleTimeString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* General Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Observações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Adicione observações gerais sobre a execução do checklist..."
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Progresso
        </Button>
        
        <Button 
          onClick={handleSubmit}
          disabled={completedCount < items.length}
        >
          <Send className="mr-2 h-4 w-4" />
          Finalizar Execução
        </Button>
      </div>
    </div>
  );
}
