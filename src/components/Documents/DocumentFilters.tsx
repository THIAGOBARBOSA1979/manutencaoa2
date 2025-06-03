
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
  Search, Filter, X, Calendar as CalendarIcon, 
  Tag, FileType, Users, Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface FilterState {
  search: string;
  category: string;
  type: string;
  status: string;
  priority: string;
  client: string;
  property: string;
  dateFrom?: Date;
  dateTo?: Date;
  tags: string[];
  securityLevel: string;
  createdBy: string;
}

interface DocumentFiltersProps {
  onSearch: (query: string, filters: any) => void;
  activeFilters: any;
  onClearFilters: () => void;
  categories: Array<{ id: string; name: string; }>;
}

export function DocumentFilters({ 
  onSearch, 
  activeFilters, 
  onClearFilters, 
  categories 
}: DocumentFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    type: "all",
    status: "all",
    priority: "all",
    client: "",
    property: "",
    tags: [],
    securityLevel: "all",
    createdBy: "",
    ...activeFilters
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters.search, newFilters);
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      updateFilter('tags', [...filters.tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    updateFilter('tags', filters.tags.filter(t => t !== tag));
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      category: "all",
      type: "all",
      status: "all",
      priority: "all",
      client: "",
      property: "",
      tags: [],
      securityLevel: "all",
      createdBy: ""
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = filters.search || 
    filters.category !== "all" || 
    filters.type !== "all" || 
    filters.status !== "all" || 
    filters.priority !== "all" ||
    filters.securityLevel !== "all" ||
    filters.client ||
    filters.property ||
    filters.createdBy ||
    filters.tags.length > 0 ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Busca e Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca principal */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, descrição, conteúdo ou tags..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(showAdvanced && "bg-muted")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros Avançados
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar Tudo
            </Button>
          )}
        </div>

        {/* Tags ativas */}
        {filters.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {filters.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Filtros básicos sempre visíveis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="auto">Automáticos</SelectItem>
              <SelectItem value="manual">Manuais</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtros avançados */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
            <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas prioridades</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.securityLevel} onValueChange={(value) => updateFilter('securityLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Nível de Segurança" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os níveis</SelectItem>
                <SelectItem value="public">Público</SelectItem>
                <SelectItem value="internal">Interno</SelectItem>
                <SelectItem value="confidential">Confidencial</SelectItem>
                <SelectItem value="restricted">Restrito</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <Input
                placeholder="Cliente..."
                value={filters.client}
                onChange={(e) => updateFilter('client', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Empreendimento..."
                value={filters.property}
                onChange={(e) => updateFilter('property', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Criado por..."
                value={filters.createdBy}
                onChange={(e) => updateFilter('createdBy', e.target.value)}
              />
            </div>

            {/* Seletor de data */}
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yyyy") : "Data inicial"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => updateFilter('dateFrom', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Indicador de filtros ativos */}
        {hasActiveFilters && (
          <div className="text-sm text-muted-foreground border-t pt-2">
            Filtros ativos aplicados
          </div>
        )}
      </CardContent>
    </Card>
  );
}
