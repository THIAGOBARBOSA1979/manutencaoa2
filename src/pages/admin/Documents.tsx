
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Search, Upload, Download, Edit, Trash2, Eye, Save, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { documentService, Document } from "@/services/DocumentService";
import { useToast } from "@/components/ui/use-toast";

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    type: "auto" as "auto" | "manual",
    template: "",
    associatedProperty: "",
    associatedClient: "",
    visible: true,
    status: "draft" as "draft" | "published" | "archived",
    tags: ""
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const docs = documentService.getAllDocuments();
    setDocuments(docs);
  };

  const filteredDocuments = documents.filter(doc => {
    if (filter !== "all" && doc.type !== filter) return false;
    if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const resetForm = () => {
    setFormData({
      title: "",
      type: "auto",
      template: "",
      associatedProperty: "",
      associatedClient: "",
      visible: true,
      status: "draft",
      tags: ""
    });
  };

  const handleCreateDocument = () => {
    if (!formData.title) {
      toast({
        title: "Erro",
        description: "Título é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      const newDocument = documentService.createDocument({
        title: formData.title,
        type: formData.type,
        template: formData.template || undefined,
        associatedTo: {
          property: formData.associatedProperty || undefined,
          client: formData.associatedClient || undefined
        },
        visible: formData.visible,
        status: formData.status,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined
      });

      setDocuments(prev => [...prev, newDocument]);
      setIsCreateDialogOpen(false);
      resetForm();

      toast({
        title: "Sucesso",
        description: "Documento criado com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar documento",
        variant: "destructive"
      });
    }
  };

  const handleEditDocument = (doc: Document) => {
    setEditingDocument(doc);
    setFormData({
      title: doc.title,
      type: doc.type,
      template: doc.template || "",
      associatedProperty: doc.associatedTo.property || "",
      associatedClient: doc.associatedTo.client || "",
      visible: doc.visible,
      status: doc.status,
      tags: doc.tags?.join(', ') || ""
    });
  };

  const handleUpdateDocument = () => {
    if (!editingDocument) return;

    try {
      const updatedDoc = documentService.updateDocument(editingDocument.id, {
        title: formData.title,
        template: formData.template || undefined,
        associatedTo: {
          property: formData.associatedProperty || undefined,
          client: formData.associatedClient || undefined
        },
        visible: formData.visible,
        status: formData.status,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined
      });

      if (updatedDoc) {
        setDocuments(prev => prev.map(doc => 
          doc.id === editingDocument.id ? updatedDoc : doc
        ));
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
        setDocuments(prev => prev.filter(doc => doc.id !== id));
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    
    try {
      // Simular progresso de upload
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      const fileUrl = await documentService.uploadFile(file);
      
      // Criar documento automaticamente após upload
      const newDocument = documentService.createDocument({
        title: file.name.replace('.pdf', ''),
        type: "manual",
        fileUrl,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        associatedTo: {},
        visible: true,
        status: "published"
      });

      setDocuments(prev => [...prev, newDocument]);
      setUploadProgress(0);

      toast({
        title: "Upload concluído",
        description: `Arquivo ${file.name} enviado com sucesso`
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Erro ao enviar arquivo",
        variant: "destructive"
      });
      setUploadProgress(0);
    }
  };

  const templateVariables = documentService.getTemplateVariables();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Documentos
          </h1>
          <p className="text-muted-foreground">
            Gerencie modelos de documentos e arquivos ({documents.length} documentos)
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Documento</DialogTitle>
                <DialogDescription>
                  Crie um novo modelo de documento ou faça upload de um arquivo
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="auto" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="auto" onClick={() => setFormData(prev => ({...prev, type: "auto"}))}>
                    Modelo Automático
                  </TabsTrigger>
                  <TabsTrigger value="manual" onClick={() => setFormData(prev => ({...prev, type: "manual"}))}>
                    Upload Manual
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="auto" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título do Documento</Label>
                      <Input 
                        id="title" 
                        placeholder="Ex: Contrato de Compra e Venda"
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="template">Modelo do Documento</Label>
                    <Textarea 
                      id="template" 
                      placeholder="Digite o modelo usando variáveis como nome_cliente, endereco, valor"
                      rows={12}
                      value={formData.template}
                      onChange={(e) => setFormData(prev => ({...prev, template: e.target.value}))}
                    />
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">Variáveis disponíveis:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {templateVariables.map(variable => (
                          <code key={variable.key} className="bg-muted px-2 py-1 rounded text-xs">
                            {`{{${variable.key}}}`}
                          </code>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="manual" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title-manual">Título do Documento</Label>
                    <Input 
                      id="title-manual" 
                      placeholder="Ex: Manual do Proprietário"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Arquivo PDF</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Clique para fazer upload ou arraste o arquivo aqui
                      </p>
                      <Input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        className="mt-2" 
                        onChange={handleFileUpload}
                      />
                      {uploadProgress > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Empreendimento</Label>
                  <Select value={formData.associatedProperty} onValueChange={(value) => setFormData(prev => ({...prev, associatedProperty: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aurora">Edifício Aurora</SelectItem>
                      <SelectItem value="bosque">Residencial Bosque</SelectItem>
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
              </div>

              <div className="space-y-2">
                <Label>Tags (separadas por vírgula)</Label>
                <Input 
                  placeholder="Ex: contrato, venda, importante"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {setIsCreateDialogOpen(false); resetForm();}}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateDocument}>
                  <Save className="mr-2 h-4 w-4" />
                  Criar Documento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="auto">Modelos Automáticos</SelectItem>
            <SelectItem value="manual">Uploads Manuais</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Documents List */}
      <div className="grid gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {doc.title}
                  </CardTitle>
                  <CardDescription>
                    Criado em {doc.createdAt.toLocaleDateString()} • {doc.downloads} downloads • 
                    Atualizado em {doc.updatedAt.toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={doc.type === "auto" ? "default" : "secondary"}>
                    {doc.type === "auto" ? "Automático" : "Manual"}
                  </Badge>
                  <Badge variant={doc.status === "published" ? "default" : doc.status === "draft" ? "secondary" : "outline"}>
                    {doc.status === "published" ? "Publicado" : doc.status === "draft" ? "Rascunho" : "Arquivado"}
                  </Badge>
                  <Badge variant={doc.visible ? "default" : "secondary"}>
                    {doc.visible ? "Visível" : "Oculto"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <strong>Associado a:</strong> {
                    Object.entries(doc.associatedTo)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ") || "Nenhuma associação"
                  }
                </div>

                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {doc.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {doc.template && (
                  <div className="text-sm">
                    <strong>Modelo:</strong>
                    <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                      {doc.template.length > 150 
                        ? `${doc.template.substring(0, 150)}...` 
                        : doc.template
                      }
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 flex-wrap">
                  {doc.type === "auto" && (
                    <Button size="sm" variant="outline" onClick={() => handlePreviewDocument(doc)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => documentService.downloadDocument(doc.id)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEditDocument(doc)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o documento "{doc.title}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteDocument(doc.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingDocument && (
        <Dialog open={!!editingDocument} onOpenChange={() => {setEditingDocument(null); resetForm();}}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Documento</DialogTitle>
              <DialogDescription>
                Edite as informações do documento
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                />
              </div>

              {editingDocument.type === "auto" && (
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Textarea 
                    value={formData.template}
                    onChange={(e) => setFormData(prev => ({...prev, template: e.target.value}))}
                    rows={8}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label>Visível</Label>
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
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <Input 
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {setEditingDocument(null); resetForm();}}>
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
      )}

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
