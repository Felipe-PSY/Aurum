import { motion } from 'motion/react';
import { Award, Heart, Gem } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

import { useDb } from '../context/DbContext';

export function BrandStorySection() {
  const { siteConfig } = useDb();
  const { title, subtitle, p1, p2 } = siteConfig.sectionContent.brandStory;

  // We keep the values array for the icons/sub-items if they were to be dynamic, 
  // but for now we follow the user's defined structure in siteConfig
  const values = [
    {
      icon: Award,
      title: "Herencia",
      description: "Más de seis décadas de magistral creación de joyería transmitidas a través de generaciones"
    },
    {
      icon: Gem,
      title: "Artesanía",
      description: "Cada pieza meticulosamente elaborada a mano por nuestros maestros artesanos"
    },
    {
      icon: Heart,
      title: "Exclusividad",
      description: "Ediciones limitadas diseñadas para quienes aprecian lo extraordinario"
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Lado de la Imagen */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <div className="relative h-[600px] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1619605401830-5430fea8d41b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwY3JhZnRzbWFuc2hpcCUyMGhhbmRzfGVufDF8fHx8MTc3Mzg0OTA0M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Artesanía de Joyería"
                className="w-full h-full object-cover"
              />
              {/* Marco de Oro */}
              <div className="absolute inset-0 border-4 border-brand-accent/20 m-4"></div>
            </div>
            
            {/* Acento Flotante */}
            <motion.div
              className="absolute -top-6 -right-6 w-32 h-32 bg-brand-accent/10 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
          </motion.div>

          {/* Lado del Contenido */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <p className="font-['Montserrat'] text-brand-accent tracking-[0.3em] mb-4" style={{ fontWeight: 400, fontSize: '0.75rem' }}>
              {subtitle}
            </p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-black mb-6" style={{ fontWeight: 300 }}>
              {title}
            </h2>
            <div className="w-16 h-[1px] bg-brand-accent mb-8"></div>
            
            <div className="space-y-6 mb-12">
              <p className="font-['Montserrat'] text-gray-700 leading-relaxed" style={{ fontWeight: 300 }}>
                {p1}
              </p>
              <p className="font-['Montserrat'] text-gray-700 leading-relaxed" style={{ fontWeight: 300 }}>
                {p2}
              </p>
            </div>

            {/* Cuadrícula de Valores */}
            <div className="space-y-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="flex gap-6 items-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 transition-colors duration-300">
                      <value.icon className="w-5 h-5 text-brand-accent" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-['Cormorant_Garamond'] text-2xl text-black mb-2" style={{ fontWeight: 500 }}>
                      {value.title}
                    </h3>
                    <p className="font-['Montserrat'] text-gray-600 text-sm" style={{ fontWeight: 300 }}>
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
