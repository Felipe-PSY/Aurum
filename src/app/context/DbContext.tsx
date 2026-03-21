import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';
import { 
  Product, 
  Category, 
  Order, 
  SiteConfig, 
  ActivityLog, 
  DbContextType,
  Testimonial
} from '../types';

const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [previousPrices, setPreviousPrices] = useState<{ id: number; price: number }[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    address: 'Calle 123 #45-67, Bogotá',
    whatsappNumber: '3012636880',
    colors: { primary: '#0A0A0A', secondary: '#FFFFFF', accent: '#D4AF37' },
    contactEmail: 'contacto@aurum.com',
    instagram: '@aurumjoyeria',
    businessHours: 'Lunes a Sábado: 10:00 - 20:00\nDomingos: Cita previa',
    hero: {
      title: 'La Excelencia en Cada Detalle',
      subtitle: 'Joyas artesanales con el sello de calidad Aurum. Encuentra la pieza perfecta para cada ocasión inolvidable.',
      buttonText: 'EXPLORAR COLECCIÓN',
      backgroundImage: 'https://images.unsplash.com/photo-1763913603709-74997cc8a299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZyUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NzM4NDkwNDB8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    homeSections: [
      { id: 'cat-destacadas', name: 'Categorías Destacadas', component: 'CollectionSection', isVisible: true, order: 0 },
      { id: 'sobre-aurum', name: 'Sobre Aurum', component: 'BrandStorySection', isVisible: true, order: 1 },
      { id: 'col-reciente', name: 'Colección Reciente', component: 'ProductSection', isVisible: true, order: 2 },
      { id: 'experiencia-lujo', name: 'Experiencia de Lujo', component: 'LuxuryExperienceSection', isVisible: true, order: 3 },
      { id: 'testimonios', name: 'Testimonios', component: 'TestimonialSection', isVisible: true, order: 4 },
      { id: 'galeria', name: 'Galería', component: 'GallerySection', isVisible: true, order: 5 }
    ],
    banners: [
      { id: 'banner-1', image: '', title: 'Colección Mujer', link: '#' }
    ],
    footerDescription: 'Creando obras maestras de joyería atemporales desde 1962. Cada pieza es una celebración de la herencia, el arte y los momentos que más importan.',
    footerSections: [
      {
        title: 'Colecciones',
        links: [
          { name: "Diamantes Signature", href: "#" },
          { name: "Herencia Dorada", href: "#" },
          { name: "Perfección en Perlas", href: "#" },
          { name: "Colección Nupcial", href: "#" },
          { name: "Ediciones Limitadas", href: "#" }
        ]
      },
      {
        title: 'Servicios',
        links: [
          { name: "Consulta Privada", href: "#" },
          { name: "Diseño a Medida", href: "#" },
          { name: "Reparación y Restauración", href: "#" },
          { name: "Servicios de Tasación", href: "#" },
          { name: "Registro de Regalos", href: "#" }
        ]
      },
      {
        title: 'Empresa',
        links: [
          { name: "Nuestra Herencia", href: "#" },
          { name: "Artesanía", href: "#" },
          { name: "Sostenibilidad", href: "#" },
          { name: "Prensa y Medios", href: "#" },
          { name: "Carreras", href: "#" }
        ]
      }
    ]
  });

  // INITIAL LOAD: Load data from localStorage once on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedProducts = localStorage.getItem('aurum_products');
        const savedCategories = localStorage.getItem('aurum_categories');
        const savedOrders = localStorage.getItem('aurum_orders');
        const savedConfig = localStorage.getItem('aurum_config');
        const savedLogs = localStorage.getItem('aurum_logs');
        const savedTestimonials = localStorage.getItem('aurum_testimonials');

        if (savedProducts) setProducts(JSON.parse(savedProducts));
        else setProducts(initialProducts.map(p => ({
          ...p,
          stock: p.stock ?? 10,
          code: p.code ?? `PRD-${p.id.toString().padStart(4, '0')}`
        })));

        if (savedCategories) setCategories(JSON.parse(savedCategories));
        else {
          setCategories([
            { id: 'anillos', name: 'Anillos', subCategories: ['Hombre', 'Mujer', 'Compromiso', 'Sellos'], isActive: true },
            { id: 'pulseras', name: 'Pulseras', subCategories: ['Hombre', 'Mujer', 'Tejidas', 'Balines'], isActive: true },
            { id: 'cadenas', name: 'Cadenas', subCategories: ['Hombre', 'Mujer'], isActive: true },
            { id: 'aretes', name: 'Aretes', subCategories: ['Topos', 'Candongas', 'Aros'], isActive: true },
            { id: 'dijes', name: 'Dijes', isActive: true },
            { id: 'balines', name: 'Balines', isActive: true },
            { id: 'piedras', name: 'Piedras', isActive: true },
            { id: 'estuches', name: 'Estuches', isActive: true }
          ]);
        }

        if (savedOrders) setOrders(JSON.parse(savedOrders));
        if (savedConfig) setSiteConfig(JSON.parse(savedConfig));
        if (savedLogs) setActivityLogs(JSON.parse(savedLogs));
        if (savedTestimonials) setTestimonials(JSON.parse(savedTestimonials));
        else {
          // Initial mock testimonials
          setTestimonials([
            {
              id: 't-1',
              name: "Isabella Fontaine",
              title: "Coleccionista de Arte",
              text: "La atención al detalle es impresionante. Cada pieza no es solo una joya, sino arte portátil que cuenta una historia.",
              rating: 5,
              date: new Date().toISOString(),
              isVisible: true
            },
            {
              id: 't-2',
              name: "Victoria Laurent",
              title: "Diseñadora de Moda",
              text: "Artesanía exquisita que rivaliza con las mejores casas europeas. Las piezas de diamante son particularmente impresionantes.",
              rating: 5,
              date: new Date().toISOString(),
              isVisible: true
            }
          ]);
        }
      } catch (err) {
        console.error("Error loading data from localStorage:", err);
      } finally {
        setIsInitialized(true);
      }
    };

    loadData();
  }, []);

  // REAL-TIME SYNC: Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (!e.newValue) return;
        const data = JSON.parse(e.newValue);
        
        switch (e.key) {
          case 'aurum_orders': setOrders(data); break;
          case 'aurum_products': setProducts(data); break;
          case 'aurum_logs': setActivityLogs(data); break;
          case 'aurum_config': setSiteConfig(data); break;
          case 'aurum_categories': setCategories(data); break;
          case 'aurum_testimonials': setTestimonials(data); break;
        }
      } catch (err) {
        console.error("Error syncing storage across tabs:", err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // SAVE TO LOCALSTORAGE: Only after initialization to prevent overwriting with empty defaults
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem('aurum_products', JSON.stringify(products));
    localStorage.setItem('aurum_categories', JSON.stringify(categories));
    localStorage.setItem('aurum_orders', JSON.stringify(orders));
    localStorage.setItem('aurum_config', JSON.stringify(siteConfig));
    localStorage.setItem('aurum_logs', JSON.stringify(activityLogs));
    localStorage.setItem('aurum_testimonials', JSON.stringify(testimonials));
  }, [products, categories, orders, siteConfig, activityLogs, testimonials, isInitialized]);

  // Sync colors to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', siteConfig.colors.primary);
    document.documentElement.style.setProperty('--color-accent', siteConfig.colors.accent);
  }, [siteConfig.colors]);

  const addProduct = (p: Product) => setProducts(prev => [...prev, { ...p, id: Date.now() }]);
  const updateProduct = (p: Product) => setProducts(prev => prev.map(item => item.id === p.id ? p : item));
  const deleteProduct = (id: number) => setProducts(prev => prev.filter(item => item.id !== id));

  const addOrder = (o: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...o,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'Nuevo'
    };
    setOrders(prev => [newOrder, ...prev]);
    addLog('order', `Nuevo pedido #${newOrder.id.slice(-6).toUpperCase()} recibido`, 'Sistema');
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prevOrders => {
      const orderIndex = prevOrders.findIndex(o => o.id === id);
      if (orderIndex === -1) return prevOrders;

      const order = prevOrders[orderIndex];
      let updatedOrder = { ...order, status };

      // Stock deduction logic
      if (status === 'Pagado' && !order.stockDeducted) {
        setProducts(prevProducts => {
          const newProducts = [...prevProducts];
          order.items.forEach(item => {
            const productIndex = newProducts.findIndex(p => p.id === (item.id || item.productId));
            if (productIndex !== -1) {
              const product = newProducts[productIndex];
              const currentStock = product.stock || 0;
              const newStock = Math.max(0, currentStock - item.quantity);
              newProducts[productIndex] = { ...product, stock: newStock };
            }
          });
          return newProducts;
        });
        
        updatedOrder.stockDeducted = true;
        addLog('inventory', `Descuento automático de stock por pedido #${id.slice(-6).toUpperCase()} marcado como Pagado`, 'Sistema');
      }

      const newOrders = [...prevOrders];
      newOrders[orderIndex] = updatedOrder;
      return newOrders;
    });
  };

  const updateSiteConfig = (config: SiteConfig) => setSiteConfig(config);
  const updateCategories = (cats: Category[]) => setCategories(cats);

  const addLog = (type: ActivityLog['type'], message: string, userName: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      message,
      userName,
      date: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 100));
  };
  
  const addTestimonial = (t: Omit<Testimonial, 'id' | 'date' | 'isVisible'>) => {
    const newTestimonial: Testimonial = {
      ...t,
      id: `test-${Date.now()}`,
      date: new Date().toISOString(),
      isVisible: true
    };
    setTestimonials(prev => [newTestimonial, ...prev]);
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const updateAllPrices = (percentage: number) => {
    console.log('DbContext: updateAllPrices called with', percentage);
    setProducts(prev => {
      // Save current prices before updating
      setPreviousPrices(prev.map(p => ({ id: p.id, price: p.price })));
      const updated = prev.map(p => ({
        ...p,
        price: Math.round(p.price * (1 + percentage / 100))
      }));
      console.log('DbContext: Updated products', updated.length);
      return updated;
    });
    addLog('inventory', `Ajuste global de precios: ${percentage > 0 ? '+' : ''}${percentage}% aplicado a todos los productos`, 'Sistema');
  };

  const undoLastPriceAdjustment = () => {
    if (!previousPrices) return;
    setProducts(prev => prev.map(p => {
      const saved = previousPrices.find(s => s.id === p.id);
      return saved ? { ...p, price: saved.price } : p;
    }));
    addLog('inventory', 'Ajuste global de precios revertido al estado anterior', 'Admin');
    setPreviousPrices(null);
  };

  const canUndoPriceAdjustment = previousPrices !== null;

  return (
    <DbContext.Provider value={{ 
      products, categories, orders, siteConfig, activityLogs, testimonials,
      addProduct, updateProduct, deleteProduct, 
      addOrder, updateOrderStatus, updateSiteConfig, updateCategories,
      updateAllPrices, undoLastPriceAdjustment, canUndoPriceAdjustment,
      addLog, addTestimonial, updateTestimonial, deleteTestimonial 
    }}>
      {children}
    </DbContext.Provider>
  );
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (!context) throw new Error('useDb must be used within a DbProvider');
  return context;
};
