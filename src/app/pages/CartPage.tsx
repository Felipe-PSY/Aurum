import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { CheckoutModal } from '../components/CheckoutModal';
import { useState } from 'react';

export function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, cartCount } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const formattedPrice = (price: number) => new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);

  return (
    <div className="min-h-screen bg-brand-primary pt-32 pb-24 px-4 sm:px-6 font-['Montserrat']">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <Link to="/catalog" className="flex items-center gap-2 text-brand-accent/60 hover:text-brand-accent transition-colors mb-4 text-xs tracking-widest uppercase">
              <ChevronLeft className="w-4 h-4" />
              Continuar Comprando
            </Link>
            <h1 className="font-['Cormorant_Garamond'] text-5xl text-white italic tracking-wide">
              Tu Bolsa <span className="text-brand-accent font-normal not-italic text-2xl ml-4">({cartCount} artículos)</span>
            </h1>
          </div>
          {cart.length > 0 && (
            <button 
              onClick={clearCart}
              className="flex items-center gap-2 text-brand-text/40 hover:text-red-400 transition-colors text-xs tracking-widest uppercase"
            >
              <Trash2 className="w-4 h-4" />
              Vaciar Bolsa
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Lista de Productos */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="popLayout">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col sm:flex-row gap-6 p-4 sm:p-6 bg-white/[0.02] border border-white/5 group hover:border-brand-accent/30 transition-all duration-500"
                  >
                    {/* Imagen */}
                    <Link to={`/product/${item.id}`} className="w-full sm:w-32 h-40 sm:h-32 shrink-0 overflow-hidden bg-[#1A1A1A]">
                      <ImageWithFallback 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link to={`/product/${item.id}`} className="font-['Cormorant_Garamond'] text-xl sm:text-2xl text-white hover:text-brand-accent transition-colors block mb-1">
                            {item.name}
                          </Link>
                          <p className="text-brand-text/40 text-[10px] tracking-widest uppercase">
                            {item.category} {item.subCategory ? `• ${item.subCategory}` : ''}
                          </p>
                        </div>
                        <p className="font-['Montserrat'] text-brand-accent font-medium tracking-wider">
                          {formattedPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        {/* Controles de Cantidad */}
                        <div className="flex items-center border border-white/10 px-2 py-1 gap-4 bg-black">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-brand-text/40 hover:text-white transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-brand-text/40 hover:text-white transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-brand-text/20 hover:text-red-400 transition-colors text-[10px] tracking-[0.2em] uppercase"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10"
                >
                  <ShoppingBag className="w-16 h-16 text-brand-accent/20 mb-6" />
                  <p className="font-['Cormorant_Garamond'] text-3xl text-white italic mb-6">Tu bolsa está vacía</p>
                  <Link 
                    to="/catalog" 
                    className="px-10 py-4 bg-brand-accent text-black text-xs tracking-[0.3em] font-bold uppercase hover:bg-white transition-all duration-300"
                  >
                    Explorar Colecciones
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-40 bg-white/[0.03] border border-white/10 p-6 sm:p-8 space-y-8">
              <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl text-white tracking-wide border-b border-white/5 pb-4">
                Resumen de Pedido
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text/60 uppercase tracking-widest">Subtotal</span>
                  <span className="text-white tracking-widest">{formattedPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text/60 uppercase tracking-widest">Envío</span>
                  <span className="text-brand-accent uppercase tracking-widest">Complementario</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between items-end mb-8">
                  <span className="font-['Cormorant_Garamond'] text-2xl text-white italic">Total</span>
                  <span className="text-2xl text-brand-accent font-bold tracking-tighter">{formattedPrice(totalPrice)}</span>
                </div>

                <button 
                  disabled={cart.length === 0}
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-brand-accent text-black font-bold text-sm tracking-[0.2em] uppercase hover:bg-white disabled:opacity-30 disabled:hover:bg-brand-accent transition-all duration-500 group"
                >
                  Proceder al Pago
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
                
                <p className="mt-6 text-[9px] text-brand-text/30 text-center leading-loose uppercase tracking-[0.2em]">
                  Impuestos incluidos. El envío se coordina vía WhatsApp tras la confirmación de datos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        total={totalPrice}
      />
    </div>
  );
}
