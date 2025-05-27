import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Search, Calendar, Eye, Filter, Clock, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { documentService, Document } from "@/services/DocumentService";

interface ClientDocument extends Omit<Document, 'status'> {
  size?: string;
  downloadUrl?: string;
  status: "disponivel" | "processando" | "vencido";
  description?: string;
}

const getTypeLabel = (type: string) => {
  const types = {
    auto: "Automático",
    manual: "Manual"
  };
  return types[type as keyof typeof types] || type;
};

const getTypeColor = (type: string) => {
  const colors = {
    auto: "default",
    manual: "secondary"
  };
  return colors[type as keyof typeof colors] || "outline";
};

const getStatusColor = (status: string) => {
  const colors = {
    disponivel: "default",
    processando: "secondary",
    vencido: "destructive"
  };
  return colors[status as keyof typeof colors] || "outline";
};

const getStatusLabel = (status: string) => {
  const labels = {
    disponivel: "Disponível",
    processando: "Processando",
    vencido: "Vencido"
  };
  return labels[status as keyof typeof labels] || status;
};

export default function ClientDocuments() {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadClientDocuments();
  }, []);

  const loadClientDocuments = () => {
    // Simular cliente logado
    const clientName = "João Silva";
    const clientDocs = documentService.getDocumentsByClient(clientName);
    
    // Converter para formato do cliente
    const formattedDocs: ClientDocument[] = clientDocs.map(doc => ({
      ...doc,
      size: doc.fileSize || `${Math.floor(Math.random() * 2000 + 500)} KB`,
      downloadUrl: doc.fileUrl || `/docs/${doc.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      status: doc.status === "published" ? "disponivel" : "processando" as any,
      description: getDocumentDescription(doc)
    }));

    setDocuments(formattedDocs);
  };

  const getDocumentDescription = (doc: Document): string => {
    if (doc.type === "auto") {
      return `Documento gerado automaticamente com base no template`;
    }
    return `Documento em formato ${doc.fileName?.split('.').pop()?.toUpperCase() || 'PDF'}`;
  };

  const filteredDocuments = documents.filter(doc => {
    if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && doc.type !== typeFilter) return false;
    if (statusFilter !== "all" && doc.status !== statusFilter) return false;
    return true;
  });

  const groupedDocuments = filteredDocuments.reduce((acc, doc) => {
    const category = doc.type === "auto" ? "Automáticos" : "Manuais";
    if (!acc[category]) acc[category] = [];
    acc[category].push(doc);
    return acc;
  }, {} as Record<string, ClientDocument[]>);

  const handleDownload = (doc: ClientDocument) => {
    if (doc.status === "processando") {
      toast({
        title: "Documento não disponível",
        description: "Este documento ainda está sendo processado.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      documentService.downloadDocument(doc.id);
      toast({
        title: "Download iniciado",
        description: `Baixando ${doc.title}...`
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Erro ao baixar o documento",
        variant: "destructive"
      });
    }
  };

  const handlePreview = (doc: ClientDocument) => {
    if (doc.status === "processando") {
      toast({
        title: "Documento não disponível",
        description: "Este documento ainda está sendo processado.",
        variant: "destructive"
      });
      return;
    }

    if (doc.type === "auto" && doc.template) {
      // Gerar preview com dados do cliente
      const clientData = {
        nome_cliente: "João Silva",
        endereco: "Rua das Flores, 123 - Apt 204",
        valor: "350.000,00",
        data: new Date().toLocaleDateString(),
        empreendimento: "Edifício Aurora",
        data_vistoria: "15/05/2025",
        responsavel_vistoria: "Carlos Santos",
        estado_geral: "Excelente",
        instalacoes_eletricas: "Conformes",
        instalacoes_hidraulicas: "Conformes",
        observacoes: "Imóvel em perfeitas condições"
      };

      try {
        const preview = documentService.generateDocument(doc.id, clientData);
        setPreviewContent(preview);
        setPreviewTitle(doc.title);
        setIsPreviewOpen(true);
      } catch (error) {
        toast({
          title: "Erro ao gerar preview",
          description: "Não foi possível gerar o preview do documento",
          variant: "destructive"
        });
      }
    } else {
      // Para documentos manuais, simular abertura
      toast({
        title: "Abrindo documento",
        description: `Carregando ${doc.title}...`
      });
      window.open(doc.downloadUrl, '_blank');
    }
  };

  const stats = {
    total: documents.length,
    disponivel: documents.filter(d => d.status === "disponivel").length,
    processando: documents.filter(d => d.status === "processando").length,
    thisMonth: documents.filter(d => d.createdAt.getMonth() === new Date().getMonth()).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Meus Documentos
        </h1>
        <p className="text-muted-foreground mt-1">
          Acesse e baixe seus documentos relacionados ao imóvel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disponíveis</p>
                <p className="text-2xl font-bold text-green-600">{stats.disponivel}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processando</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.processando}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold text-blue-600">{stats.thisMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
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
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="auto">Automáticos</SelectItem>
            <SelectItem value="manual">Manuais</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="disponivel">Disponível</SelectItem>
            <SelectItem value="processando">Processando</SelectItem>
            <SelectItem value="vencido">Vencido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Documents by Category */}
      <div className="space-y-6">
        {Object.entries(groupedDocuments).map(([category, docs]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold">{category}</h2>
              <Badge variant="outline">{docs.length}</Badge>
            </div>
            
            <div className="grid gap-3">
              {docs.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <h3 className="font-medium leading-none">{doc.title}</h3>
                          {doc.description && (
                            <p className="text-sm text-muted-foreground">{doc.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {doc.createdAt.toLocaleDateString()}
                            <Separator orientation="vertical" className="h-3" />
                            <span>{doc.size}</span>
                            <Separator orientation="vertical" className="h-3" />
                            <span>{doc.downloads} downloads</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getTypeColor(doc.type) as any} className="text-xs">
                              {getTypeLabel(doc.type)}
                            </Badge>
                            <Badge variant={getStatusColor(doc.status) as any} className="text-xs">
                              {getStatusLabel(doc.status)}
                            </Badge>
                            {doc.tags && doc.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-2"
                          onClick={() => handlePreview(doc)}
                          disabled={doc.status === "processando"}
                        >
                          <Eye className="h-4 w-4" />
                          {doc.type === "auto" ? "Preview" : "Abrir"}
                        </Button>
                        <Button 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleDownload(doc)}
                          disabled={doc.status === "processando"}
                        >
                          <Download className="h-4 w-4" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Nenhum documento encontrado</h3>
            <p className="text-muted-foreground">
              {search ? "Tente uma busca diferente" : "Seus documentos aparecerão aqui quando estiverem disponíveis"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Preview: {previewTitle}</DialogTitle>
            <DialogDescription>
              Visualização do documento gerado
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="p-4 bg-white border rounded">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {previewContent}
              </pre>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsPreviewOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
