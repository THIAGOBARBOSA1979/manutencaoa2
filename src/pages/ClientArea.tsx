
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientHeader } from "@/components/ClientArea/ClientHeader";
import { ClientSearch } from "@/components/ClientArea/ClientSearch";
import { ClientTable } from "@/components/ClientArea/ClientTable";
import { ClientDetails } from "@/components/ClientArea/ClientDetails";
import { NewClientForm } from "@/components/ClientArea/NewClientForm";
import { GenerateCredentialsForm } from "@/components/ClientArea/GenerateCredentialsForm";
import { toast } from "@/components/ui/use-toast";
import { clientAreaService, CreateClientData, GenerateCredentialsData } from "@/services/ClientAreaService";
import { clientAreaBusinessRules, ClientData, UserRole } from "@/services/ClientAreaBusinessRules";

const ClientArea = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [isNewClientDialogOpen, setNewClientDialogOpen] = useState(false);
  const [isCredentialsDialogOpen, setCredentialsDialogOpen] = useState(false);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Simulando usuário admin
  const currentUserId = "admin-001";
  const currentUserRole: UserRole = "admin";

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const userClients = clientAreaService.getClientsByUser(currentUserId, currentUserRole);
      setClients(userClients);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({ 
        title: "Campo vazio", 
        description: "Digite um termo para buscar", 
        variant: "destructive" 
      });
      return;
    }

    try {
      const result = await clientAreaService.searchClients(searchQuery, currentUserId, currentUserRole);
      
      if (result.success && result.clients) {
        if (result.clients.length > 0) {
          setClients(result.clients);
          toast({ 
            title: "Busca realizada", 
            description: `${result.clients.length} cliente(s) encontrado(s).` 
          });
        } else {
          toast({ 
            title: "Nenhum resultado", 
            description: "Nenhum cliente encontrado com os termos informados.", 
            variant: "destructive" 
          });
        }
      } else {
        toast({
          title: "Erro na busca",
          description: result.errors?.[0] || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleNewClientSubmit = async (data: CreateClientData) => {
    try {
      const result = await clientAreaService.createClient(data, currentUserId, currentUserRole);
      
      if (result.success) {
        toast({
          title: "Cliente cadastrado",
          description: "O cliente foi cadastrado com sucesso."
        });
        setNewClientDialogOpen(false);
        loadClients(); // Recarregar lista
      } else {
        toast({
          title: "Erro no cadastro",
          description: result.errors?.[0] || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleCredentialsSubmit = async (data: GenerateCredentialsData & { clientId?: string }) => {
    try {
      if (!data.clientId) {
        toast({
          title: "Erro",
          description: "Cliente deve ser selecionado para gerar credenciais.",
          variant: "destructive",
        });
        return;
      }

      const result = await clientAreaService.generateCredentials(
        data.clientId,
        data,
        currentUserId,
        currentUserRole
      );
      
      if (result.success) {
        toast({
          title: "Credenciais geradas",
          description: `Credenciais geradas com sucesso. ${data.sendByEmail ? 'Enviadas por email.' : ''}`
        });
        setCredentialsDialogOpen(false);
        loadClients(); // Recarregar lista
      } else {
        toast({
          title: "Erro na geração",
          description: result.errors?.[0] || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      const result = await clientAreaService.exportClients(currentUserId, currentUserRole);
      
      if (result.success) {
        toast({
          title: "Exportação concluída",
          description: `${result.data?.length} registros exportados com sucesso.`,
        });
        console.log("Dados exportados:", result.data);
      } else {
        toast({
          title: "Erro na exportação",
          description: result.errors?.[0] || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  // Verificar permissões do usuário
  const permissions = clientAreaBusinessRules.getClientPermissions(currentUserRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ClientHeader 
        onNewClient={() => setNewClientDialogOpen(true)}
        onGenerateCredentials={() => setCredentialsDialogOpen(true)}
        onExport={handleExport}
        canCreate={permissions.canCreate}
        canGenerateCredentials={permissions.canGenerateCredentials}
        canExport={permissions.canExport}
      />

      <ClientSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onNewClient={() => setNewClientDialogOpen(true)}
        canCreate={permissions.canCreate}
        canSearch={permissions.canView}
      />

      <ClientTable 
        clients={clients}
        onSelectClient={setSelectedClient}
        canView={permissions.canView}
        canViewSensitive={permissions.canViewSensitiveData}
      />

      {selectedClient && (
        <ClientDetails 
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          canEdit={permissions.canEdit}
          canViewSensitive={permissions.canViewSensitiveData}
        />
      )}

      {/* Dialogs */}
      {permissions.canCreate && (
        <Dialog open={isNewClientDialogOpen} onOpenChange={setNewClientDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para cadastrar um novo cliente no sistema.
              </DialogDescription>
            </DialogHeader>
            <NewClientForm 
              onSubmit={handleNewClientSubmit} 
              onCancel={() => setNewClientDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      )}

      {permissions.canGenerateCredentials && (
        <Dialog open={isCredentialsDialogOpen} onOpenChange={setCredentialsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Gerar Credenciais de Acesso</DialogTitle>
              <DialogDescription>
                Configure as credenciais de acesso para o cliente selecionado.
              </DialogDescription>
            </DialogHeader>
            <GenerateCredentialsForm 
              clients={clients.filter(c => !c.credentials)}
              onSubmit={handleCredentialsSubmit}
              onCancel={() => setCredentialsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClientArea;
