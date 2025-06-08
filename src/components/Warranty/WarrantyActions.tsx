
import { useState } from "react";
import { Eye, Edit, User, MessageCircle, Settings, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { WarrantyDetailModal } from "./WarrantyDetailModal";
import { EditWarrantyModal } from "./EditWarrantyModal";
import { AssignTechnicianModal } from "./AssignTechnicianModal";
import { WarrantyCommentsModal } from "./WarrantyCommentsModal";
import { ChangeWarrantyStatusModal } from "./ChangeWarrantyStatusModal";

interface WarrantyActionsProps {
  warranty: any;
  onUpdate?: () => void;
}

export function WarrantyActions({ warranty, onUpdate }: WarrantyActionsProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setDetailOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Visualizar detalhes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar solicitação
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setAssignOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            Atribuir técnico
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Alterar status
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCommentsOpen(true)}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Comentários internos
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <WarrantyDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        warranty={warranty}
      />

      <EditWarrantyModal
        open={editOpen}
        onOpenChange={setEditOpen}
        warranty={warranty}
        onUpdate={onUpdate}
      />

      <AssignTechnicianModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
        warranty={warranty}
        onUpdate={onUpdate}
      />

      <ChangeWarrantyStatusModal
        open={statusOpen}
        onOpenChange={setStatusOpen}
        warranty={warranty}
        onUpdate={onUpdate}
      />

      <WarrantyCommentsModal
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        warranty={warranty}
      />
    </>
  );
}
