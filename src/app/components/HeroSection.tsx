import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { useDb } from '../context/DbContext';

export function HeroSection() {
  const { siteConfig } = useDb();
  const { hero } = siteConfig;

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
      {/* Imagen de Fondo */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={hero.backgroundImage}
          alt={hero.title}
          className="w-full h-full object-cover"
          priority
        />
        {/* Capa de Degradado */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6 text-brand-accent" />
          </div>
          
          <h1 
            className="font-['Cormorant_Garamond'] text-6xl md:text-7xl lg:text-8xl mb-6 text-white tracking-wide"
            style={{ fontWeight: 300 }}
          >
            {hero.title}
          </h1>
          
          <p className="font-['Montserrat'] text-brand-text text-base md:text-lg mb-12 max-w-2xl mx-auto tracking-wide" style={{ fontWeight: 300 }}>
            {hero.subtitle}
          </p>

          <motion.button
            className="group relative inline-flex items-center gap-2 px-10 py-4 bg-transparent border border-brand-accent text-brand-accent font-['Montserrat'] tracking-widest overflow-hidden transition-all duration-500 hover:text-black"
            style={{ fontWeight: 400, fontSize: '0.875rem', letterSpacing: '0.15em' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="absolute inset-0 bg-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
            <span className="relative z-10">{hero.buttonText}</span>
          </motion.button>
        </motion.div>

        {/* Indicador de Desplazamiento */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 1.5, duration: 0.5 },
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-brand-accent to-transparent"></div>
        </motion.div>
      </div>
    </section>
  );
}
