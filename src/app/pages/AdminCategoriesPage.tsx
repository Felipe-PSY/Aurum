import { useState } from 'react';
import { useDb } from '../context/DbContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  GripVertical,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export function AdminCategoriesPage() {
  const { categories, updateCategories } = useDb();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newSubCats, setNewSubCats] = useState<string[]>([]);
  const [subInput, setSubInput] = useState('');

  const toggleCategory = (id: string) => {
    updateCategories(categories.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const deleteCategory = (id: string) => {
    if (window.confirm('¿Eliminar esta categoría? Se ocultará de la navegación.')) {
      updateCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleSave = () => {
    if (!newCatName) return;
    
    const newCat = {
      id: editingCategory?.id || newCatName.toLowerCase().replace(/\s+/g, '-'),
      name: newCatName,
      subCategories: newSubCats,
      isActive: editingCategory ? editingCategory.isActive : true
    };

    if (editingCategory) {
      updateCategories(categories.map(c => c.id === editingCategory.id ? newCat : c));
    } else {
      updateCategories([...categories, newCat]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingCategory(null);
    setNewCatName('');
    setNewSubCats([]);
    setSubInput('');
  };

  const openEdit = (cat: any) => {
    setEditingCategory(cat);
    setNewCatName(cat.name);
    setNewSubCats(cat.subCategories || []);
    setIsModalOpen(true);
  };

  const addSub = () => {
    if (subInput && !newSubCats.includes(subInput)) {
      setNewSubCats([...newSubCats, subInput]);
      setSubInput('');
    }
  };

  const removeSub = (sub: string) => {
    setNewSubCats(newSubCats.filter(s => s !== sub));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl text-white italic tracking-wide mb-1">Estructura de Menú</h1>
          <p className="text-brand-text/40 text-[10px] tracking-[0.3em] uppercase">Maneja las categorías y subcategorías de tu tienda</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-3 bg-brand-accent text-black px-6 py-4 font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-all shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Nueva Categoría
        </button>
      </div>

      <div className="bg-brand-secondary border border-white/5 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-4 text-left text-[10px] text-white/40 uppercase tracking-widest font-medium">Categoría</th>
                <th className="px-8 py-4 text-left text-[10px] text-white/40 uppercase tracking-widest font-medium">Subcategorías</th>
                <th className="px-8 py-4 text-center text-[10px] text-white/40 uppercase tracking-widest font-medium">Estado</th>
                <th className="px-8 py-4 text-right text-[10px] text-white/40 uppercase tracking-widest font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/5 text-brand-accent">
                        <GripVertical className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity cursor-move" />
                      </div>
                      <span className="text-sm text-white font-medium">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                      {cat.subCategories?.map(sub => (
                        <span key={sub} className="px-2 py-1 bg-white/5 border border-white/10 text-[9px] text-white/40 uppercase tracking-widest">
                          {sub}
                        </span>
                      ))}
                      {(!cat.subCategories || cat.subCategories.length === 0) && (
                        <span className="text-[10px] text-white/10 italic">Sin subcategorías</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button 
                      onClick={() => toggleCategory(cat.id)}
                      className="inline-flex items-center transition-colors"
                    >
                      {cat.isActive ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <ToggleRight className="w-6 h-6" />
                          <span className="text-[8px] uppercase tracking-widest font-bold">Activo</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-white/20">
                          <ToggleLeft className="w-6 h-6" />
                          <span className="text-[8px] uppercase tracking-widest font-bold">Inactivo</span>
                        </div>
                      )}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEdit(cat)}
                        className="p-2 text-white/20 hover:text-brand-accent hover:bg-brand-accent/10 transition-all rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteCategory(cat.id)}
                        className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg bg-brand-secondary border border-white/10 shadow-2xl p-8 space-y-8"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <h2 className="font-['Cormorant_Garamond'] text-3xl text-white italic tracking-wide">
                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Nombre</label>
                  <input 
                    type="text" 
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all"
                    placeholder="Ej: Compromiso"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Subcategorías</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={subInput}
                      onChange={e => setSubInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addSub()}
                      className="flex-1 bg-white/5 border border-white/10 p-3 text-sm text-white focus:border-brand-accent outline-none transition-all"
                      placeholder="Nueva subcategoría..."
                    />
                    <button 
                      onClick={addSub}
                      className="bg-brand-accent text-black px-4 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {newSubCats.map(sub => (
                      <div key={sub} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] text-white/60 uppercase tracking-widest">
                        {sub}
                        <button onClick={() => removeSub(sub)} className="hover:text-red-400 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="text-[10px] text-white/40 uppercase tracking-widest hover:text-white transition-colors">Cancelar</button>
                <button 
                  onClick={handleSave}
                  className="bg-brand-accent text-black px-8 py-4 font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-all shadow-xl rounded-sm"
                >
                  {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
