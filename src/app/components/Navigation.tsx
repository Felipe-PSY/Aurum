import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useCart } from '../context/CartContext';
import { useDb } from '../context/DbContext';

export function Navigation() {
  const { cartCount } = useCart();
  const { categories } = useDb();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const dynamicCategories = categories
    .filter(c => c.isActive && c.id !== 'ocasiones')
    .map(c => ({
      name: c.name,
      href: `/catalog/${c.id}`,
      sub: c.subCategories
    }));

  const ocasiones = [
    { name: "Matrimonio", href: "/ocasiones/matrimonio" },
    { name: "Compromiso", href: "/ocasiones/compromiso" },
    { name: "Graduaciones", href: "/ocasiones/graduaciones" },
    { name: "Quinceaños", href: "/ocasiones/quinceanos" }
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center gap-2 group">
              <Sparkles className="w-5 h-5 text-brand-accent group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-['Cormorant_Garamond'] text-2xl text-white tracking-wide" style={{ fontWeight: 300 }}>
                Aurum
              </span>
            </Link>
          </motion.div>

          {/* Navegación de Escritorio */}
          <div className="hidden md:flex items-center gap-8">
            {/* Dropdown Categorías */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('categorias')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 font-['Montserrat'] text-brand-text hover:text-white transition-colors duration-300 text-xs tracking-[0.2em] uppercase py-8">
                Categorías <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === 'categorias' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'categorias' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-[500px] bg-black/95 backdrop-blur-xl border border-white/10 p-8 grid grid-cols-2 gap-6 shadow-2xl"
                  >
                    {dynamicCategories.map((cat) => (
                      <div key={cat.name} className="space-y-3">
                        <Link 
                          to={cat.href}
                          className="font-['Cormorant_Garamond'] text-lg text-brand-accent hover:text-white transition-colors block border-b border-brand-accent/20 pb-1"
                        >
                          {cat.name}
                        </Link>
                        {cat.sub && (
                          <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {cat.sub.map(s => (
                              <Link 
                                key={s} 
                                to={s.toLowerCase() === 'hombre' || s.toLowerCase() === 'mujer' 
                                  ? `/catalog/${s.toLowerCase()}/${cat.name.toLowerCase()}` 
                                  : `${cat.href}/${s.toLowerCase()}`}
                                className="text-brand-text/60 hover:text-white text-[10px] font-['Montserrat'] tracking-widest uppercase transition-colors"
                              >
                                {s}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/catalog/hombre" className="font-['Montserrat'] text-brand-text hover:text-white transition-colors duration-300 text-xs tracking-[0.2em] uppercase">Hombre</Link>
            <Link to="/catalog/mujer" className="font-['Montserrat'] text-brand-text hover:text-white transition-colors duration-300 text-xs tracking-[0.2em] uppercase">Mujer</Link>
            
            {/* Dropdown Ocasiones */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('ocasiones')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 font-['Montserrat'] text-brand-text hover:text-white transition-colors duration-300 text-xs tracking-[0.2em] uppercase py-8">
                Ocasiones <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === 'ocasiones' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'ocasiones' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-56 bg-black/95 backdrop-blur-xl border border-white/10 p-4 space-y-2 shadow-2xl"
                  >
                    {ocasiones.map((oc) => (
                      <Link 
                        key={oc.name}
                        to={oc.href}
                        className="block font-['Montserrat'] text-[10px] text-brand-text hover:text-brand-accent transition-colors tracking-[0.2em] uppercase p-2 border-b border-white/5 last:border-0"
                      >
                        {oc.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/contacto" className="font-['Montserrat'] text-brand-text hover:text-white transition-colors duration-300 text-xs tracking-[0.2em] uppercase">Contacto</Link>
          </div>

          {/* Acciones de Escritorio */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/cart" className="relative text-brand-text hover:text-brand-accent transition-colors duration-300">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent rounded-full flex items-center justify-center text-black text-xs font-bold" style={{ fontSize: '0.6rem' }}>{cartCount}</span>
            </Link>
          </div>

          {/* Botón de Menú Móvil */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Alternar Menú"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menú Móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 top-20 bg-black z-40 overflow-y-auto"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: "circOut" }}
          >
            <div className="px-8 py-10 space-y-10">
              {/* Categorías en Móvil */}
              <div className="space-y-6">
                 <h3 className="text-brand-accent font-['Montserrat'] text-xs tracking-widest uppercase border-b border-white/10 pb-2">Categorías</h3>
                 <div className="grid grid-cols-1 gap-4">
                    {dynamicCategories.map((cat: any) => (
                        <div key={cat.name} className="space-y-2">
                             <Link to={cat.href} className="text-white font-['Cormorant_Garamond'] text-2xl py-1 block">{cat.name}</Link>
                             {cat.sub && (
                                <div className="flex flex-wrap gap-4 pl-4">
                                    {cat.sub.map((s: string) => (
                                        <Link 
                                        key={s} 
                                        to={s.toLowerCase() === 'hombre' || s.toLowerCase() === 'mujer' 
                                          ? `/catalog/${s.toLowerCase()}/${cat.name.toLowerCase()}` 
                                          : `${cat.href}/${s.toLowerCase()}`}
                                        className="text-brand-text/40 text-[10px] uppercase tracking-widest"
                                      >
                                        {s}
                                      </Link>
                                    ))}
                                </div>
                             )}
                        </div>
                    ))}
                 </div>
              </div>

              {/* Otros Enlaces en Móvil */}
              <div className="space-y-6 pt-6 border-t border-white/10">
                 <Link to="/catalog/hombre" className="block text-white font-['Cormorant_Garamond'] text-3xl">Hombre</Link>
                 <Link to="/catalog/mujer" className="block text-white font-['Cormorant_Garamond'] text-3xl">Mujer</Link>
                 <div className="space-y-4">
                    <h4 className="text-brand-accent font-['Montserrat'] text-[10px] tracking-widest uppercase">Ocasiones</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {ocasiones.map(oc => (
                            <Link key={oc.name} to={oc.href} className="text-white/60 font-['Montserrat'] text-[10px] uppercase tracking-widest">{oc.name}</Link>
                        ))}
                    </div>
                 </div>
                 <Link to="/contacto" className="block text-white font-['Cormorant_Garamond'] text-3xl">Contacto</Link>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  );
}
