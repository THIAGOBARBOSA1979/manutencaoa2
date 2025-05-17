
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Building, Calendar, ClipboardCheck, FileText, Home, MessageSquare, ShieldCheck } from "lucide-react";
import { format } from "date-fns";

// Mock data
const userDetails = {
  name: "Maria Oliveira",
  property: "Edifício Aurora",
  unit: "204",
  documentCount: 4,
  warrantyExpirationDate: new Date(2030, 3, 15),
};

const upcomingInspection = {
  id: "1",
  title: "Vistoria de Pré-entrega",
  date: new Date(2025, 4, 15, 10, 0),
  status: "pending",
};

const recentWarrantyClaims = [
  {
    id: "1",
    title: "Infiltração no banheiro",
    description: "Identificada infiltração na parede do box do banheiro social.",
    createdAt: new Date(2025, 5, 5),
    status: "pending",
  }
];

const ClientDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bem-vinda, {userDetails.name}!</h1>
        <p className="text-muted-foreground mt-1">
          {userDetails.property} - Unidade {userDetails.unit}
        </p>
      </div>

      {/* Main cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Meu Imóvel
            </CardTitle>
            <CardDescription>
              Detalhes do seu imóvel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Empreendimento:</span> {userDetails.property}</p>
              <p><span className="font-medium">Unidade:</span> {userDetails.unit}</p>
              <p><span className="font-medium">Garantia estrutural até:</span> {format(userDetails.warrantyExpirationDate, "dd/MM/yyyy")}</p>
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Ver detalhes do imóvel
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              Próxima Vistoria
            </CardTitle>
            <CardDescription>
              Informações sobre sua próxima vistoria agendada
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingInspection ? (
              <div className="space-y-2">
                <p className="font-medium">{upcomingInspection.title}</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(upcomingInspection.date, "dd/MM/yyyy 'às' HH:mm")}</span>
                </div>
                <div className="mt-2">
                  <StatusBadge status="pending" label="Agendada" />
                </div>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  Ver detalhes
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Nenhuma vistoria agendada</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Solicitações de Garantia
            </CardTitle>
            <CardDescription>
              Status das suas solicitações de garantia
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentWarrantyClaims.length > 0 ? (
              <div className="space-y-2">
                <div className="border rounded-md p-3">
                  <p className="font-medium">{recentWarrantyClaims[0].title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {recentWarrantyClaims[0].description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-muted-foreground">
                      {format(recentWarrantyClaims[0].createdAt, "dd/MM/yyyy")}
                    </div>
                    <StatusBadge status="pending" />
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  Ver todas as solicitações
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Nenhuma solicitação de garantia</p>
                <Button variant="outline" size="sm" className="mt-4">
                  Nova solicitação
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5">
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Documentos</h3>
                <p className="text-sm text-muted-foreground">
                  {userDetails.documentCount} documentos disponíveis
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Acessar
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Meu Imóvel</h3>
                <p className="text-sm text-muted-foreground">
                  Detalhes e informações
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Ver
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Suporte</h3>
                <p className="text-sm text-muted-foreground">
                  Fale com nossa equipe
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Contatar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Documents section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos Importantes
            </CardTitle>
            <CardDescription>
              Documentos relacionados ao seu imóvel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Manual do Proprietário</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground">
                    Adicionado em 10/04/2025
                  </p>
                </CardContent>
                <div className="p-4 pt-0 flex justify-center">
                  <Button variant="outline" size="sm">
                    Visualizar
                  </Button>
                </div>
              </Card>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Termo de Garantia</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground">
                    Adicionado em 10/04/2025
                  </p>
                </CardContent>
                <div className="p-4 pt-0 flex justify-center">
                  <Button variant="outline" size="sm">
                    Visualizar
                  </Button>
                </div>
              </Card>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Planta Baixa</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground">
                    Adicionado em 10/04/2025
                  </p>
                </CardContent>
                <div className="p-4 pt-0 flex justify-center">
                  <Button variant="outline" size="sm">
                    Visualizar
                  </Button>
                </div>
              </Card>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Contrato de Compra</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground">
                    Adicionado em 15/03/2025
                  </p>
                </CardContent>
                <div className="p-4 pt-0 flex justify-center">
                  <Button variant="outline" size="sm">
                    Visualizar
                  </Button>
                </div>
              </Card>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline">
                Ver todos os documentos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
