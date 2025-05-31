
import { useState } from "react";
import { Document } from "@/services/DocumentService";
import { DocumentCard } from "./DocumentCard";
import { DocumentStats } from "./DocumentStats";
import { DocumentFilters } from "./DocumentFilters";
import { BulkActions } from "./BulkActions";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

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

  const handleSearch = (query: string, filters: any) => {
    // Implementar lógica de filtro aqui
    const filtered = documents.filter(doc => {
      if (query && !doc.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (filters.category && filters.category !== "all" && doc.category !== filters.category) return false;
      if (filters.status && filters.status !== "all" && doc.status !== filters.status) return false;
      if (filters.type && filters.type !== "all" && doc.type !== filters.type) return false;
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

  const handleDownload = (id: string) => {
    // Implementar download
    console.log('Download:', id);
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

      {/* Ações em massa */}
      <BulkActions
        documents={filteredDocuments}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onActionComplete={onRefresh}
      />

      {/* Lista de documentos */}
      <div className="space-y-4">
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
          <CardContent className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Nenhum documento encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou criar um novo documento
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
