
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, Download, Edit, Trash2, Eye, Star, Copy, 
  Calendar, Clock, User, Tag, AlertTriangle 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Document } from "@/services/DocumentService";
import { DocumentVersionHistory } from "./DocumentVersionHistory";

interface DocumentCardProps {
  document: Document;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onEdit: (doc: Document) => void;
  onDelete: (id: string) => void;
  onPreview: (doc: Document) => void;
  onDownload: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRestoreVersion?: (versionId: string) => void;
  categories: Array<{ id: string; name: string; }>;
}

export function DocumentCard({ 
  document, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onPreview, 
  onDownload,
  onToggleFavorite,
  onDuplicate,
  onRestoreVersion,
  categories 
}: DocumentCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "default";
      case "draft": return "secondary";
      case "archived": return "outline";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published": return "Publicado";
      case "draft": return "Rascunho";
      case "archived": return "Arquivado";
      default: return status;
    }
  };

  const categoryName = categories.find(c => c.id === document.category)?.name || document.category;

  return (
    <Card className="hover:shadow-md transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(document.id, !!checked)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <span className="truncate">{document.title}</span>
                {document.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
              </CardTitle>
              {document.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {document.description}
                </p>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="sr-only">Mais opções</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onToggleFavorite(document.id)}>
                <Star className={`mr-2 h-4 w-4 ${document.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                {document.isFavorite ? 'Remover favorito' : 'Adicionar favorito'}
              </DropdownMenuItem>
              {document.type === "auto" && (
                <DropdownMenuItem onClick={() => onPreview(document)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDownload(document.id)}>
                <Download className="mr-2 h-4 w-4" />
                Baixar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(document.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(document)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(document.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Metadados */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {document.createdAt.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {document.downloads}
            </div>
            <div className="flex items-center gap-1">
              <span>v{document.version}</span>
            </div>
            {document.expiresAt && (
              <div className="flex items-center gap-1 text-orange-600">
                <Clock className="h-3 w-3" />
                Vence {document.expiresAt.toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={document.type === "auto" ? "default" : "secondary"} className="text-xs">
              {document.type === "auto" ? "Automático" : "Manual"}
            </Badge>
            <Badge variant={getPriorityColor(document.priority) as any} className="text-xs">
              {document.priority === "high" ? "Alta" : document.priority === "medium" ? "Média" : "Baixa"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {categoryName}
            </Badge>
            <Badge variant={getStatusColor(document.status) as any} className="text-xs">
              {getStatusLabel(document.status)}
            </Badge>
          </div>

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <Tag className="h-3 w-3 text-muted-foreground" />
              {document.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {document.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{document.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Associações */}
          {(document.associatedTo.property || document.associatedTo.client) && (
            <div className="text-sm text-muted-foreground">
              <User className="h-3 w-3 inline mr-1" />
              <strong>Associado:</strong> {
                Object.entries(document.associatedTo)
                  .filter(([_, value]) => value)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(", ")
              }
            </div>
          )}

          {/* Ações rápidas */}
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={() => onToggleFavorite(document.id)}>
              <Star className={`mr-1 h-3 w-3 ${document.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
              Favorito
            </Button>
            
            {document.type === "auto" && (
              <Button size="sm" variant="outline" onClick={() => onPreview(document)}>
                <Eye className="mr-1 h-3 w-3" />
                Preview
              </Button>
            )}
            
            <Button size="sm" variant="outline" onClick={() => onDownload(document.id)}>
              <Download className="mr-1 h-3 w-3" />
              Baixar
            </Button>

            <DocumentVersionHistory 
              document={document} 
              onRestoreVersion={onRestoreVersion}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
