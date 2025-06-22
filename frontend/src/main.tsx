import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Dashboard from './pages/Dashboard.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Dashboard />
    </ThemeProvider>
  </StrictMode>
);
