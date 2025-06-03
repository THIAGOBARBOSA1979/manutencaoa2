
import { Search, Filter, Download, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  value: string;
  label: string;
}

interface AdminFiltersProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: Array<{
    key: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }>;
  onExport?: () => void;
  resultCount?: number;
  activeFiltersCount?: number;
  onClearFilters?: () => void;
}

export const AdminFilters = ({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filters = [],
  onExport,
  resultCount,
  activeFiltersCount = 0,
  onClearFilters
}: AdminFiltersProps) => {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="space-y-4">
        {/* Search and Export */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>
          <div className="flex gap-2">
            {onExport && (
              <Button variant="outline" onClick={onExport} className="h-12">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            )}
            <Button variant="outline" className="h-12">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </div>

        {/* Filter Selects */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {filters.map((filter) => (
              <div key={filter.key} className="min-w-[180px]">
                <Select value={filter.value} onValueChange={filter.onChange}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}

        {/* Results and Active Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {resultCount !== undefined && (
              <span className="text-sm text-slate-600">
                {resultCount} resultado(s) encontrado(s)
              </span>
            )}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {activeFiltersCount} filtro(s) ativo(s)
                </Badge>
                {onClearFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
