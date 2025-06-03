
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, Calendar } from "lucide-react";

interface InspectionSummaryProps {
  totalInspections: number;
  pendingInspections: number;
  completedInspections: number;
  inProgressInspections: number;
  upcomingInspections: number;
}

export const InspectionSummary = ({
  totalInspections,
  pendingInspections,
  completedInspections,
  inProgressInspections,
  upcomingInspections
}: InspectionSummaryProps) => {
  const completionRate = totalInspections > 0 ? (completedInspections / totalInspections) * 100 : 0;

  const stats = [
    {
      title: "Pendentes",
      value: pendingInspections,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      title: "Em Andamento",
      value: inProgressInspections,
      icon: AlertTriangle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Concluídas",
      value: completedInspections,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Próximas",
      value: upcomingInspections,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Resumo das Vistorias</span>
            <Badge variant="secondary" className="bg-white/80">
              {totalInspections} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Taxa de Conclusão</span>
                <span className="font-medium">{completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border transition-all duration-200 hover:shadow-md`}>
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
