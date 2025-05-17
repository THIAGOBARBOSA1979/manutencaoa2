
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Stats } from "@/components/Dashboard/Stats";
import { PropertyCard } from "@/components/Properties/PropertyCard";
import { InspectionItem } from "@/components/Inspection/InspectionItem";
import { WarrantyClaim } from "@/components/Warranty/WarrantyClaim";
import { Calendar, ClipboardCheck, ShieldCheck, ChevronRight } from "lucide-react";

// Mock data
const recentProperties = [
  {
    id: "1",
    name: "Edifício Aurora",
    location: "São Paulo, SP",
    units: 120,
    completedUnits: 85,
    status: "progress" as const,
  },
  {
    id: "2",
    name: "Residencial Bosque Verde",
    location: "Rio de Janeiro, RJ",
    units: 75,
    completedUnits: 75,
    status: "complete" as const,
  },
  {
    id: "3",
    name: "Condomínio Monte Azul",
    location: "Belo Horizonte, MG",
    units: 50,
    completedUnits: 10,
    status: "pending" as const,
  },
];

const upcomingInspections = [
  {
    id: "1",
    property: "Edifício Aurora",
    unit: "507",
    client: "Carlos Silva",
    scheduledDate: new Date(2025, 4, 19, 10, 0),
    status: "pending" as const,
  },
  {
    id: "2",
    property: "Edifício Aurora",
    unit: "204",
    client: "Maria Oliveira",
    scheduledDate: new Date(2025, 4, 19, 14, 30),
    status: "pending" as const,
  },
];

const recentWarrantyClaims = [
  {
    id: "1",
    title: "Infiltração no banheiro",
    property: "Residencial Bosque Verde",
    unit: "305",
    client: "Ana Santos",
    description: "Identificada infiltração na parede do box do banheiro social. Já está causando mofo e descascamento da pintura.",
    createdAt: new Date(2025, 4, 15),
    status: "critical" as const,
  },
  {
    id: "2",
    title: "Porta empenada",
    property: "Edifício Aurora",
    unit: "108",
    client: "João Mendes",
    description: "A porta do quarto principal está empenada e não fecha corretamente.",
    createdAt: new Date(2025, 4, 16),
    status: "progress" as const,
  },
];

const Dashboard = () => {
  const [isLoading] = useState(false);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema de gestão de entregas e garantias
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Calendário
          </Button>
          <Button>
            Novo Empreendimento
          </Button>
        </div>
      </div>
      
      {/* Statistics */}
      <Stats />
      
      {/* Recent Properties */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Empreendimentos Recentes</h2>
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <a href="/properties">
              Ver todos
              <ChevronRight size={16} />
            </a>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
      
      {/* Inspections */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ClipboardCheck size={20} />
            Próximas Vistorias
          </h2>
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <a href="/inspections">
              Ver todas
              <ChevronRight size={16} />
            </a>
          </Button>
        </div>
        <div className="space-y-3">
          {upcomingInspections.map((inspection) => (
            <InspectionItem key={inspection.id} inspection={inspection} />
          ))}
        </div>
      </section>
      
      {/* Warranty Claims */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShieldCheck size={20} />
            Solicitações de Garantia Recentes
          </h2>
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <a href="/warranty">
              Ver todas
              <ChevronRight size={16} />
            </a>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recentWarrantyClaims.map((claim) => (
            <WarrantyClaim key={claim.id} claim={claim} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
