
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Copy, Edit, Star, Calendar, User } from "lucide-react";
import { ChecklistItem } from "@/services/ChecklistService";

interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  itemCount: number;
  isDefault: boolean;
  createdAt: Date;
  items: ChecklistItem[];
  lastUsed?: Date;
  usageCount?: number;
}

interface ChecklistTemplateCardProps {
  template: ChecklistTemplate;
  onSelect: () => void;
  onDuplicate: () => void;
  onEdit?: () => void;
}

export function ChecklistTemplateCard({ 
  template, 
  onSelect, 
  onDuplicate, 
  onEdit 
}: ChecklistTemplateCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5" />
            {template.name}
            {template.isDefault && (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            )}
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Itens:</span>
            <Badge variant="secondary">{template.itemCount}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Categoria:</span>
            <Badge variant="outline" className="text-xs">{template.category}</Badge>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span className="text-xs">{template.createdAt.toLocaleDateString()}</span>
          </div>
          
          {template.usageCount !== undefined && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="text-xs">{template.usageCount} usos</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={onSelect}
          >
            Usar Template
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={onDuplicate}
            title="Duplicar template"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          {!template.isDefault && onEdit && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={onEdit}
              title="Editar template"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
