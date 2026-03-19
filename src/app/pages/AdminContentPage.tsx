import { useState, useEffect } from 'react';
import { 
  Layout, 
  Move, 
  Trash2, 
  Plus, 
  Save,
  Monitor,
  Smartphone,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Type,
  Star as StarIcon,
  X as CloseIcon
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
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

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
                        { id: 'promo-banners', name: 'Banners Promocionales', component: 'PromoBanner' },
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
                    className="space-y-3"
                  >
                    {localConfig.homeSections.sort((a,b) => a.order - b.order).map(sec => {
                      const controls = useDragControls();
                      const isSelected = selectedSectionId === sec.id;
                      return (
                        <Reorder.Item 
                          key={sec.id} 
                          value={sec}
                          dragListener={false}
                          dragControls={controls}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`flex items-center justify-between p-4 bg-white/5 border transition-all cursor-default group ${isSelected ? 'border-brand-accent ring-1 ring-brand-accent/20 bg-brand-accent/5' : 'border-white/5 hover:border-white/10'}`}
                        >
                          <div className="flex items-center gap-4 flex-1" onClick={() => setSelectedSectionId(sec.id)}>
                            <div 
                              onPointerDown={(e) => controls.start(e)}
                              className="cursor-grab active:cursor-grabbing p-2 -ml-2 hover:text-brand-accent transition-colors hidden group-hover:block"
                            >
                              <Move className="w-3.5 h-3.5 text-white/20" />
                            </div>
                            <div className="flex flex-col">
                              <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isSelected ? 'text-brand-accent' : 'text-white/60'}`}>{sec.name}</span>
                              <span className="text-[8px] text-white/10 uppercase tracking-widest">{sec.component}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newSections = localConfig.homeSections.map(s => 
                                    s.id === sec.id ? { ...s, isVisible: !s.isVisible } : s
                                  );
                                  updateGlobalConfig({ ...localConfig, homeSections: newSections });
                                }}
                                className={`p-2 transition-colors ${sec.isVisible ? 'text-emerald-400 opacity-100' : 'text-white/10 hover:text-white/30'}`}
                                title={sec.isVisible ? 'Ocultar sección' : 'Mostrar sección'}
                              >
                                {sec.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                             <div className="w-px h-4 bg-white/5"></div>
                             <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newSections = localConfig.homeSections.filter(s => s.id !== sec.id);
                                  updateGlobalConfig({ ...localConfig, homeSections: newSections });
                                  if (selectedSectionId === sec.id) setSelectedSectionId(null);
                                }}
                                className="p-2 text-white/10 hover:text-red-400 hover:bg-red-400/5 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                             </button>
                             <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-brand-accent' : 'text-white/10'}`} />
                          </div>
                        </Reorder.Item>
                      );
                    })}
                  </Reorder.Group>
                </div>
              </section>

              {/* Dynamic Section Editor */}
              <AnimatePresence mode="wait">
                {selectedSectionId && (
                  <motion.section 
                    key={selectedSectionId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-brand-secondary border border-brand-accent/20 p-8 space-y-8 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4">
                       <button onClick={() => setSelectedSectionId(null)} className="p-2 text-white/20 hover:text-white transition-colors">
                         <CloseIcon className="w-4 h-4" />
                       </button>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center">
                         <Type className="w-4 h-4 text-brand-accent" />
                      </div>
                      <div>
                        <h3 className="text-white font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase">
                          Editando: {localConfig.homeSections.find(s => s.id === selectedSectionId)?.name}
                        </h3>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Personaliza el contenido de esta sección</p>
                      </div>
                    </div>

                    <div className="space-y-8 animate-in fade-in duration-500">
                      {/* Section Content Editor Logic */}
                      {selectedSectionId === 'cat-destacadas' && (
                        <div className="space-y-6">
                           <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Título de la Sección</label>
                                <input 
                                  type="text" 
                                  value={localConfig.sectionContent.collections.title} 
                                  onChange={(e) => updateGlobalConfig({
                                    ...localConfig,
                                    sectionContent: { ...localConfig.sectionContent, collections: { ...localConfig.sectionContent.collections, title: e.target.value } }
                                  })}
                                  className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Subtítulo (Acento)</label>
                                <input 
                                  type="text" 
                                  value={localConfig.sectionContent.collections.subtitle} 
                                  onChange={(e) => updateGlobalConfig({
                                    ...localConfig,
                                    sectionContent: { ...localConfig.sectionContent, collections: { ...localConfig.sectionContent.collections, subtitle: e.target.value } }
                                  })}
                                  className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                                />
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Colecciones (Máx 3)</label>
                              <div className="grid md:grid-cols-3 gap-6">
                                 {localConfig.sectionContent.collections.items.map((item, idx) => (
                                   <div key={item.id} className="p-4 bg-white/5 border border-white/5 space-y-4">
                                      <div className="aspect-video bg-black/40 relative group overflow-hidden">
                                         {item.image ? <img src={item.image} className="w-full h-full object-cover opacity-50" /> : <ImageIcon className="w-8 h-8 absolute inset-0 m-auto text-white/5" />}
                                         <input 
                                           type="text" 
                                           placeholder="URL de Imagen"
                                           value={item.image}
                                           onChange={(e) => {
                                             const newItems = [...localConfig.sectionContent.collections.items];
                                             newItems[idx].image = e.target.value;
                                             updateGlobalConfig({ ...localConfig, sectionContent: { ...localConfig.sectionContent, collections: { ...localConfig.sectionContent.collections, items: newItems } } });
                                           }}
                                           className="absolute bottom-0 left-0 w-full bg-black/80 p-2 text-[8px] text-white/60 focus:text-white outline-none translate-y-full group-hover:translate-y-0 transition-transform"
                                         />
                                      </div>
                                      <input 
                                        type="text" 
                                        value={item.title}
                                        onChange={(e) => {
                                          const newItems = [...localConfig.sectionContent.collections.items];
                                          newItems[idx].title = e.target.value;
                                          updateGlobalConfig({ ...localConfig, sectionContent: { ...localConfig.sectionContent, collections: { ...localConfig.sectionContent.collections, items: newItems } } });
                                        }}
                                        className="w-full bg-transparent border-b border-white/10 pb-2 text-xs text-white font-bold outline-none"
                                      />
                                      <textarea 
                                        value={item.description}
                                        onChange={(e) => {
                                          const newItems = [...localConfig.sectionContent.collections.items];
                                          newItems[idx].description = e.target.value;
                                          updateGlobalConfig({ ...localConfig, sectionContent: { ...localConfig.sectionContent, collections: { ...localConfig.sectionContent.collections, items: newItems } } });
                                        }}
                                        className="w-full bg-transparent text-[10px] text-white/40 outline-none resize-none"
                                        rows={2}
                                      />
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                      )}

                      {selectedSectionId === 'sobre-aurum' && (
                        <div className="space-y-6">
                           <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Título Principal</label>
                                <input 
                                  type="text" 
                                  value={localConfig.sectionContent.brandStory.title} 
                                  onChange={(e) => updateGlobalConfig({
                                    ...localConfig,
                                    sectionContent: { ...localConfig.sectionContent, brandStory: { ...localConfig.sectionContent.brandStory, title: e.target.value } }
                                  })}
                                  className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Subtítulo</label>
                                <input 
                                  type="text" 
                                  value={localConfig.sectionContent.brandStory.subtitle} 
                                  onChange={(e) => updateGlobalConfig({
                                    ...localConfig,
                                    sectionContent: { ...localConfig.sectionContent, brandStory: { ...localConfig.sectionContent.brandStory, subtitle: e.target.value } }
                                  })}
                                  className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                                />
                              </div>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Párrafo 1</label>
                             <textarea 
                               value={localConfig.sectionContent.brandStory.p1} 
                               onChange={(e) => updateGlobalConfig({
                                 ...localConfig,
                                 sectionContent: { ...localConfig.sectionContent, brandStory: { ...localConfig.sectionContent.brandStory, p1: e.target.value } }
                               })}
                               className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none resize-none" 
                               rows={3} 
                             />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Párrafo 2</label>
                             <textarea 
                               value={localConfig.sectionContent.brandStory.p2} 
                               onChange={(e) => updateGlobalConfig({
                                 ...localConfig,
                                 sectionContent: { ...localConfig.sectionContent, brandStory: { ...localConfig.sectionContent.brandStory, p2: e.target.value } }
                               })}
                               className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none resize-none" 
                               rows={3} 
                             />
                           </div>
                        </div>
                      )}

                      {selectedSectionId === 'testimonios' && (
                        <div className="space-y-6">
                           <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Título</label>
                                <input 
                                  type="text" 
                                  value={localConfig.sectionContent.testimonials.title} 
                                  onChange={(e) => updateGlobalConfig({
                                    ...localConfig,
                                    sectionContent: { ...localConfig.sectionContent, testimonials: { ...localConfig.sectionContent.testimonials, title: e.target.value } }
                                  })}
                                  className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Subtítulo</label>
                                <input 
                                  type="text" 
                                  value={localConfig.sectionContent.testimonials.subtitle} 
                                  onChange={(e) => updateGlobalConfig({
                                    ...localConfig,
                                    sectionContent: { ...localConfig.sectionContent, testimonials: { ...localConfig.sectionContent.testimonials, subtitle: e.target.value } }
                                  })}
                                  className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                                />
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Testimonios</label>
                              <div className="grid md:grid-cols-2 gap-6">
                                 {localConfig.sectionContent.testimonials.items.map((item, idx) => (
                                   <div key={item.id} className="p-4 bg-white/5 border border-white/5 space-y-4">
                                      <div className="flex gap-4 items-center">
                                         <div className="w-12 h-12 rounded-full bg-black/40 overflow-hidden">
                                            {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                                         </div>
                                         <div className="flex-1">
                                            <input 
                                              type="text" 
                                              value={item.name}
                                              onChange={(e) => {
                                                const newItems = [...localConfig.sectionContent.testimonials.items];
                                                newItems[idx].name = e.target.value;
                                                updateGlobalConfig({ ...localConfig, sectionContent: { ...localConfig.sectionContent, testimonials: { ...localConfig.sectionContent.testimonials, items: newItems } } });
                                              }}
                                              className="w-full bg-transparent text-xs text-white font-bold outline-none"
                                              placeholder="Nombre"
                                            />
                                            <input 
                                              type="text" 
                                              value={item.title}
                                              onChange={(e) => {
                                                const newItems = [...localConfig.sectionContent.testimonials.items];
                                                newItems[idx].title = e.target.value;
                                                updateGlobalConfig({ ...localConfig, sectionContent: { ...localConfig.sectionContent, testimonials: { ...localConfig.sectionContent.testimonials, items: newItems } } });
                                              }}
                                              className="w-full bg-transparent text-[8px] text-white/20 outline-none"
                                              placeholder="Cargo/Título"
                                            />
                                         </div>
                                      </div>
                                      <textarea 
                                        value={item.text}
                                        onChange={(e) => {
                                          const newItems = [...localConfig.sectionContent.testimonials.items];
                                          newItems[idx].text = e.target.value;
                                          updateGlobalConfig({ ...localConfig, sectionContent: { ...localConfig.sectionContent, testimonials: { ...localConfig.sectionContent.testimonials, items: newItems } } });
                                        }}
                                        className="w-full bg-transparent text-[10px] text-white/40 outline-none resize-none italic"
                                        rows={3} 
                                      />
                                      <div className="flex gap-1">
                                         {[...Array(5)].map((_, i) => (
                                           <StarIcon key={i} className={`w-3 h-3 ${i < item.rating ? 'fill-brand-accent text-brand-accent' : 'text-white/10'}`} />
                                         ))}
                                      </div>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                      )}

                      {selectedSectionId === 'experiencia-lujo' && (
                        <div className="space-y-6">
                           <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Título</label>
                                <input 
                                  type="text" 
                                  value={localConfig.sectionContent.luxuryExperience.title} 
                                  onChange={(e) => updateGlobalConfig({
                                    ...localConfig,
                                    sectionContent: { ...localConfig.sectionContent, luxuryExperience: { ...localConfig.sectionContent.luxuryExperience, title: e.target.value } }
                                  })}
                                  className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Subtítulo</label>
                                <input 
                                  type="text" 
                                  value={localConfig.sectionContent.luxuryExperience.subtitle} 
                                  onChange={(e) => updateGlobalConfig({
                                    ...localConfig,
                                    sectionContent: { ...localConfig.sectionContent, luxuryExperience: { ...localConfig.sectionContent.luxuryExperience, subtitle: e.target.value } }
                                  })}
                                  className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                                />
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Características (Features)</label>
                              <div className="grid md:grid-cols-2 gap-6">
                                 {localConfig.sectionContent.luxuryExperience.features.map((feature, idx) => (
                                   <div key={idx} className="p-4 bg-white/5 border border-white/5 space-y-4">
                                      <div className="flex gap-4 items-center">
                                         <div className="w-10 h-10 bg-brand-accent/10 flex items-center justify-center">
                                            <StarIcon className="w-4 h-4 text-brand-accent" />
                                         </div>
                                         <div className="flex-1">
                                            <input 
                                              type="text" 
                                              value={feature.title}
                                              onChange={(e) => {
                                                const newFeatures = [...localConfig.sectionContent.luxuryExperience.features];
                                                newFeatures[idx].title = e.target.value;
                                                updateGlobalConfig({ ...localConfig, sectionContent: { ...localConfig.sectionContent, luxuryExperience: { ...localConfig.sectionContent.luxuryExperience, features: newFeatures } } });
                                              }}
                                              className="w-full bg-transparent text-xs text-white font-bold outline-none"
                                              placeholder="Título"
                                            />
                                         </div>
                                      </div>
                                      <textarea 
                                        value={feature.description}
                                        onChange={(e) => {
                                          const newFeatures = [...localConfig.sectionContent.luxuryExperience.features];
                                          newFeatures[idx].description = e.target.value;
                                          updateGlobalConfig({ ...localConfig, sectionContent: { ...localConfig.sectionContent, luxuryExperience: { ...localConfig.sectionContent.luxuryExperience, features: newFeatures } } });
                                        }}
                                        className="w-full bg-transparent text-[10px] text-white/40 outline-none resize-none"
                                        rows={2}
                                      />
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                      )}

                      {selectedSectionId === 'col-reciente' && (
                        <div className="space-y-6">
                           <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Título</label>
                                <input 
                                  type="text" 
                                  value={localConfig.sectionContent.productSection.title} 
                                  onChange={(e) => updateGlobalConfig({
                                    ...localConfig,
                                    sectionContent: { ...localConfig.sectionContent, productSection: { ...localConfig.sectionContent.productSection, title: e.target.value } }
                                  })}
                                  className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Subtítulo</label>
                                <input 
                                  type="text" 
                                  value={localConfig.sectionContent.productSection.subtitle} 
                                  onChange={(e) => updateGlobalConfig({
                                    ...localConfig,
                                    sectionContent: { ...localConfig.sectionContent, productSection: { ...localConfig.sectionContent.productSection, subtitle: e.target.value } }
                                  })}
                                  className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                                />
                              </div>
                           </div>
                           <div className="p-8 border border-white/5 bg-white/2 rounded-lg text-center">
                              <p className="text-[10px] text-white/20 uppercase tracking-widest">Los productos mostrados en esta sección son los más recientes del catálogo automáticamente.</p>
                           </div>
                        </div>
                      )}

                      {selectedSectionId === 'galeria' && (
                        <div className="space-y-6">
                           <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Título</label>
                                <input 
                                  type="text" 
                                  value={localConfig.sectionContent.gallery.title} 
                                  onChange={(e) => updateGlobalConfig({
                                    ...localConfig,
                                    sectionContent: { ...localConfig.sectionContent, gallery: { ...localConfig.sectionContent.gallery, title: e.target.value } }
                                  })}
                                  className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Subtítulo</label>
                                <input 
                                  type="text" 
                                  value={localConfig.sectionContent.gallery.subtitle} 
                                  onChange={(e) => updateGlobalConfig({
                                    ...localConfig,
                                    sectionContent: { ...localConfig.sectionContent, gallery: { ...localConfig.sectionContent.gallery, subtitle: e.target.value } }
                                  })}
                                  className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none" 
                                />
                              </div>
                           </div>
                           <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                              {localConfig.sectionContent.gallery.images.map((img, idx) => (
                                <div key={img.id} className="aspect-square bg-white/5 border border-white/5 relative group overflow-hidden">
                                   {img.url ? <img src={img.url} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 absolute inset-0 m-auto text-white/5" />}
                                   <input 
                                     type="text" 
                                     value={img.url}
                                     onChange={(e) => {
                                       const newImages = [...localConfig.sectionContent.gallery.images];
                                       newImages[idx].url = e.target.value;
                                       updateGlobalConfig({ ...localConfig, sectionContent: { ...localConfig.sectionContent, gallery: { ...localConfig.sectionContent.gallery, images: newImages } } });
                                     }}
                                     className="absolute bottom-0 left-0 w-full bg-black/80 p-1 text-[6px] text-white/40 outline-none translate-y-full group-hover:translate-y-0 transition-transform"
                                     placeholder="URL"
                                   />
                                </div>
                              ))}
                           </div>
                        </div>
                      )}

                      {/* Default placeholder for other sections */}
                      {!['cat-destacadas', 'sobre-aurum', 'testimonios', 'experiencia-lujo', 'col-reciente', 'galeria'].includes(selectedSectionId) && (
                         <div className="p-12 border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center">
                            <ImageIcon className="w-8 h-8 text-white/5 mb-4" />
                            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Más opciones de edición próximamente para esta sección específica.</p>
                         </div>
                      )}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === 'banners' && (
             <div className="space-y-8">
                <section className="bg-brand-secondary border border-white/5 p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase">Banners Activos</h3>
                  </div>
                  <div className="space-y-4">
                     {localConfig.banners.map((banner, idx) => (
                       <div key={banner.id} className="bg-white/5 border border-white/5 p-6 space-y-6 group transition-all hover:border-brand-accent/20">
                          <div className="grid md:grid-cols-12 gap-6 items-start">
                             <div className="md:col-span-3 aspect-video bg-black/40 relative group/img overflow-hidden">
                                {banner.image ? <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 absolute inset-0 m-auto text-white/5" />}
                                <input 
                                  type="text" 
                                  placeholder="URL Imagen"
                                  value={banner.image}
                                  onChange={(e) => {
                                    const newBanners = [...localConfig.banners];
                                    newBanners[idx].image = e.target.value;
                                    updateGlobalConfig({ ...localConfig, banners: newBanners });
                                  }}
                                  className="absolute bottom-0 left-0 w-full bg-black/80 p-2 text-[8px] text-white/60 focus:text-white outline-none translate-y-full group-hover/img:translate-y-0 transition-transform"
                                />
                             </div>
                             <div className="md:col-span-9 grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[8px] text-white/20 uppercase tracking-widest font-bold">Título</label>
                                  <input 
                                    type="text" 
                                    value={banner.title} 
                                    onChange={(e) => {
                                      const newBanners = [...localConfig.banners];
                                      newBanners[idx].title = e.target.value;
                                      updateGlobalConfig({ ...localConfig, banners: newBanners });
                                    }}
                                    className="w-full bg-white/5 border border-white/10 p-2 text-[10px] text-white focus:border-brand-accent outline-none font-bold" 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] text-white/20 uppercase tracking-widest font-bold">Subtítulo</label>
                                  <input 
                                    type="text" 
                                    value={banner.subtitle || ''} 
                                    onChange={(e) => {
                                      const newBanners = [...localConfig.banners];
                                      newBanners[idx].subtitle = e.target.value;
                                      updateGlobalConfig({ ...localConfig, banners: newBanners });
                                    }}
                                    className="w-full bg-white/5 border border-white/10 p-2 text-[10px] text-white focus:border-brand-accent outline-none" 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] text-white/20 uppercase tracking-widest font-bold">Enlace (URL)</label>
                                  <input 
                                    type="text" 
                                    value={banner.link} 
                                    onChange={(e) => {
                                      const newBanners = [...localConfig.banners];
                                      newBanners[idx].link = e.target.value;
                                      updateGlobalConfig({ ...localConfig, banners: newBanners });
                                    }}
                                    className="w-full bg-white/5 border border-white/10 p-2 text-[10px] text-white focus:border-brand-accent outline-none" 
                                  />
                                </div>
                                <div className="flex items-center gap-4 pt-4">
                                   <button 
                                      onClick={() => {
                                        const newBanners = [...localConfig.banners];
                                        newBanners[idx].isActive = !newBanners[idx].isActive;
                                        updateGlobalConfig({ ...localConfig, banners: newBanners });
                                      }}
                                      className={`flex items-center gap-2 text-[8px] uppercase tracking-widest font-bold transition-all ${banner.isActive ? 'text-emerald-400' : 'text-white/20'}`}
                                    >
                                      {banner.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                      {banner.isActive ? 'Activo' : 'Inactivo'}
                                   </button>
                                   <button 
                                     onClick={() => {
                                       const newBanners = localConfig.banners.filter(b => b.id !== banner.id);
                                       updateGlobalConfig({ ...localConfig, banners: newBanners });
                                     }}
                                     className="text-[8px] text-white/10 hover:text-red-400 uppercase tracking-widest font-bold transition-all ml-auto"
                                   >
                                     Eliminar
                                   </button>
                                </div>
                             </div>
                          </div>
                       </div>
                     ))}
                     <button 
                       onClick={() => {
                         const newBanner = {
                           id: `banner-${Date.now()}`,
                           image: '',
                           title: 'Nueva Colección',
                           subtitle: 'Descubre más',
                           link: '#',
                           isActive: true
                         };
                         updateGlobalConfig({ ...localConfig, banners: [...localConfig.banners, newBanner] });
                       }}
                       className="w-full py-8 border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center hover:border-brand-accent/20 transition-all group"
                     >
                        <Plus className="w-6 h-6 text-white/10 group-hover:text-brand-accent transition-colors mb-2" />
                        <p className="text-[10px] text-white/20 group-hover:text-white/40 uppercase tracking-widest">Añadir Nuevo Banner Promocional</p>
                     </button>
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
