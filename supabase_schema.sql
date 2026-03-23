-- ==========================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS
-- PROYECTO: AURUM (SUPABASE)
-- ==========================================

-- Habilitar extensión para UUIDs automáticos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. CREACIÓN DE TABLAS
-- ==========================================

-- Tabla de Categorías
CREATE TABLE public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Ocasiones
CREATE TABLE public.occasions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Productos
CREATE TABLE public.products (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    previous_price NUMERIC,
    gender TEXT CHECK (gender IN ('Hombre', 'Mujer')),
    image TEXT NOT NULL,
    category TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    sub_category TEXT, -- Guardamos el texto directo para compatibilidad rápida con el frontend
    is_featured BOOLEAN DEFAULT false,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relación N a N (Productos <-> Ocasiones)
CREATE TABLE public.product_occasions (
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    occasion_id TEXT REFERENCES public.occasions(id) ON DELETE CASCADE,
    PRIMARY KEY(product_id, occasion_id)
);

-- Pedidos (Órdenes de Compra)
CREATE TABLE public.orders (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,
    customer_city TEXT,
    status TEXT DEFAULT 'Pendiente',
    total NUMERIC NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detalles de Pedidos
CREATE TABLE public.order_items (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price_at_time NUMERIC NOT NULL
);

-- Testimonios
CREATE TABLE public.testimonials (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    author TEXT NOT NULL,
    role TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configuración Web (Colores, Contacto, Todo)
CREATE TABLE public.site_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    data JSONB NOT NULL
);

-- ==========================================
-- 2. DATOS INICIALES POR DEFECTO (SEEDING)
-- ==========================================

INSERT INTO public.categories (id, name, order_index) VALUES
('anillos', 'Anillos', 1),
('pulseras', 'Pulseras', 2),
('cadenas', 'Cadenas', 3),
('aretes', 'Aretes', 4),
('dijes', 'Dijes', 5),
('balines', 'Balines', 6),
('piedras', 'Piedras', 7),
('estuches', 'Estuches', 8),
('ocasiones', 'Ocasiones', 9)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.occasions (id, name) VALUES
('matrimonio', 'Matrimonio'),
('compromiso', 'Compromiso'),
('graduaciones', 'Graduaciones'),
('quinceanos', 'Quinceaños')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_config (id, data) VALUES (1, '{
    "address": "Calle 123 #45-67, Bogotá",
    "whatsappNumber": "3012636880",
    "colors": { "primary": "#0A0A0A", "secondary": "#FFFFFF", "accent": "#D4AF37" },
    "contactEmail": "contacto@aurum.com",
    "instagram": "@aurumjoyeria",
    "businessHours": "Lunes a Sábado: 10:00 - 20:00\nDomingos: Cita previa",
    "hero": {
      "title": "La Excelencia en Cada Detalle",
      "subtitle": "Joyas artesanales con el sello de calidad Aurum. Encuentra la pieza perfecta para cada ocasión inolvidable.",
      "buttonText": "EXPLORAR COLECCIÓN",
      "backgroundImage": "https://images.unsplash.com/photo-1763913603709-74997cc8a299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZyUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NzM4NDkwNDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    "homeSections": [
      { "id": "cat-destacadas", "name": "Categorías Destacadas", "component": "CollectionSection", "isVisible": true, "order": 0 },
      { "id": "sobre-aurum", "name": "Sobre Aurum", "component": "BrandStorySection", "isVisible": true, "order": 1 },
      { "id": "col-reciente", "name": "Colección Reciente", "component": "ProductSection", "isVisible": true, "order": 2 },
      { "id": "experiencia-lujo", "name": "Experiencia de Lujo", "component": "LuxuryExperienceSection", "isVisible": true, "order": 3 },
      { "id": "testimonios", "name": "Testimonios", "component": "TestimonialSection", "isVisible": true, "order": 4 },
      { "id": "galeria", "name": "Galería", "component": "GallerySection", "isVisible": true, "order": 5 }
    ]
}')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 3. POLÍTICAS DE SEGURIDAD (RLS)
-- ==========================================

-- Habilitar RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Reglas Públicas DE LECTURA (Lo que el cliente sin loguear puede ver)
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Occasions" ON public.occasions FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read ProductOccasions" ON public.product_occasions FOR SELECT USING (true);
CREATE POLICY "Public Read SiteConfig" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT USING (is_approved = true);

-- Reglas Públicas DE ESCRITURA (Lo que el cliente sin loguear puede escribir)
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert OrderItems" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);

-- Reglas ADMIN (Todo el acceso)
-- Validamos con `auth.role() = 'authenticated'`
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Occasions" ON public.occasions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Products" ON public.products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All ProductOccasions" ON public.product_occasions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All OrderItems" ON public.order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All SiteConfig" ON public.site_config FOR ALL USING (auth.role() = 'authenticated');
