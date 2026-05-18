import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TooltipProvider } from "@/components/ui/tooltip"
import { ActiveThemeProvider } from "@/components/active-theme"
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TooltipProvider>
        <ActiveThemeProvider>
          <App />
        </ActiveThemeProvider>
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>,
)