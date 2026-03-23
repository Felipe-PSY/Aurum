import { Link } from 'react-router';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 animate-in fade-in duration-700">
      <h1 className="font-['Cormorant_Garamond'] text-8xl text-brand-accent italic tracking-widest mb-4">404</h1>
      <h2 className="text-2xl text-white font-medium mb-6 text-center">Página no encontrada</h2>
      <p className="text-white/60 mb-10 text-center max-w-md text-sm">
        Lo sentimos, la página que estás buscando no existe o la dirección URL tiene un error.
      </p>
      
      <Link 
        to="/" 
        className="flex items-center gap-2 px-8 py-4 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-black transition-all text-xs tracking-[0.2em] uppercase font-bold"
      >
        <Home className="w-4 h-4" />
        Volver al Inicio
      </Link>
    </div>
  );
}
