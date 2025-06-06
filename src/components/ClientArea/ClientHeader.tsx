
import { User, Key, Plus, Download, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientHeaderProps {
  onNewClient: () => void;
  onGenerateCredentials: () => void;
  onExport?: () => void;
  canCreate?: boolean;
  canGenerateCredentials?: boolean;
  canExport?: boolean;
}

export function ClientHeader({ 
  onNewClient, 
  onGenerateCredentials, 
  onExport,
  canCreate = true,
  canGenerateCredentials = true,
  canExport = true
}: ClientHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <User className="h-8 w-8" />
            Área do Cliente
          </h1>
          <p className="text-muted-foreground">
            Gestão centralizada de clientes, acesso e credenciais do sistema
          </p>
        </div>
        <div className="flex gap-2">
          {canExport && onExport && (
            <Button variant="outline" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          )}
          {canGenerateCredentials && (
            <Button variant="outline" onClick={onGenerateCredentials}>
              <Key className="mr-2 h-4 w-4" />
              Gerar Credenciais
            </Button>
          )}
          {canCreate && (
            <Button onClick={onNewClient}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          )}
        </div>
      </div>

      {/* Cards de Informação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gestão Segura</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">100%</div>
            <p className="text-xs text-muted-foreground">
              Controle de acesso baseado em perfis e permissões
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rastreabilidade</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Total</div>
            <p className="text-xs text-muted-foreground">
              Auditoria completa de todas as ações realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integridade</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Garantida</div>
            <p className="text-xs text-muted-foreground">
              Validação rigorosa e criptografia de dados sensíveis
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
