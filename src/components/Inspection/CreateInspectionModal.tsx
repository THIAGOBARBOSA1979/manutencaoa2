
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScheduleInspectionForm } from "./ScheduleInspectionForm";
import { ClipboardCheck } from "lucide-react";

interface CreateInspectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

export function CreateInspectionModal({ open, onOpenChange, onSubmit }: CreateInspectionModalProps) {
  const handleSuccess = () => {
    console.log("Nova vistoria agendada com sucesso");
    if (onSubmit) {
      onSubmit({});
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Agendar Nova Vistoria
          </DialogTitle>
          <DialogDescription>
            Agende uma nova vistoria seguindo as regras de negócio estabelecidas
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <ScheduleInspectionForm 
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
