
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Search, Calendar, Eye, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface ClientDocument {
  id: string;
  title: string;
  type: "contrato" | "manual" | "vistoria" | "garantia" | "outros";
  createdAt: Date;
  size: string;
  downloadUrl: string;
  status: "disponivel" | "processando" | "vencido";
  description?: string;
}

const mockClientDocuments: ClientDocument[] = [
  {
    id: "1",
    title: "Contrato de Compra e Venda - Unidade 204",
    type: "contrato",
    createdAt: new Date(2025, 3, 15),
    size: "1.2 MB",
    downloadUrl: "/docs/contrato-204.pdf",
    status: "disponivel",
    description: "Contrato assinado de compra e venda da unidade 204"
  },
  {
    id: "2",
    title: "Manual do Proprietário - Edifício Aurora",
    type: "manual",
    createdAt: new Date(2025, 3, 20),
    size: "850 KB",
    downloadUrl: "/docs/manual-aurora.pdf",
    status: "disponivel",
    description: "Manual completo com informações sobre o condomínio"
  },
  {
    id: "3",
    title: "Relatório de Vistoria de Entrega",
    type: "vistoria",
    createdAt: new Date(2025, 4, 10),
    size: "2.1 MB",
    downloadUrl: "/docs/vistoria-204.pdf",
    status: "disponivel",
    description: "Vistoria realizada no momento da entrega das chaves"
  },
  {
    id: "4",
    title: "Certificado de Garantia - 5 Anos",
    type: "garantia",
    createdAt: new Date(2025, 4, 12),
    size: "450 KB",
    downloadUrl: "/docs/garantia-204.pdf",
    status: "disponivel",
    description: "Certificado de garantia estrutural e acabamentos"
  },
  {
    id: "5",
    title: "Certidão de Registro do Imóvel",
    type: "outros",
    createdAt: new Date(2025, 4, 20),
    size: "680 KB",
    downloadUrl: "/docs/certidao-204.pdf",
    status: "processando",
    description: "Certidão emitida pelo cartório de registro de imóveis"
  }
];

const getTypeLabel = (type: string) => {
  const types = {
    contrato: "Contrato",
    manual: "Manual",
    vistoria: "Vistoria",
    garantia: "Garantia",
    outros: "Outros"
  };
  return types[type as keyof typeof types] || type;
};

const getTypeColor = (type: string) => {
  const colors = {
    contrato: "default",
    manual: "secondary", 
    vistoria: "destructive",
    garantia: "outline",
    outros: "secondary"
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
  const [documents] = useState<ClientDocument[]>(mockClientDocuments);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const filteredDocuments = documents.filter(doc => {
    if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && doc.type !== typeFilter) return false;
    if (statusFilter !== "all" && doc.status !== statusFilter) return false;
    return true;
  });

  const groupedDocuments = filteredDocuments.reduce((acc, doc) => {
    if (!acc[doc.type]) acc[doc.type] = [];
    acc[doc.type].push(doc);
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
    
    toast({
      title: "Download iniciado",
      description: `Baixando ${doc.title}...`
    });
    
    // Simular download
    const link = document.createElement('a');
    link.href = doc.downloadUrl;
    link.download = doc.title;
    link.click();
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

    toast({
      title: "Abrindo visualização",
      description: `Carregando ${doc.title}...`
    });
    
    // Simular abertura em nova aba
    window.open(doc.downloadUrl, '_blank');
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
                <p className="text-2xl font-bold">{documents.length}</p>
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
                <p className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.status === "disponivel").length}
                </p>
              </div>
              <Download className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processando</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {documents.filter(d => d.status === "processando").length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold text-blue-600">
                  {documents.filter(d => d.createdAt.getMonth() === new Date().getMonth()).length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
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
            <SelectItem value="contrato">Contratos</SelectItem>
            <SelectItem value="manual">Manuais</SelectItem>
            <SelectItem value="vistoria">Vistorias</SelectItem>
            <SelectItem value="garantia">Garantias</SelectItem>
            <SelectItem value="outros">Outros</SelectItem>
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
        {Object.entries(groupedDocuments).map(([type, docs]) => (
          <div key={type}>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold">{getTypeLabel(type)}</h2>
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
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getTypeColor(doc.type) as any} className="text-xs">
                              {getTypeLabel(doc.type)}
                            </Badge>
                            <Badge variant={getStatusColor(doc.status) as any} className="text-xs">
                              {getStatusLabel(doc.status)}
                            </Badge>
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
                          Visualizar
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
    </div>
  );
}
