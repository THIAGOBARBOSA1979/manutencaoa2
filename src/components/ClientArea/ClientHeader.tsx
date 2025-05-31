
import { User, Key, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientHeaderProps {
  onNewClient: () => void;
  onGenerateCredentials: () => void;
}

export function ClientHeader({ onNewClient, onGenerateCredentials }: ClientHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <User className="h-8 w-8" />
          Área do Cliente
        </h1>
        <p className="text-muted-foreground">
          Gestão centralizada de clientes e acesso
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onGenerateCredentials}>
          <Key className="mr-2 h-4 w-4" />
          Gerar Credenciais
        </Button>
        <Button onClick={onNewClient}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>
    </div>
  );
}
