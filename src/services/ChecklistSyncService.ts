
import { ChecklistService, ChecklistTemplate, ChecklistItem } from './ChecklistService';
import { SyncService } from './SyncService';

export interface ChecklistSyncData {
  templates: ChecklistTemplate[];
  executions: any[];
  categories: any[];
  lastSync: Date;
}

export class ChecklistSyncService {
  private static readonly STORAGE_KEY = 'checklist_sync_data';
  private static readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

  static async syncWithBackend(): Promise<ChecklistSyncData> {
    try {
      const [templates, executions] = await Promise.all([
        ChecklistService.getTemplates(),
        ChecklistService.getAppliedChecklists()
      ]);

      const syncData: ChecklistSyncData = {
        templates: templates || [],
        executions: executions || [],
        categories: this.extractCategoriesFromTemplates(templates || []),
        lastSync: new Date()
      };

      // Store locally for offline access
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(syncData));
      
      return syncData;
    } catch (error) {
      console.error('Erro na sincronização:', error);
      
      // Fallback to local data if available
      const localData = this.getLocalData();
      if (localData) {
        return localData;
      }
      
      throw error;
    }
  }

  static getLocalData(): ChecklistSyncData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return {
          ...data,
          lastSync: new Date(data.lastSync)
        };
      }
    } catch (error) {
      console.error('Erro ao carregar dados locais:', error);
    }
    return null;
  }

  static async syncTemplate(template: ChecklistTemplate): Promise<void> {
    try {
      await ChecklistService.createChecklist(template.items, {
        title: template.title,
        description: template.description
      });
      
      // Update local cache
      const localData = this.getLocalData();
      if (localData) {
        localData.templates.push(template);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(localData));
      }
    } catch (error) {
      console.error('Erro ao sincronizar template:', error);
      throw error;
    }
  }

  static async syncExecution(templateId: string, executionData: any): Promise<void> {
    try {
      await ChecklistService.applyChecklist(templateId, executionData);
      
      // Update local cache
      const localData = this.getLocalData();
      if (localData) {
        localData.executions.push({ templateId, ...executionData, syncedAt: new Date() });
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(localData));
      }
    } catch (error) {
      console.error('Erro ao sincronizar execução:', error);
      throw error;
    }
  }

  private static extractCategoriesFromTemplates(templates: ChecklistTemplate[]): any[] {
    const categoryMap = new Map();
    
    templates.forEach(template => {
      if (template.items) {
        template.items.forEach(item => {
          const match = item.description.match(/^([^:]+):\s(.+)$/);
          if (match) {
            const category = match[1];
            if (!categoryMap.has(category)) {
              categoryMap.set(category, {
                id: category.toLowerCase().replace(/\s+/g, '-'),
                name: category,
                description: `Categoria ${category}`,
                color: this.getCategoryColor(category),
                templateCount: 0,
                executionCount: 0
              });
            }
            categoryMap.get(category).templateCount++;
          }
        });
      }
    });
    
    return Array.from(categoryMap.values());
  }

  private static getCategoryColor(category: string): string {
    const colors = ['blue', 'green', 'red', 'purple', 'orange', 'yellow'];
    const hash = category.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  }

  static startAutoSync(): () => void {
    const interval = setInterval(() => {
      this.syncWithBackend().catch(console.error);
    }, this.SYNC_INTERVAL);

    return () => clearInterval(interval);
  }
}
