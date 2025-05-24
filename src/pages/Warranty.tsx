
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import WarrantyService from "@/components/Warranty/WarrantyService";
import { WarrantyProblemsManager } from "@/components/Warranty/WarrantyProblemsManager";
import { WarrantyHeader } from "@/components/Warranty/WarrantyHeader";
import { WarrantyStats } from "@/components/Warranty/WarrantyStats";
import { WarrantyFilters } from "@/components/Warranty/WarrantyFilters";
import { WarrantyTabs } from "@/components/Warranty/WarrantyTabs";

// Mock data
const warrantyClaims = [
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
  {
    id: "3",
    title: "Rachaduras na parede",
    property: "Condomínio Monte Azul",
    unit: "205",
    client: "Paulo Soares",
    description: "Surgiram rachaduras na parede da sala próximo à janela principal.",
    createdAt: new Date(2025, 4, 14),
    status: "pending" as const,
  },
  {
    id: "4",
    title: "Vazamento em tubulação",
    property: "Edifício Aurora",
    unit: "302",
    client: "Carla Ferreira",
    description: "Vazamento na tubulação embaixo da pia da cozinha, causando acúmulo de água no armário.",
    createdAt: new Date(2025, 4, 17),
    status: "critical" as const,
  },
  {
    id: "5",
    title: "Problema no piso laminado",
    property: "Residencial Bosque Verde",
    unit: "107",
    client: "Marcos Oliveira",
    description: "O piso laminado da sala está descolando em alguns pontos próximos à varanda.",
    createdAt: new Date(2025, 4, 13),
    status: "complete" as const,
  },
  {
    id: "6",
    title: "Maçaneta quebrada",
    property: "Edifício Aurora",
    unit: "504",
    client: "Laura Costa",
    description: "A maçaneta da porta do banheiro social quebrou e não é possível fechar a porta.",
    createdAt: new Date(2025, 4, 18),
    status: "progress" as const,
  },
];

// Status statistics
const statusStats = {
  critical: 2,
  pending: 1,
  progress: 2,
  complete: 1,
};

const Warranty = () => {
  const { toast } = useToast();
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [problemsDialogOpen, setProblemDialogOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string>("all-properties");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Calculate filtered claims
  const getFilteredClaims = (status: string) => {
    let filteredClaims = [...warrantyClaims];
    
    // Filter by status if not "all"
    if (status !== "all") {
      filteredClaims = filteredClaims.filter(claim => claim.status === status);
    }
    
    // Filter by property if not "all-properties"
    if (selectedProperty !== "all-properties") {
      filteredClaims = filteredClaims.filter(claim => 
        claim.property.toLowerCase().includes(selectedProperty.toLowerCase())
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      filteredClaims = filteredClaims.filter(claim => 
        claim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by date
    if (dateFilter === "today") {
      const today = new Date();
      filteredClaims = filteredClaims.filter(claim => 
        claim.createdAt.getDate() === today.getDate() &&
        claim.createdAt.getMonth() === today.getMonth() &&
        claim.createdAt.getFullYear() === today.getFullYear()
      );
    } else if (dateFilter === "week") {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      filteredClaims = filteredClaims.filter(claim => claim.createdAt >= lastWeek);
    } else if (dateFilter === "month") {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filteredClaims = filteredClaims.filter(claim => claim.createdAt >= lastMonth);
    }
    
    return filteredClaims;
  };

  const handleAtendimento = (warrantyId: string, warrantyTitle: string) => {
    setSelectedWarranty({ id: warrantyId, title: warrantyTitle });
    setServiceDialogOpen(true);
  };
  
  const handleGerenciarProblemas = (warrantyId: string, warrantyTitle: string) => {
    setSelectedWarranty({ id: warrantyId, title: warrantyTitle });
    setProblemDialogOpen(true);
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados serão enviados para seu e-mail quando estiverem prontos.",
    });
  };

  const clearFilters = () => {
    setSelectedProperty("all-properties");
    setSearchQuery("");
    setDateFilter("all");
    setFilterSheetOpen(false);
  };

  return (
    <div className="space-y-6">
      <WarrantyHeader onExportData={handleExportData} />
      
      <WarrantyStats stats={statusStats} />

      <WarrantyTabs 
        getFilteredClaims={getFilteredClaims}
        onAtender={handleAtendimento}
        onGerenciarProblemas={handleGerenciarProblemas}
      />

      <WarrantyFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}
        filterSheetOpen={filterSheetOpen}
        setFilterSheetOpen={setFilterSheetOpen}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        clearFilters={clearFilters}
      />

      {/* Warranty Service Dialog */}
      {selectedWarranty && (
        <>
          <WarrantyService
            open={serviceDialogOpen}
            onOpenChange={setServiceDialogOpen}
            warrantyId={selectedWarranty.id}
            warrantyTitle={selectedWarranty.title}
          />
          
          <WarrantyProblemsManager
            open={problemsDialogOpen}
            onOpenChange={setProblemDialogOpen}
            warrantyId={selectedWarranty.id}
            warrantyTitle={selectedWarranty.title}
          />
        </>
      )}
    </div>
  );
};

export default Warranty;
