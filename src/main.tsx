import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted faces (no third-party origins on the critical path). Geist is the variable cut; Sometype Mono only in the two weights the UI voice uses.
import '@fontsource-variable/geist/wght.css'
import '@fontsource/sometype-mono/400.css'
import '@fontsource/sometype-mono/500.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
