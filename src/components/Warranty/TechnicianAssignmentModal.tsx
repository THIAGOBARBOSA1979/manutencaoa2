
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Clock, Wrench } from "lucide-react";
import { WarrantyRequest } from "@/services/WarrantyBusinessRules";

// Mock data for technicians - in a real app this would come from an API
const availableTechnicians = [
  { 
    id: "tech-001", 
    name: "João Silva", 
    specialties: ["Hidráulica", "Elétrica"],
    currentWorkload: 3,
    maxWorkload: 8,
    rating: 4.8
  },
  { 
    id: "tech-002", 
    name: "Maria Santos", 
    specialties: ["Estrutural", "Acabamentos"],
    currentWorkload: 2,
    maxWorkload: 6,
    rating: 4.9
  },
  { 
    id: "tech-003", 
    name: "Pedro Costa", 
    specialties: ["Esquadrias", "Impermeabilização"],
    currentWorkload: 1,
    maxWorkload: 5,
    rating: 4.7
  },
  { 
    id: "tech-004", 
    name: "Ana Oliveira", 
    specialties: ["Hidráulica", "Estrutural"],
    currentWorkload: 4,
    maxWorkload: 7,
    rating: 4.6
  }
];

interface TechnicianAssignmentModalProps {
  warranty: WarrantyRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (warrantyId: string, technicianId: string, notes?: string) => Promise<void>;
}

export const TechnicianAssignmentModal = ({ 
  warranty, 
  open, 
  onOpenChange,
  onAssign
}: TechnicianAssignmentModalProps) => {
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  if (!warranty) return null;

  // Filter technicians based on warranty category
  const recommendedTechnicians = availableTechnicians.filter(tech => 
    tech.specialties.includes(warranty.category)
  );

  const otherTechnicians = availableTechnicians.filter(tech => 
    !tech.specialties.includes(warranty.category)
  );

  const selectedTechnicianData = availableTechnicians.find(tech => tech.id === selectedTechnician);

  const handleAssign = async () => {
    if (!selectedTechnician) return;

    setIsAssigning(true);
    try {
      await onAssign(warranty.id, selectedTechnician, notes);
      setSelectedTechnician("");
      setNotes("");
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atribuir técnico:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const getWorkloadColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 80) return "text-red-600 bg-red-100";
    if (percentage >= 60) return "text-orange-600 bg-orange-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Atribuir Técnico
          </DialogTitle>
          <DialogDescription>
            Selecione um técnico para atender a solicitação "{warranty.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Técnico responsável</Label>
            <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um técnico" />
              </SelectTrigger>
              <SelectContent>
                {recommendedTechnicians.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                      Recomendados para {warranty.category}
                    </div>
                    {recommendedTechnicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{tech.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              ★ {tech.rating}
                            </Badge>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getWorkloadColor(tech.currentWorkload, tech.maxWorkload)}`}
                          >
                            {tech.currentWorkload}/{tech.maxWorkload}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
                
                {otherTechnicians.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-t mt-2 pt-2">
                      Outros técnicos
                    </div>
                    {otherTechnicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{tech.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              ★ {tech.rating}
                            </Badge>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getWorkloadColor(tech.currentWorkload, tech.maxWorkload)}`}
                          >
                            {tech.currentWorkload}/{tech.maxWorkload}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedTechnicianData && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Informações do Técnico
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Especialidades:</span>
                  <div className="flex gap-1 mt-1">
                    {selectedTechnicianData.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Carga de trabalho:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={getWorkloadColor(selectedTechnicianData.currentWorkload, selectedTechnicianData.maxWorkload)}
                    >
                      {selectedTechnicianData.currentWorkload}/{selectedTechnicianData.maxWorkload} solicitações
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione observações ou instruções específicas para o técnico..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Tempo estimado para resolução</span>
            </div>
            <p className="text-sm text-blue-700">
              {warranty.estimatedResolutionTime}h baseado na categoria "{warranty.category}" e prioridade "{warranty.priority}"
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAssign}
            disabled={!selectedTechnician || isAssigning}
          >
            {isAssigning ? "Atribuindo..." : "Atribuir Técnico"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
