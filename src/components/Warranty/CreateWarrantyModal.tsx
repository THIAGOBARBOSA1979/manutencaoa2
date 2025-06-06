
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WarrantyRequestForm } from "./WarrantyRequestForm";
import { EnhancedWarrantyRequestForm } from "./EnhancedWarrantyRequestForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Layers } from "lucide-react";

interface CreateWarrantyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

export function CreateWarrantyModal({ open, onOpenChange, onSubmit }: CreateWarrantyModalProps) {
  const [activeTab, setActiveTab] = useState("simple");

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
          <DialogTitle>Nova Solicitação de Garantia</DialogTitle>
          <DialogDescription>
            Registre uma nova solicitação de garantia no sistema
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simple" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Formulário Simples
            </TabsTrigger>
            <TabsTrigger value="enhanced" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Formulário Avançado
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="simple" className="mt-6">
            <WarrantyRequestForm 
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </TabsContent>
          
          <TabsContent value="enhanced" className="mt-6">
            <EnhancedWarrantyRequestForm 
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
