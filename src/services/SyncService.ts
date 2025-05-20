
import { io } from 'socket.io-client';
import { toast } from '@/components/ui/use-toast';

export class SyncService {
  private static socket: any;
  private static retryAttempts = 3;
  private static retryDelay = 1000;

  static initialize() {
    this.socket = io(import.meta.env.VITE_API_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  private static setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to sync service');
    });

    this.socket.on('notification', (data: any) => {
      toast({
        title: data.title,
        description: data.message,
      });
    });

    this.socket.on('warranty_update', (data: any) => {
      // Dispatch warranty update event
      window.dispatchEvent(new CustomEvent('warranty_update', { detail: data }));
    });

    this.socket.on('inspection_update', (data: any) => {
      // Dispatch inspection update event
      window.dispatchEvent(new CustomEvent('inspection_update', { detail: data }));
    });
  }

  static async syncData<T>(endpoint: string, data: T, method: string = 'POST'): Promise<T> {
    let attempt = 0;
    while (attempt < this.retryAttempts) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: method !== 'GET' ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) throw new Error('Sync failed');
        return await response.json();
      } catch (error) {
        attempt++;
        if (attempt === this.retryAttempts) throw error;
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
    throw new Error('Max retry attempts reached');
  }
}
