import { useState, useRef } from 'react';
import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Copy, 
  ImageIcon,
  X,
  Upload
} from 'lucide-react';
import { Product } from '../data/products';
import { CustomDropdown } from '../components/CustomDropdown';

export function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, categories, addLog } = useDb();
  const { user } = useAuth();
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterGender, setFilterGender] = useState('');

  // Editor Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(term) || 
                        p.category.toLowerCase().includes(term) ||
                        (p.code?.toLowerCase() || '').includes(term);
    const matchCat = filterCategory ? p.category === filterCategory : true;
    const matchGen = filterGender ? p.gender === filterGender : true;
    return matchSearch && matchCat && matchGen;
  });

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
      const p = products.find(prod => prod.id === id);
      deleteProduct(id);
      if (p) addLog('product', `Eliminó producto: ${p.name}`, user?.name || 'Admin');
    }
  };

  const handleDuplicate = (p: Product) => {
    const newProduct = { ...p, name: `${p.name} (Copia)`, id: Date.now(), code: `${p.code}-C` };
    addProduct(newProduct);
    addLog('product', `Duplicó producto: ${p.name}`, user?.name || 'Admin');
  };

  const openEdit = (p: Product) => {
    setSelectedProduct(p);
    setSelectedCategory(p.category);
    setImageFile(p.image);
    setIsFeatured(!!p.isFeatured);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setSelectedProduct(null);
    const initialCategory = categories.find(c => c.isActive)?.name || '';
    setSelectedCategory(initialCategory);
    setImageFile(null);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newProduct: Product = {
      id: selectedProduct ? Number(selectedProduct.id) : Date.now(),
      name: fd.get('name') as string,
      code: fd.get('code') as string,
      price: Number(fd.get('price')),
      category: selectedCategory,
      subCategory: (fd.get('subCategory') as string) || undefined,
      gender: fd.get('gender') as any,
      stock: Number(fd.get('stock')),
      description: fd.get('description') as string,
      isFeatured: isFeatured,
      image: imageFile || 'https://images.unsplash.com/photo-1599643478514-4a410f064972?q=80&w=1000&auto=format&fit=crop'
    };

    if (selectedProduct) {
      updateProduct(newProduct);
      addLog('product', `Actualizó producto: ${newProduct.name}`, user?.name || 'Admin');
    } else {
      addProduct(newProduct);
      addLog('product', `Creó producto: ${newProduct.name}`, user?.name || 'Admin');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl text-white italic tracking-wide mb-1">Gestión de Productos</h1>
          <p className="text-brand-text/40 text-[10px] tracking-[0.3em] uppercase">Controla tu catálogo completo sin código</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-3 bg-brand-accent text-black px-6 py-4 font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-all shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-brand-secondary border border-white/5 p-4 flex flex-col md:flex-row gap-4 shadow-xl">
        <div className="relative flex-1 flex items-center bg-white/5 border border-white/10 focus-within:border-brand-accent transition-all">
          <Search className="absolute left-4 w-4 h-4 text-white/20 pointer-events-none" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, código o categoría..."
            className="w-full bg-transparent pl-12 pr-4 py-3 text-xs text-white outline-none"
          />
        </div>
        <div className="flex gap-4">
          <CustomDropdown 
            value={filterCategory} 
            onChange={setFilterCategory}
            options={[
              { value: '', label: 'Todas las Categorías' },
              ...categories.filter(c => c.isActive).map(c => ({ value: c.name, label: c.name }))
            ]}
            className="w-48"
          />
          <CustomDropdown 
            value={filterGender} 
            onChange={setFilterGender}
            options={[
              { value: '', label: 'Todos los Géneros' },
              { value: 'Mujer', label: 'Mujer' },
              { value: 'Hombre', label: 'Hombre' },
              { value: 'Unisex', label: 'Unisex' }
            ]}
            className="w-48"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, i) => (
             <motion.div 
               layout
               key={product.id}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               transition={{ delay: Math.min(i * 0.05, 0.3) }}
               className="bg-brand-secondary border border-white/5 group relative overflow-hidden flex flex-col h-full shadow-lg"
             >
               {/* Image */}
               <div className="relative aspect-square overflow-hidden bg-black/50">
                 <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000 group-hover:opacity-100" />
                 <div className="absolute top-4 right-4 flex gap-2">
                   <span className={`px-2 py-1 ${product.isFeatured ? 'bg-brand-accent text-black' : 'bg-black/50 text-white/40'} text-[8px] uppercase tracking-widest font-bold backdrop-blur-md`}>
                     {product.isFeatured ? 'Destacado' : 'Estándar'}
                   </span>
                 </div>
               </div>

               {/* Info */}
               <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-brand-secondary to-brand-primary">
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <p className="text-brand-accent text-[10px] tracking-[0.2em] uppercase font-bold mb-1">{product.category} {product.code && `| ${product.code}`}</p>
                     <h3 className="font-['Cormorant_Garamond'] text-xl text-white tracking-wide group-hover:text-brand-accent transition-colors line-clamp-1">{product.name}</h3>
                   </div>
                   <div className="relative group/actions">
                     <button className="p-2 text-white/20 hover:text-white transition-colors">
                       <MoreVertical className="w-4 h-4" />
                     </button>
                     <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all z-20">
                       <div className="bg-[#1A1A1A] border border-white/10 shadow-2xl p-2 flex flex-col gap-1 w-36">
                         <button onClick={() => openEdit(product)} className="flex items-center gap-3 px-3 py-2 text-[10px] text-white/60 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">
                           <Edit2 className="w-3 h-3" /> Editar
                         </button>
                         <button onClick={() => handleDuplicate(product)} className="flex items-center gap-3 px-3 py-2 text-[10px] text-white/60 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">
                           <Copy className="w-3 h-3" /> Duplicar
                         </button>
                         <button onClick={() => handleDelete(Number(product.id))} className="flex items-center gap-3 px-3 py-2 text-[10px] text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all uppercase tracking-widest">
                           <Trash2 className="w-3 h-3" /> Eliminar
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                   <p className="text-lg font-bold text-white tracking-tighter">
                     {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}
                   </p>
                   <div className="flex items-center gap-2">
                     <span className="text-[9px] text-white/20 uppercase tracking-widest">Stock: </span>
                     <span className={`text-xs font-medium ${product.stock && product.stock <= 3 ? 'text-red-400' : 'text-white/60'}`}>{product.stock || 0}</span>
                   </div>
                 </div>
               </div>
             </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-brand-secondary border border-white/10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-['Cormorant_Garamond'] text-3xl text-white italic tracking-wide">
                  {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto flex-1 bg-gradient-to-b from-brand-secondary to-brand-primary">
                <form id="productForm" onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-12">
                  {/* Left Column: Media */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] text-brand-accent uppercase tracking-widest block font-bold">Imágenes del Producto</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12 group hover:border-brand-accent/40 transition-all cursor-pointer relative overflow-hidden"
                      >
                        {imageFile ? (
                           <>
                             <img src={imageFile} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Upload className="w-8 h-8 text-white" />
                             </div>
                           </>
                        ) : (
                          <>
                            <ImageIcon className="w-12 h-12 text-white/10 mb-4 group-hover:text-brand-accent/40 transition-colors" />
                            <p className="text-xs text-white/40 mb-2">Haz clic para subir imagen</p>
                            <p className="text-[9px] text-white/20 uppercase tracking-widest">Mínimo 1000x1250 px Recomendado</p>
                          </>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest block">Nombre del Producto</label>
                      <input 
                        required
                        name="name"
                        type="text" 
                        defaultValue={selectedProduct?.name}
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all"
                        placeholder="Ej: Anillo Eternity Diamantes"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest block">Código (SKU)</label>
                        <input 
                          required
                          name="code"
                          type="text" 
                          defaultValue={selectedProduct?.code || `PRD-${Date.now().toString().slice(-4)}`}
                          className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all"
                        />
                      </div>
                       <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest block">Precio (COP)</label>
                        <input 
                          required
                          name="price"
                          type="number" 
                          defaultValue={selectedProduct?.price}
                          className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest block">Categoría</label>
                        <select 
                          name="category"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all appearance-none"
                        >
                          {categories.filter(c => c.isActive).map(c => (
                            <option key={c.id} value={c.name} className="bg-brand-primary">{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest block">Subcategoría</label>
                        <select 
                          name="subCategory"
                          defaultValue={selectedProduct?.subCategory || ''}
                          className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all appearance-none"
                        >
                          <option value="" className="bg-brand-primary">Ninguna</option>
                          {categories.find(c => c.name === selectedCategory)?.subCategories?.map(sub => (
                            <option key={sub} value={sub} className="bg-brand-primary">{sub}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest block">Género</label>
                        <select 
                          name="gender"
                          className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all appearance-none"
                          defaultValue={selectedProduct?.gender || 'Mujer'}
                        >
                          <option className="bg-brand-primary">Mujer</option>
                          <option className="bg-brand-primary">Hombre</option>
                          <option className="bg-brand-primary">Unisex</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest block">Stock Inicial</label>
                        <input 
                          required
                          name="stock"
                          type="number" 
                          defaultValue={selectedProduct?.stock || 0}
                          className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest block">Descripción</label>
                      <textarea 
                        name="description"
                        rows={3}
                        defaultValue={selectedProduct?.description}
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:border-brand-accent outline-none transition-all resize-none"
                        placeholder="Describe la pieza..."
                      />
                    </div>

                    <div className="flex gap-8 pt-4">
                       <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsFeatured(!isFeatured)}>
                         <div className="w-5 h-5 bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-accent transition-all">
                            {isFeatured && <div className="w-2.5 h-2.5 bg-brand-accent"></div>}
                         </div>
                         <span className="text-[10px] text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">¿Producto Destacado?</span>
                       </label>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-8 border-t border-white/5 flex justify-end gap-4 bg-brand-primary">
                <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-[10px] text-white/40 uppercase tracking-[0.2em] hover:text-white transition-all">Cancelar</button>
                <button type="submit" form="productForm" className="px-10 py-4 bg-brand-accent text-black font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-all shadow-xl">
                  {selectedProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
