import { useState } from 'react';
import { useDb } from '../context/DbContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Trash2, 
  Star, 
  ExternalLink, 
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { Testimonial } from '../types';

// Admin page for managing customer testimonials
export function AdminTestimonialsPage() {
  const { testimonials, deleteTestimonial, updateTestimonial } = useDb();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const filteredTestimonials = testimonials.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || t.rating === filterRating;
    return matchesSearch && matchesRating;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este testimonio?')) {
      deleteTestimonial(id);
    }
  };

  const toggleVisibility = (id: string, current: boolean) => {
    updateTestimonial(id, { isVisible: !current });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl text-white italic mb-2">Gestión de Testimonios</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.3em]">Administra las experiencias compartidas por tus clientes</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-secondary/50 border border-white/5 p-6 rounded-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-accent/10 flex items-center justify-center rounded-full">
              <MessageSquare className="w-6 h-6 text-brand-accent" />
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Total</p>
              <h4 className="text-2xl font-bold text-white tracking-tighter">{testimonials.length}</h4>
            </div>
          </div>
        </div>
        <div className="bg-brand-secondary/50 border border-white/5 p-6 rounded-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 flex items-center justify-center rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Aprobados</p>
              <h4 className="text-2xl font-bold text-white tracking-tighter">{testimonials.filter(t => t.isVisible).length}</h4>
            </div>
          </div>
        </div>
        <div className="bg-brand-secondary/50 border border-white/5 p-6 rounded-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-accent/10 flex items-center justify-center rounded-full">
              <Star className="w-6 h-6 text-brand-accent" />
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Promedio</p>
              <h4 className="text-2xl font-bold text-white tracking-tighter">
                {testimonials.length > 0 
                  ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
                  : '0.0'}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 bg-brand-secondary/30 p-6 border border-white/5">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text" 
            placeholder="Buscar por cliente o contenido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-brand-accent outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2">
            <Filter className="w-4 h-4 text-white/20" />
            <select 
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent text-xs text-white uppercase tracking-widest outline-none cursor-pointer"
            >
              <option value="all" className="bg-brand-primary">Todas las Calificaciones</option>
              <option value="5" className="bg-brand-primary">5 Estrellas</option>
              <option value="4" className="bg-brand-primary">4 Estrellas</option>
              <option value="3" className="bg-brand-primary">3 Estrellas</option>
              <option value="2" className="bg-brand-primary">2 Estrellas</option>
              <option value="1" className="bg-brand-primary">1 Estrella</option>
            </select>
          </div>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTestimonials.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-20 text-center bg-brand-secondary/20 border border-dashed border-white/5"
            >
              <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/40 italic">No se encontraron testimonios coincidentes.</p>
            </motion.div>
          ) : (
            filteredTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-brand-secondary border border-white/5 group hover:border-brand-accent/30 transition-all duration-500 overflow-hidden"
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center font-['Cormorant_Garamond'] text-xl italic text-brand-accent font-bold">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-white font-bold tracking-wide">{testimonial.name}</h4>
                          <p className="text-brand-accent/60 text-[10px] uppercase tracking-[0.2em]">{testimonial.title || 'Cliente'}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < testimonial.rating ? 'fill-brand-accent text-brand-accent' : 'text-white/10'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-white/80 font-['Montserrat'] text-sm leading-relaxed italic border-l-2 border-brand-accent/20 pl-6 py-2 line-clamp-2">
                      "{testimonial.text}"
                    </p>

                    <div className="flex items-center gap-6 text-[9px] text-white/30 uppercase tracking-[0.2em]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(testimonial.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        {testimonial.isVisible ? (
                          <span className="flex items-center gap-1 text-green-500/60 font-bold uppercase tracking-widest">
                            <CheckCircle2 className="w-3 h-3" /> Visible
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500/60 font-bold uppercase tracking-widest">
                            <XCircle className="w-3 h-3" /> Oculto
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end gap-3 shrink-0">
                    <button 
                      onClick={() => toggleVisibility(testimonial.id, testimonial.isVisible)}
                      className={`p-3 ${testimonial.isVisible ? 'bg-green-500/5 text-green-500' : 'bg-white/5 text-white/40'} border border-white/10 hover:bg-white/10 transition-all duration-300 rounded-sm`}
                      title={testimonial.isVisible ? "Ocultar Testimonio" : "Mostrar Testimonio"}
                    >
                      {testimonial.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => setSelectedTestimonial(testimonial)}
                      className="p-3 bg-white/5 text-white/40 hover:text-white border border-white/10 transition-all duration-300 rounded-sm"
                      title="Ver Detalles"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-3 bg-red-400/5 text-red-400 hover:bg-red-400 hover:text-white border border-white/10 transition-all duration-300 rounded-sm"
                      title="Eliminar Testimonio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedTestimonial && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTestimonial(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-brand-secondary border border-white/10 shadow-2xl overflow-hidden rounded-sm"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-['Cormorant_Garamond'] text-3xl text-white italic tracking-wide">Detalles del Testimonio</h2>
                <button onClick={() => setSelectedTestimonial(null)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center font-['Cormorant_Garamond'] text-4xl italic text-brand-accent font-bold">
                      {selectedTestimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white text-2xl font-bold tracking-wide">{selectedTestimonial.name}</h3>
                      <p className="text-brand-accent/60 text-xs uppercase tracking-[0.3em] mt-1">{selectedTestimonial.title || 'Cliente'}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < selectedTestimonial.rating ? 'fill-brand-accent text-brand-accent' : 'text-white/10'}`} 
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">Reseña</p>
                  <p className="text-white/80 font-['Montserrat'] text-lg leading-relaxed italic border-l-4 border-brand-accent/20 pl-8 py-4 bg-white/5">
                    "{selectedTestimonial.text}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                  <div>
                    <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] mb-2 font-bold">Fecha de Envío</p>
                    <div className="flex items-center gap-3 text-white/60 text-xs uppercase tracking-widest font-medium">
                      <Calendar className="w-4 h-4 text-brand-accent/40" />
                      {new Date(selectedTestimonial.date).toLocaleString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] mb-2 font-bold">Estado de Visibilidad</p>
                    <button 
                      onClick={() => {
                        const newStatus = !selectedTestimonial.isVisible;
                        toggleVisibility(selectedTestimonial.id, selectedTestimonial.isVisible);
                        setSelectedTestimonial({ ...selectedTestimonial, isVisible: newStatus });
                      }}
                      className={`flex items-center gap-4 px-6 py-3 border ${selectedTestimonial.isVisible ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'} transition-all duration-500 group shadow-lg`}
                    >
                      {selectedTestimonial.isVisible ? (
                        <>
                          <Eye className="w-4 h-4" />
                          <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Público y Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Oculto del Sitio</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-brand-primary/50 flex justify-end gap-4">
                <button 
                  onClick={() => {
                    if (window.confirm('¿Eliminar este testimonio permanentemente?')) {
                      handleDelete(selectedTestimonial.id);
                      setSelectedTestimonial(null);
                    }
                  }}
                  className="px-8 py-4 text-red-400 text-[10px] uppercase tracking-widest hover:bg-red-400/5 transition-all font-bold"
                >
                  Eliminar permanentemente
                </button>
                <button 
                  onClick={() => setSelectedTestimonial(null)} 
                  className="px-10 py-4 bg-brand-accent text-black font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-all shadow-xl"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
