
import { useState } from "react";
import { Users as UsersIcon, Plus, Eye, Edit, Trash2, UserCheck, UserX, Mail, Phone } from "lucide-react";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminFilters } from "@/components/Admin/AdminFilters";
import { AdminTable } from "@/components/Admin/AdminTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// Enhanced mock data
const users = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-8888",
    role: "admin",
    status: "active",
    property: "Edifício Aurora",
    unit: "507",
    lastLogin: "2024-01-15",
    avatar: "JS",
    createdAt: new Date(2024, 0, 10)
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    phone: "(11) 97777-6666",
    role: "client",
    status: "active",
    property: "Edifício Aurora",
    unit: "204",
    lastLogin: "2024-01-14",
    avatar: "MO",
    createdAt: new Date(2024, 0, 15)
  },
  {
    id: "3",
    name: "Roberto Pereira",
    email: "roberto.pereira@email.com",
    phone: "(11) 95555-4444",
    role: "client",
    status: "active",
    property: "Residencial Bosque Verde",
    unit: "102",
    lastLogin: "2024-01-13",
    avatar: "RP",
    createdAt: new Date(2024, 1, 5)
  },
  {
    id: "4",
    name: "Juliana Costa",
    email: "juliana.costa@email.com",
    phone: "(11) 93333-2222",
    role: "technical",
    status: "active",
    property: null,
    unit: null,
    lastLogin: "2024-01-15",
    avatar: "JC",
    createdAt: new Date(2024, 0, 20)
  },
  {
    id: "5",
    name: "Fernando Martins",
    email: "fernando.martins@email.com",
    phone: "(11) 91111-0000",
    role: "client",
    status: "inactive",
    property: "Residencial Bosque Verde",
    unit: "405",
    lastLogin: "2024-01-10",
    avatar: "FM",
    createdAt: new Date(2023, 11, 15)
  }
];

const Users = () => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");

  // Calculate stats
  const stats = [
    { label: "Total", value: users.length, color: "text-slate-700" },
    { label: "Ativos", value: users.filter(u => u.status === "active").length, color: "text-green-600" },
    { label: "Clientes", value: users.filter(u => u.role === "client").length, color: "text-blue-600" },
    { label: "Equipe", value: users.filter(u => u.role !== "client").length, color: "text-purple-600" }
  ];

  // Filter data
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchValue || 
      user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.phone.includes(searchValue);
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesProperty = propertyFilter === "all" || 
      (user.property && user.property.includes(propertyFilter));

    return matchesSearch && matchesRole && matchesStatus && matchesProperty;
  });

  const handleExport = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados serão enviados para seu e-mail.",
    });
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: "Administrador", className: "bg-purple-100 text-purple-800 border-purple-200" },
      manager: { label: "Gerente", className: "bg-blue-100 text-blue-800 border-blue-200" },
      technical: { label: "Técnico", className: "bg-green-100 text-green-800 border-green-200" },
      client: { label: "Cliente", className: "bg-gray-100 text-gray-800 border-gray-200" }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Ativo", className: "bg-green-100 text-green-800 border-green-200" },
      inactive: { label: "Inativo", className: "bg-red-100 text-red-800 border-red-200" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const columns = [
    {
      key: "user",
      label: "Usuário",
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {row.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-slate-900">{row.name}</div>
            <div className="text-sm text-slate-500 flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {row.email}
            </div>
          </div>
        </div>
      )
    },
    {
      key: "contact",
      label: "Contato",
      render: (_: any, row: any) => (
        <div>
          <div className="text-sm text-slate-600 flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {row.phone}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Último login: {row.lastLogin}
          </div>
        </div>
      )
    },
    {
      key: "role",
      label: "Função",
      render: (value: string) => getRoleBadge(value)
    },
    {
      key: "property",
      label: "Imóvel",
      render: (_: any, row: any) => (
        <div>
          {row.property ? (
            <>
              <div className="font-medium text-slate-700">{row.property}</div>
              <div className="text-sm text-slate-500">Unidade {row.unit}</div>
            </>
          ) : (
            <span className="text-slate-400">-</span>
          )}
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => getStatusBadge(value)
    }
  ];

  const actions = [
    {
      label: "Visualizar",
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: any) => console.log("View", row)
    },
    {
      label: "Editar",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: any) => console.log("Edit", row)
    },
    {
      label: "Ativar/Desativar",
      icon: <UserCheck className="h-4 w-4" />,
      onClick: (row: any) => {
        toast({
          title: "Status alterado",
          description: `Usuário ${row.status === "active" ? "desativado" : "ativado"} com sucesso.`,
        });
      }
    },
    {
      label: "Excluir",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: any) => console.log("Delete", row),
      variant: "destructive" as const,
      separator: true
    }
  ];

  const filters = [
    {
      key: "role",
      label: "Função",
      value: roleFilter,
      onChange: setRoleFilter,
      options: [
        { value: "all", label: "Todas as funções" },
        { value: "admin", label: "Administrador" },
        { value: "manager", label: "Gerente" },
        { value: "technical", label: "Técnico" },
        { value: "client", label: "Cliente" }
      ]
    },
    {
      key: "status",
      label: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "Todos os status" },
        { value: "active", label: "Ativo" },
        { value: "inactive", label: "Inativo" }
      ]
    },
    {
      key: "property",
      label: "Empreendimento",
      value: propertyFilter,
      onChange: setPropertyFilter,
      options: [
        { value: "all", label: "Todos os empreendimentos" },
        { value: "Edifício Aurora", label: "Edifício Aurora" },
        { value: "Residencial Bosque Verde", label: "Residencial Bosque Verde" },
        { value: "Condomínio Monte Azul", label: "Condomínio Monte Azul" }
      ]
    }
  ];

  const headerActions = (
    <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
      <Plus className="mr-2 h-4 w-4" />
      Novo Usuário
    </Button>
  );

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <AdminHeader
        title="Usuários"
        description="Gerenciamento completo de usuários do sistema"
        icon={<UsersIcon className="h-8 w-8 text-primary" />}
        actions={headerActions}
        stats={stats}
      />

      <AdminFilters
        searchPlaceholder="Buscar usuários por nome, email ou telefone..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        onExport={handleExport}
        resultCount={filteredUsers.length}
        activeFiltersCount={[roleFilter, statusFilter, propertyFilter].filter(f => f !== "all").length}
        onClearFilters={() => {
          setRoleFilter("all");
          setStatusFilter("all");
          setPropertyFilter("all");
          setSearchValue("");
        }}
      />

      <AdminTable
        columns={columns}
        data={filteredUsers}
        actions={actions}
        emptyState={{
          icon: <UsersIcon className="h-12 w-12 text-slate-400" />,
          title: "Nenhum usuário encontrado",
          description: "Não há usuários que correspondam aos filtros aplicados.",
          action: (
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar primeiro usuário
            </Button>
          )
        }}
      />
    </div>
  );
};

export default Users;
