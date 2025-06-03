
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: any) => ReactNode;
}

interface Action {
  label: string;
  icon?: ReactNode;
  onClick: (row: any) => void;
  variant?: "default" | "destructive";
  separator?: boolean;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  actions?: Action[];
  emptyState?: {
    icon: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
  };
}

export const AdminTable = ({ columns, data, actions, emptyState }: AdminTableProps) => {
  if (data.length === 0 && emptyState) {
    return (
      <Card className="p-12 text-center bg-white shadow-sm">
        <div className="space-y-4">
          <div className="p-4 bg-slate-100 rounded-full mx-auto w-fit">
            {emptyState.icon}
          </div>
          <h3 className="text-xl font-semibold text-slate-900">{emptyState.title}</h3>
          <p className="text-slate-600 max-w-md mx-auto">{emptyState.description}</p>
          {emptyState.action}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-900"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900 w-16">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-slate-600">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.map((action, actionIndex) => (
                          <div key={actionIndex}>
                            {action.separator && <DropdownMenuSeparator />}
                            <DropdownMenuItem
                              onClick={() => action.onClick(row)}
                              className={action.variant === "destructive" ? "text-red-600" : ""}
                            >
                              {action.icon && <span className="mr-2">{action.icon}</span>}
                              {action.label}
                            </DropdownMenuItem>
                          </div>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
