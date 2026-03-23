import { Product as BaseProduct } from './data/products';

export interface Testimonial {
  id: string;
  name: string;
  title?: string;
  text: string;
  rating: number;
  date: string;
  isVisible: boolean;
}

export type Product = BaseProduct;

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
  link: string;
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface Category {
  id: string;
  name: string;
  subCategories?: string[];
  isActive: boolean;
}

export interface OrderItem {
  id?: number | string;
  productId?: number | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  customer: {
    nombre: string;
    apellido: string;
    telefono: string;
    direccion: string;
  };
  metodoPago: string;
  status: 'Nuevo' | 'Pendiente' | 'En proceso' | 'Pagado' | 'Enviado' | 'Entregado' | 'Cancelado';
  stockDeducted?: boolean;
}

export interface SiteConfig {
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
}

export interface ActivityLog {
  id: string;
  type: 'product' | 'order' | 'inventory' | 'config' | 'system';
  message: string;
  userName: string;
  date: string;
}

export interface DbContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  siteConfig: SiteConfig;
  activityLogs: ActivityLog[];
  testimonials: Testimonial[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number | string) => void;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateSiteConfig: (config: SiteConfig) => void;
  updateCategories: (categories: Category[]) => void;
  updateAllPrices: (percentage: number) => void;
  undoLastPriceAdjustment: () => void;
  canUndoPriceAdjustment: boolean;
  addLog: (type: ActivityLog['type'], message: string, userName: string) => void;
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'date' | 'isVisible'>) => void;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
}
