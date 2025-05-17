
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

// Example data - in a real app, these would come from your database
const checklists = [
  {
    id: "checklist1",
    name: "Checklist Padrão - Entrega de Apartamento",
    description: "Verificação completa para entrega de unidades residenciais",
    itemCount: 35,
  },
  {
    id: "checklist2",
    name: "Checklist Verificação Hidráulica",
    description: "Foco em instalações hidráulicas, torneiras, válvulas e escoamento",
    itemCount: 12,
  },
  {
    id: "checklist3",
    name: "Checklist Verificação Elétrica",
    description: "Verificação de instalações elétricas, tomadas e interruptores",
    itemCount: 18,
  },
  {
    id: "checklist4",
    name: "Checklist Pós-obra",
    description: "Para vistorias após a conclusão de correções",
    itemCount: 15,
  },
];

export const ChecklistSelector = ({ 
  onSelect 
}: { 
  onSelect: (id: string) => void 
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelect(id);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checklists.map((checklist) => (
          <Card 
            key={checklist.id}
            className={cn(
              "cursor-pointer border-2 transition-all", 
              selectedId === checklist.id 
                ? "border-primary" 
                : "hover:border-primary/30"
            )}
            onClick={() => handleSelect(checklist.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">{checklist.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{checklist.description}</p>
                  <p className="text-xs text-muted-foreground">{checklist.itemCount} itens</p>
                </div>
                {selectedId === checklist.id && (
                  <div className="p-1 bg-primary rounded-full text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        type="button" 
        className="w-full border-dashed"
        onClick={() => console.log("Would open checklist management")}
      >
        <ClipboardList className="mr-2 h-4 w-4" /> 
        Criar novo checklist
      </Button>
    </div>
  );
};
