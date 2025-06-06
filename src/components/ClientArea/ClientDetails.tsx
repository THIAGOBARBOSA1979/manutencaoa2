
import { User, Mail, Phone, Home, FileText, Calendar, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ClientData } from "@/services/ClientAreaBusinessRules";

interface ClientDetailsProps {
  client: ClientData;
  onClose: () => void;
  canEdit?: boolean;
  canViewSensitive?: boolean;
}

export function ClientDetails({ 
  client, 
  onClose, 
  canEdit = false,
  canViewSensitive = false 
}: ClientDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Cliente - {client.name}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
            Fechar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="inspections">Vistorias</TabsTrigger>
            <TabsTrigger value="warranty">Garantias</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-3">Informações Pessoais</h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {canViewSensitive ? client.email : '***@***.***'}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {canViewSensitive ? client.phone : '(**) ****-****'}
                  </p>
                  {client.cpf && (
                    <p className="text-sm">
                      CPF: {canViewSensitive ? client.cpf : '***.***.***-**'}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Informações do Imóvel</h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    {client.property}
                  </p>
                  <p className="text-sm">Unidade: {client.unit}</p>
                  <p className="text-sm">
                    Nível de Acesso: 
                    <Badge variant="outline" className="ml-2">
                      {client.accessLevel === 'full' ? 'Completo' :
                       client.accessLevel === 'limited' ? 'Limitado' : 'Somente Leitura'}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h3 className="font-medium mb-3">Status e Datas</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    Status: 
                    <Badge 
                      variant="outline" 
                      className={`ml-2 ${
                        client.status === 'active' ? 'bg-green-50 text-green-700' :
                        client.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                        client.status === 'suspended' ? 'bg-red-50 text-red-700' :
                        'bg-gray-50 text-gray-700'
                      }`}
                    >
                      {client.status === 'active' ? 'Ativo' :
                       client.status === 'pending' ? 'Pendente' :
                       client.status === 'suspended' ? 'Suspenso' : 'Inativo'}
                    </Badge>
                  </p>
                  <p className="text-sm">
                    Cadastrado em: {format(client.createdAt, "dd/MM/yyyy")}
                  </p>
                  <p className="text-sm">
                    Último login: {client.lastLogin ? format(client.lastLogin, "dd/MM/yyyy 'às' HH:mm") : 'Nunca'}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Credenciais</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    Possui credenciais: 
                    <Badge variant="outline" className={`ml-2 ${client.credentials ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {client.credentials ? 'Sim' : 'Não'}
                    </Badge>
                  </p>
                  {client.credentials && (
                    <>
                      <p className="text-sm">
                        Usuário: {canViewSensitive ? client.credentials.username : '***'}
                      </p>
                      <p className="text-sm">
                        Última troca de senha: {format(client.credentials.lastPasswordChange, "dd/MM/yyyy")}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <div className="space-y-4">
              {client.documents?.length > 0 ? (
                client.documents.map((doc) => (
                  <Card key={doc.id}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {doc.title}
                      </CardTitle>
                      <CardDescription>
                        Adicionado em {format(doc.uploadedAt, "dd/MM/yyyy")}
                        {doc.isRequired && (
                          <Badge variant="destructive" className="ml-2">Obrigatório</Badge>
                        )}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum documento encontrado.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inspections" className="mt-4">
            <div className="space-y-4">
              {client.inspections?.length > 0 ? (
                client.inspections.map((inspection) => (
                  <Card key={inspection.id}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{inspection.title}</CardTitle>
                      <CardDescription>
                        Data: {format(inspection.date, "dd/MM/yyyy")}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma vistoria encontrada.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="warranty" className="mt-4">
            <div className="space-y-4">
              {client.warrantyClaims?.length > 0 ? (
                client.warrantyClaims.map((claim) => (
                  <Card key={claim.id}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{claim.title}</CardTitle>
                      <CardDescription>{claim.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma solicitação de garantia encontrada.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
