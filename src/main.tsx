
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SyncService } from './services/SyncService.ts'

console.log('Main: Iniciando aplicação...');

// Initialize the SyncService with error handling
try {
  SyncService.initialize();
  console.log('Main: SyncService inicializado');
} catch (error) {
  console.error('Main: Erro ao inicializar SyncService:', error);
}

// Check if root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Main: Elemento root não encontrado!');
  throw new Error('Root element not found');
}

console.log('Main: Renderizando aplicação...');

try {
  createRoot(rootElement).render(<App />);
  console.log('Main: Aplicação renderizada com sucesso');
} catch (error) {
  console.error('Main: Erro ao renderizar aplicação:', error);
  // Display a basic error message
  rootElement.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
      <div style="text-align: center; padding: 20px;">
        <h1 style="color: #ef4444; margin-bottom: 10px;">Erro de Carregamento</h1>
        <p style="color: #6b7280; margin-bottom: 20px;">Houve um problema ao carregar a aplicação.</p>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
          Recarregar Página
        </button>
      </div>
    </div>
  `;
}
