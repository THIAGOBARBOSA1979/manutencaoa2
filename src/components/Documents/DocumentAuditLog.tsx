
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Shield, Search, Download, Filter, Calendar,
  Eye, Edit, Trash2, Share, Archive, Plus
} from "lucide-react";
import { documentPermissionService, AuditLog } from "@/services/DocumentPermissionService";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DocumentAuditLogProps {
  documentId?: string;
  userId?: string;
  showFilters?: boolean;
}

export function DocumentAuditLog({ 
  documentId, 
  userId, 
  showFilters = true 
}: DocumentAuditLogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Obter logs baseado nos filtros
  const getLogs = (): AuditLog[] => {
    let logs: AuditLog[] = [];
    
    if (documentId) {
      logs = documentPermissionService.getDocumentAuditLogs(documentId);
    } else if (userId) {
      logs = documentPermissionService.getUserAuditLogs(userId);
    } else {
      // Retornar todos os logs (apenas para admin)
      logs = [];
    }

    // Aplicar filtros
    return logs.filter(log => {
      const matchesSearch = !searchTerm || 
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      
      const matchesDate = dateFilter === "all" || (() => {
        const now = new Date();
        const logDate = log.timestamp;
        
        switch (dateFilter) {
          case "today":
            return logDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return logDate >= weekAgo;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return logDate >= monthAgo;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesAction && matchesDate;
    });
  };

  const getActionIcon = (action: AuditLog['action']) => {
    const icons = {
      create: <Plus className="h-4 w-4" />,
      view: <Eye className="h-4 w-4" />,
      download: <Download className="h-4 w-4" />,
      edit: <Edit className="h-4 w-4" />,
      delete: <Trash2 className="h-4 w-4" />,
      approve: <Shield className="h-4 w-4" />,
      archive: <Archive className="h-4 w-4" />,
      share: <Share className="h-4 w-4" />
    };
    return icons[action] || <Eye className="h-4 w-4" />;
  };

  const getActionColor = (action: AuditLog['action']) => {
    const colors = {
      create: "bg-green-100 text-green-800",
      view: "bg-blue-100 text-blue-800",
      download: "bg-purple-100 text-purple-800",
      edit: "bg-yellow-100 text-yellow-800",
      delete: "bg-red-100 text-red-800",
      approve: "bg-emerald-100 text-emerald-800",
      archive: "bg-gray-100 text-gray-800",
      share: "bg-indigo-100 text-indigo-800"
    };
    return colors[action] || "bg-gray-100 text-gray-800";
  };

  const getActionLabel = (action: AuditLog['action']) => {
    const labels = {
      create: "Criação",
      view: "Visualização", 
      download: "Download",
      edit: "Edição",
      delete: "Exclusão",
      approve: "Aprovação",
      archive: "Arquivamento",
      share: "Compartilhamento"
    };
    return labels[action] || action;
  };

  const exportLogs = () => {
    const logs = getLogs();
    const csvContent = [
      ["Data/Hora", "Ação", "Usuário", "Documento", "Detalhes", "IP"],
      ...logs.map(log => [
        log.timestamp.toLocaleString(),
        getActionLabel(log.action),
        log.userId,
        log.documentId,
        log.details,
        log.ipAddress || "N/A"
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const logs = getLogs();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Log de Auditoria
            </CardTitle>
            <CardDescription>
              {documentId ? 'Histórico de ações neste documento' : 
               userId ? 'Histórico de ações do usuário' : 
               'Registro completo de atividades'}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showFilters && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar nos logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ações</SelectItem>
                <SelectItem value="create">Criação</SelectItem>
                <SelectItem value="view">Visualização</SelectItem>
                <SelectItem value="download">Download</SelectItem>
                <SelectItem value="edit">Edição</SelectItem>
                <SelectItem value="delete">Exclusão</SelectItem>
                <SelectItem value="approve">Aprovação</SelectItem>
                <SelectItem value="archive">Arquivamento</SelectItem>
                <SelectItem value="share">Compartilhamento</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Usuário</TableHead>
                {!documentId && <TableHead>Documento</TableHead>}
                <TableHead>Detalhes</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{log.timestamp.toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {log.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getActionColor(log.action)}>
                        <div className="flex items-center gap-1">
                          {getActionIcon(log.action)}
                          {getActionLabel(log.action)}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.userId}</TableCell>
                    {!documentId && (
                      <TableCell className="font-mono text-sm">
                        {log.documentId}
                      </TableCell>
                    )}
                    <TableCell className="max-w-xs truncate">
                      {log.details}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {log.ipAddress || "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={documentId ? 5 : 6} 
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {logs.length > 0 && (
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{logs.length} registro(s) encontrado(s)</span>
            <span>
              Último registro: {formatDistanceToNow(logs[0]?.timestamp || new Date(), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
