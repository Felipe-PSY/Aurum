import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './ImageWithFallback';
import { useDb } from '../context/DbContext';

export function ProductSection() {
  const { products: dbProducts } = useDb();
  
  const displayProducts = dbProducts
    .filter(p => p.isFeatured)
    .slice(0, 4);

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);

  return (
    <section className="py-24 px-6 bg-brand-primary">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-['Montserrat'] text-brand-accent tracking-[0.3em] mb-4" style={{ fontWeight: 400, fontSize: '0.75rem' }}>
            PIEZAS DISTINTIVAS
          </p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white mb-4" style={{ fontWeight: 300 }}>
            Obras Maestras le Esperan
          </h2>
          <div className="w-24 h-[1px] bg-brand-accent mx-auto"></div>
        </motion.div>

        {/* Cuadrícula de Productos */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="group relative bg-white/5 backdrop-blur-sm overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={`/product/${product.id}`} className="block">
                {/* Contenedor de Imagen */}
                <div className="relative h-[300px] sm:h-[400px] overflow-hidden bg-black/50">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
                    priority={index < 2}
                  />
                  
                  {/* Superposición al Pasar el Cursor */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  
                  {/* Botón Añadir a la Bolsa */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  >
                    <div className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-black font-['Montserrat'] text-xs tracking-widest hover:bg-brand-text transition-colors duration-300" style={{ fontWeight: 500 }}>
                      <ShoppingBag className="w-4 h-4" />
                      ESPECIAL
                    </div>
                  </motion.div>

                  {/* Efecto de resplandor al pasar el cursor */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0 border border-brand-accent/30 m-4"></div>
                  </div>
                </div>

                {/* Información del Producto */}
                <div className="p-4 sm:p-6">
                  <p className="font-['Montserrat'] text-brand-accent text-[10px] sm:text-xs tracking-wider mb-1 sm:mb-2" style={{ fontWeight: 400 }}>
                    {product.category}
                  </p>
                  <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-xl text-white mb-2 sm:mb-3" style={{ fontWeight: 400 }}>
                    {product.name}
                  </h3>
                  <p className="font-['Montserrat'] text-brand-text text-xs sm:text-sm" style={{ fontWeight: 300 }}>
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>

              {/* Efecto de brillo */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              ></motion.div>
            </motion.div>
          ))}
        </div>

        {/* Botón Ver Todo */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link to="/catalog" className="group relative inline-flex items-center gap-2 px-10 py-4 bg-transparent border border-brand-accent text-brand-accent font-['Montserrat'] tracking-widest overflow-hidden transition-all duration-500 hover:text-black" style={{ fontWeight: 400, fontSize: '0.875rem', letterSpacing: '0.15em' }}>
            <span className="absolute inset-0 bg-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
            <span className="relative z-10 uppercase">Ver todas las piezas</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
