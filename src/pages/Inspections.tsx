
import { useState } from "react";
import { InspectionHeader } from "@/components/Inspection/InspectionHeader";
import { InspectionStats } from "@/components/Inspection/InspectionStats";
import { InspectionFilters } from "@/components/Inspection/InspectionFilters";
import { InspectionList } from "@/components/Inspection/InspectionList";

// Mock data para exemplo
const inspections = [
  {
    id: "1",
    property: "Edifício Aurora",
    unit: "101",
    client: "João Silva",
    scheduledDate: new Date(),
    status: "pending" as const
  },
  {
    id: "2",
    property: "Residencial Bosque",
    unit: "302",
    client: "Maria Santos",
    scheduledDate: new Date(),
    status: "progress" as const
  }
];

export default function Inspections() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProperty, setFilterProperty] = useState("all");

  // Estatísticas calculadas
  const stats = {
    total: inspections.length,
    pending: inspections.filter(i => i.status === "pending").length,
    inProgress: inspections.filter(i => i.status === "progress").length,
    completed: inspections.filter(i => i.status === "complete" as any).length || 0
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <InspectionHeader 
        onViewChange={setView}
        currentView={view}
      />

      <InspectionStats {...stats} />

      <InspectionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterProperty={filterProperty}
        onPropertyChange={setFilterProperty}
      />

      <InspectionList inspections={inspections} />
    </div>
  );
}
