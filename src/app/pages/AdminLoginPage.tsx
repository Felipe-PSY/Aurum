import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Lock, User, Sparkles } from 'lucide-react';

export function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ user: username, pass: password });
    if (success) {
      navigate('/jyaurum');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center px-6 font-['Montserrat']">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-accent/10 mb-6 border border-brand-accent/20">
            <Sparkles className="w-8 h-8 text-brand-accent" />
          </div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl text-white mb-2 italic tracking-wide">Aurum Admin</h1>
          <p className="text-brand-text/40 text-xs tracking-[0.3em] uppercase">Panel de Gestión Privado</p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-md p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-brand-accent uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3" /> Correo Electrónico
              </label>
              <input 
                required
                type="email"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-brand-accent outline-none transition-colors"
                placeholder="admin@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-brand-accent uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3" /> Contraseña
              </label>
              <input 
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-brand-accent outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-[10px] uppercase tracking-widest text-center">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-brand-accent text-black font-bold text-xs tracking-[0.2em] uppercase hover:bg-white transition-all duration-500"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-brand-text/20 text-[9px] uppercase tracking-[0.2em]">
          Aurum Luxury Jewelry &copy; 2026. Todos los derechos reservados.
        </p>
      </motion.div>
    </div>
  );
}
