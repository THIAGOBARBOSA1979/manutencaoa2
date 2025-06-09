
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  Users, 
  AlertTriangle,
  TrendingUp
} from "lucide-react";

interface ChecklistStatsProps {
  totalTemplates: number;
  totalExecutions: number;
  completionRate: number;
  averageTime: number;
  activeInspectors: number;
  pendingReviews: number;
  monthlyGrowth: number;
  categoryBreakdown: {
    category: string;
    count: number;
    percentage: number;
  }[];
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Templates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Templates</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTemplates}</div>
          <p className="text-xs text-muted-foreground">
            Templates ativos
          </p>
        </CardContent>
      </Card>

      {/* Execuções */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Execuções</CardTitle>
          <PlayCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalExecutions}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-green-500" />
            +{monthlyGrowth}% este mês
          </div>
        </CardContent>
      </Card>

      {/* Taxa de Conclusão */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <Progress value={completionRate} className="h-2" />
        </CardContent>
      </Card>

      {/* Tempo Médio */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageTime}min</div>
          <p className="text-xs text-muted-foreground">
            Por execução
          </p>
        </CardContent>
      </Card>

      {/* Inspetores Ativos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inspetores Ativos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeInspectors}</div>
          <p className="text-xs text-muted-foreground">
            Online agora
          </p>
        </CardContent>
      </Card>

      {/* Revisões Pendentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revisões Pendentes</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingReviews}</div>
          <Badge variant={pendingReviews > 5 ? "destructive" : "secondary"} className="text-xs">
            {pendingReviews > 5 ? "Atenção" : "Normal"}
          </Badge>
        </CardContent>
      </Card>

      {/* Breakdown por Categoria */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Distribuição por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categoryBreakdown.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-sm">{item.category}</span>
                <div className="flex items-center gap-2">
                  <Progress value={item.percentage} className="w-16 h-2" />
                  <span className="text-xs text-muted-foreground w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
