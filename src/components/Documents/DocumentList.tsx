
import { useState, useEffect } from "react";
import { Document } from "@/services/DocumentService";
import { DocumentCard } from "./DocumentCard";
import { DocumentStats } from "./DocumentStats";
import { DocumentFilters } from "./DocumentFilters";
import { BulkActions } from "./BulkActions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, LayoutGrid, List, RefreshCw } from "lucide-react";

interface DocumentListProps {
  documents: Document[];
  onEdit: (doc: Document) => void;
  onDelete: (id: string) => void;
  onPreview: (doc: Document) => void;
  onToggleFavorite: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRestoreVersion?: (versionId: string) => void;
  onRefresh: () => void;
  stats: any;
  categories: Array<{ id: string; name: string; }>;
}

export function DocumentList({
  documents,
  onEdit,
  onDelete,
  onPreview,
  onToggleFavorite,
  onDuplicate,
  onRestoreVersion,
  onRefresh,
  stats,
  categories
}: DocumentListProps) {
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setFilteredDocuments(documents);
  }, [documents]);

  const handleSearch = (query: string, filters: any) => {
    const filtered = documents.filter(doc => {
      // Busca por texto
      if (query) {
        const searchLower = query.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(searchLower);
        const matchesDescription = doc.description?.toLowerCase().includes(searchLower);
        const matchesTags = doc.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesTitle && !matchesDescription && !matchesTags) return false;
      }

      // Filtros específicos
      if (filters.category && filters.category !== "all" && doc.category !== filters.category) return false;
      if (filters.status && filters.status !== "all" && doc.status !== filters.status) return false;
      if (filters.type && filters.type !== "all" && doc.type !== filters.type) return false;
      if (filters.priority && filters.priority !== "all" && doc.priority !== filters.priority) return false;
      if (filters.securityLevel && filters.securityLevel !== "all" && doc.securityLevel !== filters.securityLevel) return false;
      
      // Filtros de texto
      if (filters.client && !doc.associatedTo.client?.toLowerCase().includes(filters.client.toLowerCase())) return false;
      if (filters.property && !doc.associatedTo.property?.toLowerCase().includes(filters.property.toLowerCase())) return false;
      if (filters.createdBy && !doc.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase())) return false;
      
      // Filtros de data
      if (filters.dateFrom && doc.createdAt < filters.dateFrom) return false;
      if (filters.dateTo && doc.createdAt > filters.dateTo) return false;
      
      // Filtros de tags
      if (filters.tags && filters.tags.length > 0) {
        if (!doc.tags || !filters.tags.every(tag => doc.tags?.includes(tag))) return false;
      }

      return true;
    });
    
    setFilteredDocuments(filtered);
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setFilteredDocuments(documents);
  };

  const handleSelect = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredDocuments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDocuments.map(doc => doc.id));
    }
  };

  const handleDownload = (id: string) => {
    console.log('Download documento:', id);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular carregamento
      onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloads, 0);

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <DocumentStats stats={stats} totalDownloads={totalDownloads} />

      {/* Filtros */}
      <DocumentFilters 
        onSearch={handleSearch}
        activeFilters={activeFilters}
        onClearFilters={handleClearFilters}
        categories={categories}
      />

      {/* Controles da lista */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">
            {filteredDocuments.length} documento{filteredDocuments.length !== 1 ? 's' : ''} encontrado{filteredDocuments.length !== 1 ? 's' : ''}
          </h3>
          {filteredDocuments.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="gap-2"
            >
              {selectedIds.length === filteredDocuments.length ? 'Desmarcar todos' : 'Selecionar todos'}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Ações em massa */}
      <BulkActions
        documents={filteredDocuments}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onActionComplete={onRefresh}
      />

      {/* Lista de documentos */}
      <div className={`space-y-4 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : ''}`}>
        {filteredDocuments.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            isSelected={selectedIds.includes(doc.id)}
            onSelect={handleSelect}
            onEdit={onEdit}
            onDelete={onDelete}
            onPreview={onPreview}
            onDownload={handleDownload}
            onToggleFavorite={onToggleFavorite}
            onDuplicate={onDuplicate}
            onRestoreVersion={onRestoreVersion}
            categories={categories}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum documento encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {documents.length === 0 
                ? "Ainda não há documentos criados no sistema."
                : "Tente ajustar os filtros ou termos de busca."}
            </p>
            {Object.keys(activeFilters).length > 0 && (
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar filtros
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
