
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScheduleInspectionForm } from "./ScheduleInspectionForm";

interface ScheduleInspectionDialogProps {
  triggerButton?: React.ReactNode;
  clientId?: string;
  propertyInfo?: {
    property: string;
    unit: string;
    client: string;
  };
}

export function ScheduleInspectionDialog({ 
  triggerButton, 
  clientId,
  propertyInfo 
}: ScheduleInspectionDialogProps) {
  const [open, setOpen] = React.useState(false);
  
  const handleSubmit = (data: any) => {
    console.log("Nova vistoria agendada", data);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // Preparar dados iniciais se houver informações de propriedade
  const initialData = propertyInfo ? {
    property: propertyInfo.property,
    unit: propertyInfo.unit,
    type: "delivery" as const,
    inspector: "",
    date: "",
    time: "09:00",
    priority: "medium" as const,
    observations: `Vistoria para o cliente: ${propertyInfo.client}`,
  } : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Agendar Vistoria
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agendar Nova Vistoria</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para agendar uma vistoria.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
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
