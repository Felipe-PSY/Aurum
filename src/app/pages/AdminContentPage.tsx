import { useState, useEffect } from 'react';
import { 
  Layout, 
  Move, 
  Trash2, 
  Plus, 
  Save,
  Monitor,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';
import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';

export function AdminContentPage() {
  const { siteConfig, updateSiteConfig, addLog } = useDb();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'banners' | 'footer'>('home');
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

      <div className="flex border-b border-white/5">
        <button 
          onClick={() => setActiveTab('home')}
          className={`px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 ${activeTab === 'home' ? 'border-brand-accent text-white' : 'border-transparent text-white/20'}`}
        >
          Página de Inicio
        </button>
        <button 
          onClick={() => setActiveTab('banners')}
          className={`px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 ${activeTab === 'banners' ? 'border-brand-accent text-white' : 'border-transparent text-white/20'}`}
        >
          Banners Promocionales
        </button>
        <button 
          onClick={() => setActiveTab('footer')}
          className={`px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 ${activeTab === 'footer' ? 'border-brand-accent text-white' : 'border-transparent text-white/20'}`}
        >
          Footer & Textos
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

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Editor Area */}
        <div className="lg:col-span-8 space-y-8">
          {activeTab === 'home' && (
            <div className="space-y-8">
              <section className="bg-brand-secondary border border-white/5 p-8 space-y-6">
                <h3 className="text-white font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase border-b border-white/5 pb-4">Sección Hero</h3>
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
                </div>
              </section>

              <section className="bg-brand-secondary border border-white/5 p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-white font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase">Secciones de la Home</h3>
                  <button 
                    onClick={() => {
                      const availableSections = [
                        { id: 'cat-destacadas', name: 'Categorías Destacadas', component: 'CollectionSection' },
                        { id: 'sobre-aurum', name: 'Sobre Aurum', component: 'BrandStorySection' },
                        { id: 'col-reciente', name: 'Colección Reciente', component: 'ProductSection' },
                        { id: 'experiencia-lujo', name: 'Experiencia de Lujo', component: 'LuxuryExperienceSection' },
                        { id: 'testimonios', name: 'Testimonios', component: 'TestimonialSection' },
                        { id: 'galeria', name: 'Galería', component: 'GallerySection' }
                      ];
                      
                      const currentIds = localConfig.homeSections.map(s => s.id);
                      const nextToAdd = availableSections.find(s => !currentIds.includes(s.id));
                      
                      if (nextToAdd) {
                        const newSection = {
                          ...nextToAdd,
                          isVisible: true,
                          order: localConfig.homeSections.length
                        };
                        updateGlobalConfig({
                          ...localConfig,
                          homeSections: [...localConfig.homeSections, newSection]
                        });
                      }
                    }}
                    className="text-[10px] text-brand-accent font-bold uppercase tracking-widest flex items-center gap-2 hover:underline"
                  >
                    <Plus className="w-3 h-3" /> Añadir Sección
                  </button>
                </div>
                <div className="space-y-4">
                  <Reorder.Group 
                    axis="y" 
                    values={localConfig.homeSections} 
                    onReorder={(newOrder) => updateGlobalConfig({ 
                      ...localConfig, 
                      homeSections: newOrder.map((s, idx) => ({ ...s, order: idx })) 
                    })}
                    className="space-y-4"
                  >
                    {localConfig.homeSections.sort((a,b) => a.order - b.order).map(sec => {
                      const controls = useDragControls();
                      return (
                        <Reorder.Item 
                          key={sec.id} 
                          value={sec}
                          dragListener={false}
                          dragControls={controls}
                          className="flex items-center justify-between p-4 bg-white/5 border border-white/5 group hover:border-brand-accent/30 transition-all cursor-default"
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              onPointerDown={(e) => controls.start(e)}
                              className="cursor-grab active:cursor-grabbing p-1 -ml-1 hover:text-brand-accent transition-colors"
                            >
                              <Move className="w-4 h-4 text-white/10 group-hover:text-white/30" />
                            </div>
                            <span className="text-xs text-white uppercase tracking-widest">{sec.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => {
                                const newSections = localConfig.homeSections.map(s => 
                                  s.id === sec.id ? { ...s, isVisible: !s.isVisible } : s
                                );
                                updateGlobalConfig({ ...localConfig, homeSections: newSections });
                              }}
                              className={`text-[9px] font-bold tracking-tighter uppercase transition-colors ${sec.isVisible ? 'text-green-400' : 'text-white/20'}`}
                            >
                              {sec.isVisible ? 'Visible' : 'Oculto'}
                            </button>
                            <button 
                              onClick={() => {
                                const newSections = localConfig.homeSections.filter(s => s.id !== sec.id);
                                updateGlobalConfig({ ...localConfig, homeSections: newSections });
                              }}
                              className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </Reorder.Item>
                      );
                    })}
                  </Reorder.Group>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'banners' && (
             <div className="space-y-8">
                <section className="bg-brand-secondary border border-white/5 p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase">Banners Activos</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                     {localConfig.banners.map(banner => (
                       <div key={banner.id} className="relative aspect-video bg-white/5 border border-white/10 group cursor-pointer overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center text-white/20 group-hover:text-brand-accent transition-all text-[10px] uppercase tracking-widest">
                            {banner.image ? <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" /> : "Sin Imagen"}
                          </div>
                          <div className="absolute top-4 right-4 flex gap-2">
                             <button 
                               onClick={() => {
                                 const newBanners = localConfig.banners.filter(b => b.id !== banner.id);
                                 updateGlobalConfig({ ...localConfig, banners: newBanners });
                               }}
                               className="p-2 bg-black/60 text-white/60 hover:text-red-400 backdrop-blur-md transition-all"
                             >
                               <Trash2 className="w-3 h-3" />
                             </button>
                          </div>
                          <div className="absolute bottom-4 left-4">
                             <p className="text-[10px] text-white uppercase tracking-widest bg-black/60 px-2 py-1 backdrop-blur-md">{banner.title}</p>
                          </div>
                       </div>
                     ))}
                     <div 
                       onClick={() => {
                         const newBanner = {
                           id: `banner-${Date.now()}`,
                           image: '',
                           title: 'Nuevo Banner',
                           link: '#'
                         };
                         updateGlobalConfig({ ...localConfig, banners: [...localConfig.banners, newBanner] });
                       }}
                       className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 p-6 text-center hover:border-brand-accent/40 transition-all cursor-pointer"
                     >
                        <Plus className="w-6 h-6 text-white/10 mb-2" />
                        <p className="text-[10px] text-white/20 uppercase tracking-widest">Añadir Banner</p>
                     </div>
                  </div>
                </section>
             </div>
          )}

          {activeTab === 'footer' && (
            <div className="space-y-8">
              <section className="bg-brand-secondary border border-white/5 p-8 space-y-6">
                <h3 className="text-white font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase border-b border-white/5 pb-4">Footer & Textos Generales</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Descripción de Marca (Footer)</label>
                    <textarea 
                      value={localConfig.footerDescription} 
                      onChange={(e) => updateGlobalConfig({
                        ...localConfig,
                        footerDescription: e.target.value
                      })}
                      className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none resize-none" 
                      rows={4} 
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Dirección</label>
                      <input 
                        type="text" 
                        value={localConfig.address} 
                        onChange={(e) => updateGlobalConfig({
                          ...localConfig,
                          address: e.target.value
                        })}
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">WhatsApp</label>
                      <input 
                        type="text" 
                        value={localConfig.whatsappNumber} 
                        onChange={(e) => updateGlobalConfig({
                          ...localConfig,
                          whatsappNumber: e.target.value
                        })}
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Email de Contacto</label>
                      <input 
                        type="email" 
                        value={localConfig.contactEmail} 
                        onChange={(e) => updateGlobalConfig({
                          ...localConfig,
                          contactEmail: e.target.value
                        })}
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Instagram (@usuario)</label>
                      <input 
                        type="text" 
                        value={localConfig.instagram} 
                        onChange={(e) => updateGlobalConfig({
                          ...localConfig,
                          instagram: e.target.value
                        })}
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                      />
                    </div>
                  </div>
                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Enlaces del Footer</h4>
                    <div className="grid md:grid-cols-3 gap-6">
                      {localConfig.footerSections.map((section, sIdx) => (
                        <div key={sIdx} className="space-y-4 p-4 bg-white/5 border border-white/5">
                          <input 
                            type="text" 
                            value={section.title} 
                            onChange={(e) => {
                              const newSections = [...localConfig.footerSections];
                              newSections[sIdx].title = e.target.value;
                              updateGlobalConfig({ ...localConfig, footerSections: newSections });
                            }}
                            className="w-full bg-transparent border-b border-white/10 pb-2 text-xs text-brand-accent font-bold uppercase tracking-widest outline-none" 
                          />
                          <div className="space-y-3">
                            {section.links.map((link, lIdx) => (
                              <div key={lIdx} className="space-y-1">
                                <input 
                                  type="text" 
                                  value={link.name} 
                                  onChange={(e) => {
                                    const newSections = [...localConfig.footerSections];
                                    newSections[sIdx].links[lIdx].name = e.target.value;
                                    updateGlobalConfig({ ...localConfig, footerSections: newSections });
                                  }}
                                  className="w-full bg-transparent text-[10px] text-white/60 outline-none hover:text-white transition-colors" 
                                />
                                <input 
                                  type="text" 
                                  value={link.href} 
                                  onChange={(e) => {
                                    const newSections = [...localConfig.footerSections];
                                    newSections[sIdx].links[lIdx].href = e.target.value;
                                    updateGlobalConfig({ ...localConfig, footerSections: newSections });
                                  }}
                                  className="w-full bg-transparent text-[8px] text-white/20 outline-none" 
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
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
                    <p className={`font-['Cormorant_Garamond'] ${previewMode === 'mobile' ? 'text-[10px]' : 'text-lg'} text-white mb-2 italic leading-tight`}>
                      {localConfig.hero.title}
                    </p>
                    <p className={`font-['Montserrat'] ${previewMode === 'mobile' ? 'text-[6px]' : 'text-[10px]'} text-white/60 mb-4 max-w-[80%] whitespace-pre-wrap`}>
                      {localConfig.hero.subtitle}
                    </p>
                    <div className="w-20 py-1.5 border border-white/40 text-[6px] text-white uppercase tracking-widest">Explorar</div>
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
