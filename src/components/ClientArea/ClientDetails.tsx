
import { User, Mail, Phone, Home, FileText, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ClientDetailsProps {
  client: any;
  onClose: () => void;
}

export function ClientDetails({ client, onClose }: ClientDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Cliente
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="inspections">Vistorias</TabsTrigger>
            <TabsTrigger value="warranty">Garantias</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-3">Informações Pessoais</h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {client.email}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {client.phone}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Informações do Imóvel</h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    {client.property}
                  </p>
                  <p className="text-sm">Unidade: {client.unit}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <div className="space-y-4">
              {client.documents?.map((doc: any) => (
                <Card key={doc.id}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {doc.title}
                    </CardTitle>
                    <CardDescription>
                      Adicionado em {format(doc.uploadedAt, "dd/MM/yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4">
                    <Button variant="outline" size="sm">
                      Visualizar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inspections" className="mt-4">
            <div className="space-y-4">
              {client.inspections?.map((inspection: any) => (
                <Card key={inspection.id}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{inspection.title}</CardTitle>
                    <CardDescription>
                      Agendada para {format(inspection.date, "dd/MM/yyyy 'às' HH:mm")}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4">
                    <Badge variant={inspection.status === "completed" ? "secondary" : "outline"}>
                      {inspection.status === "scheduled" ? "Agendada" : "Concluída"}
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="warranty" className="mt-4">
            <div className="space-y-4">
              {client.warrantyClaims?.map((claim: any) => (
                <Card key={claim.id}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{claim.title}</CardTitle>
                    <CardDescription>{claim.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 flex justify-between">
                    <Badge variant={claim.status === "completed" ? "secondary" : "outline"}>
                      {claim.status === "pending" ? "Pendente" : "Concluída"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Ver detalhes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
