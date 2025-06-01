import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, Download, Eye, CheckCircle, Clock, 
  Star, AlertTriangle, Archive, BarChart,
  Calendar, User, Tag, Filter
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { documentService, Document } from "@/services/DocumentService";
import { DocumentPreview } from "@/components/Documents/DocumentPreview";
import { DocumentSearch } from "@/components/Documents/DocumentSearch";
import { DocumentBulkActions } from "@/components/Documents/DocumentBulkActions";

interface ClientDocument extends Omit<Document, 'status'> {
  size?: string;
  downloadUrl?: string;
  status: "disponivel" | "processando" | "vencido";
  description?: string;
}

interface SearchFilters {
  query: string;
  category: string;
  type: string;
  status: string;
  priority: string;
  dateFrom?: Date;
  dateTo?: Date;
  tags: string[];
  favorites: boolean;
}

export default function ClientDocuments() {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewDoc, setPreviewDoc] = useState<ClientDocument | null>(null);
  const [previewContent, setPreviewContent] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    type: 'all',
    status: 'all',
    priority: 'all',
    tags: [],
    favorites: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadClientDocuments();
  }, []);

  const loadClientDocuments = () => {
    const clientName = "João Silva";
    const clientDocs = documentService.getDocumentsByClient(clientName);
    
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

  // Filtros aplicados
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      if (filters.query && !doc.title.toLowerCase().includes(filters.query.toLowerCase()) &&
          !doc.description?.toLowerCase().includes(filters.query.toLowerCase()) &&
          !doc.tags?.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()))) {
        return false;
      }
      if (filters.category !== "all" && doc.category !== filters.category) return false;
      if (filters.type !== "all" && doc.type !== filters.type) return false;
      if (filters.status !== "all" && doc.status !== filters.status) return false;
      if (filters.priority !== "all" && doc.priority !== filters.priority) return false;
      if (filters.favorites && !doc.isFavorite) return false;
      if (filters.dateFrom && doc.createdAt < filters.dateFrom) return false;
      if (filters.dateTo && doc.createdAt > filters.dateTo) return false;
      if (filters.tags.length > 0 && !filters.tags.some(tag => doc.tags?.includes(tag))) return false;
      
      return true;
    });
  }, [documents, filters]);

  const stats = useMemo(() => ({
    total: documents.length,
    disponivel: documents.filter(d => d.status === "disponivel").length,
    processando: documents.filter(d => d.status === "processando").length,
    favorites: documents.filter(d => d.isFavorite).length,
    thisMonth: documents.filter(d => d.createdAt.getMonth() === new Date().getMonth()).length
  }), [documents]);

  const categories = documentService.getCategories();
  const availableTags = [...new Set(documents.flatMap(doc => doc.tags || []))];

  const handleSelectDocument = (id: string, selected: boolean) => {
    setSelectedIds(prev => 
      selected ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedIds(selected ? filteredDocuments.map(doc => doc.id) : []);
  };

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
        setPreviewDoc(doc);
        setIsPreviewOpen(true);
      } catch (error) {
        toast({
          title: "Erro ao gerar preview",
          description: "Não foi possível gerar o preview do documento",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Abrindo documento",
        description: `Carregando ${doc.title}...`
      });
      window.open(doc.downloadUrl, '_blank');
    }
  };

  const handleBulkDownload = (ids: string[]) => {
    ids.forEach(id => {
      const doc = documents.find(d => d.id === id);
      if (doc) handleDownload(doc);
    });
    setSelectedIds([]);
  };

  const handleBulkDelete = (ids: string[]) => {
    // Simulação de exclusão em lote
    setDocuments(prev => prev.filter(doc => !ids.includes(doc.id)));
    setSelectedIds([]);
  };

  const handleBulkFavorite = (ids: string[]) => {
    setDocuments(prev => prev.map(doc => 
      ids.includes(doc.id) ? { ...doc, isFavorite: true } : doc
    ));
    setSelectedIds([]);
  };

  const handleBulkArchive = (ids: string[]) => {
    setDocuments(prev => prev.map(doc => 
      ids.includes(doc.id) ? { ...doc, status: "vencido" as any } : doc
    ));
    setSelectedIds([]);
  };

  const DocumentCard = ({ doc }: { doc: ClientDocument }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={selectedIds.includes(doc.id)}
              onCheckedChange={(checked) => handleSelectDocument(doc.id, !!checked)}
            />
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
                <Badge variant={doc.type === "auto" ? "default" : "secondary"} className="text-xs">
                  {doc.type === "auto" ? "Automático" : "Manual"}
                </Badge>
                <Badge variant={doc.status === "disponivel" ? "default" : doc.status === "processando" ? "secondary" : "destructive"} className="text-xs">
                  {doc.status === "disponivel" ? "Disponível" : doc.status === "processando" ? "Processando" : "Vencido"}
                </Badge>
                {doc.isFavorite && (
                  <Badge variant="outline" className="text-xs">
                    <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                    Favorito
                  </Badge>
                )}
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
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Meus Documentos
        </h1>
        <p className="text-muted-foreground mt-1">
          Acesse e gerencie seus documentos relacionados ao imóvel
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            <FileText className="h-4 w-4 mr-2" />
            Todos ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <Star className="h-4 w-4 mr-2" />
            Favoritos ({stats.favorites})
          </TabsTrigger>
          <TabsTrigger value="recent">
            <Clock className="h-4 w-4 mr-2" />
            Recentes
          </TabsTrigger>
          <TabsTrigger value="contracts">
            <Archive className="h-4 w-4 mr-2" />
            Contratos
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart className="h-4 w-4 mr-2" />
            Estatísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
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

          {/* Search and Filters */}
          <DocumentSearch
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
            availableTags={availableTags}
          />

          {/* Bulk Actions */}
          <DocumentBulkActions
            selectedIds={selectedIds}
            onClearSelection={() => setSelectedIds([])}
            onBulkDownload={handleBulkDownload}
            onBulkDelete={handleBulkDelete}
            onBulkFavorite={handleBulkFavorite}
            onBulkArchive={handleBulkArchive}
          />

          {/* Select All */}
          {filteredDocuments.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Checkbox
                checked={selectedIds.length === filteredDocuments.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">
                Selecionar todos ({filteredDocuments.length} documentos)
              </span>
            </div>
          )}

          {/* Documents Grid */}
          <div className="grid gap-3">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
            {filteredDocuments.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">
                    Nenhum documento encontrado
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tente ajustar os filtros de busca
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="grid gap-4">
            {documents.filter(d => d.isFavorite).map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow border-yellow-200">
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
                          <Badge variant={doc.type === "auto" ? "default" : "secondary"} className="text-xs">
                            {doc.type === "auto" ? "Automático" : "Manual"}
                          </Badge>
                          <Badge variant={doc.status === "disponivel" ? "default" : doc.status === "processando" ? "secondary" : "destructive"} className="text-xs">
                            {doc.status === "disponivel" ? "Disponível" : doc.status === "processando" ? "Processando" : "Vencido"}
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
        </TabsContent>

        <TabsContent value="recent">
          <div className="grid gap-4">
            {documents
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .slice(0, 10)
              .map((doc) => (
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
                            <Badge variant={doc.type === "auto" ? "default" : "secondary"} className="text-xs">
                              {doc.type === "auto" ? "Automático" : "Manual"}
                            </Badge>
                            <Badge variant={doc.status === "disponivel" ? "default" : doc.status === "processando" ? "secondary" : "destructive"} className="text-xs">
                              {doc.status === "disponivel" ? "Disponível" : doc.status === "processando" ? "Processando" : "Vencido"}
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
        </TabsContent>

        <TabsContent value="contracts">
          <div className="grid gap-4">
            {documents.filter(d => d.category === "contrato").map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow border-blue-200">
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
                          <Badge variant={doc.type === "auto" ? "default" : "secondary"} className="text-xs">
                            {doc.type === "auto" ? "Automático" : "Manual"}
                          </Badge>
                          <Badge variant={doc.status === "disponivel" ? "default" : doc.status === "processando" ? "secondary" : "destructive"} className="text-xs">
                            {doc.status === "disponivel" ? "Disponível" : doc.status === "processando" ? "Processando" : "Vencido"}
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
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map(cat => {
                    const count = documents.filter(d => d.category === cat.id).length;
                    return (
                      <div key={cat.id} className="flex justify-between items-center">
                        <span>{cat.name}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividade de Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents
                    .sort((a, b) => b.downloads - a.downloads)
                    .slice(0, 5)
                    .map(doc => (
                      <div key={doc.id} className="flex justify-between items-center">
                        <span className="text-sm">{doc.title}</span>
                        <Badge variant="outline">{doc.downloads} downloads</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <DocumentPreview
        document={previewDoc}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDownload={handleDownload}
        content={previewContent}
      />
    </div>
  );
}
