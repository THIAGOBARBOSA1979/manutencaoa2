
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp
} from "lucide-react";

interface WarrantyStatsProps {
  stats: {
    critical: number;
    pending: number;
    progress: number;
    complete: number;
  };
}

export const WarrantyStats = ({ stats }: WarrantyStatsProps) => {
  const total = stats.critical + stats.pending + stats.progress + stats.complete;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Críticas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          <p className="text-xs text-muted-foreground">
            Requer atenção imediata
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          <p className="text-xs text-muted-foreground">
            Aguardando atendimento
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.progress}</div>
          <p className="text-xs text-muted-foreground">
            Sendo resolvidas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? Math.round((stats.complete / total) * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
