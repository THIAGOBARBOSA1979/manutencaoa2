
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChecklistItem } from '@/services/ChecklistService';
import { InspectionPhotoUpload, InspectionPhoto } from '@/components/Inspection/InspectionPhotoUpload';
import { Check, X, AlertCircle, Camera, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChecklistExecutionProps {
  title: string;
  description: string;
  items: ChecklistItem[];
  readOnly?: boolean;
  onItemStatusChange?: (itemId: string, status: 'completed' | 'failed' | 'not_applicable' | 'pending') => void;
  onItemNotesChange?: (itemId: string, notes: string) => void;
  onSave?: () => void;
  onBack: () => void;
}

export const ChecklistExecution = ({ 
  title, 
  description, 
  items,
  readOnly = false,
  onItemStatusChange,
  onItemNotesChange,
  onSave,
  onBack
}: ChecklistExecutionProps) => {
  const [photos, setPhotos] = useState<InspectionPhoto[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Calculate completion stats
  const totalItems = items.length;
  const completedItems = items.filter(item => item.status === 'completed').length;
  const failedItems = items.filter(item => item.status === 'failed').length;
  const pendingItems = items.filter(item => item.status === 'pending').length;
  const naItems = items.filter(item => item.status === 'not_applicable').length;
  const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    let category = "Outros";
    const match = item.description?.match(/^([^:]+):\s(.+)$/);
    
    if (match) {
      category = match[1];
    }
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const handleStatusChange = (itemId: string, status: 'completed' | 'failed' | 'not_applicable' | 'pending') => {
    if (onItemStatusChange) {
      onItemStatusChange(itemId, status);
    }
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    if (onItemNotesChange) {
      onItemNotesChange(itemId, notes);
    }
  };

  const toggleItemExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getItemPhotos = (itemId: string) => {
    return photos.filter(photo => photo.inspectionStepId === itemId);
  };

  const handlePhotosChange = (itemId: string, newPhotos: InspectionPhoto[]) => {
    setPhotos(prev => {
      const filtered = prev.filter(photo => photo.inspectionStepId !== itemId);
      return [...filtered, ...newPhotos];
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <Button variant="outline" onClick={onBack}>Voltar</Button>
      </div>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            Progresso da Execução
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{completedItems}</div>
              <div className="text-sm text-muted-foreground">Concluídos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{failedItems}</div>
              <div className="text-sm text-muted-foreground">Com Problemas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{pendingItems}</div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{naItems}</div>
              <div className="text-sm text-muted-foreground">N/A</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Conclusão</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items by Category */}
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
            <CardDescription>
              {categoryItems.length} {categoryItems.length === 1 ? 'item' : 'itens'} para verificação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryItems.map(item => {
                const itemText = item.description?.includes(': ') 
                  ? item.description.split(': ')[1] 
                  : item.description || item.text;
                const isExpanded = expandedItems.has(item.id);
                const itemPhotos = getItemPhotos(item.id);
                
                return (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{itemText}</span>
                          {item.required && (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                              Obrigatório
                            </Badge>
                          )}
                        </div>
                        
                        {item.completedAt && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Concluído em {format(item.completedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </div>
                        )}
                      </div>
                      
                      {!readOnly && onItemStatusChange && (
                        <div className="flex border rounded-md overflow-hidden">
                          <Button
                            size="sm"
                            variant="ghost"
                            className={cn(
                              "rounded-none px-3",
                              item.status === "completed" && "bg-green-100 text-green-800"
                            )}
                            onClick={() => handleStatusChange(item.id, 'completed')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className={cn(
                              "rounded-none px-3",
                              item.status === "failed" && "bg-red-100 text-red-800"
                            )}
                            onClick={() => handleStatusChange(item.id, 'failed')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className={cn(
                              "rounded-none px-3",
                              item.status === "not_applicable" && "bg-gray-100 text-gray-800"
                            )}
                            onClick={() => handleStatusChange(item.id, 'not_applicable')}
                          >
                            N/A
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className={cn(
                              "rounded-none px-3",
                              item.status === "pending" && "bg-amber-100 text-amber-800"
                            )}
                            onClick={() => handleStatusChange(item.id, 'pending')}
                          >
                            <AlertCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      {readOnly && (
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          item.status === "completed" && "bg-green-100 text-green-800 border-green-200",
                          item.status === "failed" && "bg-red-100 text-red-800 border-red-200",
                          item.status === "not_applicable" && "bg-gray-100 text-gray-800 border-gray-200",
                          item.status === "pending" && "bg-amber-100 text-amber-800 border-amber-200"
                        )}>
                          {item.status === "completed" ? "OK" : 
                           item.status === "failed" ? "Problema" :
                           item.status === "not_applicable" ? "N/A" : "Pendente"}
                        </Badge>
                      )}
                    </div>

                    {/* Expand/Collapse for details */}
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleItemExpansion(item.id)}
                        className="text-xs"
                      >
                        {isExpanded ? "Menos detalhes" : "Mais detalhes"}
                        <Camera className="h-3 w-3 ml-1" />
                        {itemPhotos.length > 0 && (
                          <Badge variant="outline" className="ml-1 text-xs">
                            {itemPhotos.length}
                          </Badge>
                        )}
                      </Button>
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="space-y-4 pt-2 border-t">
                        {/* Notes */}
                        {!readOnly && onItemNotesChange && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Observações</Label>
                            <Textarea
                              value={item.notes || ''}
                              onChange={(e) => handleNotesChange(item.id, e.target.value)}
                              placeholder="Adicione observações sobre este item..."
                              className="text-sm"
                              rows={2}
                            />
                          </div>
                        )}

                        {readOnly && item.notes && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Observações</Label>
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                              {item.notes}
                            </p>
                          </div>
                        )}

                        {/* Photo Upload */}
                        <InspectionPhotoUpload
                          inspectionId="checklist-execution"
                          stepId={item.id}
                          stepTitle={item.text || itemText}
                          photos={itemPhotos}
                          onPhotosChange={(newPhotos) => handlePhotosChange(item.id, newPhotos)}
                          readonly={readOnly}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {!readOnly && onSave && (
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={pendingItems > 0}>
            <Check className="mr-2 h-4 w-4" />
            {pendingItems > 0 ? `${pendingItems} itens pendentes` : 'Finalizar Checklist'}
          </Button>
        </div>
      )}
    </div>
  );
};
