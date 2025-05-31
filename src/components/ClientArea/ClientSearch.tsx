
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onNewClient: () => void;
}

export function ClientSearch({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  onNewClient 
}: ClientSearchProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar cliente
            </CardTitle>
            <CardDescription>
              Pesquise por nome, email ou telefone do cliente
            </CardDescription>
          </div>
          <Button onClick={onNewClient} size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Input 
            placeholder="Digite o nome, email ou telefone" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          />
          <Button onClick={onSearch}>Buscar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
