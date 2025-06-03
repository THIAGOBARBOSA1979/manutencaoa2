
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

interface WarrantySummaryProps {
  totalClaims: number;
  pendingClaims: number;
  inProgressClaims: number;
  completedClaims: number;
  criticalClaims: number;
}

export const WarrantySummary = ({
  totalClaims,
  pendingClaims,
  inProgressClaims,
  completedClaims,
  criticalClaims
}: WarrantySummaryProps) => {
  const resolutionRate = totalClaims > 0 ? (completedClaims / totalClaims) * 100 : 0;
  const avgResponseTime = "2.5 dias"; // Mock data - in real app would come from API

  const stats = [
    {
      title: "Críticas",
      value: criticalClaims,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      title: "Pendentes",
      value: pendingClaims,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      title: "Em Andamento",
      value: inProgressClaims,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Resolvidas",
      value: completedClaims,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Resumo das Garantias</span>
            </div>
            <Badge variant="secondary" className="bg-white/80">
              {totalClaims} solicitações
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Taxa de Resolução</span>
                  <span className="font-medium">{resolutionRate.toFixed(1)}%</span>
                </div>
                <Progress value={resolutionRate} className="h-2" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-center p-3 bg-white/60 rounded-lg">
                <div className="text-lg font-bold text-primary">{avgResponseTime}</div>
                <div className="text-xs text-muted-foreground">Tempo médio de resposta</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border transition-all duration-200 hover:shadow-md hover:scale-105`}>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">
                    {stat.title}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
