
import { useState } from "react";
import { Eye, Edit, Calendar, History, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { InspectionDetailModal } from "./InspectionDetailModal";
import { EditInspectionModal } from "./EditInspectionModal";
import { RescheduleInspectionModal } from "./RescheduleInspectionModal";
import { InspectionHistoryModal } from "./InspectionHistoryModal";

interface InspectionActionsProps {
  inspection: any;
  onUpdate?: () => void;
}

export function InspectionActions({ inspection, onUpdate }: InspectionActionsProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

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
            Editar vistoria
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setRescheduleOpen(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Reagendar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setHistoryOpen(true)}>
            <History className="mr-2 h-4 w-4" />
            Ver histórico
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InspectionDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        inspection={inspection}
      />

      <EditInspectionModal
        open={editOpen}
        onOpenChange={setEditOpen}
        inspection={inspection}
        onUpdate={onUpdate}
      />

      <RescheduleInspectionModal
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        inspection={inspection}
        onUpdate={onUpdate}
      />

      <InspectionHistoryModal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        inspection={inspection}
      />
    </>
  );
}
