import { useState, useEffect } from 'react';
import { 
  Layout, 
  Save,
  Monitor,
  Smartphone,
  CheckCircle2,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';

export function AdminContentPage() {
  const { siteConfig, updateSiteConfig, addLog } = useDb();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [localConfig, setLocalConfig] = useState(siteConfig);

  useEffect(() => {
    setLocalConfig(siteConfig);
  }, [siteConfig]);

  const updateGlobalConfig = (newConfig: typeof siteConfig) => {
    setLocalConfig(newConfig);
    updateSiteConfig(newConfig);
  };

  const handleSave = () => {
    updateSiteConfig(localConfig);
    addLog('config', 'Guardó cambios de contenido', user?.name || 'Admin');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl text-white italic tracking-wide mb-1">Contenido Visual</h1>
          <p className="text-brand-text/40 text-[10px] tracking-[0.3em] uppercase">Edita banners, secciones y textos principales</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-3 bg-brand-accent text-black px-8 py-4 font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-all shadow-xl"
        >
          <Save className="w-4 h-4" />
          Guardar Cambios
        </button>
      </div>

      <AnimatePresence>
        {isSaved && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] uppercase tracking-widest font-bold flex items-center gap-3"
          >
            <CheckCircle2 className="w-4 h-4" />
            Contenido actualizado con éxito
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Hero Editor */}
          <section className="bg-brand-secondary border border-white/5 p-8 space-y-6">
            <h3 className="text-white font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase border-b border-white/5 pb-4">Sección Hero (Inicio)</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Título Principal</label>
                <input 
                  type="text" 
                  value={localConfig.hero.title} 
                  onChange={(e) => updateGlobalConfig({
                    ...localConfig,
                    hero: { ...localConfig.hero, title: e.target.value }
                  })}
                  className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Subtítulo</label>
                <textarea 
                  value={localConfig.hero.subtitle} 
                  onChange={(e) => updateGlobalConfig({
                    ...localConfig,
                    hero: { ...localConfig.hero, subtitle: e.target.value }
                  })}
                  className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none resize-none" 
                  rows={3} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Imagen de Fondo (Hero)</label>
                <div className="relative aspect-video bg-white/5 border border-white/10 group overflow-hidden">
                  {localConfig.hero.backgroundImage ? (
                    <img 
                      src={localConfig.hero.backgroundImage} 
                      alt="Hero Background" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                      <Upload className="w-8 h-8 mb-2" />
                      <p className="text-[10px] uppercase tracking-widest">Sin Imagen</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-brand-accent text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors">
                      Cambiar Imagen
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              updateGlobalConfig({
                                ...localConfig,
                                hero: { ...localConfig.hero, backgroundImage: reader.result as string }
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <p className="text-[9px] text-white/20 italic">Formatos recomendados: JPG, PNG, WEBP. Tamaño ideal: 1920x1080px.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Preview / Context Area */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-[#1A1A1A] border border-white/10 p-6 space-y-6">
              <h4 className="text-white font-['Montserrat'] text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                <Layout className="w-4 h-4 text-brand-accent" /> Vista Previa
              </h4>
              <div className={`transition-all duration-500 mx-auto ${previewMode === 'mobile' ? 'w-[200px] aspect-[9/16]' : 'w-full aspect-video'} bg-black rounded-lg border border-white/10 overflow-hidden relative group`}>
                 {/* Simulated Content Preview */}
                 <div className="absolute inset-0 p-4 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-px bg-brand-accent mb-4"></div>
                    <p className={`font-['Cormorant_Garamond'] ${previewMode === 'mobile' ? 'text-[8px]' : 'text-lg'} text-white mb-2 italic leading-tight`}>
                      {localConfig.hero.title}
                    </p>
                    <p className={`font-['Montserrat'] ${previewMode === 'mobile' ? 'text-[5px]' : 'text-[10px]'} text-white/60 mb-4 max-w-[80%] whitespace-pre-wrap`}>
                      {localConfig.hero.subtitle}
                    </p>
                    <div className="w-20 py-1.5 border border-white/40 text-[5px] text-white uppercase tracking-widest">Explorar</div>
                 </div>
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 p-2 bg-black/60 backdrop-blur-md rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setPreviewMode('desktop')} className={`hover:text-brand-accent ${previewMode === 'desktop' ? 'text-brand-accent' : 'text-white/40'}`}><Monitor className="w-3 h-3" /></button>
                    <button onClick={() => setPreviewMode('mobile')} className={`hover:text-brand-accent ${previewMode === 'mobile' ? 'text-brand-accent' : 'text-white/40'}`}><Smartphone className="w-3 h-3" /></button>
                 </div>
              </div>
              <p className="text-[9px] text-white/20 leading-relaxed italic">
                La vista previa es una representación aproximada. Los cambios finales se verán reflejados en el sitio público según el dispositivo del usuario.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
