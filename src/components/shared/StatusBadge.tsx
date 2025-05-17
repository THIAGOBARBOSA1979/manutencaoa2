
import { cn } from "@/lib/utils";

type StatusType = "pending" | "progress" | "complete" | "critical";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig = {
  pending: {
    class: "status-pending",
    defaultLabel: "Pendente",
  },
  progress: {
    class: "status-progress",
    defaultLabel: "Em Andamento",
  },
  complete: {
    class: "status-complete",
    defaultLabel: "Concluído",
  },
  critical: {
    class: "status-critical",
    defaultLabel: "Crítico",
  },
};

export const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span className={cn("status-badge", config.class, className)}>
      {label || config.defaultLabel}
    </span>
  );
};
