import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './app/features/messaging/styles/codice.css'
import App from './App.tsx'

// ----------------------------------------------------------------------------
// Silenciar cancelaciones internas de Monaco Editor.
// Monaco usa CancellationTokens en muchos procesos (IntelliSense, workers,
// language servers, parsers) que se cancelan continuamente cuando el editor
// se reorganiza, cambia de path, se desmonta o el usuario tipea rápido.
// Esas cancelaciones son intencionadas pero Monaco las expone como promesas
// rechazadas no manejadas con `name: "Canceled"` o `message: "Canceled"`,
// que se propagan al body y aparecen como errores ruidosos en la consola al
// clicar en cualquier lugar editable (foro, ajustes, retos, apuntes…).
// ----------------------------------------------------------------------------
const esCancelacionDeMonaco = (reason: any): boolean => {
  if (!reason) return false;
  if (reason.name === 'Canceled' || reason.name === 'CanceledError') return true;
  if (reason.message === 'Canceled' || reason.message === 'Canceled: Canceled') return true;
  if (typeof reason === 'string' && reason.includes('Canceled')) return true;
  return false;
};

window.addEventListener('unhandledrejection', (event) => {
  if (esCancelacionDeMonaco(event.reason)) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  if (esCancelacionDeMonaco(event.error)) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
