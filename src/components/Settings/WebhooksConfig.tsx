
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Save, Check, X, AlertTriangle, Webhook } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Event types for webhooks
const eventTypes = [
  { id: "property_created", name: "Criação de novo empreendimento" },
  { id: "warranty_created", name: "Nova solicitação de garantia registrada" },
  { id: "client_created", name: "Novo cliente cadastrado" },
  { id: "inspection_scheduled", name: "Vistoria agendada" },
  { id: "inspection_completed", name: "Vistoria concluída" },
  { id: "warranty_status_updated", name: "Atualização de status de garantia" },
  { id: "warranty_in_progress", name: "Garantia em atendimento" },
  { id: "warranty_completed", name: "Garantia concluída" },
];

// HTTP Methods
const httpMethods = ["POST", "PUT"];

// Mock webhooks data
const initialWebhooks = [
  {
    id: "1",
    name: "Notificação de nova garantia",
    eventType: "warranty_created",
    url: "https://api.example.com/webhooks/warranty",
    method: "POST",
    headers: '{"Authorization": "Bearer {token}"}',
    bodyTemplate: '{"event": "{event}", "data": "{data}"}',
    active: true,
    retryCount: 3,
  },
  {
    id: "2",
    name: "Atualização de sistema externo",
    eventType: "warranty_status_updated",
    url: "https://external-system.com/api/update",
    method: "PUT",
    headers: '{"Authorization": "Bearer {token}", "Content-Type": "application/json"}',
    bodyTemplate: '{"status": "{status}", "id": "{id}", "timestamp": "{timestamp}"}',
    active: true,
    retryCount: 5,
  },
];

