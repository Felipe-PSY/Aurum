import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  AlertTriangle, 
  ArrowUpDown, 
  ArrowUp,
  ArrowDown,
  Plus, 
  Minus,
  CheckCircle2
} from 'lucide-react';

export function AdminInventoryPage() {
  const { products, updateProduct, addLog } = useDb();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const filteredProducts = useMemo(() => {
    const result = [...products].filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.code?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    if (sortDirection === 'asc') {
      result.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    } else if (sortDirection === 'desc') {
      result.sort((a, b) => (b.stock || 0) - (a.stock || 0));
    }
    return result;
  }, [products, searchTerm, sortDirection]);

  const updateStock = (id: number | string, delta: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const currentStock = product.stock || 0;
    const newStock = Math.max(0, currentStock + delta);
    updateProduct({ ...product, stock: newStock });
    addLog('inventory', `Ajustó stock de ${product.name} a ${newStock}`, user?.email?.split('@')[0] || 'Admin');
  };

  const totalUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => (p.stock || 0) <= 3).length;
  const inventoryValue = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl text-white italic tracking-wide mb-1">Control de Inventario</h1>
          <p className="text-brand-text/40 text-[10px] tracking-[0.3em] uppercase">Gestiona existencias y alertas de stock bajo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-secondary border border-white/5 p-6 shadow-xl">
          <p className="text-brand-text/40 text-[9px] uppercase tracking-widest mb-1">Total Unidades</p>
          <p className="text-3xl font-bold text-white">{new Intl.NumberFormat('es-CO').format(totalUnits)}</p>
        </div>
        <div className="bg-brand-secondary border border-white/5 p-6 shadow-xl border-l-red-400/50 border-l-4">
          <p className="text-red-400/60 text-[9px] uppercase tracking-widest mb-1">Stock Bajo (≤3)</p>
          <p className="text-3xl font-bold text-white">{lowStockCount}</p>
        </div>
        <div className="bg-brand-secondary border border-white/5 p-6 shadow-xl">
          <p className="text-green-400/60 text-[9px] uppercase tracking-widest mb-1">Valor Inventario</p>
          <p className="text-3xl font-bold text-white">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(inventoryValue)}</p>
        </div>
      </div>

      <div className="bg-brand-secondary border border-white/5 p-4">
        <div className="relative flex items-center bg-white/5 border border-white/10 focus-within:border-brand-accent transition-all">
          <Search className="absolute left-4 w-4 h-4 text-white/20 pointer-events-none" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por producto..."
            className="w-full bg-transparent pl-12 pr-4 py-3 text-xs text-white outline-none"
          />
        </div>
      </div>

      <div className="bg-brand-secondary border border-white/5 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-4 text-left text-[10px] text-white/40 uppercase tracking-widest font-medium">Producto</th>
                <th className="px-8 py-4 text-left text-[10px] text-white/40 uppercase tracking-widest font-medium">Categoría</th>
                <th className="px-8 py-4 text-left text-[10px] text-white/40 uppercase tracking-widest font-medium">Código</th>
                <th 
                  className="px-8 py-4 text-center text-[10px] text-white/40 uppercase tracking-widest font-medium group cursor-pointer hover:text-white transition-colors select-none"
                  onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc')}
                >
                  <div className="flex items-center justify-center gap-2">
                    Existencias 
                    {sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-accent" /> : sortDirection === 'desc' ? <ArrowDown className="w-3 h-3 text-brand-accent" /> : <ArrowUpDown className="w-3 h-3 group-hover:text-white" />}
                  </div>
                </th>
                <th className="px-8 py-4 text-center text-[10px] text-white/40 uppercase tracking-widest font-medium">Estatus</th>
                <th className="px-8 py-4 text-right text-[10px] text-white/40 uppercase tracking-widest font-medium">Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((p) => {
                const stock = (p as any).stock || 0;
                return (
                  <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={p.image} className="w-10 h-10 object-cover border border-white/10" />
                        <span className="text-xs text-white font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[10px] text-white/30 uppercase tracking-[0.2em]">{p.category}</td>
                    <td className="px-8 py-6 text-[10px] text-white/60 font-mono">{p.code || '-'}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-lg font-bold ${stock <= 3 ? 'text-red-400' : 'text-white'}`}>{stock}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {stock <= 3 ? (
                        <div className="inline-flex items-center gap-2 text-red-400/60 bg-red-400/5 px-2 py-1 rounded border border-red-400/10">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="text-[8px] uppercase tracking-widest font-bold">Reponer</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 text-green-400/60 bg-green-400/5 px-2 py-1 rounded border border-green-400/10">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="text-[8px] uppercase tracking-widest font-bold">Suficiente</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => updateStock(p.id, -1)}
                          className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-red-400/20 transition-all font-bold"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => updateStock(p.id, 1)}
                          className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-green-400/20 transition-all font-bold"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
