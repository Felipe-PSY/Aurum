import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Product, 
  Category, 
  Order, 
  SiteConfig, 
  ActivityLog, 
  DbContextType,
  Testimonial
} from '../types';

const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [previousPrices, setPreviousPrices] = useState<{ id: string | number; price: number }[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    address: '', whatsappNumber: '', colors: { primary: '', secondary: '', accent: '' },
    contactEmail: '', instagram: '', businessHours: '', hero: { title: '', subtitle: '', buttonText: '', backgroundImage: '' },
    homeSections: [], banners: [], footerDescription: '', footerSections: []
  });

  // INITIAL LOAD: Fetch from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Config
        const { data: configData } = await supabase.from('site_config').select('data').eq('id', 1).single();
        if (configData) setSiteConfig(configData.data as SiteConfig);

        // 2. Categories & Subcategories
        const { data: catData } = await supabase.from('categories').select('*').order('order_index');
        const { data: occData } = await supabase.from('occasions').select('*');
        
        let mappedCats: Category[] = catData?.map((c: any) => ({
          id: c.id,
          name: c.name,
          isActive: c.is_active,
          subCategories: c.sub_categories || [] 
        })) || [];
        
        // Emulate or Update Occasions Category
        if (occData && occData.length > 0) {
          const occSubNames = Array.from(new Set(occData.map((o: any) => o.name))); // Unique names
          const existingOccIdx = mappedCats.findIndex(c => c.id === 'ocasiones');
          
          if (existingOccIdx !== -1) {
            // Merge with existing row if found
            mappedCats[existingOccIdx].subCategories = occSubNames;
          } else {
            // Add manually if missing from table
            mappedCats.push({
              id: 'ocasiones',
              name: 'Ocasiones',
              subCategories: occSubNames,
              isActive: true
            });
          }
        }
        setCategories(mappedCats);

        // 3. Products
        const { data: prodData } = await supabase.from('products').select('*, product_occasions(occasion_id)');
        if (prodData) {
          const mappedProd: Product[] = prodData.map((p: any) => ({
            id: p.id,
            code: p.code,
            name: p.name,
            description: p.description,
            price: Number(p.price),
            previousPrice: p.previous_price ? Number(p.previous_price) : undefined,
            gender: p.gender as any,
            image: p.image,
            category: p.category,
            subCategory: p.sub_category,
            isFeatured: p.is_featured,
            stock: p.stock,
            occasion: p.product_occasions?.map((po: any) => po.occasion_id) || []
          }));
          setProducts(mappedProd);
        }

        // 4. Orders
        const { data: ordersData } = await supabase.from('orders').select('*, order_items(*, products(name))').order('created_at', { ascending: false });
        if (ordersData) {
           const mappedOrders: Order[] = ordersData.map((o: any) => {
             const nameParts = o.customer_name ? o.customer_name.split(' ') : [''];
             return {
             id: o.id,
             date: o.created_at,
             status: o.status as any,
             total: Number(o.total),
             customer: {
               nombre: nameParts[0] || '',
               apellido: nameParts.slice(1).join(' ') || '',
               telefono: o.customer_phone || '',
               direccion: o.customer_address || ''
             },
             metodoPago: o.notes || 'Transferencia',
             items: o.order_items.map((oi: any) => ({
                 productId: oi.product_id,
                 name: oi.products?.name || 'Agregado',
                 quantity: oi.quantity,
                 price: Number(oi.price_at_time)
             }))
           }});
           setOrders(mappedOrders);
        }

        // 5. Testimonials
        const { data: testData } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        if (testData) {
           setTestimonials(testData.map((t: any) => ({
             id: t.id,
             name: t.author,
             title: t.role,
             text: t.content,
             rating: t.rating,
             isVisible: t.is_approved,
             date: t.created_at
           })));
        }

        // Local Logs (we can keep these local to avoid cluttering DB for now)
        const savedLogs = localStorage.getItem('aurum_logs');
        if (savedLogs) setActivityLogs(JSON.parse(savedLogs));

      } catch (err) {
        console.error("Error fetching data from Supabase:", err);
      } finally {
        setIsInitialized(true);
      }
    };

    fetchData();
  }, []);

  // Sync colors
  useEffect(() => {
    if (siteConfig?.colors?.primary) {
      document.documentElement.style.setProperty('--color-primary', siteConfig.colors.primary);
      document.documentElement.style.setProperty('--color-accent', siteConfig.colors.accent);
    }
  }, [siteConfig]);

  // WRITES TO SUPABASE (and local state optimism)
  
  const addLog = (type: ActivityLog['type'], message: string, userName: string) => {
    const newLog: ActivityLog = { id: `log-${Date.now()}`, type, message, userName, date: new Date().toISOString() };
    setActivityLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 100);
      localStorage.setItem('aurum_logs', JSON.stringify(updated));
      return updated;
    });
  };

  const addProduct = async (p: Product) => {
    const newId = crypto.randomUUID();
    const productData = {
      id: newId,
      code: p.code,
      name: p.name,
      description: p.description,
      price: p.price,
      previous_price: p.previousPrice,
      gender: p.gender,
      image: p.image,
      category: p.category,
      sub_category: p.subCategory,
      is_featured: p.isFeatured,
      stock: p.stock
    };
    
    setProducts(prev => [...prev, { ...p, id: newId }]); // optimism
    await supabase.from('products').insert(productData);
    
    if (p.occasion && p.occasion.length > 0) {
      const occs = p.occasion.map(o => ({ product_id: newId, occasion_id: o.toLowerCase() }));
      await supabase.from('product_occasions').insert(occs);
    }
  };

  const updateProduct = async (p: Product) => {
    setProducts(prev => prev.map(item => item.id === p.id ? p : item));
    
    await supabase.from('products').update({
      code: p.code, name: p.name, description: p.description, price: p.price,
      previous_price: p.previousPrice, gender: p.gender, image: p.image,
      category: p.category, sub_category: p.subCategory, is_featured: p.isFeatured,
      stock: p.stock
    }).eq('id', p.id);

    // Recrear occasions
    await supabase.from('product_occasions').delete().eq('product_id', p.id);
    if (p.occasion && p.occasion.length > 0) {
      const occs = p.occasion.map(o => ({ product_id: p.id, occasion_id: o.toLowerCase() }));
      await supabase.from('product_occasions').insert(occs);
    }
  };

  const deleteProduct = async (id: number | string) => {
    setProducts(prev => prev.filter(item => item.id !== id));
    await supabase.from('products').delete().eq('id', id);
  };

  const addOrder = async (o: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newId = crypto.randomUUID();
    const date = new Date().toISOString();
    const orderData = {
      id: newId,
      customer_name: `${o.customer.nombre} ${o.customer.apellido}`.trim(),
      customer_email: 'correo@ejemplo.com',
      customer_phone: o.customer.telefono,
      customer_address: o.customer.direccion,
      customer_city: '',
      status: 'Nuevo',
      total: o.total,
      notes: o.metodoPago,
      created_at: date
    };

    const newOrder: Order = { ...o, id: newId, date, status: 'Nuevo' };
    setOrders(prev => [newOrder, ...prev]);
    
    await supabase.from('orders').insert(orderData);
    
    if (o.items.length > 0) {
      const items = o.items.map(i => ({
        order_id: newId,
        product_id: i.productId || i.id,
        quantity: i.quantity,
        price_at_time: i.price
      }));
      await supabase.from('order_items').insert(items);
    }
    addLog('order', `Nuevo pedido #${newId.slice(-6).toUpperCase()} recibido`, 'Sistema');
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    let updatedOrder = { ...order, status };

    // Stock deduction
    if (status === 'Pagado' && !order.stockDeducted) {
      const newProducts = [...products];
      for (const item of order.items) {
        const productIndex = newProducts.findIndex(p => p.id === (item.id || item.productId));
        if (productIndex !== -1) {
          const product = newProducts[productIndex];
          const newStock = Math.max(0, (product.stock || 0) - item.quantity);
          newProducts[productIndex] = { ...product, stock: newStock };
          await supabase.from('products').update({ stock: newStock }).eq('id', product.id);
        }
      }
      setProducts(newProducts);
      updatedOrder.stockDeducted = true;
      addLog('inventory', `Descuento automático de stock por pedido #${id.slice(-6).toUpperCase()}`, 'Sistema');
    }

    setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
    await supabase.from('orders').update({ status }).eq('id', id);
  };

  const updateSiteConfig = async (config: SiteConfig) => {
    setSiteConfig(config);
    await supabase.from('site_config').update({ data: config }).eq('id', 1);
  };

  const updateCategories = async (cats: Category[]) => {
    const oldCats = [...categories];
    setCategories(cats); // Optimismo

    try {
      if (cats.length > oldCats.length) {
        // ADICIÓN DE CATEGORÍA
        const newCat = cats.find(c => !oldCats.find(oc => oc.id === c.id));
        if (newCat && newCat.id !== 'ocasiones') {
          const { error } = await supabase.from('categories').insert({
            id: newCat.id,
            name: newCat.name,
            is_active: newCat.isActive,
            sub_categories: newCat.subCategories || [],
            order_index: cats.length
          });
          if (error) throw error;
          addLog('config', `Nueva categoría creada: ${newCat.name}`, 'Sistema');
        }
      } else if (cats.length < oldCats.length) {
        // ELIMINACIÓN
        const deletedCat = oldCats.find(oc => !cats.find(c => c.id === oc.id));
        if (deletedCat && deletedCat.id !== 'ocasiones') {
          const { error } = await supabase.from('categories').delete().eq('id', deletedCat.id);
          if (error) throw error;
          addLog('config', `Categoría eliminada: ${deletedCat.name}`, 'Sistema');
        }
      } 
      
      // Siempre sincronizar estados y subcategorías para todas las existentes
      for (const cat of cats) {
        const oldCat = oldCats.find(oc => oc.id === cat.id);
        // Comparamos nombre, estado y subcategorías
        const hasChanged = !oldCat || 
          cat.name !== oldCat.name || 
          cat.isActive !== oldCat.isActive || 
          JSON.stringify(cat.subCategories) !== JSON.stringify(oldCat.subCategories);

        if (hasChanged) {
          if (cat.id === 'ocasiones') {
            const oldSubs = oldCat?.subCategories || [];
            const newSubs = cat.subCategories || [];
            
            // Subs nuevas
            const added = newSubs.filter(s => !oldSubs.includes(s));
            for (const name of added) {
               await supabase.from('occasions').insert({
                 id: name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-'),
                 name: name
               });
            }
            // Subs borradas
            const removed = oldSubs.filter(s => !newSubs.includes(s));
            for (const name of removed) {
               await supabase.from('occasions').delete().eq('name', name);
            }
          } else {
            const { error } = await supabase.from('categories').update({
              name: cat.name,
              is_active: cat.isActive,
              sub_categories: cat.subCategories || []
            }).eq('id', cat.id);
            if (error) {
              console.error("Error updating category:", error);
              // Si el error es que la columna no existe, avisamos al usuario (silenciosamente en log por ahora)
              if (error.message.includes('sub_categories')) {
                addLog('system', 'ERROR: Falta columna sub_categories en base de datos.', 'Admin');
              }
              throw error;
            }
          }
        }
      }
    } catch (err) {
      console.error("Critical error in updateCategories:", err);
      // Revertir optimismo si falla
      setCategories(oldCats);
      alert("Error al guardar cambios en las categorías. Por favor verifica tu conexión o base de datos.");
    }
  };

  const addTestimonial = async (t: Omit<Testimonial, 'id' | 'date' | 'isVisible'>) => {
    const newId = crypto.randomUUID();
    const date = new Date().toISOString();
    const testData = {
      id: newId,
      author: t.name,
      role: t.title,
      content: t.text,
      rating: t.rating,
      is_approved: true,
      created_at: date
    };
    
    setTestimonials(prev => [{ ...t, id: newId, date, isVisible: true }, ...prev]);
    await supabase.from('testimonials').insert(testData);
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    const testData: any = {};
    if (updates.name !== undefined) testData.author = updates.name;
    if (updates.title !== undefined) testData.role = updates.title;
    if (updates.text !== undefined) testData.content = updates.text;
    if (updates.rating !== undefined) testData.rating = updates.rating;
    if (updates.isVisible !== undefined) testData.is_approved = updates.isVisible;
    
    await supabase.from('testimonials').update(testData).eq('id', id);
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    await supabase.from('testimonials').delete().eq('id', id);
  };

  const updateAllPrices = async (percentage: number) => {
    setProducts(prev => {
      setPreviousPrices(prev.map(p => ({ id: p.id, price: p.price })));
      const updated = prev.map(p => ({ ...p, price: Math.round(p.price * (1 + percentage / 100)) }));
      
      // Batch update the DB (in a real app, do an RPC, but we'll loop safely since product count is small)
      updated.forEach(async (p) => {
        await supabase.from('products').update({ price: p.price }).eq('id', p.id);
      });
      
      return updated;
    });
    addLog('inventory', `Ajuste global de precios: ${percentage > 0 ? '+' : ''}${percentage}% aplicado`, 'Sistema');
  };

  const undoLastPriceAdjustment = async () => {
    if (!previousPrices) return;
    setProducts(prev => {
      const updated = prev.map(p => {
        const saved = previousPrices.find(s => s.id === p.id);
        return saved ? { ...p, price: saved.price } : p;
      });
      
      updated.forEach(async (p) => {
        await supabase.from('products').update({ price: p.price }).eq('id', p.id);
      });
      
      return updated;
    });
    addLog('inventory', 'Ajuste global de precios revertido', 'Admin');
    setPreviousPrices(null);
  };

  const canUndoPriceAdjustment = previousPrices !== null;

  return (
    <DbContext.Provider value={{ 
      products, categories, orders, siteConfig, activityLogs, testimonials,
      addProduct, updateProduct, deleteProduct, 
      addOrder, updateOrderStatus, updateSiteConfig, updateCategories,
      updateAllPrices, undoLastPriceAdjustment, canUndoPriceAdjustment,
      addLog, addTestimonial, updateTestimonial, deleteTestimonial 
    }}>
      {isInitialized ? children : null}
    </DbContext.Provider>
  );
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (!context) throw new Error('useDb must be used within a DbProvider');
  return context;
};
