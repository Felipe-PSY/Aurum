import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, products as initialProducts } from '../data/products';

export interface HeroConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundImage: string;
}

// Simplified interfaces - removed dynamic sections, banners, and footer links per requirements
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
  footerDescription: string;
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
    footerDescription: 'Creando obras maestras de joyería atemporales desde 1962. Cada pieza es una celebración de la herencia, el arte y los momentos que más importan.'
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
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      // Clean up legacy/broken color value if it exists
      if (config.colors && config.colors.accent === 'var(--color-accent)') {
        config.colors.accent = '#D4AF37';
      }
      setSiteConfig(config);
    }
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
