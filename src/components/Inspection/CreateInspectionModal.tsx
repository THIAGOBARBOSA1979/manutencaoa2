
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnhancedScheduleInspectionForm } from "./EnhancedScheduleInspectionForm";
import { ClipboardCheck } from "lucide-react";

interface CreateInspectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

export function CreateInspectionModal({ open, onOpenChange, onSubmit }: CreateInspectionModalProps) {
  const handleSubmit = (data: any) => {
    console.log("Nova vistoria agendada:", data);
    if (onSubmit) {
      onSubmit(data);
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Agendar Nova Vistoria
          </DialogTitle>
          <DialogDescription>
            Agende uma nova vistoria no sistema com todas as informações necessárias
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <EnhancedScheduleInspectionForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
