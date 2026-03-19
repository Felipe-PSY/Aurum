import { useState } from 'react';
import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';
import { 
  Save, 
  Globe, 
  MessageSquare, 
  Palette,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AdminConfigPage() {
  const { siteConfig, updateSiteConfig, addLog } = useDb();
  const { user } = useAuth();
  const [localConfig, setLocalConfig] = useState(siteConfig);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateSiteConfig(localConfig);
    addLog('config', 'Actualizó configuración del sitio', user?.name || 'Admin');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl text-white italic tracking-wide mb-1">Configuración General</h1>
          <p className="text-brand-text/40 text-[10px] tracking-[0.3em] uppercase">Personaliza la identidad y funciones de tu tienda</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-3 bg-brand-accent text-black px-8 py-4 font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-all shadow-xl group"
        >
          <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Guardar Cambios
        </button>
      </div>

      <AnimatePresence>
        {isSaved && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-3 p-4 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs tracking-widest uppercase font-bold"
          >
            <CheckCircle2 className="w-4 h-4" />
            Configuración actualizada con éxito
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-8">
        {/* Identidad de Marca */}
        <section className="bg-brand-secondary border border-white/5 p-8 space-y-8">
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <Globe className="w-5 h-5 text-brand-accent" />
            <h2 className="text-white font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase">Identidad de Marca</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Dirección de Tienda</label>
              <input 
                type="text" 
                value={(localConfig as any).address || ''}
                onChange={e => setLocalConfig({...localConfig, address: e.target.value} as any)}
                className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Email de Contacto</label>
              <input 
                type="email" 
                value={localConfig.contactEmail}
                onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
            <div className="space-y-4">
              <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Usuario Instagram (Ej: @aurumjoyeria)</label>
              <input 
                type="text" 
                value={(localConfig as any).instagram || ''}
                onChange={e => setLocalConfig({...localConfig, instagram: e.target.value} as any)}
                className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Contacto y Redes */}
        <section className="bg-brand-secondary border border-white/5 p-8 space-y-8">
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <MessageSquare className="w-5 h-5 text-brand-accent" />
            <h2 className="text-white font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase">Canal de Ventas WhatsApp</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Número de WhatsApp</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xs">+</span>
                <input 
                  type="text" 
                  value={localConfig.whatsappNumber}
                  onChange={e => setLocalConfig({...localConfig, whatsappNumber: e.target.value.replace(/\D/g, '')})}
                  className="w-full bg-white/5 border border-white/10 pl-8 pr-4 py-4 text-sm text-white focus:border-brand-accent outline-none transition-all"
                />
              </div>
              <p className="text-[9px] text-white/20 italic">Ej: 573012636880 (Sin espacios ni símbolos)</p>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Horarios de Atención</label>
              <textarea 
                value={localConfig.businessHours || ''}
                onChange={e => setLocalConfig({...localConfig, businessHours: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all resize-none h-[120px]"
                placeholder="Lunes a Sábado: 10:00 - 20:00&#10;Domingos: Cita previa"
              />
            </div>
          </div>
        </section>

        {/* Personalización Visual */}
        <section className="bg-brand-secondary border border-white/5 p-8 space-y-8">
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <Palette className="w-5 h-5 text-brand-accent" />
            <h2 className="text-white font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase">Colores de Marca</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Color de Acento (Oro)</label>
              <div className="flex gap-4">
                <input 
                  type="color" 
                  value={localConfig.colors.accent}
                  onChange={e => setLocalConfig({
                    ...localConfig, 
                    colors: { ...localConfig.colors, accent: e.target.value } 
                  })}
                  className="w-12 h-12 bg-transparent border-0 cursor-pointer"
                />
                <input 
                  type="text" 
                  value={localConfig.colors.accent}
                  onChange={e => setLocalConfig({
                    ...localConfig, 
                    colors: { ...localConfig.colors, accent: e.target.value } 
                  })}
                  className="flex-1 bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Color de Fondo Principal</label>
              <div className="flex gap-4">
                <input 
                  type="color" 
                  value={localConfig.colors.primary}
                  onChange={e => setLocalConfig({
                    ...localConfig, 
                    colors: { ...localConfig.colors, primary: e.target.value } 
                  })}
                  className="w-12 h-12 bg-transparent border-0 cursor-pointer"
                />
                <input 
                  type="text" 
                  value={localConfig.colors.primary}
                  onChange={e => setLocalConfig({
                    ...localConfig, 
                    colors: { ...localConfig.colors, primary: e.target.value } 
                  })}
                  className="flex-1 bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="p-6 bg-brand-accent/5 border border-brand-accent/10 flex gap-4">
        <AlertCircle className="w-5 h-5 text-brand-accent shrink-0" />
        <p className="text-[10px] text-brand-accent uppercase tracking-widest leading-relaxed">
          Nota: Los cambios realizados aquí se aplicarán instantáneamente a toda la tienda pública en la próxima recarga.
        </p>
      </div>
    </div>
  );
}
