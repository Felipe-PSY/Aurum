import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { DashboardSkeleton } from './components/Skeletons';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CatalogPage = lazy(() => import('./pages/CatalogPage').then(m => ({ default: m.CatalogPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const OccasionPage = lazy(() => import('./pages/OccasionPage').then(m => ({ default: m.OccasionPage })));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminLayout = lazy(() => import('./components/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage').then(m => ({ default: m.AdminProductsPage })));
const AdminCategoriesPage = lazy(() => import('./pages/AdminCategoriesPage').then(m => ({ default: m.AdminCategoriesPage })));
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage').then(m => ({ default: m.AdminOrdersPage })));
const AdminCustomersPage = lazy(() => import('./pages/AdminCustomersPage').then(m => ({ default: m.AdminCustomersPage })));
const AdminInventoryPage = lazy(() => import('./pages/AdminInventoryPage').then(m => ({ default: m.AdminInventoryPage })));
const AdminConfigPage = lazy(() => import('./pages/AdminConfigPage').then(m => ({ default: m.AdminConfigPage })));
const AdminContentPage = lazy(() => import('./pages/AdminContentPage').then(m => ({ default: m.AdminContentPage })));
const AdminTestimonialsPage = lazy(() => import('@/app/pages/AdminTestimonialsPage').then(m => ({ default: m.AdminTestimonialsPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

import { DbProvider } from './context/DbContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Component to protect admin routes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <AdminLoginPage />;
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/jyaurum');

  return (
    <DbProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-white">
            {!isAdminRoute && <Navigation />}
            <main>
              <Suspense fallback={isAdminRoute ? <DashboardSkeleton /> : <div className="min-h-screen bg-brand-primary" />}>
                <Routes>
                  {/* Storefront Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalog/:param1?/:param2?/:param3?" element={<CatalogPage />} />
                  <Route path="/ocasiones/:slug" element={<OccasionPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/contacto" element={<ContactPage />} />

                  {/* Admin Routes */}
                  <Route path="/jyaurum/login" element={<AdminLoginPage />} />
                  <Route path="/jyaurum" element={
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

                  {/* Fallback 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            {!isAdminRoute && <Footer />}
          </div>
        </CartProvider>
      </AuthProvider>
    </DbProvider>
  );
}
