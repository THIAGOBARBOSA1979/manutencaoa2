
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Calendar as CalendarIcon, 
  User, 
  CheckCircle2, 
  Clock, 
  X, 
  Camera,
  FileText,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ServiceExecution {
  id: string;
  warrantyId: string;
  executionDate: Date;
  technician: string;
  technicianId: string;
  description: string;
  status: 'executed' | 'pending' | 'rejected';
  evidences: string[];
  materials: string[];
  timeSpent: number; // in minutes
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceExecutionProofProps {
  warrantyId: string;
  executions: ServiceExecution[];
  onAddExecution: (execution: Omit<ServiceExecution, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateExecution: (executionId: string, updates: Partial<ServiceExecution>) => void;
}

const technicians = [
  { id: "1", name: "João Silva" },
  { id: "2", name: "Maria Oliveira" },
  { id: "3", name: "Carlos Santos" },
  { id: "4", name: "Ana Pereira" },
];

export const ServiceExecutionProof = ({ 
  warrantyId, 
  executions, 
  onAddExecution, 
  onUpdateExecution 
}: ServiceExecutionProofProps) => {
  const { toast } = useToast();
  const [isAddingExecution, setIsAddingExecution] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [files, setFiles] = useState<File[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState("");

  const getStatusBadge = (status: ServiceExecution['status']) => {
    const statusConfig = {
      executed: { label: "Executado", className: "bg-green-100 text-green-800 border-green-200" },
      pending: { label: "Pendente", className: "bg-amber-100 text-amber-800 border-amber-200" },
      rejected: { label: "Reprovado", className: "bg-red-100 text-red-800 border-red-200" }
    };
    
    const config = statusConfig[status];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const handleSubmitExecution = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    if (!selectedDate) {
      toast({
        title: "Erro",
        description: "Por favor, selecione a data de execução.",
        variant: "destructive",
      });
      return;
    }

    const newExecution: Omit<ServiceExecution, 'id' | 'createdAt' | 'updatedAt'> = {
      warrantyId,
      executionDate: selectedDate,
      technician: technicians.find(t => t.id === formData.get('technicianId'))?.name || '',
      technicianId: formData.get('technicianId') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as ServiceExecution['status'],
      evidences: files.map(f => f.name), // In real app, would upload to storage
      materials,
      timeSpent: parseInt(formData.get('timeSpent') as string, 10),
      notes: formData.get('notes') as string,
    };

    onAddExecution(newExecution);
    setIsAddingExecution(false);
    setSelectedDate(undefined);
    setFiles([]);
    setMaterials([]);
    form.reset();

    toast({
      title: "Execução registrada",
      description: "A comprovação de execução foi registrada com sucesso.",
    });
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setMaterials(prev => [...prev, newMaterial.trim()]);
      setNewMaterial("");
    }
  };

  const removeMaterial = (index: number) => {
    setMaterials(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Comprovação de Execução</h3>
          <p className="text-sm text-muted-foreground">
            Registre as execuções realizadas para esta garantia
          </p>
        </div>
        <Dialog open={isAddingExecution} onOpenChange={setIsAddingExecution}>
          <DialogTrigger asChild>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Registrar Execução
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Comprovação de Execução</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmitExecution} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Execução</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technicianId">Responsável Técnico</Label>
                  <Select name="technicianId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar técnico" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status da Execução</Label>
                  <Select name="status" required defaultValue="executed">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executed">Executado</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="rejected">Reprovado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeSpent">Tempo Gasto (minutos)</Label>
                  <Input
                    id="timeSpent"
                    name="timeSpent"
                    type="number"
                    min="1"
                    placeholder="120"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Serviço</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva detalhadamente o serviço executado..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Materiais Utilizados</Label>
                <div className="flex gap-2">
                  <Input
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    placeholder="Nome do material"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                  />
                  <Button type="button" onClick={addMaterial} variant="outline">
                    Adicionar
                  </Button>
                </div>
                {materials.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {materials.map((material, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {material}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeMaterial(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Evidências (Fotos)</Label>
                <div className="border rounded-md p-3">
                  {files.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <div className="text-sm truncate max-w-xs flex items-center gap-2">
                            <Camera className="h-4 w-4" />
                            {file.name}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-center relative">
                    <Input
                      type="file"
                      className="opacity-0 absolute inset-0 z-10 cursor-pointer"
                      multiple
                      onChange={handleFilesChange}
                      accept="image/*"
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      type="button"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Selecionar Fotos
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Observações adicionais..."
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddingExecution(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Registrar Execução
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {executions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma execução registrada</h3>
            <p className="text-muted-foreground mb-4">
              Registre as execuções realizadas para manter um histórico completo
            </p>
            <Button onClick={() => setIsAddingExecution(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Registrar primeira execução
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {executions.map((execution) => (
            <Card key={execution.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Execução - {format(execution.executionDate, "dd/MM/yyyy", { locale: ptBR })}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{execution.technician}</span>
                    </div>
                  </div>
                  {getStatusBadge(execution.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{execution.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Tempo: {execution.timeSpent} minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <span>Evidências: {execution.evidences.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Materiais: {execution.materials.length}</span>
                  </div>
                </div>

                {execution.materials.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Materiais utilizados:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {execution.materials.map((material, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {execution.notes && (
                  <div>
                    <Label className="text-sm font-medium">Observações:</Label>
                    <p className="text-sm text-muted-foreground mt-1">{execution.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
