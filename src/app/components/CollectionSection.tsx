import { motion } from 'motion/react';
import { ImageWithFallback } from './ImageWithFallback';

import { useDb } from '../context/DbContext';

export function CollectionSection() {
  const { siteConfig } = useDb();
  const { title, subtitle, items } = siteConfig.sectionContent.collections;

  return (
    <section className="py-24 px-6 bg-[#FAFAFA]">
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
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-black mb-4" style={{ fontWeight: 300 }}>
            {title}
          </h2>
          <div className="w-24 h-[1px] bg-brand-accent mx-auto"></div>
        </motion.div>

        {/* Cuadrícula de Colecciones */}
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((collection, index) => (
            <motion.div
              key={collection.id}
              className="group relative overflow-hidden bg-white cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Contenedor de Imagen */}
              <div className="relative h-[500px] overflow-hidden">
                <ImageWithFallback
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Capa de Degradado */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Contenido al Pasar el Cursor */}
                <div className="absolute inset-0 flex items-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="text-white">
                    <h3 className="font-['Cormorant_Garamond'] text-3xl mb-2" style={{ fontWeight: 400 }}>
                      {collection.title}
                    </h3>
                    <p className="font-['Montserrat'] text-sm text-brand-text mb-4" style={{ fontWeight: 300 }}>
                      {collection.description}
                    </p>
                    <span className="inline-block text-brand-accent font-['Montserrat'] text-xs tracking-widest border-b border-brand-accent pb-1" style={{ fontWeight: 400 }}>
                      DESCUBRIR MÁS
                    </span>
                  </div>
                </div>
              </div>

              {/* Superposición del Título (visible por defecto) */}
              <div className="absolute bottom-8 left-8 right-8 group-hover:opacity-0 transition-opacity duration-500">
                <h3 className="font-['Cormorant_Garamond'] text-3xl text-white" style={{ fontWeight: 400 }}>
                  {collection.title}
                </h3>
              </div>

              {/* Efecto de Resplandor */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent blur-sm"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
