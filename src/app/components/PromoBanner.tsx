import { motion } from 'motion/react';
import { useDb } from '../context/DbContext';
import { ImageWithFallback } from './ImageWithFallback';
import { ArrowRight } from 'lucide-react';

export function PromoBanner() {
  const { siteConfig } = useDb();
  const activeBanners = siteConfig.banners.filter(b => b.isActive);

  if (activeBanners.length === 0) return null;

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {activeBanners.map((banner, index) => (
          <motion.div
            key={banner.id}
            className="group relative h-[300px] md:h-[400px] overflow-hidden bg-black"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            {/* Background Image */}
            {banner.image ? (
              <ImageWithFallback
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-primary to-black flex items-center justify-center">
                <div className="w-full h-full border border-brand-accent/20 m-4"></div>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                className="max-w-xl"
              >
                {banner.subtitle && (
                  <p className="font-['Montserrat'] text-brand-accent tracking-[0.3em] mb-4 text-xs md:text-sm" style={{ fontWeight: 400 }}>
                    {banner.subtitle.toUpperCase()}
                  </p>
                )}
                <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-6xl text-white mb-6" style={{ fontWeight: 300 }}>
                  {banner.title}
                </h2>
                
                {banner.link && (
                  <a
                    href={banner.link}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-['Montserrat'] text-xs tracking-widest hover:bg-brand-accent hover:text-white transition-all duration-300"
                    style={{ fontWeight: 500 }}
                  >
                    EXPLORAR AHORA
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            </div>

            {/* Border Accents */}
            <div className="absolute inset-0 border border-white/20 m-4 pointer-events-none group-hover:border-brand-accent/50 transition-colors duration-500"></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