const WebhooksConfig = () => {
  const [webhooks, setWebhooks] = useState(initialWebhooks);
  const [newWebhook, setNewWebhook] = useState({
    id: "",
    name: "",
    eventType: "",
    url: "",
    method: "POST",
    headers: '{"Authorization": "Bearer {token}"}',
    bodyTemplate: '{"event": "{event}", "data": "{data}"}',
    active: true,
    retryCount: 3,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTestResultOpen, setIsTestResultOpen] = useState(false);
  const [testResult, setTestResult] = useState({ success: false, message: "" });
  const { toast } = useToast();

  // Handle input change for new webhook
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewWebhook((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select change for new webhook
  const handleSelectChange = (name: string, value: string) => {
    setNewWebhook((prev) => ({ ...prev, [name]: value }));
  };

  // Handle switch change for new webhook
  const handleSwitchChange = (checked: boolean) => {
    setNewWebhook((prev) => ({ ...prev, active: checked }));
  };

  // Handle retry count change
  const handleRetryCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setNewWebhook((prev) => ({ ...prev, retryCount: value }));
    }
  };

  // Save new webhook
  const handleSaveWebhook = () => {
    if (!newWebhook.name || !newWebhook.eventType || !newWebhook.url) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate JSON format for headers and bodyTemplate
      JSON.parse(newWebhook.headers);
      JSON.parse(newWebhook.bodyTemplate);

      const webhookToSave = {
        ...newWebhook,
        id: newWebhook.id || Date.now().toString(),
      };

      if (newWebhook.id) {
        // Update existing webhook
        setWebhooks((prev) =>
          prev.map((wh) => (wh.id === newWebhook.id ? webhookToSave : wh))
        );
        toast({
          title: "Webhook atualizado",
          description: "O webhook foi atualizado com sucesso",
        });
      } else {
        // Add new webhook
        setWebhooks((prev) => [...prev, webhookToSave]);
        toast({
          title: "Webhook criado",
          description: "O novo webhook foi criado com sucesso",
        });
      }

      // Reset form and close dialog
      setNewWebhook({
        id: "",
        name: "",
        eventType: "",
        url: "",
        method: "POST",
        headers: '{"Authorization": "Bearer {token}"}',
        bodyTemplate: '{"event": "{event}", "data": "{data}"}',
        active: true,
        retryCount: 3,
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Formato inválido",
        description: "Os campos Headers e Template do Corpo devem estar em formato JSON válido",
        variant: "destructive",
      });
    }
  };

  // Edit webhook
  const handleEditWebhook = (webhook: typeof newWebhook) => {
    setNewWebhook(webhook);
    setIsDialogOpen(true);
  };

  // Delete webhook
  const handleDeleteWebhook = (id: string) => {
    setWebhooks((prev) => prev.filter((wh) => wh.id !== id));
    toast({
      title: "Webhook removido",
      description: "O webhook foi removido com sucesso",
    });
  };

  // Toggle webhook active status
  const handleToggleActive = (id: string) => {
    setWebhooks((prev) =>
      prev.map((wh) =>
        wh.id === id ? { ...wh, active: !wh.active } : wh
      )
    );
  };

  // Test webhook
  const handleTestWebhook = (webhook: typeof newWebhook) => {
    // Simulate webhook test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% chance of success for demo
      setTestResult({
        success,
        message: success
          ? "Webhook testado com sucesso. Resposta: 200 OK"
          : "Erro ao testar webhook. Resposta: 404 Not Found",
      });
      setIsTestResultOpen(true);
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          Configuração de Webhooks
        </CardTitle>
        <CardDescription>
          Configure integrações via webhooks para diversos eventos do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6">
          <h3 className="text-lg font-medium">Webhooks Configurados</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {newWebhook.id ? "Editar Webhook" : "Novo Webhook"}
                </DialogTitle>
                <DialogDescription>
                  {newWebhook.id
                    ? "Edite as configurações do webhook conforme necessário."
                    : "Configure um novo webhook para integração com sistemas externos."}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newWebhook.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Nome descritivo do webhook"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="eventType" className="text-right">
                    Evento
                  </Label>
                  <Select
                    value={newWebhook.eventType}
                    onValueChange={(value) => handleSelectChange("eventType", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione um evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    URL do Endpoint
                  </Label>
                  <Input
                    id="url"
                    name="url"
                    value={newWebhook.url}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="https://exemplo.com/webhook"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="method" className="text-right">
                    Método HTTP
                  </Label>
                  <Select
                    value={newWebhook.method}
                    onValueChange={(value) => handleSelectChange("method", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {httpMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="headers" className="text-right pt-2">
                    Headers (JSON)
                  </Label>
                  <Textarea
                    id="headers"
                    name="headers"
                    value={newWebhook.headers}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="bodyTemplate" className="text-right pt-2">
                    Template do Corpo (JSON)
                  </Label>
                  <Textarea
                    id="bodyTemplate"
                    name="bodyTemplate"
                    value={newWebhook.bodyTemplate}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="retryCount" className="text-right">
                    Tentativas de Retry
                  </Label>
                  <Input
                    id="retryCount"
                    name="retryCount"
                    type="number"
                    min={0}
                    max={10}
                    value={newWebhook.retryCount}
                    onChange={handleRetryCountChange}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="active" className="text-right">
                    Ativo
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="active"
                      checked={newWebhook.active}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="active">
                      {newWebhook.active ? "Sim" : "Não"}
                    </Label>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleTestWebhook(newWebhook)}
                  >
                    Testar Webhook
                  </Button>
                  <Button type="button" onClick={handleSaveWebhook}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Test Result Dialog */}
          <Dialog open={isTestResultOpen} onOpenChange={setIsTestResultOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Resultado do Teste</DialogTitle>
              </DialogHeader>
              <div className="py-6">
                <div
                  className={`flex items-center gap-2 p-4 rounded-md ${
                    testResult.success ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  {testResult.success ? (
                    <Check className="h-6 w-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  )}
                  <p className="text-sm">{testResult.message}</p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => setIsTestResultOpen(false)}
                >
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {webhooks.length > 0 ? (
            webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="flex justify-between items-center p-4 border rounded-md"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{webhook.name}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        webhook.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {webhook.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {eventTypes.find((e) => e.id === webhook.eventType)?.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate max-w-md">
                    {webhook.url}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(webhook.id)}
                  >
                    {webhook.active ? "Desativar" : "Ativar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTestWebhook(webhook)}
                  >
                    Testar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditWebhook(webhook)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteWebhook(webhook.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground">
                Nenhum webhook configurado. Clique em "Novo Webhook" para adicionar.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhooksConfig;
