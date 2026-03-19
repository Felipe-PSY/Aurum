import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Send, X, CheckCircle2 } from 'lucide-react';
import { useDb } from '../context/DbContext';

interface TestimonialFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestimonialForm({ isOpen, onClose }: TestimonialFormProps) {
  const { addTestimonial } = useDb();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    text: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTestimonial({
      ...formData,
      rating
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setFormData({ name: '', text: '' });
      setRating(5);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white p-8 md:p-12 shadow-2xl border border-gray-100"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-brand-accent transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-3xl text-black mb-2 italic">¡Muchas Gracias!</h3>
                <p className="font-['Montserrat'] text-gray-500 text-sm tracking-wide">Tu experiencia ha sido enviada con éxito y será compartida tras ser revisada.</p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <h2 className="font-['Cormorant_Garamond'] text-4xl text-black mb-2 italic tracking-wide">Tu Experiencia</h2>
                  <div className="w-12 h-[1px] bg-brand-accent mx-auto mb-4" />
                  <p className="text-gray-400 font-['Montserrat'] text-[10px] tracking-[0.3em] uppercase">Nos encantaría saber qué piensas de Aurum</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star 
                          className={`w-8 h-8 ${
                            (hover || rating) >= star 
                              ? 'fill-brand-accent text-brand-accent' 
                              : 'text-gray-200'
                          } transition-colors duration-200`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest">Nombre Completo</label>
                    <input 
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 p-4 text-black font-['Montserrat'] text-sm focus:border-brand-accent outline-none transition-colors"
                      placeholder="Ej: Isabella Fontaine"
                    />
                  </div>


                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest">Tu Comentario</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.text}
                      onChange={e => setFormData({...formData, text: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 p-4 text-black font-['Montserrat'] text-sm focus:border-brand-accent outline-none transition-colors resize-none"
                      placeholder="Describe tu experiencia con nuestras joyas y servicios..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 py-5 bg-brand-accent text-black font-bold text-sm tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-500 group"
                  >
                    Enviar Experiencia
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
