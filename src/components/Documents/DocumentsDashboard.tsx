
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Star, Clock, Archive, AlertTriangle, TrendingUp } from "lucide-react";
import { documentService } from "@/services/DocumentService";

export function DocumentsDashboard() {
  const stats = documentService.getDocumentStats();
  const expiringDocs = documentService.getExpiringDocuments();
  const favoriteDocs = documentService.getFavoriteDocuments();

  return (
    <div className="space-y-6">
      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Publicados</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favoritos</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.favorites}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vencendo</p>
                <p className="text-2xl font-bold text-red-600">{stats.expiring}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documentos por categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos por Categoria</CardTitle>
          <CardDescription>Distribuição dos documentos por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.byCategory.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{cat.category}</span>
                <Badge variant="secondary">{cat.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Documentos favoritos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Documentos Favoritos
            </CardTitle>
            <CardDescription>Seus documentos marcados como favoritos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {favoriteDocs.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium text-sm">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">{doc.downloads} downloads</p>
                  </div>
                  <Badge variant="outline">{doc.category}</Badge>
                </div>
              ))}
              {favoriteDocs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum documento favorito
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documentos vencendo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Documentos Vencendo
            </CardTitle>
            <CardDescription>Documentos que vencem nos próximos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringDocs.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium text-sm">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Vence em {doc.expiresAt?.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="destructive">Urgente</Badge>
                </div>
              ))}
              {expiringDocs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum documento vencendo
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
