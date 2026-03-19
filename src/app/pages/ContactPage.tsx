import { useDb } from '../context/DbContext';

export function ContactPage() {
  const { siteConfig } = useDb();
  return (
    <div className="min-h-screen bg-brand-primary pt-40 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-3xl w-full text-center">
        <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-white mb-8 tracking-wide">Contáctenos</h1>
        <div className="w-24 h-[1px] bg-brand-accent mx-auto mb-12"></div>
        <p className="font-['Montserrat'] text-brand-text text-lg mb-12 font-light leading-relaxed">
          Nuestros asesores están a su disposición para brindarle una experiencia personalizada. 
          Visítenos en nuestro atelier o comuníquese con nosotros para consultas privadas.
        </p>
        
        <div className="grid md:grid-cols-2 gap-12 text-left">
          <div className="space-y-6">
             <div>
                <h3 className="font-['Montserrat'] text-brand-accent text-xs tracking-widest uppercase mb-2">Visítenos</h3>
                <p className="text-white font-light whitespace-pre-line">{siteConfig.address || 'Calle de la Joyería, Edificio Éclat\nBogotá, Colombia'}</p>
             </div>
             <div>
                <h3 className="font-['Montserrat'] text-brand-accent text-xs tracking-widest uppercase mb-2">Llámenos</h3>
                <p className="text-white font-light">{siteConfig.whatsappNumber ? `+${siteConfig.whatsappNumber}` : '+57 (300) 123-4567'}</p>
             </div>
          </div>
          <div className="space-y-6">
             <div>
                <h3 className="font-['Montserrat'] text-brand-accent text-xs tracking-widest uppercase mb-2">Horario</h3>
                <p className="text-white font-light whitespace-pre-line">{siteConfig.businessHours || 'Lunes a Sábado: 10:00 - 20:00\nDomingos: Cita previa'}</p>
             </div>
             <div>
                <h3 className="font-['Montserrat'] text-brand-accent text-xs tracking-widest uppercase mb-2">Correo</h3>
                <p className="text-white font-light">{siteConfig.contactEmail || 'atelier@maisoneclat.com'}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
