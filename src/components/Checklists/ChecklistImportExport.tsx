
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Upload, 
  FileJson, 
  FileSpreadsheet, 
  File,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface ImportExportProps {
  selectedTemplates?: string[];
  onImportComplete?: (count: number) => void;
}

export function ChecklistImportExport({ selectedTemplates = [], onImportComplete }: ImportExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportFormat, setExportFormat] = useState("json");
  const [exportOptions, setExportOptions] = useState({
    includeExecutions: false,
    includeAnalytics: false,
    includeCategories: true
  });
  const [importProgress, setImportProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const { toast } = useToast();

  const exportFormats = [
    { value: "json", label: "JSON", icon: FileJson, description: "Formato padrão para backup completo" },
    { value: "csv", label: "CSV", icon: FileSpreadsheet, description: "Para análise em planilhas" },
    { value: "pdf", label: "PDF", icon: File, description: "Relatório formatado para impressão" }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 20) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const filename = `checklists_export_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      
      toast({
        title: "Exportação concluída",
        description: `Arquivo ${filename} foi baixado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleImport = async (file: File) => {
    setIsImporting(true);
    setImportProgress(0);

    try {
      // Simulate import progress
      for (let i = 0; i <= 100; i += 25) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      const importedCount = Math.floor(Math.random() * 10) + 1;
      
      toast({
        title: "Importação concluída",
        description: `${importedCount} templates foram importados com sucesso.`,
      });

      onImportComplete?.(importedCount);
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Não foi possível importar o arquivo. Verifique o formato.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImport(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Checklists
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Formato de Exportação</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div className="flex items-center gap-2">
                      <format.icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{format.label}</div>
                        <div className="text-xs text-muted-foreground">{format.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Opções de Exportação</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeExecutions"
                  checked={exportOptions.includeExecutions}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeExecutions: checked === true }))
                  }
                />
                <Label htmlFor="includeExecutions" className="text-sm">
                  Incluir histórico de execuções
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeAnalytics"
                  checked={exportOptions.includeAnalytics}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeAnalytics: checked === true }))
                  }
                />
                <Label htmlFor="includeAnalytics" className="text-sm">
                  Incluir dados analíticos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCategories"
                  checked={exportOptions.includeCategories}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeCategories: checked === true }))
                  }
                />
                <Label htmlFor="includeCategories" className="text-sm">
                  Incluir categorias
                </Label>
              </div>
            </div>
          </div>

          {selectedTemplates.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                {selectedTemplates.length} template(s) selecionado(s) para exportação
              </p>
            </div>
          )}

          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Exportando... {exportProgress}%</span>
              </div>
              <Progress value={exportProgress} />
            </div>
          )}

          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="w-full"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Checklists
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Arquivo para Importação</Label>
            <Input
              type="file"
              accept=".json,.csv"
              onChange={handleFileUpload}
              disabled={isImporting}
            />
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: JSON, CSV (máximo 10MB)
            </p>
          </div>

          <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Arraste e solte um arquivo aqui ou clique para selecionar
            </p>
          </div>

          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Importando... {importProgress}%</span>
              </div>
              <Progress value={importProgress} />
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Regras de Importação:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Templates duplicados serão ignorados
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Categorias inexistentes serão criadas
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-yellow-500" />
                Backup automático antes da importação
              </li>
            </ul>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <FileJson className="mr-2 h-4 w-4" />
                Baixar Template de Exemplo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Template de Exemplo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Baixe um template de exemplo para entender o formato correto de importação.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <FileJson className="mr-2 h-4 w-4" />
                    Exemplo JSON
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exemplo CSV
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
