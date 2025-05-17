
import { User, Home, ClipboardCheck, ShieldCheck, Mail, Phone, ArrowRight, FileText, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for a client
const client = {
  id: "1",
  name: "Maria Oliveira",
  email: "maria.oliveira@email.com",
  phone: "(11) 97777-6666",
  status: "active",
  property: "Edifício Aurora",
  unit: "204",
  documents: [
    {
      id: "1",
      title: "Contrato de Compra",
      uploadedAt: new Date(2024, 2, 15),
      type: "contract",
    },
    {
      id: "2",
      title: "Manual do Proprietário",
      uploadedAt: new Date(2024, 3, 10),
      type: "manual",
    },
    {
      id: "3",
      title: "Termo de Garantia",
      uploadedAt: new Date(2024, 3, 10),
      type: "warranty",
    },
    {
      id: "4",
      title: "Planta Baixa",
      uploadedAt: new Date(2024, 3, 10),
      type: "blueprint",
    }
  ],
  inspections: [
    {
      id: "1",
      title: "Vistoria de Pré-entrega",
      date: new Date(2025, 4, 15, 10, 0),
      status: "scheduled",
    },
    {
      id: "2",
      title: "Entrega de Chaves",
      date: new Date(2025, 4, 20, 14, 30),
      status: "scheduled",
    }
  ],
  warrantyClaims: [
    {
      id: "1",
      title: "Infiltração no banheiro",
      description: "Identificada infiltração na parede do box do banheiro social.",
      createdAt: new Date(2025, 5, 5),
      status: "pending",
    }
  ]
};

const ClientArea = () => {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <User />
            Área do Cliente
          </h1>
          <p className="text-muted-foreground">
            Gestão de clientes e acesso à área do cliente
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Gerar Credenciais
          </Button>
          <Button>
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Search client */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Buscar cliente</CardTitle>
          <CardDescription>
            Digite o email, nome ou CPF do cliente para buscar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Input 
              placeholder="Email, nome ou CPF do cliente" 
              className="flex-1"
            />
            <Button>Buscar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Client details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium">{client.name}</h3>
              <div className="flex flex-col mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span>{client.property} - Unidade {client.unit}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Cliente Ativo</Badge>
              </div>
              <Button className="mt-4 self-end" variant="outline">
                Acessar como Cliente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client data tabs */}
      <Tabs defaultValue="documents" className="mt-6">
        <TabsList>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="inspections">Vistorias</TabsTrigger>
          <TabsTrigger value="warranty">Garantias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {client.documents.map((document) => (
              <Card key={document.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {document.title}
                  </CardTitle>
                  <CardDescription>
                    Adicionado em {format(document.uploadedAt, "dd/MM/yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Visualizar documento
                  </Button>
                </CardFooter>
              </Card>
            ))}
            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Adicionar documento
                </CardTitle>
                <CardDescription>
                  Envie um novo documento para o cliente
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Enviar documento
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="inspections" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.inspections.map((inspection) => (
              <Card key={inspection.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4" />
                    {inspection.title}
                  </CardTitle>
                  <CardDescription>
                    Agendada para {format(inspection.date, "dd/MM/yyyy 'às' HH:mm")}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Badge variant={inspection.status === "completed" ? "secondary" : "outline"}>
                    {inspection.status === "scheduled" ? "Agendada" : "Concluída"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Ver detalhes
                  </Button>
                </CardFooter>
              </Card>
            ))}
            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Agendar vistoria
                </CardTitle>
                <CardDescription>
                  Agende uma nova vistoria para o cliente
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Agendar vistoria
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="warranty" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.warrantyClaims.map((claim) => (
              <Card key={claim.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    {claim.title}
                  </CardTitle>
                  <CardDescription>
                    Aberta em {format(claim.createdAt, "dd/MM/yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-0">
                  <p className="text-sm text-muted-foreground">
                    {claim.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Badge variant={claim.status === "completed" ? "secondary" : "outline"}>
                    {claim.status === "pending" ? "Pendente" : "Concluída"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Ver detalhes
                  </Button>
                </CardFooter>
              </Card>
            ))}
            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Registrar chamado
                </CardTitle>
                <CardDescription>
                  Registre um novo chamado de garantia
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Registrar chamado
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Additional tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-4 w-4" />
              Credenciais de Acesso
            </CardTitle>
            <CardDescription>
              Gerencie o acesso do cliente à área do cliente
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Gerenciar Credenciais
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Comunicação
            </CardTitle>
            <CardDescription>
              Envie emails e notificações para o cliente
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Enviar Mensagem
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Histórico
            </CardTitle>
            <CardDescription>
              Visualize o histórico completo de interações
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Ver Histórico
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ClientArea;
