import { useState, useEffect } from 'react';
import { ChecklistService, ChecklistItem, ChecklistTemplate } from '@/services/ChecklistService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ClipboardCheck, Plus, Eye, Edit } from "lucide-react";
import { CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import { ChecklistBuilder } from '@/components/Checklists/ChecklistBuilder';
import { ChecklistTemplates } from '@/components/Checklists/ChecklistTemplates';

// Mock data for checklist templates
const mockTemplates = [
  {
    id: "1",
    title: "Vistoria de Pré-Entrega",
    description: "Checklist completo para vistorias antes da entrega ao cliente",
    sections: 6,
    items: 42,
    createdAt: new Date(2025, 2, 15),
    lastUpdated: new Date(2025, 2, 20),
  },
  {
    id: "2",
    title: "Vistoria de Garantia - Hidráulica",
    description: "Itens a serem verificados em vistorias de garantia hidráulica",
    sections: 3,
    items: 18,
    createdAt: new Date(2025, 3, 5),
    lastUpdated: new Date(2025, 3, 5),
  },
  {
    id: "3",
    title: "Inspeção de Qualidade - Fase Acabamento",
    description: "Verificação de qualidade para obras em fase de acabamento",
    sections: 5,
    items: 35,
    createdAt: new Date(2025, 1, 20),
    lastUpdated: new Date(2025, 4, 10),
  },
];

// Mock data for applied checklists
const mockAppliedChecklists = [
  {
    id: "1",
    templateTitle: "Vistoria de Pré-Entrega",
    property: "Edifício Aurora",
    unit: "204",
    completedBy: "Carlos Mendes",
    completedAt: new Date(2025, 4, 15),
    status: "completed",
    score: 95,
  },
  {
    id: "2",
    templateTitle: "Vistoria de Garantia - Hidráulica",
    property: "Residencial Verde Vida",
    unit: "101A",
    completedBy: "Ana Silva",
    completedAt: new Date(2025, 4, 12),
    status: "completed",
    score: 87,
  },
  {
    id: "3",
    templateTitle: "Inspeção de Qualidade - Fase Acabamento",
    property: "Condomínio Monte Alto",
    unit: "Torre 2 - Andar 5",
    completedBy: "Roberto Almeida",
    completedAt: null,
    status: "in_progress",
    score: null,
  },
];

const Checklist = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("templates");
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isApplyDialogOpen, setApplyDialogOpen] = useState(false);
  const [templates, setTemplates] = useState(mockTemplates);
  const [appliedChecklists, setAppliedChecklists] = useState(mockAppliedChecklists);
  const [isBuilderMode, setIsBuilderMode] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);

  // Filter templates based on search term
  const filteredTemplates = templates.filter(
    template => 
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter applied checklists based on search term
  const filteredApplied = appliedChecklists.filter(
    checklist =>
      checklist.templateTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checklist.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTemplate = async (title: string, description: string, items: ChecklistItem[]) => {
    try {
      await ChecklistService.createChecklist(items, { title, description });
      
      // In a real app, we would fetch updated templates 
      // For now, add to mock data
      const newTemplate = {
        id: uuidv4(),
        title,
        description,
        sections: 1,
        items: items.length,
        createdAt: new Date(),
        lastUpdated: new Date(),
      };
      
      setTemplates([...templates, newTemplate]);
      
      toast({
        title: "Sucesso",
        description: "Modelo de checklist criado com sucesso.",
      });
      setIsBuilderMode(false);
      setCreateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar modelo de checklist.",
        variant: "destructive",
      });
    }
  };

  const handleApplyChecklist = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const application = {
        templateId: formData.get('template') as string,
        property: formData.get('property') as string,
        unit: formData.get('unit') as string,
        startDate: new Date(),
        status: 'in_progress',
      };
      
      // TODO: Implement application method in ChecklistService
      
      toast({
        title: "Sucesso",
        description: "Checklist aplicado com sucesso.",
      });
      setApplyDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao aplicar checklist.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const startNewChecklist = () => {
    setShowTemplateSelection(true);
    setCreateDialogOpen(false);
  };

  const handleTemplateSelection = (template: any) => {
    setShowTemplateSelection(false);
    setIsBuilderMode(true);
    // Here you would pre-populate the builder with template data
  };

  const handleCreateCustom = () => {
    setShowTemplateSelection(false);
    setIsBuilderMode(true);
  };

  if (showTemplateSelection) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardCheck className="h-8 w-8" />
            Escolher Template
          </h1>
          <Button variant="outline" onClick={() => setShowTemplateSelection(false)}>
            Voltar
          </Button>
        </div>
        <ChecklistTemplates 
          onSelectTemplate={handleTemplateSelection}
          onCreateCustom={handleCreateCustom}
        />
      </div>
    );
  }

  if (isBuilderMode) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardCheck className="h-8 w-8" />
            Novo Modelo de Checklist
          </h1>
        </div>
        <ChecklistBuilder 
          onSave={handleCreateTemplate}
          onCancel={() => setIsBuilderMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardCheck className="h-8 w-8" />
            Checklists
          </h1>
          <p className="text-muted-foreground">
            Gerencie e aplique modelos de checklist para vistorias e inspeções
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isApplyDialogOpen} onOpenChange={setApplyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Check className="mr-2 h-4 w-4" />
                Aplicar Checklist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Aplicar Checklist</DialogTitle>
                <DialogDescription>
                  Selecione um modelo de checklist para aplicar a uma unidade ou empreendimento.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleApplyChecklist} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template">Modelo de Checklist</Label>
                  <Select name="template" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property">Empreendimento</Label>
                  <Input
                    id="property"
                    name="property"
                    placeholder="Nome do empreendimento"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade</Label>
                  <Input
                    id="unit"
                    name="unit"
                    placeholder="Número/Identificação da unidade"
                    required
                  />
                </div>
              </form>
              <DialogFooter>
                <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleApplyChecklist}>
                  Aplicar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Modelo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Modelo de Checklist</DialogTitle>
                <DialogDescription>
                  Escolha como deseja criar seu novo modelo de checklist
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col space-y-4 pt-4">
                <Button onClick={startNewChecklist}>
                  <Plus className="mr-2 h-4 w-4" />
                  Usar template ou criar personalizado
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and tabs */}
      <div className="space-y-4">
        <Input 
          placeholder="Buscar checklists..." 
          className="max-w-md"
          value={searchTerm}
          onChange={handleSearch}
        />

        <Tabs defaultValue="templates" onValueChange={setActiveTab} value={activeTab}>
          <TabsList>
            <TabsTrigger value="templates">Modelos</TabsTrigger>
            <TabsTrigger value="applied">Aplicados</TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4 pt-4">
            {filteredTemplates.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map(template => (
                  <Card key={template.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>{template.sections} seções</span>
                        <span>{template.items} itens</span>
                      </div>
                      <div className="mt-2 text-muted-foreground">
                        Atualizado em {format(template.lastUpdated, "dd/MM/yyyy")}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-1" /> Visualizar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <h3 className="mt-2 text-lg font-medium">Nenhum modelo encontrado</h3>
                <p className="text-muted-foreground">
                  Não foram encontrados modelos correspondentes à sua busca.
                </p>
                <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Criar novo modelo
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Applied Tab */}
          <TabsContent value="applied" className="pt-4">
            {filteredApplied.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Checklists Aplicados</CardTitle>
                  <CardDescription>
                    Checklists que foram aplicados em vistorias e inspeções
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Local</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplied.map(checklist => (
                        <TableRow key={checklist.id}>
                          <TableCell className="font-medium">
                            {checklist.templateTitle}
                          </TableCell>
                          <TableCell>
                            {checklist.property} - {checklist.unit}
                          </TableCell>
                          <TableCell>{checklist.completedBy}</TableCell>
                          <TableCell>
                            {checklist.completedAt 
                              ? format(checklist.completedAt, "dd/MM/yyyy")
                              : "Em andamento"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={checklist.status === "completed" ? "default" : "outline"}>
                              {checklist.status === "completed" ? "Concluído" : "Em andamento"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center p-8">
                <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <h3 className="mt-2 text-lg font-medium">Nenhum checklist aplicado encontrado</h3>
                <p className="text-muted-foreground">
                  Não foram encontrados checklists aplicados correspondentes à sua busca.
                </p>
                <Button className="mt-4" onClick={() => setApplyDialogOpen(true)}>
                  <Check className="h-4 w-4 mr-2" /> Aplicar checklist
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Checklist;
