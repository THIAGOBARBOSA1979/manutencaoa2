
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface InspectionStatsProps {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export function InspectionStats({ total, pending, inProgress, completed }: InspectionStatsProps) {
  const stats = [
    {
      title: "Total de Vistorias",
      value: total,
      icon: ClipboardCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pendentes",
      value: pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Em Andamento",
      value: inProgress,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Concluídas",
      value: completed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
