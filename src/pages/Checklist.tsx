
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
  Filter,
  Download,
  Upload,
  Grid,
  List
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const handleSaveExecution = (completedItems: ChecklistItem[], notes: string) => {
    console.log('Salvando execução:', { completedItems, notes });
  };

  const handleSubmitExecution = (completedItems: ChecklistItem[], notes: string) => {
    console.log('Finalizando execução:', { completedItems, notes });
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
        <div className="mb-4">
          <Button variant="outline" onClick={handleBack}>
            ← Voltar aos Templates
          </Button>
        </div>
        <ChecklistExecution
          title={selectedTemplate.name}
          items={executionItems}
          onSave={handleSaveExecution}
          onSubmit={handleSubmitExecution}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Sistema de Checklists
          </h1>
          <p className="text-muted-foreground">
            Gerencie templates, execute checklists e acompanhe análises
          </p>
        </div>
        
        <div className="flex items-center gap-2">
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
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <ChecklistStats {...statsData} />

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="executions">
            <PlayCircle className="h-4 w-4 mr-2" />
            Execuções
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="h-4 w-4 mr-2" />
            Análises
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
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
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="executions">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Execuções Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <PlayCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma execução registrada</h3>
                  <p>Execute um checklist para ver o histórico aqui</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="space-y-2">
                  <div className="text-sm">Vistoria Pré-Entrega</div>
                  <div className="text-sm">Inspeção de Garantia</div>
                  <div className="text-sm">Manutenção Preventiva</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Problemas Frequentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm flex justify-between">
                    <span>Hidráulica</span>
                    <Badge variant="destructive">23%</Badge>
                  </div>
                  <div className="text-sm flex justify-between">
                    <span>Elétrica</span>
                    <Badge variant="destructive">18%</Badge>
                  </div>
                  <div className="text-sm flex justify-between">
                    <span>Acabamento</span>
                    <Badge variant="destructive">15%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crescimento Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+12%</div>
                  <p className="text-xs text-muted-foreground">
                    Comparado ao mês anterior
                  </p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Backup Automático</label>
                    <p className="text-xs text-muted-foreground">
                      Fazer backup dos templates automaticamente
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notificações</label>
                    <p className="text-xs text-muted-foreground">
                      Receber notificações de execuções pendentes
                    </p>
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
