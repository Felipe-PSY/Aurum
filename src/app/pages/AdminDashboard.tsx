import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { CustomDropdown } from '../components/CustomDropdown';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useDb } from '../context/DbContext';
import { DashboardSkeleton } from '../components/Skeletons';

export function AdminDashboard() {
  const { products, orders, isAdminDataLoaded } = useDb();
  const [timeFilter, setTimeFilter] = useState<number>(7);

  if (!isAdminDataLoaded) return <DashboardSkeleton />;

  // Dynamic Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos Días' : hour < 18 ? 'Buenas Tardes' : 'Buenas Noches';

  // Compute stats
  const totalSales = orders
    .filter(o => o.status === 'Pagado' || o.status === 'Entregado')
    .reduce((sum, o) => sum + o.total, 0);
  
  const today = new Date().toISOString().split('T')[0];
  const ordersToday = orders.filter(o => o.date.startsWith(today)).length;
  
  const activeProducts = products.filter(p => (p.stock || 0) > 0).length;
  
  const uniqueCustomers = new Set(orders.map(o => o.customer?.telefono)).size;

  const stats = [
    { name: 'Ventas Totales', value: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(totalSales), change: '', icon: TrendingUp, positive: true },
    { name: 'Pedidos Hoy', value: ordersToday.toString(), change: '', icon: ShoppingBag, positive: true },
    { name: 'Productos Activos', value: activeProducts.toString(), change: '', icon: Package, positive: true },
    { name: 'Clientes', value: uniqueCustomers.toString(), change: '', icon: Users, positive: true },
  ];

  // Compute Chart Data
  const chartData = useMemo(() => {
    return Array.from({ length: timeFilter }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (timeFilter - 1 - i));
      const dateStr = d.toISOString().split('T')[0];
      const dayOrders = orders.filter(o => o.date.startsWith(dateStr));
      const sales = dayOrders
        .filter(o => o.status === 'Pagado' || o.status === 'Entregado')
        .reduce((sum, o) => sum + o.total, 0);
      const label = timeFilter <= 7 ? d.toLocaleDateString('es-CO', { weekday: 'short' }) : `${d.getDate()}/${d.getMonth()+1}`;
      return { name: label, sales, orders: dayOrders.length };
    });
  }, [orders, timeFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl text-white italic tracking-wide mb-1">{greeting}, Administrador</h1>
          <p className="text-brand-text/40 text-[10px] tracking-[0.3em] uppercase">Resumen de actividad para hoy</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
          <Clock className="w-4 h-4 text-brand-accent" />
          <span className="text-[10px] text-white/60 uppercase tracking-widest">{new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-brand-secondary border border-white/5 p-6 shadow-xl group hover:border-brand-accent/30 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-lg group-hover:bg-brand-accent/10 transition-colors">
                <stat.icon className="w-5 h-5 text-brand-accent" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
                {stat.change && (stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />)}
              </div>
            </div>
            <div>
              <p className="text-brand-text/40 text-[9px] uppercase tracking-[0.2em] mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-brand-secondary border border-white/5 p-8 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-['Cormorant_Garamond'] text-2xl text-white italic tracking-wide">Tendencia de Ventas</h3>
            <CustomDropdown
              value={timeFilter.toString()}
              onChange={(val) => setTimeFilter(Number(val))}
              options={[
                { value: '7', label: 'Últimos 7 días' },
                { value: '30', label: 'Último mes' },
                { value: '180', label: 'Últimos 6 meses' }
              ]}
              className="w-40"
            />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => value >= 1000000 ? `$${(value/1000000).toFixed(1)}M` : `$${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)}
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-accent)', fontSize: '12px' }}
                  labelStyle={{ color: 'white', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="sales" stroke="var(--color-accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-brand-secondary border border-white/5 p-8 shadow-xl flex flex-col">
          <h3 className="font-['Cormorant_Garamond'] text-2xl text-white italic tracking-wide mb-6">Alertas de Inventario</h3>
          <div className="flex-1 space-y-4">
            {products.filter(p => p.stock !== undefined && p.stock <= 3).slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 hover:border-brand-accent/20 transition-all rounded-lg">
                <div className="w-10 h-10 shrink-0 bg-brand-primary border border-white/10 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-60" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-white truncate font-medium">{p.name}</p>
                  <p className="text-[9px] text-brand-text/40 uppercase tracking-widest">{p.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-400">{p.stock}</p>
                  <p className="text-[8px] text-white/20 uppercase tracking-tighter">Stock</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/inventario" className="w-full mt-6 py-3 border border-white/10 text-[9px] text-brand-accent uppercase tracking-[0.2em] hover:bg-brand-accent hover:text-black transition-all text-center block">
            Ver todo el inventario
          </Link>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-brand-secondary border border-white/5 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-['Cormorant_Garamond'] text-2xl text-white italic tracking-wide">Pedidos Recientes</h3>
          <Link to="/admin/pedidos" className="text-[9px] text-brand-accent uppercase tracking-[0.2em] hover:text-white transition-colors">
            Ver todos los pedidos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-4 text-left text-[10px] text-white/40 uppercase tracking-widest font-medium">Pedido</th>
                <th className="px-8 py-4 text-left text-[10px] text-white/40 uppercase tracking-widest font-medium">Cliente</th>
                <th className="px-8 py-4 text-left text-[10px] text-white/40 uppercase tracking-widest font-medium">Estado</th>
                <th className="px-8 py-4 text-left text-[10px] text-white/40 uppercase tracking-widest font-medium">Fecha</th>
                <th className="px-8 py-4 text-right text-[10px] text-white/40 uppercase tracking-widest font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-4 text-white/20">
                      <ShoppingBag className="w-8 h-8" />
                      <p className="text-xs uppercase tracking-widest">No hay pedidos recientes</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-6 text-xs text-white font-medium">#{order.id.slice(-6)}</td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-white font-medium">{order.customer?.nombre} {order.customer?.apellido}</p>
                      <p className="text-[10px] text-white/30 truncate max-w-[150px]">{order.customer?.direccion}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[9px] uppercase tracking-widest font-bold">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs text-white/60">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-8 py-6 text-right text-xs text-brand-accent font-bold">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(order.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
