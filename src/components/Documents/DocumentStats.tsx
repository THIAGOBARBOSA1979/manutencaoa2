
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, Download, Star, Clock, 
  AlertTriangle, Archive, TrendingUp, Users
} from "lucide-react";

interface DocumentStatsProps {
  stats: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    favorites: number;
    expiring: number;
  };
  totalDownloads: number;
}

export function DocumentStats({ stats, totalDownloads }: DocumentStatsProps) {
  const publishedPercentage = stats.total > 0 ? (stats.published / stats.total) * 100 : 0;
  const draftPercentage = stats.total > 0 ? (stats.draft / stats.total) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Documentos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span>Publicados</span>
              <Badge variant="default" className="text-xs">{stats.published}</Badge>
            </div>
            <Progress value={publishedPercentage} className="h-1" />
          </div>
        </CardContent>
      </Card>

      {/* Downloads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Downloads</CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDownloads}</div>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <p className="text-xs text-muted-foreground">
              Média: {stats.total > 0 ? Math.round(totalDownloads / stats.total) : 0} por documento
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rascunhos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Em Rascunho</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.draft}</div>
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span>% do total</span>
              <Badge variant="secondary" className="text-xs">
                {Math.round(draftPercentage)}%
              </Badge>
            </div>
            <Progress value={draftPercentage} className="h-1" />
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alertas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-orange-500" />
                <span className="text-sm">Vencendo</span>
              </div>
              <Badge variant="destructive" className="text-xs">
                {stats.expiring}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive className="h-3 w-3 text-gray-500" />
                <span className="text-sm">Arquivados</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {stats.archived}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-sm">Favoritos</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {stats.favorites}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
