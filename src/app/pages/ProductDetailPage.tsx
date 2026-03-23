import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ShoppingBag, ChevronLeft, Star, ShieldCheck, Truck, RefreshCw, Plus, Minus } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ProductCard } from '../components/ProductCard';
import { CheckoutModal } from '../components/CheckoutModal';

export function ProductDetailPage() {
  const { id } = useParams();
  const { cart, addToCart, updateQuantity } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const product = useMemo(() => 
    products.find(p => String(p.id) === id), 
  [id]);

  const cartItem = useMemo(() => 
    cart.find(item => String(item.id) === id), 
  [cart, id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-32">
        <div className="text-center">
          <h2 className="text-brand-accent font-['Cormorant_Garamond'] text-4xl mb-6 italic">Producto no encontrado</h2>
          <Link to="/catalog" className="text-white hover:text-brand-accent transition-colors uppercase tracking-[0.2em] text-xs">Volver al Catálogo</Link>
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(product.price);

  return (
    <div className="min-h-screen bg-brand-primary pt-32 pb-24 px-4 sm:px-6 font-['Montserrat']">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <Link to="/catalog" className="flex items-center gap-2 text-brand-text/40 hover:text-brand-accent transition-colors mb-8 sm:mb-12 text-xs tracking-widest uppercase">
          <ChevronLeft className="w-4 h-4" />
          Volver a {product.category}
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 mb-24 lg:mb-32">
          {/* Imágenes */}
          <div className="space-y-4 sm:space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[4/5] bg-white/[0.03] border border-white/5 overflow-hidden"
            >
              <ImageWithFallback 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </motion.div>
            
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {[0, 1, 2, 3].map((i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square bg-white/[0.03] border transition-all duration-300 ${activeImage === i ? 'border-brand-accent' : 'border-white/5 hover:border-white/20'}`}
                >
                  <ImageWithFallback 
                    src={product.image} 
                    alt={`${product.name} shadow ${i}`} 
                    className={`w-full h-full object-cover ${activeImage !== i ? 'opacity-40' : ''}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Detalles */}
          <div className="flex flex-col">
            <div className="mb-6 sm:mb-10">
              <div className="flex items-center gap-4 mb-3 sm:mb-4">
                <span className="text-brand-accent text-[9px] sm:text-[10px] tracking-[0.3em] uppercase border border-brand-accent/30 px-2 sm:px-3 py-1 bg-brand-accent/5">
                  Pieza de Autor
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-brand-accent text-brand-accent" />)}
                </div>
              </div>
              
              <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl lg:text-6xl text-white mb-4 tracking-wide leading-tight">
                {product.name}
              </h1>
              <p className="text-3xl font-['Montserrat'] text-brand-accent tracking-tighter mb-8 font-light italic flex items-center gap-4">
                {formattedPrice}
                {product.stock !== undefined && product.stock === 0 && (
                  <span className="text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 uppercase tracking-[0.2em] font-bold not-italic">
                    Agotado
                  </span>
                )}
              </p>
              
              <p className="text-brand-text/60 leading-relaxed text-sm tracking-wide mb-10 max-w-xl">
                Esta exquisita pieza de la colección {product.category} ha sido elaborada meticulosamente por nuestros maestros artesanos. 
                Utilizando los materiales más finos, cada detalle refleja la elegancia atemporal y el compromiso con la excelencia que define a Aurum. 
                Perfecta para elevar cualquier ocasión especial o como un legado de distinción.
              </p>

              <div className="grid sm:grid-cols-2 gap-8 mb-12 border-y border-white/5 py-8">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-black transition-all">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-brand-text/40 uppercase tracking-widest">Certificado de Autenticidad</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-black transition-all">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-brand-text/40 uppercase tracking-widest">Envío Gratuito Asegurado</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {product.stock !== undefined && product.stock === 0 ? (
                  <button 
                    disabled
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 text-white/20 font-bold text-xs tracking-[0.2em] uppercase cursor-not-allowed"
                  >
                    Producto Agotado
                  </button>
                ) : !cartItem ? (
                  <button 
                    onClick={() => addToCart(product)}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-white text-black font-bold text-xs tracking-[0.2em] uppercase hover:bg-brand-accent transition-all duration-500"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Añadir a la Bolsa
                  </button>
                ) : (
                  <div className="flex-1 flex items-center bg-white border border-brand-accent/20 overflow-hidden shadow-sm">
                    <button 
                      onClick={() => updateQuantity(product.id, -1)}
                      className="flex-1 py-5 flex items-center justify-center hover:bg-brand-accent hover:text-black transition-colors text-black border-r border-brand-accent/10"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <div className="px-8 py-5 text-black font-bold font-['Montserrat'] text-sm min-w-[4rem] text-center">
                      {cartItem.quantity}
                    </div>
                    <button 
                      onClick={() => updateQuantity(product.id, 1)}
                      className="flex-1 py-5 flex items-center justify-center hover:bg-brand-accent hover:text-black transition-colors text-black border-l border-brand-accent/10"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {product.stock !== undefined && product.stock > 0 && (
                  <button 
                    onClick={() => setIsCheckoutOpen(true)}
                    className="flex-1 py-5 bg-brand-accent text-black font-bold text-xs tracking-[0.2em] uppercase hover:bg-white transition-all duration-500"
                  >
                    Proceder al Pago
                  </button>
                )}
              </div>
            </div>

            <div className="mt-auto pt-10 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-brand-text/30 text-[10px] uppercase tracking-widest">
                    <RefreshCw className="w-3 h-3" />
                    <span>Devolución garantizada en 30 días</span>
                </div>
                <p className="text-brand-text/20 text-[9px] uppercase tracking-[0.2em] leading-relaxed">
                    Referencia: AU-{product.id}{product.category.substring(0,2).toUpperCase()} - {product.gender.toUpperCase()}
                </p>
            </div>
          </div>
        </div>

        {/* Artículos Relacionados */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-white/10 pt-24">
            <h2 className="font-['Cormorant_Garamond'] text-4xl text-white mb-16 text-center italic tracking-widest">
              Artículos Relacionados
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </section>
        )}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItem ? [cartItem] : [{ ...product, quantity: 1 }]}
        total={cartItem ? cartItem.price * cartItem.quantity : product.price}
      />
      </div>
    </div>
  );
}
