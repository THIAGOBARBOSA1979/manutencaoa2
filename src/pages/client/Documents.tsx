import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, Download, Eye, CheckCircle, Clock, 
  Star, AlertTriangle, Archive, BarChart,
  Calendar, User, Tag, Filter, Building
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { documentService, Document } from "@/services/DocumentService";
import { propertyService, PropertyDocument } from "@/services/PropertyService";
import { DocumentPreview } from "@/components/Documents/DocumentPreview";
import { DocumentSearch } from "@/components/Documents/DocumentSearch";
import { DocumentBulkActions } from "@/components/Documents/DocumentBulkActions";
import { PropertySelector } from "@/components/Documents/PropertySelector";

interface SearchFilters {
  query: string;
  category: string;
  type: string;
  status: string;
  priority: string;
  propertyId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  tags: string[];
  favorites: boolean;
}

export default function ClientDocuments() {
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [previewContent, setPreviewContent] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    type: 'all',
    status: 'all',
    priority: 'all',
    propertyId: undefined,
    tags: [],
    favorites: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadClientDocuments();
  }, []);

  const loadClientDocuments = () => {
    const clientName = "João Silva";
    const propertyDocs = propertyService.getDocumentsByClient(clientName);
    setDocuments(propertyDocs);
  };

  // Convert PropertyDocument to Document for preview compatibility
  const convertToDocument = (propertyDoc: PropertyDocument): Document => {
    return {
      id: propertyDoc.id,
      title: propertyDoc.title,
      type: "manual", // PropertyDocuments are typically manual files
      category: propertyDoc.category,
      associatedTo: {
        property: propertyDoc.propertyId,
        unit: propertyDoc.unitId
      },
      visible: true,
      createdAt: new Date(propertyDoc.lastModified),
      updatedAt: new Date(propertyDoc.lastModified),
      downloads: 0,
      status: "published" as const,
      tags: propertyDoc.tags,
      isFavorite: false,
      version: 1,
      priority: propertyDoc.priority,
      description: propertyDoc.description,
      createdBy: "Sistema",
      fileUrl: propertyDoc.downloadUrl,
      fileName: propertyDoc.title,
      fileSize: propertyDoc.size,
      securityLevel: "internal"
    };
  };

  // Apply filters to documents
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      if (filters.query && !doc.title.toLowerCase().includes(filters.query.toLowerCase()) &&
          !doc.description?.toLowerCase().includes(filters.query.toLowerCase()) &&
          !doc.tags?.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()))) {
        return false;
      }
      if (filters.category !== "all" && doc.category !== filters.category) return false;
      if (filters.type !== "all" && doc.type !== filters.type) return false;
      if (filters.priority !== "all" && doc.priority !== filters.priority) return false;
      if (filters.propertyId && doc.propertyId !== filters.propertyId) return false;
      if (filters.tags.length > 0 && !filters.tags.some(tag => doc.tags?.includes(tag))) return false;
      
      return true;
    });
  }, [documents, filters]);

  const stats = useMemo(() => {
    const filteredByProperty = filters.propertyId 
      ? documents.filter(d => d.propertyId === filters.propertyId)
      : documents;
      
    return {
      total: filteredByProperty.length,
      new: filteredByProperty.filter(d => d.isNew).length,
      thisMonth: filteredByProperty.filter(d => {
        const docDate = new Date(d.lastModified);
        const now = new Date();
        return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
      }).length,
      byProperty: propertyService.getDocumentStats(filters.propertyId)
    };
  }, [documents, filters.propertyId]);

  const categories = [
    { id: "contrato", name: "Contratos" },
    { id: "manual", name: "Manuais" },
    { id: "relatorio", name: "Relatórios" },
    { id: "certificado", name: "Certificados" },
    { id: "outros", name: "Outros" }
  ];

  const availableTags = [...new Set(documents.flatMap(doc => doc.tags || []))];

  const handleSelectDocument = (id: string, selected: boolean) => {
    setSelectedIds(prev => 
      selected ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedIds(selected ? filteredDocuments.map(doc => doc.id) : []);
  };

  const handleDownload = (doc: PropertyDocument) => {
    try {
      propertyService.downloadDocument(doc.id);
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

  const handleDownloadById = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      handleDownload(doc);
    }
  };

  const handlePreview = (doc: PropertyDocument) => {
    const documentForPreview = convertToDocument(doc);
    setPreviewDoc(documentForPreview);
    setPreviewContent(`Preview do documento: ${doc.title}\n\nDescrição: ${doc.description || 'Sem descrição'}`);
    setIsPreviewOpen(true);
  };

  const handleBulkDownload = (ids: string[]) => {
    ids.forEach(id => {
      const doc = documents.find(d => d.id === id);
      if (doc) handleDownload(doc);
    });
    setSelectedIds([]);
  };

  const handleBulkDelete = (ids: string[]) => {
    setDocuments(prev => prev.filter(doc => !ids.includes(doc.id)));
    setSelectedIds([]);
  };

  const handleBulkFavorite = (ids: string[]) => {
    // This would be implemented with proper state management
    setSelectedIds([]);
    toast({
      title: "Favoritos atualizados",
      description: `${ids.length} documentos marcados como favoritos`
    });
  };

  const handleBulkArchive = (ids: string[]) => {
    // This would be implemented with proper state management  
    setSelectedIds([]);
    toast({
      title: "Documentos arquivados",
      description: `${ids.length} documentos foram arquivados`
    });
  };

  const DocumentCard = ({ doc }: { doc: PropertyDocument }) => {
    const property = propertyService.getPropertyById(doc.propertyId);
    
    const getDocumentIcon = (type: string) => {
      switch (type) {
        case "manual": return "📋";
        case "warranty": return "🛡️";
        case "blueprint": return "📐";
        case "contract": return "📄";
        case "inspection": return "🔍";
        case "certificate": return "🏆";
        default: return "📁";
      }
    };

    const getDocumentColor = (type: string) => {
      switch (type) {
        case "manual": return "from-blue-500/10 to-blue-600/10 border-blue-200";
        case "warranty": return "from-green-500/10 to-green-600/10 border-green-200";
        case "blueprint": return "from-purple-500/10 to-purple-600/10 border-purple-200";
        case "contract": return "from-orange-500/10 to-orange-600/10 border-orange-200";
        case "inspection": return "from-teal-500/10 to-teal-600/10 border-teal-200";
        case "certificate": return "from-yellow-500/10 to-yellow-600/10 border-yellow-200";
        default: return "from-gray-500/10 to-gray-600/10 border-gray-200";
      }
    };

    return (
      <Card className={`hover:shadow-md transition-shadow bg-gradient-to-br ${getDocumentColor(doc.type)} border`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox
                checked={selectedIds.includes(doc.id)}
                onCheckedChange={(checked) => handleSelectDocument(doc.id, !!checked)}
              />
              <div className="text-2xl">{getDocumentIcon(doc.type)}</div>
              <div className="space-y-1 flex-1">
                <h3 className="font-medium leading-none flex items-center gap-2">
                  {doc.title}
                  {doc.isNew && (
                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                      Novo
                    </Badge>
                  )}
                </h3>
                {doc.description && (
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(doc.lastModified).toLocaleDateString()}
                  <Separator orientation="vertical" className="h-3" />
                  <span>{doc.size}</span>
                  {property && (
                    <>
                      <Separator orientation="vertical" className="h-3" />
                      <Building className="h-3 w-3" />
                      <span>{property.name}</span>
                      {doc.unitId && <span>- Unidade {doc.unitId}</span>}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {doc.category}
                  </Badge>
                  <Badge 
                    variant={doc.priority === "high" ? "destructive" : doc.priority === "medium" ? "default" : "secondary"} 
                    className="text-xs"
                  >
                    {doc.priority === "high" ? "Alta" : doc.priority === "medium" ? "Média" : "Baixa"}
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
              >
                <Eye className="h-4 w-4" />
                Ver
              </Button>
              <Button 
                size="sm" 
                className="gap-2"
                onClick={() => handleDownload(doc)}
              >
                <Download className="h-4 w-4" />
                Baixar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
          Acesse e gerencie seus documentos relacionados aos imóveis
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            <FileText className="h-4 w-4 mr-2" />
            Todos ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="new">
            <Star className="h-4 w-4 mr-2" />
            Novos ({stats.new})
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
                    <p className="text-sm font-medium text-muted-foreground">Novos</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
                  </div>
                  <Star className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Este Mês</p>
                    <p className="text-2xl font-bold text-green-600">{stats.thisMonth}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prioridade Alta</p>
                    <p className="text-2xl font-bold text-red-600">{stats.byProperty.byPriority.high}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property Selector */}
          <PropertySelector
            selectedPropertyId={filters.propertyId}
            onPropertyChange={(propertyId) => setFilters(prev => ({ ...prev, propertyId }))}
          />

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
                    Tente ajustar os filtros de busca ou selecionar outro imóvel
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="new">
          <div className="grid gap-4">
            {documents.filter(d => d.isNew).map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contracts">
          <div className="grid gap-4">
            {documents.filter(d => d.category === "contrato").map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
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
                    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                    .slice(0, 5)
                    .map(doc => (
                      <div key={doc.id} className="flex justify-between items-center">
                        <span className="text-sm">{doc.title}</span>
                        <Badge variant="outline">0 downloads</Badge>
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
        onDownload={handleDownloadById}
        content={previewContent}
      />
    </div>
  );
}
