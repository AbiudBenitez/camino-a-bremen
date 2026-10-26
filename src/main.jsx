import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Banco de pruebas de la interacción común. Solo en desarrollo: el build lo descarta.
const Raiz = import.meta.env.DEV && window.location.hash === '#prueba-arrastre'
  ? (await import('./arrastre/Demo.jsx')).default
  : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Raiz />
  </StrictMode>,
)
