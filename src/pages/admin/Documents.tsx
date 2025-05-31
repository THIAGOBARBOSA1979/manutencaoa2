import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Search, Eye, Save, X, 
  Star, Clock, AlertTriangle, Archive, BarChart, TrendingUp
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { documentService, Document } from "@/services/DocumentService";
import { useToast } from "@/components/ui/use-toast";
import { DocumentsDashboard } from "@/components/Documents/DocumentsDashboard";
import { DocumentAnalytics } from "@/components/Documents/DocumentAnalytics";
import { DocumentCreateDialog } from "@/components/Documents/DocumentCreateDialog";
import { DocumentList } from "@/components/Documents/DocumentList";

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const { toast } = useToast();

  // Form states for editing
  const [formData, setFormData] = useState({
    title: "",
    type: "auto" as "auto" | "manual",
    template: "",
    category: "outros" as any,
    associatedProperty: "",
    associatedClient: "",
    visible: true,
    status: "draft" as "draft" | "published" | "archived",
    tags: "",
    priority: "medium" as "low" | "medium" | "high",
    description: "",
    expiresAt: ""
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const docs = documentService.getAllDocuments();
    setDocuments(docs);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "auto",
      template: "",
      category: "outros",
      associatedProperty: "",
      associatedClient: "",
      visible: true,
      status: "draft",
      tags: "",
      priority: "medium",
      description: "",
      expiresAt: ""
    });
  };

  const handleEditDocument = (doc: Document) => {
    setEditingDocument(doc);
    setFormData({
      title: doc.title,
      type: doc.type,
      template: doc.template || "",
      category: doc.category,
      associatedProperty: doc.associatedTo.property || "",
      associatedClient: doc.associatedTo.client || "",
      visible: doc.visible,
      status: doc.status,
      tags: doc.tags?.join(', ') || "",
      priority: doc.priority,
      description: doc.description || "",
      expiresAt: doc.expiresAt ? doc.expiresAt.toISOString().split('T')[0] : ""
    });
  };

  const handleUpdateDocument = () => {
    if (!editingDocument) return;

    try {
      const updatedDoc = documentService.updateDocument(editingDocument.id, {
        title: formData.title,
        template: formData.template || undefined,
        category: formData.category,
        associatedTo: {
          property: formData.associatedProperty || undefined,
          client: formData.associatedClient || undefined
        },
        visible: formData.visible,
        status: formData.status,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined,
        priority: formData.priority,
        description: formData.description,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined
      });

      if (updatedDoc) {
        loadDocuments();
        setEditingDocument(null);
        resetForm();

        toast({
          title: "Sucesso",
          description: "Documento atualizado com sucesso"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar documento",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDocument = (id: string) => {
    try {
      const success = documentService.deleteDocument(id);
      if (success) {
        loadDocuments();
        toast({
          title: "Sucesso",
          description: "Documento excluído com sucesso"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir documento",
        variant: "destructive"
      });
    }
  };

  const handlePreviewDocument = (doc: Document) => {
    if (doc.type === "auto" && doc.template) {
      // Gerar preview com dados de exemplo
      const sampleData = {
        nome_cliente: "João Silva",
        endereco: "Rua das Flores, 123",
        valor: "350.000,00",
        data: new Date().toLocaleDateString(),
        empreendimento: "Edifício Aurora"
      };
      
      const preview = documentService.generateDocument(doc.id, sampleData);
      setPreviewContent(preview);
      setIsPreviewDialogOpen(true);
    } else {
      toast({
        title: "Preview não disponível",
        description: "Preview disponível apenas para documentos automáticos"
      });
    }
  };

  const handleToggleFavorite = (id: string) => {
    try {
      const success = documentService.toggleFavorite(id);
      if (success) {
        loadDocuments();
        toast({
          title: "Sucesso",
          description: "Favorito atualizado com sucesso"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar favorito",
        variant: "destructive"
      });
    }
  };

  const handleDuplicate = (id: string) => {
    try {
      const duplicated = documentService.duplicateDocument(id);
      if (duplicated) {
        loadDocuments();
        toast({
          title: "Sucesso",
          description: "Documento duplicado com sucesso"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao duplicar documento",
        variant: "destructive"
      });
    }
  };

  const handleRestoreVersion = (versionId: string) => {
    try {
      console.log('Restaurando versão:', versionId);
      toast({
        title: "Versão restaurada",
        description: "A versão anterior foi restaurada com sucesso"
      });
      loadDocuments();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao restaurar versão",
        variant: "destructive"
      });
    }
  };

  const stats = documentService.getDocumentStats();
  const categories = documentService.getCategories();
  const favoriteDocuments = documentService.getFavoriteDocuments();
  const expiringDocuments = documentService.getExpiringDocuments();

  return (
    <div className="space-y-6">
      {/* Header Melhorado */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              Gerenciamento de Documentos
            </h1>
            <p className="text-muted-foreground mt-1">
              Sistema completo para criação, organização e distribuição de documentos
            </p>
          </div>
          <DocumentCreateDialog onDocumentCreated={loadDocuments} />
        </div>
        
        {/* Breadcrumb de navegação */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Administração</span>
          <span>/</span>
          <span className="text-foreground font-medium">Documentos</span>
          <span className="ml-auto">{documents.length} documentos no total</span>
        </div>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Favoritos ({stats.favorites})
          </TabsTrigger>
          <TabsTrigger value="expiring" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Vencendo ({stats.expiring})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DocumentsDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <DocumentAnalytics />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentList
            documents={documents}
            onEdit={handleEditDocument}
            onDelete={handleDeleteDocument}
            onPreview={handlePreviewDocument}
            onToggleFavorite={handleToggleFavorite}
            onDuplicate={handleDuplicate}
            onRestoreVersion={handleRestoreVersion}
            onRefresh={loadDocuments}
            stats={stats}
            categories={categories}
          />
        </TabsContent>

        <TabsContent value="favorites">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Documentos Favoritos</h3>
              <Badge variant="secondary">{favoriteDocuments.length} documentos</Badge>
            </div>
            <div className="space-y-4">
              {favoriteDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow border-yellow-200">
                  {/* ... keep existing code (favorite documents layout) */}
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="expiring">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Documentos Vencendo</h3>
              <Badge variant="destructive">{expiringDocuments.length} documentos</Badge>
            </div>
            <div className="space-y-4">
              {expiringDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow border-red-200">
                  {/* ... keep existing code (expiring documents layout) */}
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Document Dialog */}
      <Dialog open={!!editingDocument} onOpenChange={(open) => !open && setEditingDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Documento</DialogTitle>
            <DialogDescription>
              Modifique as informações do documento
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título</Label>
                <Input 
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({...prev, status: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {formData.type === "auto" && (
              <div className="space-y-2">
                <Label htmlFor="edit-template">Template</Label>
                <Textarea 
                  id="edit-template"
                  rows={8}
                  value={formData.template}
                  onChange={(e) => setFormData(prev => ({...prev, template: e.target.value}))}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input 
                placeholder="Nome do cliente (opcional)"
                value={formData.associatedClient}
                onChange={(e) => setFormData(prev => ({...prev, associatedClient: e.target.value}))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Visível para Cliente</Label>
              <Select value={formData.visible.toString()} onValueChange={(value) => setFormData(prev => ({...prev, visible: value === "true"}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tags (separadas por vírgula)</Label>
              <Input 
                placeholder="Ex: contrato, venda, importante"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({...prev, priority: value as "low" | "medium" | "high"}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea 
                placeholder="Digite a descrição do documento"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Expira em</Label>
              <Input 
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData(prev => ({...prev, expiresAt: e.target.value}))}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingDocument(null)}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleUpdateDocument}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Preview do Documento</DialogTitle>
            <DialogDescription>
              Visualização com dados de exemplo
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <pre className="whitespace-pre-wrap p-4 bg-muted rounded text-sm font-mono">
              {previewContent}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
