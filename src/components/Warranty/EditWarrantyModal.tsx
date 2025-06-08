
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnhancedWarrantyRequestForm } from "./EnhancedWarrantyRequestForm";
import { Edit } from "lucide-react";

interface EditWarrantyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warranty: any;
  onUpdate?: () => void;
}

export function EditWarrantyModal({ open, onOpenChange, warranty, onUpdate }: EditWarrantyModalProps) {
  const handleSuccess = () => {
    console.log("Garantia editada com sucesso");
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
            Editar Solicitação de Garantia
          </DialogTitle>
          <DialogDescription>
            Modifique as informações da solicitação
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <EnhancedWarrantyRequestForm 
            onSubmit={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
