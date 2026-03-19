import { motion } from 'motion/react';
import { ImageWithFallback } from './ImageWithFallback';

import { useDb } from '../context/DbContext';

export function GallerySection() {
  const { siteConfig } = useDb();
  const { title, subtitle, images: galleryItems } = siteConfig.sectionContent.gallery;

  // Map to the structure used by the component
  const galleryImages = galleryItems.map(item => ({
    id: item.id,
    image: item.url,
    title: item.alt || "Galería Aurum",
    size: item.id % 3 === 0 ? 'large' : item.id % 2 === 0 ? 'medium' : 'small'
  }));

  return (
    <section className="py-24 px-6 bg-black">
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
            {subtitle}
          </p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white mb-4" style={{ fontWeight: 300 }}>
            {title}
          </h2>
          <div className="w-24 h-[1px] bg-brand-accent mx-auto"></div>
        </motion.div>

        {/* Galería Estilo Masonry */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((item, index) => {
            const heightClass = 
              item.size === 'large' ? 'row-span-2 h-[600px]' :
              item.size === 'medium' ? 'h-[400px]' :
              'h-[300px]';

            return (
              <motion.div
                key={item.id}
                className={`group relative overflow-hidden cursor-pointer ${heightClass}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 0.98 }}
              >
                {/* Imagen */}
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                />

                {/* Superposición */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Título */}
                <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div>
                    <h3 className="font-['Cormorant_Garamond'] text-2xl text-white mb-2" style={{ fontWeight: 400 }}>
                      {item.title}
                    </h3>
                    <div className="w-16 h-[1px] bg-brand-accent"></div>
                  </div>
                </div>

                {/* Borde resplandeciente al pasar el cursor */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 border border-brand-accent/40 m-2"></div>
                </div>

                {/* Acentos de esquina */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 m-4"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 m-4"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Ver Más */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <button className="group relative inline-flex items-center gap-2 px-10 py-4 bg-transparent border border-brand-accent text-brand-accent font-['Montserrat'] tracking-widest overflow-hidden transition-all duration-500 hover:text-black" style={{ fontWeight: 400, fontSize: '0.875rem', letterSpacing: '0.15em' }}>
            <span className="absolute inset-0 bg-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
            <span className="relative z-10">VER CATÁLOGO</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
