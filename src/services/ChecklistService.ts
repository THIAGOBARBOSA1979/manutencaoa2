
export interface ChecklistItem {
  id: string;
  text: string;
  description?: string;
  required: boolean;
  isRequired: boolean;
  status: 'pending' | 'completed' | 'failed' | 'not_applicable';
  notes?: string;
  evidence?: string[];
  completedAt?: Date;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  items: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistExecution {
  id: string;
  templateId: string;
  templateName: string;
  executedBy: string;
  startedAt: Date;
  completedAt?: Date;
  items: ChecklistItem[];
  photos: string[];
  notes: string;
}

class ChecklistService {
  private templates: ChecklistTemplate[] = [];
  private executions: ChecklistExecution[] = [];

  // Create a new checklist template
  async createChecklist(
    items: ChecklistItem[], 
    metadata: { title: string; description: string; category?: string }
  ): Promise<ChecklistTemplate> {
    const template: ChecklistTemplate = {
      id: Date.now().toString(),
      name: metadata.title,
      description: metadata.description,
      category: metadata.category || 'Geral',
      items: items.map(item => ({
        ...item,
        status: 'pending',
        completedAt: undefined
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.templates.push(template);
    return template;
  }

  // Get all templates
  getTemplates(): ChecklistTemplate[] {
    return this.templates;
  }

  // Get template by ID
  getTemplateById(id: string): ChecklistTemplate | undefined {
    return this.templates.find(t => t.id === id);
  }

  // Execute checklist
  async executeChecklist(
    templateId: string,
    executedBy: string,
    items: ChecklistItem[]
  ): Promise<ChecklistExecution> {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const execution: ChecklistExecution = {
      id: Date.now().toString(),
      templateId,
      templateName: template.name,
      executedBy,
      startedAt: new Date(),
      completedAt: items.every(item => item.status !== 'pending') ? new Date() : undefined,
      items,
      photos: [],
      notes: ''
    };

    this.executions.push(execution);
    return execution;
  }

  // Get executions
  getExecutions(): ChecklistExecution[] {
    return this.executions;
  }

  // Get executions by template
  getExecutionsByTemplate(templateId: string): ChecklistExecution[] {
    return this.executions.filter(e => e.templateId === templateId);
  }
}

export const ChecklistService = new ChecklistService();
