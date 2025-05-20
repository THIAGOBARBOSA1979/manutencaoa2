
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SyncService } from './services/SyncService.ts'

// Initialize the SyncService
SyncService.initialize();

createRoot(document.getElementById("root")!).render(<App />);
