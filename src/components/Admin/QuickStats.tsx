
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown } from "lucide-react";

interface QuickStatsProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  progress?: {
    value: number;
    max: number;
    label?: string;
  };
  subtitle?: string;
  color?: "blue" | "green" | "amber" | "purple" | "red";
}

export const QuickStats = ({
  title,
  value,
  icon,
  trend,
  progress,
  subtitle,
  color = "blue"
}: QuickStatsProps) => {
  const colorClasses = {
    blue: {
      card: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
      title: "text-blue-900",
      value: "text-blue-900",
      text: "text-blue-700",
      icon: "text-blue-600"
    },
    green: {
      card: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
      title: "text-green-900",
      value: "text-green-900",
      text: "text-green-700",
      icon: "text-green-600"
    },
    amber: {
      card: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200",
      title: "text-amber-900",
      value: "text-amber-900",
      text: "text-amber-700",
      icon: "text-amber-600"
    },
    purple: {
      card: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
      title: "text-purple-900",
      value: "text-purple-900",
      text: "text-purple-700",
      icon: "text-purple-600"
    },
    red: {
      card: "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
      title: "text-red-900",
      value: "text-red-900",
      text: "text-red-700",
      icon: "text-red-600"
    }
  };

  const classes = colorClasses[color];

  const getTrendIcon = (trendValue: number) => {
    return trendValue > 0 ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  return (
    <Card className={classes.card}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className={`text-sm font-medium ${classes.title}`}>{title}</h3>
          <div className={classes.icon}>{icon}</div>
        </div>
        
        <div className={`text-2xl font-bold ${classes.value}`}>{value}</div>
        
        {trend !== undefined && (
          <div className={`flex items-center gap-2 text-xs ${classes.text} mt-1`}>
            {getTrendIcon(trend)}
            <span>{Math.abs(trend)}% vs período anterior</span>
          </div>
        )}
        
        {progress && (
          <div className="mt-3">
            <Progress 
              value={(progress.value / progress.max) * 100} 
              className="h-2"
            />
            <p className={`text-xs ${classes.text} mt-1`}>
              {progress.label || `${progress.value}/${progress.max}`}
            </p>
          </div>
        )}
        
        {subtitle && (
          <p className={`text-xs ${classes.text} mt-2`}>{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};
