import { StrictMode } from 'react'
import { QueryClientProvider} from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import './index.css'
import Dashboard from './pages/Dashboard.tsx'
import { queryClient } from './config/queryClient.ts'
import { ThemeProvider } from './components/ThemeProvider.tsx'


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Dashboard />
    </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
