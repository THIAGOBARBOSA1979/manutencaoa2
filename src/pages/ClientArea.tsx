
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientHeader } from "@/components/ClientArea/ClientHeader";
import { ClientSearch } from "@/components/ClientArea/ClientSearch";
import { ClientTable } from "@/components/ClientArea/ClientTable";
import { ClientDetails } from "@/components/ClientArea/ClientDetails";
import { NewClientForm } from "@/components/ClientArea/NewClientForm";
import { GenerateCredentialsForm } from "@/components/ClientArea/GenerateCredentialsForm";
import { toast } from "@/components/ui/use-toast";

// Mock data improvements
const clients = [
  {
    id: "1",
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    phone: "(11) 97777-6666",
    status: "active",
    property: "Edifício Aurora",
    unit: "204",
    createdAt: new Date(2024, 2, 15),
    lastLogin: new Date(2024, 3, 10),
    documents: [
      { id: "1", title: "Contrato de Compra", uploadedAt: new Date(2024, 2, 15) },
      { id: "2", title: "Manual do Proprietário", uploadedAt: new Date(2024, 3, 10) }
    ],
    inspections: [
      { id: "1", title: "Vistoria de Pré-entrega", date: new Date(2025, 4, 15, 10, 0), status: "scheduled" }
    ],
    warrantyClaims: [
      { 
        id: "1", 
        title: "Infiltração no banheiro",
        description: "Identificada infiltração na parede do box do banheiro social.",
        createdAt: new Date(2025, 5, 5),
        status: "pending"
      }
    ]
  }
];

const ClientArea = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);
  const [isNewClientDialogOpen, setNewClientDialogOpen] = useState(false);
  const [isCredentialsDialogOpen, setCredentialsDialogOpen] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({ title: "Campo vazio", description: "Digite um termo para buscar", variant: "destructive" });
      return;
    }

    const foundClient = clients.find(client => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery)
    );

    if (foundClient) {
      setSelectedClient(foundClient);
      toast({ title: "Cliente encontrado", description: `${foundClient.name} encontrado com sucesso.` });
    } else {
      toast({ title: "Cliente não encontrado", description: "Nenhum cliente encontrado com os termos informados.", variant: "destructive" });
    }
  };

  const handleNewClientSubmit = (data: any) => {
    toast({
      title: "Cliente cadastrado",
      description: "O cliente foi cadastrado com sucesso."
    });
    setNewClientDialogOpen(false);
  };

  const handleCredentialsSubmit = (data: any) => {
    toast({
      title: "Credenciais geradas",
      description: "As credenciais de acesso foram geradas e enviadas ao cliente."
    });
    setCredentialsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <ClientHeader 
        onNewClient={() => setNewClientDialogOpen(true)}
        onGenerateCredentials={() => setCredentialsDialogOpen(true)}
      />

      <ClientSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onNewClient={() => setNewClientDialogOpen(true)}
      />

      <ClientTable 
        clients={clients}
        onSelectClient={setSelectedClient}
      />

      {selectedClient && (
        <ClientDetails 
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}

      {/* Dialogs */}
      <Dialog open={isNewClientDialogOpen} onOpenChange={setNewClientDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para cadastrar um novo cliente.
            </DialogDescription>
          </DialogHeader>
          <NewClientForm 
            onSubmit={handleNewClientSubmit} 
            onCancel={() => setNewClientDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCredentialsDialogOpen} onOpenChange={setCredentialsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Gerar Credenciais de Acesso</DialogTitle>
            <DialogDescription>
              Configure as credenciais de acesso para o cliente.
            </DialogDescription>
          </DialogHeader>
          <GenerateCredentialsForm 
            onSubmit={handleCredentialsSubmit}
            onCancel={() => setCredentialsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientArea;
