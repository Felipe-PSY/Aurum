import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Phone, User, MapPin, Wallet } from 'lucide-react';
import { useDb } from '../context/DbContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  total: number;
}

export function CheckoutModal({ isOpen, onClose, items, total }: CheckoutModalProps) {
  const { addOrder } = useDb();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    metodoPago: 'Transferencia Bancaria'
  });

  const formattedTotal = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(total);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    
    const greeting = getGreeting();
    const articleText = items.length === 1 ? 'el siguiente artículo' : 'los siguientes artículos';
    
    let productList = items.map(item => `- ${item.name} (Cantidad: ${item.quantity})`).join('\n');
    
    const message = `${greeting}.

Quiero comprar ${articleText}:

${productList}

Mis datos son:

Nombre: ${formData.nombre}
Apellido: ${formData.apellido}
Teléfono: ${formData.telefono}
Dirección: ${formData.direccion}
Método de pago: ${formData.metodoPago}`;

    addOrder({
      items,
      total,
      customer: {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        direccion: formData.direccion
      },
      metodoPago: formData.metodoPago
    });

    const whatsappUrl = `https://wa.me/573012636880?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
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
            className="relative w-full max-w-xl bg-brand-primary border border-white/10 shadow-2xl p-8 md:p-12"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/40 hover:text-brand-accent transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-10">
              <h2 className="font-['Cormorant_Garamond'] text-4xl text-white mb-2 italic tracking-wide">Finalizar Pedido</h2>
              <p className="text-brand-accent font-['Montserrat'] text-lg font-bold mb-2">{formattedTotal}</p>
              <p className="text-brand-text/40 text-[10px] tracking-[0.3em] uppercase">Completa tus datos para coordinar la entrega</p>
            </div>

            <form onSubmit={handleFinalize} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-accent uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3 h-3" /> Nombres
                  </label>
                  <input 
                    required
                    type="text"
                    value={formData.nombre}
                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 text-white font-['Montserrat'] text-sm focus:border-brand-accent outline-none transition-colors"
                    placeholder="Ej: Juan Camilo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-accent uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3 h-3" /> Apellidos
                  </label>
                  <input 
                    required
                    type="text"
                    value={formData.apellido}
                    onChange={e => setFormData({...formData, apellido: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 text-white font-['Montserrat'] text-sm focus:border-brand-accent outline-none transition-colors"
                    placeholder="Ej: Pérez García"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-brand-accent uppercase tracking-widest flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Número de Teléfono
                </label>
                <input 
                  required
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={formData.telefono}
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData({...formData, telefono: value});
                  }}
                  className="w-full bg-white/5 border border-white/10 p-4 text-white font-['Montserrat'] text-sm focus:border-brand-accent outline-none transition-colors"
                  placeholder="300 000 0000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-brand-accent uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Dirección de Entrega
                </label>
                <input 
                  required
                  type="text"
                  value={formData.direccion}
                  onChange={e => setFormData({...formData, direccion: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 text-white font-['Montserrat'] text-sm focus:border-brand-accent outline-none transition-colors"
                  placeholder="Ciudad, Barrio, Calle y Nro de Casa"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-brand-accent uppercase tracking-widest flex items-center gap-2">
                  <Wallet className="w-3 h-3" /> Método de Pago
                </label>
                <select 
                  value={formData.metodoPago}
                  onChange={e => setFormData({...formData, metodoPago: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 text-white font-['Montserrat'] text-sm focus:border-brand-accent outline-none transition-colors appearance-none"
                >
                  <option className="bg-brand-primary" value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option className="bg-brand-primary" value="Wompi / Tarjeta">Wompi / Tarjeta de Crédito</option>
                  <option className="bg-brand-primary" value="Pago Contra Entrega">Pago Contra Entrega</option>
                  <option className="bg-brand-primary" value="Nequi / Daviplata">Nequi / Daviplata</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-5 bg-brand-accent text-black font-bold text-sm tracking-[0.2em] uppercase hover:bg-white transition-all duration-500 group mt-8"
              >
                Finalizar Pago vía WhatsApp
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
