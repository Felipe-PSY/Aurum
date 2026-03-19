import { motion } from 'motion/react';
import { ImageWithFallback } from './ImageWithFallback';

const galleryImages = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1584628913500-7da703b091db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmluZ3MlMjBkaWFtb25kfGVufDF8fHx8MTc3Mzg0OTA0NXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Colección de Boda",
    size: "large"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1758995115560-59c10d6cc28f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwbmVja2xhY2UlMjBqZXdlbHJ5JTIwZWxlZ2FudHxlbnwxfHx8fDE3NzM4NDkwNDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Elegancia en Oro",
    size: "medium"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1764179690227-af049306cd20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHdlYXJpbmclMjBlbGVnYW50JTIwamV3ZWxyeXxlbnwxfHx8fDE3NzM4MDY3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Estilo Editorial",
    size: "large"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1767210338407-54b9264c326b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMGVhcnJpbmdzJTIwbHV4dXJ5fGVufDF8fHx8MTc3Mzg0NzMyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Luminosidad de Perlas",
    size: "medium"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1763029513623-37d488cb97b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwYnJhY2VsZXQlMjBlbGVnYW50fGVufDF8fHx8MTc3Mzc2NDQ3MHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Brillantez de Diamante",
    size: "medium"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1736180857448-f166c7e00987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW1zdG9uZSUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzczODQ5MDQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Gemas Preciosas",
    size: "small"
  }
];

export function GallerySection() {
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
            GALERÍA VISUAL
          </p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white mb-4" style={{ fontWeight: 300 }}>
            Momentos de Brillantez
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
