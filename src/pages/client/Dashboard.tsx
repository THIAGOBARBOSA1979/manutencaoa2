import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useState } from "react";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [warrantyStatus] = useState<"pending" | "progress" | "complete">("pending");

  const handleDownloadWarranty = () => {
    // TODO: Implementar download do termo de garantia
    console.log("Downloading warranty document...");
  };

  const handleDownloadFloorPlan = () => {
    // TODO: Implementar download da planta baixa
    console.log("Downloading floor plan...");
  };

  const handleDownloadContract = () => {
    // TODO: Implementar download do contrato
    console.log("Downloading contract...");
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">Vistoria</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-col gap-3">
              <StatusBadge status={warrantyStatus} />
              <Button 
                variant="outline" 
                onClick={() => navigate("/client/inspections")}
                className="w-full"
              >
                Ver Detalhes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">Termo de Garantia</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Documento oficial da garantia do seu imóvel
              </p>
              <Button 
                variant="outline" 
                onClick={handleDownloadWarranty}
                className="w-full"
              >
                Baixar Documento
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">Planta Baixa</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Planta baixa do seu imóvel
              </p>
              <Button 
                variant="outline" 
                onClick={handleDownloadFloorPlan}
                className="w-full"
              >
                Baixar Planta
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">Contrato de Compra</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Contrato de compra e venda do imóvel
              </p>
              <Button 
                variant="outline"
                onClick={handleDownloadContract}
                className="w-full"
              >
                Baixar Contrato
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}