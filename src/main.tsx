import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router';
import { CartProvider } from './app/context/CartContext';
import { ToastProvider } from './app/context/ToastContext';
import App from './app/App';
import "./styles/index.css";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <CartProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </CartProvider>
  </BrowserRouter>
);