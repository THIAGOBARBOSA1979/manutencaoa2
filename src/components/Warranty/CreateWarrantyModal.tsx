
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnhancedWarrantyRequestForm } from "./EnhancedWarrantyRequestForm";
import { Shield } from "lucide-react";

interface CreateWarrantyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

export function CreateWarrantyModal({ open, onOpenChange, onSubmit }: CreateWarrantyModalProps) {
  const handleSubmit = (data: any) => {
    console.log("Nova solicitação de garantia:", data);
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
            <Shield className="h-5 w-5" />
            Nova Solicitação de Garantia
          </DialogTitle>
          <DialogDescription>
            Registre uma nova solicitação de garantia no sistema
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <EnhancedWarrantyRequestForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
