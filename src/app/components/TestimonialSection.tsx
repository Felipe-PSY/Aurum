import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

const testimonials = [
  {
    id: 1,
    name: "Isabella Fontaine",
    title: "Coleccionista de Arte",
    image: "https://images.unsplash.com/photo-1678723357379-d87f2a0ec8ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBwb3J0cmFpdCUyMGZhc2hpb258ZW58MXx8fHwxNzczNzk0NTY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    text: "La atención al detalle es impresionante. Cada pieza no es solo una joya, sino arte portátil que cuenta una historia. He formado toda mi colección aquí durante la última década.",
    rating: 5
  },
  {
    id: 2,
    name: "Victoria Laurent",
    title: "Diseñadora de Moda",
    image: "https://images.unsplash.com/photo-1764179690227-af049306cd20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHdlYXJpbmclMjBlbGVnYW50JTIwamV3ZWxyeXxlbnwxfHx8fDE3NzM4MDY3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    text: "Artesanía exquisita que rivaliza con las mejores casas europeas. Las piezas de diamante son particularmente impresionantes, con una claridad y brillantez excepcionales.",
    rating: 5
  }
];

export function TestimonialSection() {
  return (
    <section className="py-24 px-6 bg-white">
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
            TESTIMONIOS DE CLIENTES
          </p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-black mb-4" style={{ fontWeight: 300 }}>
            Palabras de Nuestros Clientes
          </h2>
          <div className="w-24 h-[1px] bg-brand-accent mx-auto"></div>
        </motion.div>

        {/* Cuadrícula de Testimonios */}
        <div className="grid md:grid-cols-2 gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="relative bg-[#FAFAFA] p-10 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
                {/* Icono de Cita */}
                <div className="absolute -top-4 left-10 w-12 h-12 bg-brand-accent flex items-center justify-center">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                {/* Estrellas */}
                <div className="flex gap-1 mb-6 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-accent text-brand-accent" />
                  ))}
                </div>

                {/* Texto del Testimonio */}
                <p className="font-['Montserrat'] text-gray-700 leading-relaxed mb-8 text-base" style={{ fontWeight: 300, fontStyle: 'italic' }}>
                  "{testimonial.text}"
                </p>

                {/* Información del Cliente */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 overflow-hidden rounded-full">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 ring-2 ring-brand-accent/20"></div>
                  </div>
                  <div>
                    <h4 className="font-['Cormorant_Garamond'] text-xl text-black" style={{ fontWeight: 500 }}>
                      {testimonial.name}
                    </h4>
                    <p className="font-['Montserrat'] text-gray-500 text-sm" style={{ fontWeight: 300 }}>
                      {testimonial.title}
                    </p>
                  </div>
                </div>

                {/* Línea decorativa */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Efecto de resplandor */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-brand-accent/0 via-brand-accent/5 to-brand-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              ></motion.div>
            </motion.div>
          ))}
        </div>

        {/* Estadísticas Adicionales */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            { number: "60+", label: "Años de Excelencia" },
            { number: "15K+", label: "Clientes Satisfechos" },
            { number: "98%", label: "Retención de Clientes" },
            { number: "50+", label: "Maestros Artesanos" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="font-['Cormorant_Garamond'] text-5xl text-brand-accent mb-2" style={{ fontWeight: 300 }}>
                {stat.number}
              </div>
              <div className="font-['Montserrat'] text-gray-600 text-sm tracking-wide" style={{ fontWeight: 400 }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
