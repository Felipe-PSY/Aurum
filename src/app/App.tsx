import { Routes, Route, useLocation } from 'react-router';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OccasionPage } from './pages/OccasionPage';
import { CartProvider } from './context/CartContext';
import { DbProvider } from './context/DbContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminCustomersPage } from './pages/AdminCustomersPage';
import { AdminInventoryPage } from './pages/AdminInventoryPage';
import { AdminConfigPage } from './pages/AdminConfigPage';
import { AdminContentPage } from './pages/AdminContentPage';
import { AdminTestimonialsPage } from '@/app/pages/AdminTestimonialsPage';

// Component to protect admin routes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <AdminLoginPage />;
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <DbProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-white">
            {!isAdminRoute && <Navigation />}
            <main>
              <Routes>
                {/* Storefront Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog/:param1?/:param2?/:param3?" element={<CatalogPage />} />
                <Route path="/ocasiones/:slug" element={<OccasionPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/contacto" element={<ContactPage />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="productos" element={<AdminProductsPage />} />
                  <Route path="categorias" element={<AdminCategoriesPage />} />
                  <Route path="pedidos" element={<AdminOrdersPage />} />
                  <Route path="clientes" element={<AdminCustomersPage />} />
                  <Route path="inventario" element={<AdminInventoryPage />} />
                  <Route path="contenido" element={<AdminContentPage />} />
                  <Route path="testimonios" element={<AdminTestimonialsPage />} />
                  <Route path="configuracion" element={<AdminConfigPage />} />
                </Route>
              </Routes>
            </main>
            {!isAdminRoute && <Footer />}
          </div>
        </CartProvider>
      </AuthProvider>
    </DbProvider>
  );
}
