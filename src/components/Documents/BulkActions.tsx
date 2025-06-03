
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Download, Trash2, Archive, Star, Tag, 
  MoreHorizontal, PackageX, CheckCircle, Shield,
  Eye, FileText
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Document } from "@/services/DocumentService";

interface BulkActionsProps {
  documents: Document[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onActionComplete: () => void;
}

export function BulkActions({
  documents,
  selectedIds,
  onSelectionChange,
  onActionComplete
}: BulkActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  if (selectedIds.length === 0) return null;

  const selectedDocuments = documents.filter(doc => selectedIds.includes(doc.id));

  const handleBulkDownload = async () => {
    setIsProcessing(true);
    try {
      // Simular download em massa
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Download iniciado",
        description: `Preparando download de ${selectedIds.length} documentos...`
      });
      
      onSelectionChange([]);
      onActionComplete();
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Falha ao preparar download dos documentos",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkFavorite = () => {
    // Implementar lógica de favoritos em massa
    toast({
      title: "Favoritos atualizados",
      description: `${selectedIds.length} documentos foram marcados como favoritos.`
    });
    onSelectionChange([]);
    onActionComplete();
  };

  const handleBulkArchive = () => {
    // Implementar lógica de arquivamento em massa
    setShowArchiveDialog(false);
    toast({
      title: "Documentos arquivados",
      description: `${selectedIds.length} documentos foram arquivados.`
    });
    onSelectionChange([]);
    onActionComplete();
  };

  const handleBulkDelete = () => {
    // Implementar lógica de exclusão em massa
    setShowDeleteDialog(false);
    toast({
      title: "Documentos excluídos",
      description: `${selectedIds.length} documentos foram excluídos com sucesso.`,
      variant: "destructive"
    });
    onSelectionChange([]);
    onActionComplete();
  };

  const handleBulkPermissions = () => {
    toast({
      title: "Permissões atualizadas",
      description: `Permissões foram configuradas para ${selectedIds.length} documentos.`
    });
  };

  const getSelectionSummary = () => {
    const categories = selectedDocuments.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([cat, count]) => 
      `${count} ${cat}`
    ).join(", ");
  };

  return (
    <>
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg m-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {selectedIds.length} documento{selectedIds.length > 1 ? 's' : ''} selecionado{selectedIds.length > 1 ? 's' : ''}
              </span>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {selectedIds.length}
              </Badge>
            </div>
            
            {selectedIds.length <= 5 && (
              <div className="text-sm text-muted-foreground">
                {getSelectionSummary()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDownload}
              disabled={isProcessing}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isProcessing ? "Preparando..." : "Baixar Todos"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkFavorite}
              className="gap-2"
            >
              <Star className="h-4 w-4" />
              Favoritar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleBulkPermissions}>
                  <Shield className="mr-2 h-4 w-4" />
                  Gerenciar permissões
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Tag className="mr-2 h-4 w-4" />
                  Adicionar tags
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Alterar categoria
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowArchiveDialog(true)}>
                  <Archive className="mr-2 h-4 w-4" />
                  Arquivar selecionados
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir selecionados
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectionChange([])}
              className="gap-2"
            >
              <PackageX className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog de confirmação para arquivamento */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar arquivamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja arquivar {selectedIds.length} documento{selectedIds.length > 1 ? 's' : ''}? 
              Documentos arquivados podem ser restaurados posteriormente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkArchive}>
              Arquivar {selectedIds.length} documento{selectedIds.length > 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmação para exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {selectedIds.length} documento{selectedIds.length > 1 ? 's' : ''}? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir {selectedIds.length} documento{selectedIds.length > 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
