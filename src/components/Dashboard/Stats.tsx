
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, ShieldCheck, ClipboardCheck, AlertTriangle } from "lucide-react";

export const Stats = () => {
  const stats = [
    {
      title: "Empreendimentos",
      value: "12",
      icon: Building,
      description: "3 em andamento",
      color: "text-blue-600",
    },
    {
      title: "Vistorias",
      value: "148",
      icon: ClipboardCheck,
      description: "24 pendentes",
      color: "text-emerald-600",
    },
    {
      title: "Garantias",
      value: "57",
      icon: ShieldCheck,
      description: "18 em andamento",
      color: "text-violet-600",
    },
    {
      title: "Chamados Críticos",
      value: "5",
      icon: AlertTriangle,
      description: "Prioridade alta",
      color: "text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={cn("p-2 rounded-full bg-slate-100", stat.color)}>
              <stat.icon size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

import { cn } from "@/lib/utils";
