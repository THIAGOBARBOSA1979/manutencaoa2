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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  PlusCircle, 
  ListTodo, 
  Settings2, 
  MessageSquare, 
  Clock,
  User,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { WarrantyProblem, PriorityLevel } from "./types";
import { WarrantyProblemDetail } from "./WarrantyProblemDetail";
import { ServiceExecutionProof, ServiceExecution } from "./ServiceExecutionProof";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Available categories
const problemCategories = [
  "Hidráulica",
  "Elétrica",
  "Estrutural", 
  "Vedação e Impermeabilização",
  "Acabamento",
  "Esquadrias",
  "Equipamentos",
  "Outros"
];

interface CommunicationHistory {
  id: string;
  problemId: string;
  message: string;
  author: string;
  authorType: 'client' | 'technician' | 'admin';
  timestamp: Date;
  attachments?: string[];
}

interface WarrantyProblemsManagerProps {
  warrantyId: string;
  warrantyTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WarrantyProblemsManager = ({ 
  warrantyId, 
  warrantyTitle, 
  open, 
  onOpenChange 
}: WarrantyProblemsManagerProps) => {
  const { toast } = useToast();
  const [problems, setProblems] = useState<WarrantyProblem[]>([]);
  const [executions, setExecutions] = useState<ServiceExecution[]>([]);
  const [communications, setCommunications] = useState<CommunicationHistory[]>([]);
  const [isAddingProblem, setIsAddingProblem] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("problems");
  
  const selectedProblem = problems.find(p => p.id === selectedProblemId);
  const allProblemsResolved = problems.length > 0 && problems.every(p => p.status === "resolved");
  
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
  
  const handleAddProblem = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
    const category = (form.elements.namedItem("category") as HTMLSelectElement).value;
    const priority = (form.elements.namedItem("priority") as HTMLSelectElement).value as PriorityLevel;
    
    const newProblem: WarrantyProblem = {
      id: generateId(),
      title,
      description,
      category,
      priority,
      status: "open",
      assignedTo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setProblems([...problems, newProblem]);
    setIsAddingProblem(false);
    form.reset();
    
    // Add initial communication
    const initialCommunication: CommunicationHistory = {
      id: generateId(),
      problemId: newProblem.id,
      message: `Problema "${title}" foi criado na categoria ${category} com prioridade ${priority}.`,
      author: "Sistema",
      authorType: "admin",
      timestamp: new Date()
    };
    setCommunications(prev => [...prev, initialCommunication]);
    
    toast({
      title: "Problema adicionado",
      description: "O problema foi adicionado com sucesso à solicitação de garantia.",
    });
  };
  
  const handleUpdateProblem = (updatedProblem: WarrantyProblem) => {
    const oldProblem = problems.find(p => p.id === updatedProblem.id);
    setProblems(problems.map(p => 
      p.id === updatedProblem.id ? updatedProblem : p
    ));

    // Add communication for status change
    if (oldProblem && oldProblem.status !== updatedProblem.status) {
      const statusCommunication: CommunicationHistory = {
        id: generateId(),
        problemId: updatedProblem.id,
        message: `Status alterado de "${oldProblem.status}" para "${updatedProblem.status}".`,
        author: "Sistema",
        authorType: "admin",
        timestamp: new Date()
      };
      setCommunications(prev => [...prev, statusCommunication]);
    }
    
    toast({
      title: "Problema atualizado",
      description: `O status do problema "${updatedProblem.title}" foi atualizado.`,
    });
  };

  const handleAddExecution = (execution: Omit<ServiceExecution, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExecution: ServiceExecution = {
      ...execution,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setExecutions(prev => [...prev, newExecution]);
    
    toast({
      title: "Execução registrada",
      description: "A comprovação de execução foi registrada com sucesso.",
    });
  };

  const handleUpdateExecution = (executionId: string, updates: Partial<ServiceExecution>) => {
    setExecutions(prev => prev.map(exec => 
      exec.id === executionId 
        ? { ...exec, ...updates, updatedAt: new Date() }
        : exec
    ));
  };

  const addCommunication = (problemId: string, message: string) => {
    const newCommunication: CommunicationHistory = {
      id: generateId(),
      problemId,
      message,
      author: "Usuário Atual", // Would come from auth context
      authorType: "admin",
      timestamp: new Date()
    };
    
    setCommunications(prev => [...prev, newCommunication]);
  };
  
  const handleFinishWarranty = () => {
    toast({
      title: "Garantia concluída",
      description: "Todos os problemas da garantia foram resolvidos. Garantia encerrada com sucesso.",
    });
    onOpenChange(false);
  };
  
  const getProblemStatusCount = () => {
    const counts = {
      open: 0,
      in_progress: 0,
      pending: 0,
      resolved: 0,
      canceled: 0,
    };
    
    problems.forEach(problem => {
      counts[problem.status]++;
    });
    
    return counts;
  };
  
  const statusCounts = getProblemStatusCount();
  const problemCommunications = communications.filter(c => c.problemId === selectedProblemId);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95%] max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Gestão Completa - {warrantyTitle}
          </DialogTitle>
          <DialogDescription>
            Gerencie problemas individuais, execuções e comunicações desta solicitação de garantia.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="problems" className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              Problemas ({problems.length})
            </TabsTrigger>
            <TabsTrigger value="executions" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Execuções ({executions.length})
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comunicações ({communications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="problems" className="mt-4 overflow-y-auto max-h-[70vh]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Badge variant="outline">Total: {problems.length}</Badge>
                {statusCounts.open > 0 && (
                  <Badge variant="outline" className="border-slate-200 bg-slate-100">
                    Abertos: {statusCounts.open}
                  </Badge>
                )}
                {statusCounts.in_progress > 0 && (
                  <Badge variant="outline" className="border-blue-200 bg-blue-100">
                    Em andamento: {statusCounts.in_progress}
                  </Badge>
                )}
                {statusCounts.resolved > 0 && (
                  <Badge variant="outline" className="border-green-200 bg-green-100">
                    Resolvidos: {statusCounts.resolved}
                  </Badge>
                )}
              </div>
              
              <Button onClick={() => setIsAddingProblem(true)}>
                <PlusCircle className="h-4 w-4 mr-1" />
                Adicionar problema
              </Button>
            </div>

            {problems.length === 0 ? (
              <div className="text-center p-12 border rounded-md bg-slate-50">
                <Settings2 className="h-12 w-12 mx-auto text-slate-400" />
                <h3 className="mt-4 text-lg font-medium">Nenhum problema cadastrado</h3>
                <p className="mt-2 text-muted-foreground">
                  Esta solicitação de garantia ainda não possui problemas específicos registrados.
                </p>
                <Button 
                  onClick={() => setIsAddingProblem(true)} 
                  className="mt-4"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Adicionar o primeiro problema
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-4">
                  <div className="font-medium">Lista de problemas</div>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {problems.map((problem) => (
                      <div
                        key={problem.id}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          selectedProblemId === problem.id 
                            ? "border-primary bg-primary/5" 
                            : "hover:bg-slate-50"
                        }`}
                        onClick={() => setSelectedProblemId(problem.id)}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium">{problem.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={
                              problem.status === "open" ? "border-slate-200 bg-slate-100" :
                              problem.status === "in_progress" ? "border-blue-200 bg-blue-100" :
                              problem.status === "pending" ? "border-amber-200 bg-amber-100" :
                              problem.status === "resolved" ? "border-green-200 bg-green-100" :
                              "border-red-200 bg-red-100"
                            }
                          >
                            {
                              problem.status === "open" ? "Aberto" :
                              problem.status === "in_progress" ? "Em andamento" :
                              problem.status === "pending" ? "Pendente" :
                              problem.status === "resolved" ? "Resolvido" :
                              "Cancelado"
                            }
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{problem.category}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(problem.createdAt, "dd/MM/yyyy")}
                          {communications.filter(c => c.problemId === problem.id).length > 0 && (
                            <>
                              <MessageSquare className="h-3 w-3 ml-2" />
                              {communications.filter(c => c.problemId === problem.id).length}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  {selectedProblem ? (
                    <div className="space-y-4">
                      <WarrantyProblemDetail 
                        problem={selectedProblem} 
                        onUpdateProblem={handleUpdateProblem} 
                      />
                      
                      {/* Problem-specific communications */}
                      {problemCommunications.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <MessageSquare className="h-5 w-5" />
                              Histórico de Comunicação
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="max-h-40 overflow-y-auto">
                            <div className="space-y-3">
                              {problemCommunications.map((comm) => (
                                <div key={comm.id} className="flex gap-3 text-sm">
                                  <div className="flex-shrink-0">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                      comm.authorType === 'admin' ? 'bg-blue-100 text-blue-700' :
                                      comm.authorType === 'technician' ? 'bg-green-100 text-green-700' :
                                      'bg-amber-100 text-amber-700'
                                    }`}>
                                      {comm.author.charAt(0).toUpperCase()}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium">{comm.author}</span>
                                      <span className="text-muted-foreground">
                                        {format(comm.timestamp, "dd/MM/yyyy HH:mm")}
                                      </span>
                                    </div>
                                    <p>{comm.message}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-12 border rounded-md bg-slate-50 h-full flex flex-col items-center justify-center">
                      <p className="text-muted-foreground">
                        Selecione um problema na lista para visualizar os detalhes
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="executions" className="mt-4 overflow-y-auto max-h-[70vh]">
            <ServiceExecutionProof
              warrantyId={warrantyId}
              executions={executions}
              onAddExecution={handleAddExecution}
              onUpdateExecution={handleUpdateExecution}
            />
          </TabsContent>

          <TabsContent value="communications" className="mt-4 overflow-y-auto max-h-[70vh]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Histórico Completo de Comunicações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {communications.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhuma comunicação registrada</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {communications.map((comm) => {
                      const relatedProblem = problems.find(p => p.id === comm.problemId);
                      return (
                        <div key={comm.id} className="flex gap-3 p-3 border rounded-md">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              comm.authorType === 'admin' ? 'bg-blue-100 text-blue-700' :
                              comm.authorType === 'technician' ? 'bg-green-100 text-green-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {comm.author.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{comm.author}</span>
                              <span className="text-muted-foreground text-sm">
                                {format(comm.timestamp, "dd/MM/yyyy HH:mm")}
                              </span>
                              {relatedProblem && (
                                <Badge variant="outline" className="text-xs">
                                  {relatedProblem.title}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm">{comm.message}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Fechar
            </Button>
            
            {problems.length > 0 && (
              <Button
                type="button"
                disabled={!allProblemsResolved}
                onClick={handleFinishWarranty}
              >
                Finalizar garantia
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
      
      {/* Dialog for adding new problem */}
      <Dialog open={isAddingProblem} onOpenChange={setIsAddingProblem}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar novo problema</DialogTitle>
            <DialogDescription>
              Cadastre um novo problema específico para esta solicitação de garantia.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddProblem} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do problema</Label>
              <Input 
                id="title"
                name="title"
                placeholder="Informe um título para o problema"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select name="category" required defaultValue={problemCategories[0]}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {problemCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select name="priority" required defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição do problema</Label>
              <Textarea 
                id="description"
                name="description"
                placeholder="Descreva detalhadamente o problema..."
                rows={4}
                required
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddingProblem(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Adicionar problema
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};
