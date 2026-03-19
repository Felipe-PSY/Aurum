import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, products as initialProducts } from '../data/products';

export interface HeroConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundImage: string;
}

export interface HomeSection {
  id: string;
  name: string;
  component: string;
  isVisible: boolean;
  order: number;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  link: string;
  isActive: boolean;
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SectionContent {
  collections: {
    title: string;
    subtitle: string;
    items: { id: number; title: string; description: string; image: string; }[];
  };
  brandStory: {
    title: string;
    subtitle: string;
    p1: string;
    p2: string;
    image: string;
    values: { title: string; description: string; iconName: string; }[];
  };
  luxuryExperience: {
    title: string;
    subtitle: string;
    features: { title: string; description: string; iconName: string; }[];
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: { id: number; name: string; title: string; text: string; rating: number; image: string; }[];
    stats: { number: string; label: string; }[];
  };
  productSection: {
    title: string;
    subtitle: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    images: { id: number; url: string; alt: string; }[];
  };
}

interface SiteConfig {
  address: string;
  whatsappNumber: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  contactEmail: string;
  instagram: string;
  businessHours?: string;
  hero: HeroConfig;
  homeSections: HomeSection[];
  banners: Banner[];
  footerDescription: string;
  footerSections: FooterSection[];
  sectionContent: SectionContent;
}

interface Category {
  id: string;
  name: string;
  subCategories?: string[];
  isActive: boolean;
}

interface Order {
  id: string;
  date: string;
  items: any[];
  total: number;
  customer: {
    nombre: string;
    apellido: string;
    telefono: string;
    direccion: string;
  };
  metodoPago: string;
  status: 'Nuevo' | 'Pendiente' | 'En proceso' | 'Pagado' | 'Enviado' | 'Entregado' | 'Cancelado';
}

export interface ActivityLog {
  id: string;
  type: 'product' | 'order' | 'inventory' | 'config' | 'system';
  message: string;
  userName: string;
  date: string;
}

interface DbContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  siteConfig: SiteConfig;
  activityLogs: ActivityLog[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateSiteConfig: (config: SiteConfig) => void;
  updateCategories: (categories: Category[]) => void;
  addLog: (type: ActivityLog['type'], message: string, userName: string) => void;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    address: 'Calle 123 #45-67, Bogotá',
    whatsappNumber: '3012636880',
    colors: { primary: '#0A0A0A', secondary: '#FFFFFF', accent: 'var(--color-accent)' },
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
      { id: 'banner-1', image: '', title: 'Colección Mujer', subtitle: 'Descubre la elegancia eterna', link: '#', isActive: true }
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
    ],
    sectionContent: {
      collections: {
        title: 'Excelencia Seleccionada',
        subtitle: 'COLECCIONES DESTACADAS',
        items: [
          {
            id: 1,
            title: "Diamantes de Autor",
            description: "Exquisitas piezas de diamante que capturan la luz y la imaginación",
            image: "https://images.unsplash.com/photo-1586878340506-af074f2ee999?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzM4NDkwNDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            id: 2,
            title: "Herencia Dorada",
            description: "Diseños de oro atemporales que celebran generaciones de artesanía",
            image: "https://images.unsplash.com/photo-1758995115560-59c10d6cc28f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwbmVja2xhY2UlMjBqZXdlbHJ5JTIwZWxlZ2FudHxlbnwxfHx8fDE3NzM4NDkwNDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          },
          {
            id: 3,
            title: "Perfección en Perlas",
            description: "Perlas brillantes seleccionadas para una elegancia sofisticada",
            image: "https://images.unsplash.com/photo-1767210338407-54b9264c326b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMGVhcnJpbmdzJTIwbHV4dXJ5fGVufDF8fHx8MTc3Mzg0NzMyOXww&ixlib=rb-4.1.0&q=80&w=1080"
          }
        ]
      },
      brandStory: {
        title: 'Un Legado de Brillantez',
        subtitle: 'NUESTRA HISTORIA',
        p1: 'Desde 1962, hemos estado creando joyas que trascienden el tiempo. Cada pieza cuenta una historia de pasión, precisión y un arte inigualable, fusionando técnicas tradicionales con una visión contemporánea.',
        p2: 'Nuestro taller en el corazón de París sigue siendo un santuario donde maestros joyeros transforman metales preciosos y piedras preciosas en arte portátil, destinado a convertirse en reliquias familiares.',
        image: 'https://images.unsplash.com/photo-1619605401830-5430fea8d41b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwY3JhZnRzbWFuc2hpcCUyMGhhbmRzfGVufDF8fHx8MTc3Mzg0OTA0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
        values: [
          { iconName: 'Award', title: "Herencia", description: "Más de seis décadas de magistral creación de joyería transmitidas a través de generaciones" },
          { iconName: 'Gem', title: "Artesanía", description: "Cada pieza meticulosamente elaborada a mano por nuestros maestros artesanos" },
          { iconName: 'Heart', title: "Exclusividad", description: "Ediciones limitadas diseñadas para quienes aprecian lo extraordinario" }
        ]
      },
      luxuryExperience: {
        title: 'El Viaje Aurum',
        subtitle: 'EXPERIENCIA DE LUJO',
        features: [
          { iconName: 'MapPin', title: "Envío Global Asegurado", description: "Entrega puerta a puerta con seguimiento en tiempo real y seguro total para su tranquilidad." },
          { iconName: 'Clock', title: "Conserje 24/7", description: "Asesoramiento personalizado disponible en cualquier momento para ayudarle a elegir la pieza perfecta." },
          { iconName: 'ShieldCheck', title: "Autenticidad Certificada", description: "Cada pieza se entrega con un certificado detallado de autenticidad y los más altos estándares de calidad." },
          { iconName: 'Gift', title: "Presentación Signature", description: "Un desempaquetado inolvidable con nuestro elegante estuche de cortesía y envoltorio de lujo." }
        ]
      },
      testimonials: {
        title: 'Palabras de Nuestros Clientes',
        subtitle: 'TESTIMONIOS DE CLIENTES',
        items: [
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
        ],
        stats: [
          { number: "60+", label: "Años de Excelencia" },
          { number: "15K+", label: "Clientes Satisfechos" },
          { number: "98%", label: "Retención de Clientes" },
          { number: "50+", label: "Maestros Artesanos" }
        ]
      },
      productSection: {
        title: 'Obras Maestras le Esperan',
        subtitle: 'PIEZAS DISTINTIVAS'
      },
      gallery: {
        title: 'Esplendor Visual',
        subtitle: 'GALERÍA DE INSTAGRAM',
        images: [
          { id: 1, url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400', alt: 'Joyería 1' },
          { id: 2, url: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=400', alt: 'Joyería 2' },
          { id: 3, url: 'https://images.unsplash.com/photo-1573408302185-9114f33a65af?q=80&w=400', alt: 'Joyería 3' },
          { id: 4, url: 'https://images.unsplash.com/photo-1599459183200-59c2667a0127?q=80&w=400', alt: 'Joyería 4' },
          { id: 5, url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400', alt: 'Joyería 5' },
          { id: 6, url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=400', alt: 'Joyería 6' }
        ]
      }
    }
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('aurum_products');
    const savedCategories = localStorage.getItem('aurum_categories');
    const savedOrders = localStorage.getItem('aurum_orders');
    const savedConfig = localStorage.getItem('aurum_config');
    const savedLogs = localStorage.getItem('aurum_logs');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else setProducts(initialProducts.map(p => ({
      ...p,
      stock: p.stock ?? 10,
      code: p.code ?? `PRD-${p.id.toString().padStart(4, '0')}`
    })));

    if (savedCategories) setCategories(JSON.parse(savedCategories));
    else {
      const initialCategories: Category[] = [
        { id: 'anillos', name: 'Anillos', subCategories: ['Hombre', 'Mujer', 'Compromiso', 'Sellos'], isActive: true },
        { id: 'pulseras', name: 'Pulseras', subCategories: ['Hombre', 'Mujer', 'Tejidas', 'Balines'], isActive: true },
        { id: 'cadenas', name: 'Cadenas', subCategories: ['Hombre', 'Mujer'], isActive: true },
        { id: 'aretes', name: 'Aretes', subCategories: ['Topos', 'Candongas', 'Aros'], isActive: true },
        { id: 'dijes', name: 'Dijes', isActive: true },
        { id: 'balines', name: 'Balines', isActive: true },
        { id: 'piedras', name: 'Piedras', isActive: true },
        { id: 'estuches', name: 'Estuches', isActive: true }
      ];
      setCategories(initialCategories);
    }

    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedConfig) setSiteConfig(JSON.parse(savedConfig));
    if (savedLogs) setActivityLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('aurum_products', JSON.stringify(products));
    if (categories.length > 0) localStorage.setItem('aurum_categories', JSON.stringify(categories));
    localStorage.setItem('aurum_orders', JSON.stringify(orders));
    localStorage.setItem('aurum_config', JSON.stringify(siteConfig));
    localStorage.setItem('aurum_logs', JSON.stringify(activityLogs));
  }, [products, categories, orders, siteConfig, activityLogs]);

  // Sync colors to CSS variables dynamically
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', siteConfig.colors.primary);
    document.documentElement.style.setProperty('--color-accent', siteConfig.colors.accent);
    // We intentionally don't inject secondary so it falls back to the dark #0F0F0F defined in CSS, preserving Admin UI contrast.
  }, [siteConfig.colors]);

  const addProduct = (p: Product) => setProducts([...products, { ...p, id: Date.now() }]);
  const updateProduct = (p: Product) => setProducts(products.map(item => item.id === p.id ? p : item));
  const deleteProduct = (id: number) => setProducts(products.filter(item => item.id !== id));

  const addOrder = (o: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...o,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'Nuevo'
    };
    setOrders([newOrder, ...orders]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
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
    setActivityLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  return (
    <DbContext.Provider value={{ 
      products, categories, orders, siteConfig, activityLogs,
      addProduct, updateProduct, deleteProduct, 
      addOrder, updateOrderStatus, updateSiteConfig, updateCategories,
      addLog 
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
