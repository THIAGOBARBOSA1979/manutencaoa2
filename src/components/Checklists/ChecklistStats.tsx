
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Calendar,
  Target
} from "lucide-react";

interface ChecklistStatsProps {
  totalTemplates: number;
  totalExecutions: number;
  completionRate: number;
  averageTime: number;
  activeInspectors: number;
  pendingReviews: number;
  monthlyGrowth: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}

export function ChecklistStats({
  totalTemplates,
  totalExecutions,
  completionRate,
  averageTime,
  activeInspectors,
  pendingReviews,
  monthlyGrowth,
  categoryBreakdown
}: ChecklistStatsProps) {
  const stats = [
    {
      title: "Templates Ativos",
      value: totalTemplates,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Templates disponíveis"
    },
    {
      title: "Execuções Este Mês",
      value: totalExecutions,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Checklists executados"
    },
    {
      title: "Taxa de Conclusão",
      value: `${completionRate}%`,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Média de finalização"
    },
    {
      title: "Tempo Médio",
      value: `${averageTime}min`,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Por execução"
    },
    {
      title: "Inspetores Ativos",
      value: activeInspectors,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Executando checklists"
    },
    {
      title: "Pendências",
      value: pendingReviews,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Para revisão"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Taxa de Conclusão</span>
                <span className="text-sm text-muted-foreground">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{monthlyGrowth}%</div>
                <div className="text-xs text-green-700">Crescimento mensal</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{averageTime}</div>
                <div className="text-xs text-blue-700">Minutos por checklist</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Distribuição por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryBreakdown.map((category) => (
                <div key={category.category} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.category}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                  <Progress value={category.percentage} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
