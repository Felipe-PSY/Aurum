import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Phone, User, Wallet, AlertCircle, Building2, Home } from 'lucide-react';
import { useDb } from '../context/DbContext';
import { useCart } from '../context/CartContext';
import { OrderItem } from '../types';
import { COLOMBIA_DATA, DEPARTAMENTOS } from '../data/colombia';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  total: number;
}

export function CheckoutModal({ isOpen, onClose, items, total }: CheckoutModalProps) {
  const { addOrder } = useDb();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    departamento: '',
    ciudad: '',
    barrio: '',
    direccion: '',
    infoAdicional: '',
    tipoVivienda: 'Casa',
    metodoPago: 'Transferencia Bancaria'
  });
  const [phoneError, setPhoneError] = useState('');
  const [ciudades, setCiudades] = useState<string[]>([]);
  const { clearCart } = useCart();

  useEffect(() => {
    if (formData.departamento) {
      setCiudades(COLOMBIA_DATA[formData.departamento] || []);
      setFormData(prev => ({ ...prev, ciudad: '' }));
    }
  }, [formData.departamento]);

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
    
    if (formData.telefono.length !== 10) {
      setPhoneError('El número debe tener exactamente 10 dígitos');
      return;
    }
    
    const greeting = getGreeting();
    const articleText = items.length === 1 ? 'el siguiente artículo' : 'los siguientes artículos';
    
    let productList = items.map(item => `- ${item.name} (Cantidad: ${item.quantity})`).join('\n');
    
    const fullDireccion = `${formData.direccion}, ${formData.barrio}, ${formData.ciudad}, ${formData.departamento}. (${formData.tipoVivienda})${formData.infoAdicional ? ` - Ref: ${formData.infoAdicional}` : ''}`;

    const message = `${greeting}.
    
Quiero comprar ${articleText}:

${productList}

Mis datos son:

Nombre: ${formData.nombre} ${formData.apellido}
Teléfono: ${formData.telefono}
Departamento: ${formData.departamento}
Ciudad: ${formData.ciudad}
Barrio: ${formData.barrio}
Dirección: ${formData.direccion}
Tipo de vivienda: ${formData.tipoVivienda}
${formData.infoAdicional ? `Información adicional: ${formData.infoAdicional}\n` : ''}Método de pago: ${formData.metodoPago}`;

    addOrder({
      items,
      total,
      customer: {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        direccion: fullDireccion
      },
      metodoPago: formData.metodoPago
    });

    const whatsappUrl = `https://wa.me/573012636880?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6 overflow-y-auto py-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-brand-primary border border-white/10 shadow-2xl p-6 sm:p-8 md:p-12 my-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/40 hover:text-brand-accent transition-colors z-10"
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
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.telefono}
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData({...formData, telefono: value});
                    if (value.length > 0 && value.length < 10) {
                      setPhoneError('Debe tener 10 dígitos');
                    } else if (value.length === 10) {
                      setPhoneError('');
                    }
                  }}
                  className={`w-full bg-white/5 border ${phoneError ? 'border-red-500/50' : 'border-white/10'} p-4 text-white font-['Montserrat'] text-sm focus:border-brand-accent outline-none transition-colors`}
                  placeholder="300 000 0000"
                />
                {phoneError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] text-red-400 flex items-center gap-1 mt-1"
                  >
                    <AlertCircle className="w-3 h-3" /> {phoneError}
                  </motion.p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-accent uppercase tracking-widest flex items-center gap-2">
                    Departamento
                  </label>
                  <select 
                    required
                    value={formData.departamento}
                    onChange={e => setFormData({...formData, departamento: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 text-white font-['Montserrat'] text-sm focus:border-brand-accent outline-none transition-colors appearance-none"
                  >
                    <option value="" className="bg-brand-primary">Seleccionar...</option>
                    {DEPARTAMENTOS.map(dept => (
                      <option key={dept} value={dept} className="bg-brand-primary">{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-accent uppercase tracking-widest flex items-center gap-2">
                    Ciudad
                  </label>
                  <select 
                    required
                    disabled={!formData.departamento}
                    value={formData.ciudad}
                    onChange={e => setFormData({...formData, ciudad: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 text-white font-['Montserrat'] text-sm focus:border-brand-accent outline-none transition-colors appearance-none disabled:opacity-50"
                  >
                    <option value="" className="bg-brand-primary">Seleccionar...</option>
                    {ciudades.map(city => (
                      <option key={city} value={city} className="bg-brand-primary">{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-accent uppercase tracking-widest flex items-center gap-2">
                    Barrio
                  </label>
                  <input 
                    required
                    type="text"
                    value={formData.barrio}
                    onChange={e => setFormData({...formData, barrio: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 text-white font-['Montserrat'] text-sm focus:border-brand-accent outline-none transition-colors"
                    placeholder="Ej: El Poblado"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-accent uppercase tracking-widest flex items-center gap-2">
                    Dirección
                  </label>
                  <input 
                    required
                    type="text"
                    value={formData.direccion}
                    onChange={e => setFormData({...formData, direccion: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 text-white font-['Montserrat'] text-sm focus:border-brand-accent outline-none transition-colors"
                    placeholder="Ej: Calle 10 # 43-56"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-accent uppercase tracking-widest flex items-center gap-2">
                    Tipo de Vivienda
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, tipoVivienda: 'Casa'})}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 border font-['Montserrat'] text-[10px] tracking-widest uppercase transition-all ${formData.tipoVivienda === 'Casa' ? 'bg-brand-accent text-black border-brand-accent' : 'bg-white/5 text-white/40 border-white/10 hover:border-brand-accent/50'}`}
                    >
                      <Home className="w-3 h-3" /> Casa
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, tipoVivienda: 'Apartamento'})}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 border font-['Montserrat'] text-[10px] tracking-widest uppercase transition-all ${formData.tipoVivienda === 'Apartamento' ? 'bg-brand-accent text-black border-brand-accent' : 'bg-white/5 text-white/40 border-white/10 hover:border-brand-accent/50'}`}
                    >
                      <Building2 className="w-3 h-3" /> Apto
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-accent uppercase tracking-widest flex items-center gap-2">
                    Información Adicional
                  </label>
                  <input 
                    type="text"
                    value={formData.infoAdicional}
                    onChange={e => setFormData({...formData, infoAdicional: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 text-white font-['Montserrat'] text-sm focus:border-brand-accent outline-none transition-colors"
                    placeholder="Ej: Apto 402, Torre 1"
                  />
                </div>
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
                className="w-full flex items-center justify-center gap-3 py-5 bg-brand-accent text-black font-bold text-sm tracking-[0.2em] uppercase hover:bg-white transition-all duration-500 group mt-4"
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
