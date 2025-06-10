import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChecklistBuilder } from '@/components/Checklists/ChecklistBuilder';
import { ChecklistDetail } from '@/components/Checklists/ChecklistDetail';
import { ChecklistTemplates } from '@/components/Checklists/ChecklistTemplates';
import { ChecklistExecution } from '@/components/Checklists/ChecklistExecution';
import { ChecklistStats } from '@/components/Checklists/ChecklistStats';
import { ChecklistCategories } from '@/components/Checklists/ChecklistCategories';
import { ChecklistImportExport } from '@/components/Checklists/ChecklistImportExport';
import { ChecklistItem, ChecklistService } from '@/services/ChecklistService';
import { 
  Plus, 
  FileText, 
  PlayCircle, 
  BarChart, 
  Settings,
  Search,
  Filter
} from 'lucide-react';

interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  itemCount: number;
  isDefault: boolean;
  createdAt: Date;
  items: ChecklistItem[];
}

export default function Checklist() {
  const [currentView, setCurrentView] = useState<'templates' | 'builder' | 'execution' | 'detail'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [executionItems, setExecutionItems] = useState<ChecklistItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock stats data
  const statsData = {
    totalTemplates: 15,
    totalExecutions: 245,
    completionRate: 87,
    averageTime: 25,
    activeInspectors: 8,
    pendingReviews: 3,
    monthlyGrowth: 12,
    categoryBreakdown: [
      { category: "Vistoria", count: 8, percentage: 53 },
      { category: "Manutenção", count: 4, percentage: 27 },
      { category: "Segurança", count: 3, percentage: 20 }
    ]
  };

  const handleSelectTemplate = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
    setExecutionItems(template.items);
    setCurrentView('execution');
  };

  const handleCreateNew = () => {
    setCurrentView('builder');
  };

  const handleSaveChecklist = async (title: string, description: string, items: ChecklistItem[]) => {
    try {
      await ChecklistService.createChecklist(items, { title, description });
      setCurrentView('templates');
    } catch (error) {
      console.error('Erro ao salvar checklist:', error);
    }
  };

  const handleItemStatusChange = (itemId: string, status: 'completed' | 'failed' | 'not_applicable' | 'pending') => {
    setExecutionItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status, completedAt: status === 'completed' ? new Date() : undefined } : item
    ));
  };

  const handleItemNotesChange = (itemId: string, notes: string) => {
    setExecutionItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, notes } : item
    ));
  };

  const handleSaveExecution = () => {
    const completedItems = executionItems.filter(item => item.status === 'completed');
    console.log('Salvando execução:', { completedItems, totalItems: executionItems.length });
    setCurrentView('templates');
  };

  const handleBack = () => {
    setCurrentView('templates');
    setSelectedTemplate(null);
    setExecutionItems([]);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  if (currentView === 'builder') {
    return (
      <div className="container mx-auto py-6">
        <ChecklistBuilder
          onSave={handleSaveChecklist}
          onCancel={handleBack}
        />
      </div>
    );
  }

  if (currentView === 'execution' && selectedTemplate) {
    return (
      <div className="container mx-auto py-6">
        <ChecklistExecution
          title={selectedTemplate.name}
          description={selectedTemplate.description}
          items={executionItems}
          onItemStatusChange={handleItemStatusChange}
          onItemNotesChange={handleItemNotesChange}
          onSave={handleSaveExecution}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              Sistema de Checklists
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie templates, execute checklists e acompanhe análises de performance
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar checklists..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Statistics Overview */}
        <ChecklistStats {...statsData} />
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="executions" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Execuções</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Análises</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Configurações</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ChecklistCategories
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
              />
            </div>
            <div className="lg:col-span-3">
              <ChecklistTemplates
                onSelectTemplate={handleSelectTemplate}
                onCreateNew={handleCreateNew}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="executions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5" />
                Execuções Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma execução registrada</h3>
                <p className="mb-4">Execute um checklist para ver o histórico aqui</p>
                <Button onClick={handleCreateNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  Iniciar Nova Execução
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taxa de Sucesso</span>
                    <Badge variant="secondary">87%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tempo Médio</span>
                    <Badge variant="secondary">25min</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Eficiência</span>
                    <Badge variant="secondary">92%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Templates Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Vistoria Pré-Entrega</span>
                    <Badge variant="outline">45 usos</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Inspeção de Garantia</span>
                    <Badge variant="outline">32 usos</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Manutenção Preventiva</span>
                    <Badge variant="outline">28 usos</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Problemas Frequentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Hidráulica</span>
                    <Badge variant="destructive">23%</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Elétrica</span>
                    <Badge variant="destructive">18%</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Acabamento</span>
                    <Badge variant="destructive">15%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <ChecklistImportExport />
            
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Backup Automático</h4>
                    <p className="text-sm text-muted-foreground">
                      Fazer backup dos templates automaticamente
                    </p>
                    <Badge variant="secondary">Ativo</Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Notificações</h4>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações de execuções pendentes
                    </p>
                    <Badge variant="secondary">Ativo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
