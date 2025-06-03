
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AdminHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
  actions?: ReactNode;
  stats?: Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;
}

export const AdminHeader = ({ title, description, icon, actions, stats }: AdminHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg">
        <div className="p-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl">
                {icon}
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-slate-600 mt-2 text-lg">
                  {description}
                </p>
              </div>
            </div>
            {actions && (
              <div className="flex gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className={`text-3xl font-bold ${stat.color || 'text-primary'} mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm text-slate-600 font-medium">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
