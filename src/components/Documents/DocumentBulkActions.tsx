
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
  MoreHorizontal, PackageX, CheckCircle 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentBulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onBulkDownload: (ids: string[]) => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkFavorite: (ids: string[]) => void;
  onBulkArchive: (ids: string[]) => void;
}

export function DocumentBulkActions({
  selectedIds,
  onClearSelection,
  onBulkDownload,
  onBulkDelete,
  onBulkFavorite,
  onBulkArchive
}: DocumentBulkActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  if (selectedIds.length === 0) return null;

  const handleBulkDownload = () => {
    onBulkDownload(selectedIds);
    toast({
      title: "Download iniciado",
      description: `Preparando download de ${selectedIds.length} documentos...`
    });
  };

  const handleBulkFavorite = () => {
    onBulkFavorite(selectedIds);
    toast({
      title: "Favoritos atualizados",
      description: `${selectedIds.length} documentos foram marcados como favoritos.`
    });
  };

  const handleBulkArchive = () => {
    onBulkArchive(selectedIds);
    toast({
      title: "Documentos arquivados",
      description: `${selectedIds.length} documentos foram arquivados.`
    });
  };

  const handleBulkDelete = () => {
    onBulkDelete(selectedIds);
    setShowDeleteDialog(false);
    toast({
      title: "Documentos excluídos",
      description: `${selectedIds.length} documentos foram excluídos com sucesso.`,
      variant: "destructive"
    });
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-primary" />
          <span className="font-medium">
            {selectedIds.length} documento{selectedIds.length > 1 ? 's' : ''} selecionado{selectedIds.length > 1 ? 's' : ''}
          </span>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {selectedIds.length}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Baixar Todos
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
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleBulkArchive}>
                <Archive className="mr-2 h-4 w-4" />
                Arquivar selecionados
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Tag className="mr-2 h-4 w-4" />
                Adicionar tags
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
            onClick={onClearSelection}
            className="gap-2"
          >
            <PackageX className="h-4 w-4" />
            Cancelar
          </Button>
        </div>
      </div>

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
