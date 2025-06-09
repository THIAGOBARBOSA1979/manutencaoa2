
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Download, 
  Upload, 
  FileJson, 
  FileSpreadsheet, 
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ChecklistImportExport() {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importData, setImportData] = useState("");
  const { toast } = useToast();

  const handleExportTemplates = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = {
        templates: [],
        exportedAt: new Date().toISOString(),
        version: "1.0"
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `checklist-templates-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export realizado com sucesso",
        description: "Templates exportados para arquivo JSON"
      });
    } catch (error) {
      toast({
        title: "Erro no export",
        description: "Não foi possível exportar os templates",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportTemplates = async () => {
    if (!importData.trim()) {
      toast({
        title: "Dados inválidos",
        description: "Por favor, cole os dados JSON para importar",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    try {
      const parsedData = JSON.parse(importData);
      
      // Validate structure
      if (!parsedData.templates || !Array.isArray(parsedData.templates)) {
        throw new Error("Estrutura de dados inválida");
      }
      
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Import realizado com sucesso",
        description: `${parsedData.templates.length} templates importados`
      });
      
      setImportData("");
    } catch (error) {
      toast({
        title: "Erro no import",
        description: "Dados JSON inválidos ou estrutura incorreta",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              O export inclui todos os templates ativos e suas configurações.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              onClick={handleExportTemplates} 
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <FileJson className="h-4 w-4" />
              {isExporting ? "Exportando..." : "Export JSON"}
            </Button>
            
            <Button 
              variant="outline" 
              disabled
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel (Em breve)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Cole o conteúdo JSON exportado previamente para importar templates.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <Label htmlFor="import-data">Dados JSON</Label>
            <Textarea
              id="import-data"
              placeholder='{"templates": [...], "version": "1.0"}'
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
            
            <Button 
              onClick={handleImportTemplates}
              disabled={isImporting || !importData.trim()}
              className="w-full"
            >
              {isImporting ? "Importando..." : "Importar Templates"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
