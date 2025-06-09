
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScheduleInspectionForm } from "./ScheduleInspectionForm";
import { Edit } from "lucide-react";

interface EditInspectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: any;
  onUpdate?: () => void;
}

export function EditInspectionModal({ open, onOpenChange, inspection, onUpdate }: EditInspectionModalProps) {
  const handleSubmit = (data: any) => {
    console.log("Vistoria editada com sucesso", data);
    if (onUpdate) {
      onUpdate();
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Preparar dados iniciais baseados na vistoria existente
  const initialData = {
    property: inspection?.property || "",
    unit: inspection?.unit || "",
    type: inspection?.type || "delivery",
    inspector: inspection?.inspector || "",
    date: inspection?.date || "",
    time: inspection?.time || "09:00",
    priority: inspection?.priority || "medium",
    observations: inspection?.observations || "",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Vistoria
          </DialogTitle>
          <DialogDescription>
            Modifique as informações da vistoria agendada
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <ScheduleInspectionForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={initialData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
