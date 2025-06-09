
import { useState, useEffect } from 'react';
import { ChecklistService } from '@/services/ChecklistService';
import { useToast } from '@/hooks/use-toast';

interface SyncStatus {
  isLoading: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  error: string | null;
}

export function useChecklistSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isLoading: false,
    lastSync: null,
    pendingChanges: 0,
    error: null
  });
  const { toast } = useToast();

  const syncTemplates = async () => {
    setSyncStatus(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const templates = await ChecklistService.getTemplates();
      setSyncStatus(prev => ({
        ...prev,
        isLoading: false,
        lastSync: new Date(),
        pendingChanges: 0
      }));
      
      return templates;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na sincronização';
      setSyncStatus(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      
      toast({
        title: "Erro de sincronização",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    }
  };

  const syncExecutions = async () => {
    try {
      const executions = await ChecklistService.getAppliedChecklists();
      return executions;
    } catch (error) {
      console.error('Erro ao sincronizar execuções:', error);
      throw error;
    }
  };

  // Auto-sync periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!syncStatus.isLoading) {
        syncTemplates();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [syncStatus.isLoading]);

  return {
    syncStatus,
    syncTemplates,
    syncExecutions
  };
}
