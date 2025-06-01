import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  FileText, 
  Home, 
  Calendar, 
  ShieldCheck, 
  Ruler, 
  MapPin,
  Download,
  Eye,
  Star,
  Clock,
  CheckCircle
} from "lucide-react";

// Mock data with enhanced information
const property = {
  id: "1",
  name: "Edifício Aurora",
  unit: "204",
  address: "Rua das Flores, 1500, Centro",
  city: "São Paulo",
  state: "SP", 
  size: "72m²",
  bedrooms: 2,
  bathrooms: 2,
  deliveryDate: "15/04/2025",
  warrantyExpiration: "15/04/2030",
  status: "delivered",
  rating: 4.8,
  completionPercentage: 100,
  documents: [
    { 
      id: "1", 
      title: "Manual do Proprietário", 
      type: "manual",
      size: "2.4 MB",
      lastModified: "20/05/2025",
      isNew: true
    },
    { 
      id: "2", 
      title: "Termo de Garantia", 
      type: "warranty",
      size: "1.8 MB", 
      lastModified: "15/04/2025",
      isNew: false
    },
    { 
      id: "3", 
      title: "Planta Baixa", 
      type: "blueprint",
      size: "5.2 MB",
      lastModified: "10/04/2025", 
      isNew: false
    },
    { 
      id: "4", 
      title: "Contrato de Compra", 
      type: "contract",
      size: "3.1 MB",
      lastModified: "01/03/2024",
      isNew: false
    }
  ]
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    delivered: { label: "Entregue", variant: "default" as const, color: "bg-green-500" },
    progress: { label: "Em Andamento", variant: "secondary" as const, color: "bg-blue-500" },
    pending: { label: "Pendente", variant: "outline" as const, color: "bg-yellow-500" }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
      {config.label}
    </Badge>
  );
};

const DocumentCard = ({ doc }: { doc: any }) => {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "manual": return "📋";
      case "warranty": return "🛡️";
      case "blueprint": return "📐";
      case "contract": return "📄";
      default: return "📁";
    }
  };

  const getDocumentColor = (type: string) => {
    switch (type) {
      case "manual": return "from-blue-500/10 to-blue-600/10 border-blue-200";
      case "warranty": return "from-green-500/10 to-green-600/10 border-green-200";
      case "blueprint": return "from-purple-500/10 to-purple-600/10 border-purple-200";
      case "contract": return "from-orange-500/10 to-orange-600/10 border-orange-200";
      default: return "from-gray-500/10 to-gray-600/10 border-gray-200";
    }
  };

  return (
    <Card className={`border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${getDocumentColor(doc.type)}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getDocumentIcon(doc.type)}</div>
            <div>
              <h3 className="font-semibold text-sm flex items-center gap-2">
                {doc.title}
                {doc.isNew && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                    Novo
                  </Badge>
                )}
              </h3>
              <p className="text-xs text-muted-foreground">
                {doc.size} • Atualizado em {doc.lastModified}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <Eye size={14} />
            Ver
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <Download size={14} />
            Baixar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ClientProperties = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
            <Building className="h-8 w-8 text-primary" />
          </div>
          Meu Imóvel
        </h1>
        <p className="text-muted-foreground">
          Informações completas e documentos do seu imóvel
        </p>
      </div>

      {/* Property hero card */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Property image/visual */}
            <div className="lg:w-1/3 h-64 lg:h-auto bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <Building className="h-24 w-24 text-white/80" />
              <div className="absolute top-4 right-4">
                <StatusBadge status={property.status} />
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{property.rating}</span>
                </div>
                <p className="text-xs opacity-90">Avaliação do imóvel</p>
              </div>
            </div>
            
            {/* Property details */}
            <div className="flex-1 p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2">{property.name}</h2>
                  <p className="text-xl text-muted-foreground mb-3">Unidade {property.unit}</p>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin size={16} />
                    <span>{property.address}, {property.city}-{property.state}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle size={16} className="text-green-500" />
                      <span>Entregue em {property.deliveryDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} className="text-blue-500" />
                      <span>Garantia até {property.warrantyExpiration}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 text-center border">
                    <div className="text-muted-foreground text-sm mb-1">Área</div>
                    <div className="text-2xl font-bold text-primary">{property.size}</div>
                  </div>
                  <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 text-center border">
                    <div className="text-muted-foreground text-sm mb-1">Quartos</div>
                    <div className="text-2xl font-bold text-primary">{property.bedrooms}</div>
                  </div>
                  <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 text-center border">
                    <div className="text-muted-foreground text-sm mb-1">Banheiros</div>
                    <div className="text-2xl font-bold text-primary">{property.bathrooms}</div>
                  </div>
                  <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 text-center border">
                    <div className="text-muted-foreground text-sm mb-1">Status</div>
                    <div className="text-xl font-bold text-green-600">100%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for property information */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-muted/50">
          <TabsTrigger value="overview" className="gap-2">
            <Home size={16} />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText size={16} />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="warranty" className="gap-2">
            <ShieldCheck size={16} />
            Garantias
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* ... keep existing code (overview tab content) */}
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentos do Imóvel
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Acesse todos os documentos relacionados ao seu imóvel
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10">
                  {property.documents.length} documentos
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.documents.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="warranty" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Garantias do Imóvel
              </CardTitle>
              <CardDescription>
                Informações sobre as garantias aplicáveis ao seu imóvel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium">Períodos de Garantia</h3>
                <div className="mt-4 border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-3 px-4 text-left">Item</th>
                        <th className="py-3 px-4 text-left">Período</th>
                        <th className="py-3 px-4 text-left">Validade até</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-3 px-4">Fundação e estrutura</td>
                        <td className="py-3 px-4">5 anos</td>
                        <td className="py-3 px-4">{property.warrantyExpiration}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Impermeabilização</td>
                        <td className="py-3 px-4">3 anos</td>
                        <td className="py-3 px-4">15/04/2028</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Instalações hidráulicas</td>
                        <td className="py-3 px-4">2 anos</td>
                        <td className="py-3 px-4">15/04/2027</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Instalações elétricas</td>
                        <td className="py-3 px-4">2 anos</td>
                        <td className="py-3 px-4">15/04/2027</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Revestimentos cerâmicos</td>
                        <td className="py-3 px-4">1 ano</td>
                        <td className="py-3 px-4">15/04/2026</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Fissuras</td>
                        <td className="py-3 px-4">1 ano</td>
                        <td className="py-3 px-4">15/04/2026</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Esquadrias</td>
                        <td className="py-3 px-4">1 ano</td>
                        <td className="py-3 px-4">15/04/2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium">Como Solicitar Garantia</h3>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                      <span>Acesse a aba "Garantias" no menu principal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                      <span>Clique em "Nova Solicitação" e preencha o formulário</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                      <span>Descreva o problema com detalhes e adicione fotos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                      <span>Nossa equipe analisará e entrará em contato</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mt-0.5">5</span>
                      <span>Acompanhe o status da solicitação pelo portal</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium">O que não é coberto</h3>
                  <ul className="mt-3 list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Desgaste natural dos materiais</li>
                    <li>Uso inadequado ou falta de manutenção</li>
                    <li>Modificações realizadas pelo proprietário</li>
                    <li>Danos causados por terceiros</li>
                    <li>Itens com garantia direta do fabricante</li>
                    <li>Danos causados por eventos da natureza</li>
                    <li>Uso comercial em unidades residenciais</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline">
                  Ver termo completo de garantia
                </Button>
                <Button>
                  Solicitar garantia
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientProperties;
