import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  ClipboardCheck, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  BarChart3,
  PieChart,
  Zap
} from "lucide-react";
import { AdminHeader } from "./AdminHeader";
import { QuickActionsModal } from "./QuickActionsModal";

interface DashboardStats {
  properties: {
    total: number;
    active: number;
    completed: number;
    trend: number;
  };
  inspections: {
    total: number;
    pending: number;
    today: number;
    trend: number;
  };
  warranty: {
    total: number;
    critical: number;
    resolved: number;
    trend: number;
  };
  users: {
    total: number;
    active: number;
    clients: number;
    trend: number;
  };
}

interface RecentActivity {
  id: string;
  type: "inspection" | "warranty" | "property" | "user";
  title: string;
  description: string;
  time: string;
  status: "success" | "warning" | "error" | "info";
}

const mockStats: DashboardStats = {
  properties: { total: 8, active: 5, completed: 3, trend: 12.5 },
  inspections: { total: 42, pending: 8, today: 3, trend: -5.2 },
  warranty: { total: 15, critical: 2, resolved: 11, trend: 8.1 },
  users: { total: 156, active: 142, clients: 128, trend: 15.3 }
};

const recentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "inspection",
    title: "Vistoria concluída",
    description: "Edifício Aurora - Unidade 507",
    time: "2 min atrás",
    status: "success"
  },
  {
    id: "2",
    type: "warranty",
    title: "Nova solicitação de garantia",
    description: "Infiltração no banheiro - Res. Bosque Verde",
    time: "15 min atrás",
    status: "warning"
  },
  {
    id: "3",
    type: "user",
    title: "Novo cliente cadastrado",
    description: "Maria Silva - Unidade 204",
    time: "1 hora atrás",
    status: "info"
  },
  {
    id: "4",
    type: "property",
    title: "Empreendimento atualizado",
    description: "Condomínio Monte Azul - 95% concluído",
    time: "2 horas atrás",
    status: "success"
  }
];

export const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [showQuickActions, setShowQuickActions] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const headerActions = (
    <div className="flex gap-3">
      <Button variant="outline">
        <BarChart3 className="mr-2 h-4 w-4" />
        Relatórios
      </Button>
      <Button onClick={() => setShowQuickActions(true)}>
        <Zap className="mr-2 h-4 w-4" />
        Ação Rápida
      </Button>
    </div>
  );

  return (
    <>
      <div className="space-y-8">
        <AdminHeader
          title="Dashboard Administrativo"
          description="Visão geral completa do sistema de gestão"
          icon={<BarChart3 className="h-8 w-8 text-primary" />}
          actions={headerActions}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Empreendimentos</CardTitle>
              <Building className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{mockStats.properties.total}</div>
              <div className="flex items-center gap-2 text-xs text-blue-700">
                {getTrendIcon(mockStats.properties.trend)}
                <span>{Math.abs(mockStats.properties.trend)}% vs mês anterior</span>
              </div>
              <div className="mt-3">
                <Progress 
                  value={(mockStats.properties.completed / mockStats.properties.total) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-blue-700 mt-1">
                  {mockStats.properties.completed} concluídos
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Vistorias</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{mockStats.inspections.total}</div>
              <div className="flex items-center gap-2 text-xs text-green-700">
                {getTrendIcon(mockStats.inspections.trend)}
                <span>{Math.abs(mockStats.inspections.trend)}% vs mês anterior</span>
              </div>
              <div className="mt-3 flex justify-between text-xs text-green-700">
                <span>Hoje: {mockStats.inspections.today}</span>
                <span>Pendentes: {mockStats.inspections.pending}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-900">Garantias</CardTitle>
              <ShieldCheck className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">{mockStats.warranty.total}</div>
              <div className="flex items-center gap-2 text-xs text-amber-700">
                {getTrendIcon(mockStats.warranty.trend)}
                <span>{Math.abs(mockStats.warranty.trend)}% vs mês anterior</span>
              </div>
              <div className="mt-3 flex justify-between text-xs text-amber-700">
                <span>Críticas: {mockStats.warranty.critical}</span>
                <span>Resolvidas: {mockStats.warranty.resolved}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Usuários</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{mockStats.users.total}</div>
              <div className="flex items-center gap-2 text-xs text-purple-700">
                {getTrendIcon(mockStats.users.trend)}
                <span>{Math.abs(mockStats.users.trend)}% vs mês anterior</span>
              </div>
              <div className="mt-3 flex justify-between text-xs text-purple-700">
                <span>Ativos: {mockStats.users.active}</span>
                <span>Clientes: {mockStats.users.clients}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Atividades Recentes</CardTitle>
                    <CardDescription>
                      Últimas ações realizadas no sistema
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver todas
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {activity.title}
                          </p>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Performance */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Acesso direto às funções principais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowQuickActions(true)}
                >
                  <Building className="mr-2 h-4 w-4" />
                  Novo Empreendimento
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowQuickActions(true)}
                >
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Agendar Vistoria
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowQuickActions(true)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Cadastrar Usuário
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowQuickActions(true)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Agenda
                </Button>
              </CardContent>
            </Card>

            {/* System Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance do Sistema</CardTitle>
                <CardDescription>
                  Métricas de desempenho
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Sincronização</span>
                    <span className="text-green-600 font-medium">98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Disponibilidade</span>
                    <span className="text-green-600 font-medium">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Satisfação do Cliente</span>
                    <span className="text-blue-600 font-medium">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alertas Importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-amber-800">
                  <p>• 2 garantias críticas pendentes</p>
                  <p>• 5 vistorias agendadas para hoje</p>
                  <p>• Backup do sistema às 02:00</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <QuickActionsModal 
        open={showQuickActions}
        onOpenChange={setShowQuickActions}
      />
    </>
  );
};
