import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// The CMS lives at /admin as a lazy chunk so visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp.tsx'))
const isAdmin =
  window.location.pathname === '/admin' ||
  window.location.pathname.startsWith('/admin/')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
