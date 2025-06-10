
import { SyncService } from './SyncService';

export interface ChecklistItem {
  id: string;
  text: string;
  description?: string;
  required: boolean;
  isRequired: boolean;
  conditional?: {
    dependsOn: string;
    value: boolean;
  };
  evidence?: File[] | null;
  status: 'pending' | 'completed' | 'failed' | 'not_applicable';
  notes?: string;
  completedAt?: Date;
}

export interface ChecklistTemplate {
  id?: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  createdAt?: Date;
  lastUpdated?: Date;
}

export class ChecklistService {
  static async createChecklist(items: ChecklistItem[], templateData: { title: string; description: string }) {
    const checklistData = {
      title: templateData.title,
      description: templateData.description,
      items,
      timestamp: new Date().toISOString(),
      hash: await this.generateHash(items),
      status: 'active'
    };

    return await SyncService.syncData('checklists', checklistData, 'POST');
  }

  static async applyChecklist(templateId: string, applicationData: any) {
    const data = {
      templateId,
      ...applicationData,
      timestamp: new Date().toISOString(),
      status: 'in_progress'
    };

    return await SyncService.syncData(`checklists/${templateId}/apply`, data, 'POST');
  }

  static async getTemplates() {
    return await SyncService.syncData('checklists/templates', null, 'GET');
  }

  static async getAppliedChecklists() {
    return await SyncService.syncData('checklists/applied', null, 'GET');
  }

  static async signChecklist(checklistId: string, signature: any) {
    const signatureData = {
      checklistId,
      signature,
      timestamp: new Date().toISOString(),
    };

    return await SyncService.syncData(`checklists/${checklistId}/sign`, signatureData, 'POST');
  }

  private static async generateHash(data: any): Promise<string> {
    const msgBuffer = new TextEncoder().encode(JSON.stringify(data));
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
