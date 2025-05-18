
import { SyncService } from './SyncService';

export interface ChecklistItem {
  id: string;
  description: string;
  required: boolean;
  conditional?: {
    dependsOn: string;
    value: boolean;
  };
  evidence?: File[];
}

export class ChecklistService {
  static async createChecklist(template: ChecklistItem[], signatures: string[]) {
    const checklistData = {
      template,
      signatures,
      timestamp: new Date().toISOString(),
      hash: await this.generateHash(template),
      status: 'active'
    };

    return await SyncService.syncData('checklists', checklistData);
  }

  static async applyChecklist(templateId: string, applicationData: any) {
    const data = {
      templateId,
      ...applicationData,
      timestamp: new Date().toISOString(),
      status: 'in_progress'
    };

    return await SyncService.syncData(`checklists/${templateId}/apply`, data);
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

    return await SyncService.syncData(`checklists/${checklistId}/sign`, signatureData);
  }

  private static async generateHash(data: any): Promise<string> {
    const msgBuffer = new TextEncoder().encode(JSON.stringify(data));
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
