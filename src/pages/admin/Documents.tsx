
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Search, Upload, Download, Edit, Trash2, Eye } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Document {
  id: string;
  title: string;
  type: "auto" | "manual";
  template?: string;
  fileUrl?: string;
  associatedTo: {
    client?: string;
    property?: string;
    unit?: string;
    phase?: string;
  };
  visible: boolean;
  createdAt: Date;
  downloads: number;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Contrato de Compra e Venda",
    type: "auto",
    template: "Contrato de Compra e Venda do imóvel {{endereco}}, cliente {{nome_cliente}}, valor {{valor}}",
    associatedTo: { client: "João Silva", property: "Edifício Aurora", unit: "101" },
    visible: true,
    createdAt: new Date(2025, 4, 10),
    downloads: 5
  },
  {
    id: "2", 
    title: "Manual do Proprietário",
    type: "manual",
    fileUrl: "/docs/manual-proprietario.pdf",
    associatedTo: { property: "Edifício Aurora" },
    visible: true,
    createdAt: new Date(2025, 4, 12),
    downloads: 12
  }
];

export default function AdminDocuments() {
  const [documents] = useState<Document[]>(mockDocuments);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredDocuments = documents.filter(doc => {
    if (filter !== "all" && doc.type !== filter) return false;
    if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
            Gerencie modelos de documentos e arquivos
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Documento</DialogTitle>
              <DialogDescription>
                Crie um novo modelo de documento ou faça upload de um arquivo
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="auto" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="auto">Modelo Automático</TabsTrigger>
                <TabsTrigger value="manual">Upload Manual</TabsTrigger>
              </TabsList>
              
              <TabsContent value="auto" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Documento</Label>
                  <Input id="title" placeholder="Ex: Contrato de Compra e Venda" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template">Modelo do Documento</Label>
                  <Textarea 
                    id="template" 
                    placeholder="Digite o modelo usando variáveis como {{nome_cliente}}, {{endereco}}, {{valor}}"
                    rows={8}
                  />
                  <p className="text-sm text-muted-foreground">
                    Use variáveis: 
                    <code className="bg-muted px-1 rounded text-xs mx-1">{"{{nome_cliente}}"}</code>
                    <code className="bg-muted px-1 rounded text-xs mx-1">{"{{endereco}}"}</code>
                    <code className="bg-muted px-1 rounded text-xs mx-1">{"{{valor}}"}</code>
                    <code className="bg-muted px-1 rounded text-xs mx-1">{"{{data}}"}</code>
                    <code className="bg-muted px-1 rounded text-xs mx-1">{"{{empreendimento}}"}</code>
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title-manual">Título do Documento</Label>
                  <Input id="title-manual" placeholder="Ex: Manual do Proprietário" />
                </div>
                <div className="space-y-2">
                  <Label>Arquivo PDF</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Clique para fazer upload ou arraste o arquivo aqui
                    </p>
                    <Input type="file" accept=".pdf" className="mt-2" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Associar a Empreendimento</Label>
                <Select>
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
                <Label>Visível para Cliente</Label>
                <Select defaultValue="true">
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
            
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Criar Documento</Button>
            </div>
          </DialogContent>
        </Dialog>
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
                    Criado em {doc.createdAt.toLocaleDateString()} • {doc.downloads} downloads
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={doc.type === "auto" ? "default" : "secondary"}>
                    {doc.type === "auto" ? "Automático" : "Manual"}
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
                
                {doc.template && (
                  <div className="text-sm">
                    <strong>Modelo:</strong>
                    <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                      {doc.template.length > 100 
                        ? `${doc.template.substring(0, 100)}...` 
                        : doc.template
                      }
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
