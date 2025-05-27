
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Search, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ClientDocument {
  id: string;
  title: string;
  type: "contrato" | "manual" | "vistoria" | "outros";
  createdAt: Date;
  size: string;
  downloadUrl: string;
}

const mockClientDocuments: ClientDocument[] = [
  {
    id: "1",
    title: "Contrato de Compra e Venda - Unidade 204",
    type: "contrato",
    createdAt: new Date(2025, 3, 15),
    size: "1.2 MB",
    downloadUrl: "/docs/contrato-204.pdf"
  },
  {
    id: "2",
    title: "Manual do Proprietário - Edifício Aurora",
    type: "manual",
    createdAt: new Date(2025, 3, 20),
    size: "850 KB",
    downloadUrl: "/docs/manual-aurora.pdf"
  },
  {
    id: "3",
    title: "Relatório de Vistoria de Entrega",
    type: "vistoria",
    createdAt: new Date(2025, 4, 10),
    size: "2.1 MB",
    downloadUrl: "/docs/vistoria-204.pdf"
  },
  {
    id: "4",
    title: "Certificado de Garantia",
    type: "outros",
    createdAt: new Date(2025, 4, 12),
    size: "450 KB",
    downloadUrl: "/docs/garantia-204.pdf"
  }
];

const getTypeLabel = (type: string) => {
  const types = {
    contrato: "Contrato",
    manual: "Manual",
    vistoria: "Vistoria",
    outros: "Outros"
  };
  return types[type as keyof typeof types] || type;
};

const getTypeColor = (type: string) => {
  const colors = {
    contrato: "default",
    manual: "secondary", 
    vistoria: "destructive",
    outros: "outline"
  };
  return colors[type as keyof typeof colors] || "outline";
};

export default function ClientDocuments() {
  const [documents] = useState<ClientDocument[]>(mockClientDocuments);
  const [search, setSearch] = useState("");

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const groupedDocuments = filteredDocuments.reduce((acc, doc) => {
    if (!acc[doc.type]) acc[doc.type] = [];
    acc[doc.type].push(doc);
    return acc;
  }, {} as Record<string, ClientDocument[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Meus Documentos
        </h1>
        <p className="text-muted-foreground">
          Acesse e baixe seus documentos relacionados ao imóvel
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar documentos..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium leading-none">{doc.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {doc.createdAt.toLocaleDateString()}
                            <Separator orientation="vertical" className="h-3" />
                            <span>{doc.size}</span>
                          </div>
                          <Badge variant={getTypeColor(doc.type) as any} className="text-xs">
                            {getTypeLabel(doc.type)}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Baixar
                      </Button>
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
