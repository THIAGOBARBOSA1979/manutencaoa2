
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../shared/StatusBadge";
import { Calendar, MessageSquare, Building, Home } from "lucide-react";

interface WarrantyClaimProps {
  claim: {
    id: string;
    title: string;
    property: string;
    unit: string;
    client: string;
    description: string;
    createdAt: Date;
    status: "pending" | "progress" | "complete" | "critical";
  };
  onAtender?: () => void;
}

export const WarrantyClaim = ({ claim, onAtender }: WarrantyClaimProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-slate-100 card-hover">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">{claim.title}</h3>
        <StatusBadge status={claim.status} />
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Building size={14} />
          <span>{claim.property}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Home size={14} />
          <span>Unidade {claim.unit}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar size={14} />
          <span>Aberto em {format(claim.createdAt, "dd/MM/yyyy")}</span>
        </div>
      </div>
      
      <div className="text-sm mb-4">
        <MessageSquare size={14} className="inline mr-1 text-muted-foreground" />
        <p className="line-clamp-2">{claim.description}</p>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm">Detalhes</Button>
        <Button variant="default" size="sm" onClick={onAtender}>Atender</Button>
      </div>
    </div>
  );
};
