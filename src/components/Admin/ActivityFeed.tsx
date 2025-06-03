
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, AlertTriangle, Clock, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activity {
  id: string;
  type: "inspection" | "warranty" | "property" | "user" | "document";
  title: string;
  description: string;
  timestamp: Date;
  status: "success" | "warning" | "error" | "info";
  user?: string;
  metadata?: Record<string, any>;
}

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export const ActivityFeed = ({ 
  activities, 
  maxItems = 10, 
  showViewAll = true,
  onViewAll 
}: ActivityFeedProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      inspection: "bg-blue-100 text-blue-800",
      warranty: "bg-amber-100 text-amber-800",
      property: "bg-green-100 text-green-800",
      user: "bg-purple-100 text-purple-800",
      document: "bg-gray-100 text-gray-800"
    };
    return colors[type as keyof typeof colors] || colors.document;
  };

  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas {maxItems} ações realizadas no sistema
            </CardDescription>
          </div>
          {showViewAll && (
            <Button variant="outline" size="sm" onClick={onViewAll}>
              <Eye className="h-4 w-4 mr-2" />
              Ver todas
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.length > 0 ? (
            displayActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {activity.title}
                    </p>
                    <Badge variant="outline" className={`text-xs ${getTypeColor(activity.type)}`}>
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 truncate mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-slate-500">
                      {formatDistanceToNow(activity.timestamp, { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </p>
                    {activity.user && (
                      <p className="text-xs text-slate-500">
                        por {activity.user}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Nenhuma atividade recente</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
