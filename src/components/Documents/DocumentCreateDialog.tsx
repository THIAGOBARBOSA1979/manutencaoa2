
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, Save } from "lucide-react";
import { documentService } from "@/services/DocumentService";
import { useToast } from "@/components/ui/use-toast";

interface DocumentCreateDialogProps {
  onDocumentCreated: () => void;
}

export function DocumentCreateDialog({ onDocumentCreated }: DocumentCreateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

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
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
        createdBy: "Admin"
      });

      setIsOpen(false);
      resetForm();
      onDocumentCreated();

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
        title: formData.title || file.name.replace('.pdf', ''),
        type: "manual",
        fileUrl,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        category: formData.category || "outros",
        associatedTo: {},
        visible: true,
        status: "published",
        priority: "medium",
        createdBy: "Admin"
      });

      setUploadProgress(0);
      setIsOpen(false);
      resetForm();
      onDocumentCreated();

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
  const categories = documentService.getCategories();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
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
                placeholder="Digite o modelo usando variáveis como {{nome_cliente}}, {{endereco}}, {{valor}}"
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
            <Label>Prioridade</Label>
            <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({...prev, priority: value}))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Cliente Associado</Label>
            <Input 
              placeholder="Nome do cliente (opcional)"
              value={formData.associatedClient}
              onChange={(e) => setFormData(prev => ({...prev, associatedClient: e.target.value}))}
            />
          </div>
          <div className="space-y-2">
            <Label>Data de Expiração</Label>
            <Input 
              type="date"
              value={formData.expiresAt}
              onChange={(e) => setFormData(prev => ({...prev, expiresAt: e.target.value}))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea 
            placeholder="Descrição do documento (opcional)"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
          />
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
          <Button variant="outline" onClick={() => {setIsOpen(false); resetForm();}}>
            Cancelar
          </Button>
          <Button onClick={handleCreateDocument}>
            <Save className="mr-2 h-4 w-4" />
            Criar Documento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
