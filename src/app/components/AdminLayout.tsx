import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingBag, 
  Users, 
  Database, 
  Image as ImageIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  Sun,
  Moon
} from 'lucide-react';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const { activityLogs } = useDb();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLightMode, setIsLightMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [clearedNotifs, setClearedNotifs] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('aurum_cleared_notifs') || '[]');
  });

  const dynamicNotifs: { id: string; title: string; time: string; unread: boolean; dateMs: number }[] = [];

  activityLogs.forEach(log => {
    const isRead = clearedNotifs.includes(log.id);
    dynamicNotifs.push({
      id: log.id,
      title: `${log.userName} ${log.message}`, // message already contains the action verb
      time: new Date(log.date).toLocaleString(),
      unread: !isRead,
      dateMs: new Date(log.date).getTime()
    });
  });

  dynamicNotifs.sort((a, b) => b.dateMs - a.dateMs);
  const unreadCount = dynamicNotifs.filter(n => n.unread).length;

  const handleClearNotifs = () => {
    const allIds = dynamicNotifs.map(n => n.id);
    const newCleared = Array.from(new Set([...clearedNotifs, ...allIds]));
    setClearedNotifs(newCleared);
    localStorage.setItem('aurum_cleared_notifs', JSON.stringify(newCleared));
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Productos', icon: Package, path: '/admin/productos' },
    { name: 'Categorías', icon: Tags, path: '/admin/categorias' },
    { name: 'Pedidos', icon: ShoppingBag, path: '/admin/pedidos' },
    { name: 'Clientes', icon: Users, path: '/admin/clientes' },
    { name: 'Inventario', icon: Database, path: '/admin/inventario' },
    { name: 'Banners / Contenido', icon: ImageIcon, path: '/admin/contenido' },
    { name: 'Reportes', icon: BarChart3, path: '/admin/reportes' },
    { name: 'Configuración', icon: Settings, path: '/admin/configuracion' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={`min-h-screen bg-brand-primary text-white font-['Montserrat'] flex transition-all duration-300 ${isLightMode ? 'invert hue-rotate-180' : ''}`}>
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? 280 : 0 }}
        className={`fixed lg:static inset-y-0 left-0 bg-brand-secondary border-r border-white/5 z-50 flex flex-col transition-all duration-300 overflow-hidden ${!isSidebarOpen && 'lg:w-0'}`}
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <Link to="/" className="font-['Cormorant_Garamond'] text-3xl italic tracking-widest text-brand-accent">
            Aurum
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/40">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-4 custom-scrollbar">
          <p className="px-4 py-2 text-[9px] uppercase tracking-[0.3em] text-white/20 mb-2">Principal</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-4 transition-all duration-300 group ${isActive ? 'bg-brand-accent/10 text-brand-accent' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-xs uppercase tracking-widest font-medium">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="ml-auto w-1 h-4 bg-brand-accent rounded-full"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-brand-primary">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-brand-secondary/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-[10px] text-white/20 uppercase tracking-widest">
              <span>Admin</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-brand-accent">{menuItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Buscar..."
                className="bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/20 focus:border-brand-accent outline-none transition-all w-64"
              />
            </div>

            <button 
              onClick={() => setIsLightMode(!isLightMode)}
              className="relative p-2 text-white/40 hover:text-white transition-colors"
              title="Cambiar apariencia"
            >
              {isLightMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-white/40 hover:text-white transition-colors"
                title="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-accent rounded-full border-2 border-brand-primary" />
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-4 w-80 bg-brand-secondary border border-white/10 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                      <h4 className="text-[10px] text-brand-accent uppercase tracking-widest font-bold">Notificaciones</h4>
                      {unreadCount > 0 && (
                        <span onClick={handleClearNotifs} className="text-[8px] text-white/40 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Marcar leídas</span>
                      )}
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                      {dynamicNotifs.length === 0 ? (
                        <div className="p-8 text-center text-white/40 text-xs font-light italic">No hay notificaciones recientes</div>
                      ) : (
                        dynamicNotifs.map(n => (
                          <div key={n.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${n.unread ? 'bg-white/[0.02]' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                              <p className={`text-xs ${n.unread ? 'text-white font-medium' : 'text-white/60'}`}>{n.title}</p>
                              {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0 mt-1" />}
                            </div>
                            <p className="text-[9px] text-white/30 uppercase tracking-widest">{n.time}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white tracking-wide">{user?.name}</p>
                <p className="text-[9px] text-brand-accent uppercase tracking-widest">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center font-['Cormorant_Garamond'] text-brand-accent text-xl italic font-bold">
                {user?.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.2);
        }
        ${isLightMode ? 'img { filter: invert(1) hue-rotate(180deg); }' : ''}
      `}</style>
    </div>
  );
}
