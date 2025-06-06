
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientData } from "@/services/ClientAreaBusinessRules";

interface ClientTableProps {
  clients: ClientData[];
  onSelectClient: (client: ClientData) => void;
  canView?: boolean;
  canViewSensitive?: boolean;
}

export function ClientTable({ 
  clients, 
  onSelectClient, 
  canView = true,
  canViewSensitive = false 
}: ClientTableProps) {
  if (!canView) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Você não tem permissão para visualizar clientes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Clientes</CardTitle>
        <CardDescription>
          {clients.length} clientes cadastrados no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Imóvel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map(client => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{canViewSensitive ? client.email : '***@***.***'}</TableCell>
                <TableCell>{canViewSensitive ? client.phone : '(**) ****-****'}</TableCell>
                <TableCell>{client.property} - {client.unit}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      client.status === 'active' ? 'bg-green-50 text-green-700' :
                      client.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                      client.status === 'suspended' ? 'bg-red-50 text-red-700' :
                      'bg-gray-50 text-gray-700'
                    }
                  >
                    {client.status === 'active' ? 'Ativo' :
                     client.status === 'pending' ? 'Pendente' :
                     client.status === 'suspended' ? 'Suspenso' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSelectClient(client)}
                  >
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
