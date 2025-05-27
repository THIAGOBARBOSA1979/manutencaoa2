
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  FileText, 
  ClipboardCheck, 
  ShieldCheck, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Bell,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  // Mock data para demonstrar funcionalidades
  const userInfo = {
    name: "Maria Oliveira",
    property: "Edifício Aurora",
    unit: "Unidade 204",
    deliveryDate: new Date(2025, 5, 15),
    contractDate: new Date(2024, 10, 20)
  };

  const recentDocuments = [
    { id: "1", title: "Contrato de Compra e Venda", date: new Date(2025, 3, 15), status: "disponivel" },
    { id: "2", title: "Manual do Proprietário", date: new Date(2025, 3, 20), status: "disponivel" },
    { id: "3", title: "Relatório de Vistoria", date: new Date(2025, 4, 10), status: "disponivel" }
  ];

  const upcomingInspections = [
    { id: "1", title: "Vistoria de Pré-entrega", date: new Date(2025, 5, 10), status: "agendada" },
    { id: "2", title: "Vistoria de Entrega", date: new Date(2025, 5, 15), status: "pendente" }
  ];

  const warrantyRequests = [
    { id: "1", title: "Reparo na torneira do banheiro", status: "em_andamento", priority: "media" },
    { id: "2", title: "Ajuste na porta da cozinha", status: "concluido", priority: "baixa" }
  ];

  const notifications = [
    { id: "1", title: "Vistoria agendada", message: "Sua vistoria de pré-entrega foi confirmada", urgent: true },
    { id: "2", title: "Documento disponível", message: "Manual do proprietário já está disponível", urgent: false },
    { id: "3", title: "Lembrete de pagamento", message: "Próxima parcela vence em 5 dias", urgent: true }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      disponivel: "default",
      agendada: "default",
      pendente: "secondary",
      em_andamento: "secondary",
      concluido: "outline"
    };
    return colors[status as keyof typeof colors] || "outline";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      disponivel: "Disponível",
      agendada: "Agendada",
      pendente: "Pendente",
      em_andamento: "Em Andamento",
      concluido: "Concluído"
    };
    return labels[status as keyof typeof labels] || status;
  };

  const daysToDelivery = Math.ceil((userInfo.deliveryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const contractProgress = Math.min(((new Date().getTime() - userInfo.contractDate.getTime()) / (userInfo.deliveryDate.getTime() - userInfo.contractDate.getTime())) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Bem-vindo, {userInfo.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          Acompanhe o progresso do seu imóvel e acesse seus documentos
        </p>
      </div>

      {/* Property Info Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                {userInfo.property}
              </CardTitle>
              <CardDescription className="text-base font-medium text-foreground/80">
                {userInfo.unit}
              </CardDescription>
            </div>
            <Badge variant="default" className="text-sm px-3 py-1">
              {daysToDelivery > 0 ? `${daysToDelivery} dias para entrega` : "Entregue"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progresso da obra</span>
              <span>{Math.round(contractProgress)}%</span>
            </div>
            <Progress value={contractProgress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Contrato: {userInfo.contractDate.toLocaleDateString()}</span>
              <span>Entrega: {userInfo.deliveryDate.toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documentos</p>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-muted-foreground">3 disponíveis</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vistorias</p>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">1 agendada</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Garantias</p>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">1 em andamento</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notificações</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">2 urgentes</p>
              </div>
              <Bell className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos Recentes
              </CardTitle>
              <Link to="/client/documents">
                <Button variant="ghost" size="sm">
                  Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">{doc.date.toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant={getStatusColor(doc.status) as any} className="text-xs">
                  {getStatusLabel(doc.status)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Inspections */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                Próximas Vistorias
              </CardTitle>
              <Link to="/client/inspections">
                <Button variant="ghost" size="sm">
                  Ver todas <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingInspections.map((inspection) => (
              <div key={inspection.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{inspection.title}</p>
                    <p className="text-xs text-muted-foreground">{inspection.date.toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant={getStatusColor(inspection.status) as any} className="text-xs">
                  {getStatusLabel(inspection.status)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Warranty Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Solicitações de Garantia
              </CardTitle>
              <Link to="/client/warranty">
                <Button variant="ghost" size="sm">
                  Ver todas <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {warrantyRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{request.title}</p>
                    <p className="text-xs text-muted-foreground">Prioridade: {request.priority}</p>
                  </div>
                </div>
                <Badge variant={getStatusColor(request.status) as any} className="text-xs">
                  {getStatusLabel(request.status)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                {notification.urgent ? (
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente as funcionalidades mais utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/client/documents">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <FileText className="h-6 w-6" />
                Meus Documentos
              </Button>
            </Link>
            <Link to="/client/inspections">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <ClipboardCheck className="h-6 w-6" />
                Agendar Vistoria
              </Button>
            </Link>
            <Link to="/client/warranty">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <ShieldCheck className="h-6 w-6" />
                Solicitar Garantia
              </Button>
            </Link>
            <Link to="/client/properties">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Home className="h-6 w-6" />
                Meu Imóvel
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
