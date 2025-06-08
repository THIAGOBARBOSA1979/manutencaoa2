
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
  const handleSuccess = () => {
    console.log("Vistoria editada com sucesso");
    if (onUpdate) {
      onUpdate();
    }
    onOpenChange(false);
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
            onSuccess={handleSuccess}
            propertyInfo={{
              property: inspection.property,
              unit: inspection.unit,
              client: inspection.client
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
