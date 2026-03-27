import { motion } from 'motion/react';
import { Instagram, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { useDb } from '../context/DbContext';

// footerLinks is now managed in DbContext

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Footer() {
  const { siteConfig } = useDb();

  return (
    <footer className="bg-brand-primary text-white">
      {/* Sección del Boletín Informativo */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-brand-accent" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contenido Principal del Pie de Página */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Columna de Marca */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-['Cormorant_Garamond'] text-3xl mb-6 text-brand-accent" style={{ fontWeight: 300 }}>
                Aurum
              </h2>
              <p className="font-['Montserrat'] text-brand-text mb-8 leading-relaxed" style={{ fontWeight: 300 }}>
                {siteConfig.footerDescription}
              </p>

              {/* Información de Contacto */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-brand-text">
                  <MapPin className="w-4 h-4 text-brand-accent" />
                  <span className="font-['Montserrat'] text-sm" style={{ fontWeight: 300 }}>
                    {siteConfig.address || '25 Place Vendôme, París, Francia'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-brand-text">
                  <Phone className="w-4 h-4 text-brand-accent" />
                  <span className="font-['Montserrat'] text-sm" style={{ fontWeight: 300 }}>
                    {siteConfig.whatsappNumber ? `+${siteConfig.whatsappNumber}` : '+33 1 42 60 30 70'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-brand-text">
                  <Mail className="w-4 h-4 text-brand-accent" />
                  <span className="font-['Montserrat'] text-sm" style={{ fontWeight: 300 }}>
                    {siteConfig.contactEmail || 'boutique@maisoneclat.com'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Dynamic Footer Sections */}
          {(siteConfig.footerSections || []).map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * (idx + 1) }}
            >
              <h4 className="font-['Cormorant_Garamond'] text-xl mb-6" style={{ fontWeight: 500 }}>
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="font-['Montserrat'] text-brand-text hover:text-brand-accent transition-colors duration-300 text-sm"
                      style={{ fontWeight: 300 }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Barra Inferior */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.p
            className="font-['Montserrat'] text-brand-text text-sm order-2 md:order-1"
            style={{ fontWeight: 300 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div>
              <span className="text-[10px] opacity-10 hover:opacity-60 transition-opacity font-light tracking-tighter normal-case">Nexo_Group</span>
            </div>
            © 2026 Aurum. Todos los derechos reservados. | Política de Privacidad | Términos de Servicio
          </motion.p>

          {/* Enlaces de Redes Sociales */}
          <motion.div
            className="flex gap-4 order-1 md:order-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {socialLinks.map((social) => {
              const href = (social.label === 'Instagram' && siteConfig.instagram)
                ? `https://instagram.com/${siteConfig.instagram.replace('@', '')}`
                : social.href;
              return (
                <a
                  key={social.label}
                  href={href}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-brand-text hover:border-brand-accent hover:text-brand-accent transition-all duration-300"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              );
            })}
          </motion.div>
        </div>
      </div>

    </footer>
  );
}
