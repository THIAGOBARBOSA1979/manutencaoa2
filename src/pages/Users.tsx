import { useState } from "react";
import { Users as UsersIcon, Plus, User, Mail, Phone, UserCheck, UserCog, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserForm } from "@/components/Users/UserForm";
import { UserFilters } from "@/components/Users/UserFilters";

// Mock data
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
  },
  {
    id: "6",
    name: "Luciana Santos",
    email: "luciana.santos@email.com",
    phone: "(11) 98888-7777",
    role: "manager",
    status: "active",
    property: null,
    unit: null,
  },
];

// Role configuration
const roleConfig = {
  admin: {
    label: "Administrador",
    badge: "bg-purple-100 text-purple-800",
    icon: UserCog,
  },
  manager: {
    label: "Gerente",
    badge: "bg-blue-100 text-blue-800",
    icon: UserCheck,
  },
  technical: {
    label: "Técnico",
    badge: "bg-green-100 text-green-800",
    icon: UserCheck,
  },
  client: {
    label: "Cliente",
    badge: "bg-gray-100 text-gray-800",
    icon: User,
  },
};

const Users = () => {
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
    property: "all",
  });
  const [userList, setUserList] = useState(users);

  // Filter users based on active filters
  const filteredUsers = userList.filter(user => {
    const matchesSearch = !filters.search || 
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.phone.includes(filters.search);
    
    const matchesRole = filters.role === "all" || user.role === filters.role;
    const matchesStatus = filters.status === "all" || user.status === filters.status;
    const matchesProperty = filters.property === "all" || 
      (user.property && user.property.toLowerCase().includes(filters.property));

    return matchesSearch && matchesRole && matchesStatus && matchesProperty;
  });

  const handleSaveUser = (userData: any) => {
    if (editingUser) {
      setUserList(users => users.map(user => 
        user.id === editingUser.id ? { ...user, ...userData } : user
      ));
      setEditingUser(null);
    } else {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        status: "active",
      };
      setUserList(users => [...users, newUser]);
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsUserFormOpen(true);
  };

  const renderUserCard = (user: any) => {
    const RoleIcon = roleConfig[user.role as keyof typeof roleConfig]?.icon || User;
    return (
      <Card key={user.id}>
        <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600">
              <RoleIcon size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">{user.name}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail size={14} />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone size={14} />
                  <span>{user.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Badge className={roleConfig[user.role as keyof typeof roleConfig]?.badge}>
                  {roleConfig[user.role as keyof typeof roleConfig]?.label}
                </Badge>
                {user.status === "inactive" && (
                  <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                    <UserMinus className="mr-1 h-3 w-3" />
                    Inativo
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div>
            {user.role === "client" && user.property && (
              <div className="text-sm text-muted-foreground mb-2">
                <span className="font-medium">{user.property}</span> - Unidade {user.unit}
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Ver perfil</Button>
              <Button variant="default" size="sm" onClick={() => handleEditUser(user)}>
                Editar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <UsersIcon />
            Usuários
          </h1>
          <p className="text-muted-foreground">
            Gerenciamento completo de usuários do sistema
          </p>
        </div>
        <Button onClick={() => setIsUserFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Filters */}
      <UserFilters 
        onFilterChange={setFilters}
        totalUsers={filteredUsers.length}
        activeFilters={filters}
      />

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="admin">
            Administradores ({filteredUsers.filter(u => u.role === "admin" || u.role === "manager").length})
          </TabsTrigger>
          <TabsTrigger value="staff">
            Funcionários ({filteredUsers.filter(u => u.role === "technical").length})
          </TabsTrigger>
          <TabsTrigger value="clients">
            Clientes ({filteredUsers.filter(u => u.role === "client").length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 pt-4">
          <div className="space-y-4">
            {filteredUsers.map(renderUserCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="admin" className="space-y-4 pt-4">
          <div className="space-y-4">
            {filteredUsers
              .filter(user => user.role === "admin" || user.role === "manager")
              .map(renderUserCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="staff" className="space-y-4 pt-4">
          <div className="space-y-4">
            {filteredUsers
              .filter(user => user.role === "technical")
              .map(renderUserCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-4 pt-4">
          <div className="space-y-4">
            {filteredUsers
              .filter(user => user.role === "client")
              .map(renderUserCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* User Form Modal */}
      <UserForm
        isOpen={isUserFormOpen}
        onClose={() => {
          setIsUserFormOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />
    </div>
  );
};

export default Users;
