import { useState } from 'react';
import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search,
  Eye, 
  MessageCircle, 
  User as UserIcon,
  XCircle
} from 'lucide-react';
import { CustomDropdown } from '../components/CustomDropdown';

export function AdminOrdersPage() {
  const { products, orders, updateOrderStatus, updateProduct, addLog } = useDb();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const statusColors: any = {
    'Nuevo': 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    'Pendiente': 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    'En proceso': 'bg-purple-400/10 text-purple-400 border-purple-400/20',
    'Pagado': 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    'Enviado': 'bg-indigo-400/10 text-indigo-400 border-indigo-400/20',
    'Entregado': 'bg-green-400/10 text-green-400 border-green-400/20',
    'Cancelado': 'bg-red-400/10 text-red-400 border-red-400/20'
  };

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        o.customer.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus ? o.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl text-white italic tracking-wide mb-1">Gestión de Pedidos</h1>
          <p className="text-brand-text/40 text-[10px] tracking-[0.3em] uppercase">Monitorea y actualiza el estado de las ventas</p>
        </div>
      </div>

      <div className="bg-brand-secondary border border-white/5 p-4 flex flex-col md:flex-row gap-4 shadow-xl">
        <div className="relative flex-1 flex items-center bg-white/5 border border-white/10 focus-within:border-brand-accent transition-all">
          <Search className="absolute left-4 w-4 h-4 text-white/20 pointer-events-none" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID de pedido o nombre de cliente..."
            className="w-full bg-transparent pl-12 pr-4 py-3 text-xs text-white outline-none"
          />
        </div>
        <CustomDropdown
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: '', label: 'Todos los Estados' },
            ...Object.keys(statusColors).map(status => ({ value: status, label: status }))
          ]}
          className="w-48"
        />
      </div>

      <div className="bg-brand-secondary border border-white/5 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-4 text-left text-[10px] text-white/40 uppercase tracking-widest font-medium">Pedido</th>
                <th className="px-8 py-4 text-left text-[10px] text-white/40 uppercase tracking-widest font-medium">Cliente</th>
                <th className="px-8 py-4 text-left text-[10px] text-white/40 uppercase tracking-widest font-medium">Fecha</th>
                <th className="px-8 py-4 text-left text-[10px] text-white/40 uppercase tracking-widest font-medium">Estado</th>
                <th className="px-8 py-4 text-right text-[10px] text-white/40 uppercase tracking-widest font-medium">Total</th>
                <th className="px-8 py-4 text-right text-[10px] text-white/40 uppercase tracking-widest font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="px-8 py-6 font-mono text-[10px] text-brand-accent">#{order.id.slice(-6).toUpperCase()}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/60">
                        {order.customer.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs text-white font-medium">{order.customer.nombre} {order.customer.apellido}</p>
                        <p className="text-[9px] text-white/20 uppercase tracking-widest">{order.customer.telefono}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs text-white/40 italic">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 border text-[8px] uppercase tracking-widest font-bold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right text-sm font-bold text-white">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(order.total)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-white/40 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const msg = `Hola ${order.customer.nombre}, te contactamos de Aurum sobre tu pedido #${order.id.slice(-6).toUpperCase()}...`;
                          window.open(`https://wa.me/${order.customer.telefono}?text=${encodeURIComponent(msg)}`, '_blank');
                        }}
                        className="p-2 text-white/40 hover:text-[#25D366] hover:bg-[#25D366]/10 transition-all"
                        title="Contactar Cliente"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-brand-secondary border border-white/10 shadow-2xl p-10"
            >
              <button onClick={() => setSelectedOrder(null)} className="absolute top-6 right-6 text-white/40 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>

              <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-6">
                <div>
                  <h2 className="font-['Cormorant_Garamond'] text-3xl text-white italic tracking-wide mb-2">Pedido #{selectedOrder.id.slice(-6).toUpperCase()}</h2>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 border text-[9px] uppercase tracking-widest font-bold ${statusColors[selectedOrder.status]}`}>
                      {selectedOrder.status}
                    </span>
                    <span className="text-[10px] text-white/20 uppercase tracking-widest">{new Date(selectedOrder.date).toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-brand-text/40 text-[9px] uppercase tracking-widest mb-1">Total del Pedido</p>
                  <p className="text-3xl font-bold text-brand-accent tracking-tighter">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(selectedOrder.total)}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-[10px] text-brand-accent uppercase tracking-[0.2em] font-bold mb-4">
                      <UserIcon className="w-3 h-3" /> Datos del Cliente
                    </h4>
                    <div className="space-y-2 p-4 bg-white/5 border border-white/5 rounded-lg">
                      <p className="text-sm text-white font-medium">{selectedOrder.customer.nombre} {selectedOrder.customer.apellido}</p>
                      <p className="text-xs text-white/60">{selectedOrder.customer.telefono}</p>
                      <p className="text-xs text-white/40 uppercase tracking-wider mt-2">Dirección:</p>
                      <p className="text-xs text-white/60 italic">{selectedOrder.customer.direccion}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-[10px] text-brand-accent uppercase tracking-[0.2em] font-bold mb-4">
                      <ShoppingBag className="w-3 h-3" /> Artículos
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <span className="text-white/80">{item.name} <span className="text-white/20 ml-2">x{item.quantity}</span></span>
                          <span className="text-white font-medium">{(item.price * item.quantity).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] text-brand-accent uppercase tracking-[0.2em] font-bold mb-4">Actualizar Estado</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(statusColors).map(status => (
                        <button 
                          key={status}
                          onClick={() => {
                            updateOrderStatus(selectedOrder.id, status as any);
                            setSelectedOrder({ ...selectedOrder, status });
                            addLog('order', `Actualizó pedido #${selectedOrder.id.slice(-6).toUpperCase()} a ${status}`, user?.name || 'Admin');
                          }}
                          className={`px-3 py-2 text-[8px] uppercase tracking-widest transition-all border ${selectedOrder.status === status ? 'bg-brand-accent text-black border-brand-accent' : 'bg-white/5 text-white/40 border-white/10 hover:border-brand-accent/50'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const msg = `Hola ${selectedOrder.customer.nombre}, te contactamos de Aurum sobre tu pedido #${selectedOrder.id.slice(-6).toUpperCase()}...`;
                      window.open(`https://wa.me/${selectedOrder.customer.telefono}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="w-full py-4 bg-[#25D366] text-white flex items-center justify-center gap-3 font-bold text-[10px] tracking-widest uppercase hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="w-4 h-4" /> Contactar al Cliente
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
