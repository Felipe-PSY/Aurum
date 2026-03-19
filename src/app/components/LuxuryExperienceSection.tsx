import { motion } from 'motion/react';
import { Package, Shield, Sparkles, Clock } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

import { useDb } from '../context/DbContext';

export function LuxuryExperienceSection() {
  const { siteConfig } = useDb();
  const { title, subtitle, features } = siteConfig.sectionContent.luxuryExperience;

  // Map features to use the appropriate icons (static for now)
  const experiences = [
    { icon: Package, title: features[0].title, description: features[0].description },
    { icon: Shield, title: features[1].title, description: features[1].description },
    { icon: Sparkles, title: features[2].title, description: features[2].description },
    { icon: Clock, title: features[3].title, description: features[3].description }
  ];

  return (
    <section className="py-24 px-6 bg-[#FAFAFA] relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
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
          <div className="w-24 h-[1px] bg-brand-accent mx-auto mb-6"></div>
          <p className="font-['Montserrat'] text-gray-600 max-w-2xl mx-auto" style={{ fontWeight: 300 }}>
            Su viaje con nosotros va mucho más allá de la adquisición. Ofrecemos una experiencia de lujo inigualable diseñada para honrar su inversión.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Lado de la Imagen */}
          <motion.div
            className="relative h-[500px] overflow-hidden order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1759563876829-47c081a2afd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwYm94JTIwcGFja2FnaW5nfGVufDF8fHx8MTc3Mzg0OTA0NHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Embalaje de Lujo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            
            {/* Resplandor flotante */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
          </motion.div>

          {/* Tarjetas de Experiencia */}
          <motion.div
            className="grid sm:grid-cols-2 gap-6 order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.title}
                className="group relative bg-white p-8 hover:shadow-2xl hover:shadow-brand-accent/10 transition-all duration-500 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Icono */}
                <div className="mb-6 relative">
                  <div className="w-14 h-14 rounded-full bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 transition-colors duration-300">
                    <experience.icon className="w-6 h-6 text-brand-accent" />
                  </div>
                  
                  {/* Anillo animado */}
                  <motion.div
                    className="absolute inset-0 w-14 h-14 rounded-full border border-brand-accent/30"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  ></motion.div>
                </div>

                {/* Contenido */}
                <h3 className="font-['Cormorant_Garamond'] text-2xl text-black mb-3 group-hover:text-brand-accent transition-colors duration-300" style={{ fontWeight: 500 }}>
                  {experience.title}
                </h3>
                <p className="font-['Montserrat'] text-gray-600 text-sm" style={{ fontWeight: 300 }}>
                  {experience.description}
                </p>

                {/* Acento de borde */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-accent group-hover:w-full transition-all duration-500"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Sección de Llamada a la Acción (CTA) */}
        <motion.div
          className="text-center bg-black text-white py-16 px-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl mb-4" style={{ fontWeight: 300 }}>
            Programe una Consulta Privada
          </h3>
          <p className="font-['Montserrat'] text-brand-text mb-8 max-w-xl mx-auto" style={{ fontWeight: 300 }}>
            Descubra nuestra colección en persona con un especialista en joyería dedicado
          </p>
          <button className="group relative inline-flex items-center gap-2 px-10 py-4 bg-transparent border border-brand-accent text-brand-accent font-['Montserrat'] tracking-widest overflow-hidden transition-all duration-500 hover:text-black" style={{ fontWeight: 400, fontSize: '0.875rem', letterSpacing: '0.15em' }}>
            <span className="absolute inset-0 bg-brand-accent translate-x-full group-hover:translate-y-0 transition-transform duration-500"></span>
            <span className="relative z-10">RESERVAR CITA</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
