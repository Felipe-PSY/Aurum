import { useState, useMemo } from 'react';
import { useDb } from '../context/DbContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users as UsersIcon, 
  Search, 
  Phone, 
  ShoppingBag, 
  ChevronRight,
  XCircle,
  MessageCircle
} from 'lucide-react';

export function AdminCustomersPage() {
  const { orders } = useDb();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Extract unique customers from orders
  const customers = useMemo(() => {
    const customerMap = new Map();
    
    orders.forEach(order => {
      const key = order.customer.telefono; // Using phone as unique ID for simulation
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          ...order.customer,
          totalOrders: 1,
          totalSpent: order.total,
          lastOrderDate: order.date,
          orders: [order]
        });
      } else {
        const existing = customerMap.get(key);
        existing.totalOrders += 1;
        existing.totalSpent += order.total;
        if (new Date(order.date) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.date;
        }
        existing.orders.push(order);
      }
    });

    return Array.from(customerMap.values());
  }, [orders]);

  const filteredCustomers = customers.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefono.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl text-white italic tracking-wide mb-1">Directorio de Clientes</h1>
          <p className="text-brand-text/40 text-[10px] tracking-[0.3em] uppercase">Base de datos de compradores y recurrencia</p>
        </div>
      </div>

      <div className="bg-brand-secondary border border-white/5 p-4 flex flex-col md:flex-row gap-4 shadow-xl">
        <div className="relative flex-1 flex items-center bg-white/5 border border-white/10 focus-within:border-brand-accent transition-all">
          <Search className="absolute left-4 w-4 h-4 text-white/20 pointer-events-none" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, apellido o teléfono..."
            className="w-full bg-transparent pl-12 pr-4 py-3 text-xs text-white outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer, idx) => (
          <div key={idx} className="bg-brand-secondary border border-white/5 p-6 hover:border-brand-accent/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-lg">
                {customer.nombre.charAt(0)}
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Total Compras</p>
                <p className="text-xl font-bold text-white leading-none">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(customer.totalSpent)}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-white font-medium text-lg leading-tight group-hover:text-brand-accent transition-colors">{customer.nombre} {customer.apellido}</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1 italic">{customer.totalOrders} pedidos realizados</p>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5">
              <div className="flex items-center gap-3 text-xs text-white/40">
                <Phone className="w-3 h-3 text-brand-accent" />
                <span>{customer.telefono}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/40">
                <ShoppingBag className="w-3 h-3 text-brand-accent" />
                <span>Último pedido: {new Date(customer.lastOrderDate).toLocaleDateString()}</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedCustomer(customer)}
              className="w-full mt-6 py-3 border border-white/10 text-[10px] text-white/40 uppercase tracking-widest font-bold flex items-center justify-center gap-2 group-hover:bg-brand-accent group-hover:text-black group-hover:border-brand-accent transition-all"
            >
              Ver Historial <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-24 text-center border border-dashed border-white/10">
            <UsersIcon className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white font-['Cormorant_Garamond'] text-2xl italic">No se encontraron clientes registrados.</p>
          </div>
        )}
      </div>

      {/* Customer History Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-brand-secondary border border-white/10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-['Cormorant_Garamond'] text-3xl text-white italic tracking-wide mb-1">
                    Historial de Compras
                  </h2>
                  <p className="text-brand-text/40 text-[10px] tracking-[0.3em] uppercase">
                    {selectedCustomer.nombre} {selectedCustomer.apellido}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      const msg = `Hola ${selectedCustomer.nombre}, te contactamos de Aurum...`;
                      window.open(`https://wa.me/${selectedCustomer.telefono}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="px-6 py-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center gap-2 font-bold text-[10px] tracking-widest uppercase transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> Contactar
                  </button>
                  <button onClick={() => setSelectedCustomer(null)} className="text-white/40 hover:text-white transition-colors">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-8 overflow-y-auto flex-1">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/5 p-4 border border-white/5 text-center">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Total Gastado</p>
                    <p className="text-xl font-bold text-brand-accent">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(selectedCustomer.totalSpent)}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 border border-white/5 text-center">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Total Pedidos</p>
                    <p className="text-xl font-bold text-white">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div className="bg-white/5 p-4 border border-white/5 text-center">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Última Compra</p>
                    <p className="text-xl font-bold text-white">{new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <h3 className="text-[10px] text-brand-accent uppercase tracking-[0.2em] font-bold mb-4">Pedidos Realizados</h3>
                <div className="space-y-4">
                  {selectedCustomer.orders.map((order: any) => (
                    <div key={order.id} className="bg-white/5 border border-white/5 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-accent/50 transition-colors">
                      <div>
                        <p className="font-mono text-brand-accent text-[10px] mb-1">#{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-white/60">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item: any, i: number) => (
                            <span key={i} className="px-2 py-1 bg-black/50 border border-white/5 text-[9px] text-white/80 uppercase tracking-widest">
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white mb-1">
                          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(order.total)}
                        </p>
                        <span className="px-2 py-1 border border-white/20 text-[8px] uppercase tracking-widest font-bold text-white/60">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
