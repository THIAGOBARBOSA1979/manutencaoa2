
import { Search, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface InspectionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  filterProperty: string;
  onPropertyChange: (value: string) => void;
}

export function InspectionFilters({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterProperty,
  onPropertyChange
}: InspectionFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vistorias..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <Select value={filterStatus} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="progress">Em andamento</SelectItem>
              <SelectItem value="complete">Concluídas</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterProperty} onValueChange={onPropertyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Propriedade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as propriedades</SelectItem>
              <SelectItem value="aurora">Edifício Aurora</SelectItem>
              <SelectItem value="bosque">Residencial Bosque</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="w-full">
            <Filter className="mr-2 h-4 w-4" />
            Filtros avançados
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
