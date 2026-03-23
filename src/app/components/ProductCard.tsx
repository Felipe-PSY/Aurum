import { motion } from 'motion/react';
import { ShoppingBag, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './ImageWithFallback';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { cart, addToCart, updateQuantity } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(product.price);
  const isOutOfStock = product.stock !== undefined && product.stock === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
      className="group"
    >
      {/* Contenedor de Imagen */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#1A1A1A] mb-6 shadow-2xl">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <ImageWithFallback 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          />
          
          {/* Capa de Brillo al Hoover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
        
        {/* Botón Añadir a la Bolsa / Controles de Cantidad */}
        <div className="absolute inset-x-0 bottom-0 p-6 lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-500 z-10">
          {!cartItem ? (
            <button 
              disabled={isOutOfStock}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isOutOfStock) addToCart(product);
              }}
              className={`w-full flex items-center justify-center gap-2 py-4 ${isOutOfStock ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-brand-accent text-black hover:bg-white'} font-['Montserrat'] text-[10px] tracking-[0.2em] uppercase transition-all duration-300 font-bold shadow-2xl`}
            >
              <ShoppingBag className="w-4 h-4" />
              {isOutOfStock ? 'Agotado' : 'Añadir a la Bolsa'}
            </button>
          ) : (
            <div className="flex items-center bg-black/60 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(product.id, -1);
                }}
                className="flex-1 py-4 flex items-center justify-center hover:bg-brand-accent hover:text-black transition-colors text-white border-r border-white/10"
              >
                <Minus className="w-3 h-3" />
              </button>
              <div className="px-6 py-4 text-white font-bold font-['Montserrat'] text-xs min-w-[3rem] text-center">
                {cartItem.quantity}
              </div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(product.id, 1);
                }}
                className="flex-1 py-4 flex items-center justify-center hover:bg-brand-accent hover:text-black transition-colors text-white border-l border-white/10"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Marcadores de Nuevo/Destacado (Opcional) */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isOutOfStock && (
            <span className="px-3 py-1 bg-red-500/80 backdrop-blur-md border border-red-400/50 text-white text-[8px] tracking-[0.3em] uppercase font-bold">
              Agotado
            </span>
          )}
          {index < 2 && !isOutOfStock && (
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] tracking-[0.3em] uppercase">
              Nuevo
            </span>
          )}
          {cartItem && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-6 h-6 bg-brand-accent flex items-center justify-center rounded-full shadow-lg border border-black/20"
            >
              <span className="text-[10px] font-bold text-black font-['Montserrat']">{cartItem.quantity}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Info del Producto */}
      <div className="space-y-2 text-center">
        <Link to={`/product/${product.id}`} className="block group/title">
          <h3 className="font-['Cormorant_Garamond'] text-2xl text-white group-hover/title:text-brand-accent transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        <div className="flex flex-col items-center gap-2">
          <p className="text-brand-text/40 text-[10px] tracking-[0.2em] uppercase font-['Montserrat']">
            {product.category}
          </p>
          <div className="w-8 h-[1px] bg-brand-accent/30" />
          <p className="text-brand-accent font-['Montserrat'] text-sm tracking-widest font-medium">
            {formattedPrice}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
