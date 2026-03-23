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
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    address: '', whatsappNumber: '', colors: { primary: '', secondary: '', accent: '' },
    contactEmail: '', instagram: '', businessHours: '', adminName: '', 
    hero: { title: '', subtitle: '', buttonText: '', backgroundImage: '' },
    homeSections: [], banners: [], footerDescription: '', footerSections: []
  });

  // INITIAL LOAD: Fetch from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: configData },
          { data: catData },
          { data: occData },
          { data: prodData },
          { data: ordersData },
          { data: testData },
          { data: logsData }
        ] = await Promise.all([
          supabase.from('site_config').select('data').eq('id', 1).single(),
          supabase.from('categories').select('*').order('order_index'),
          supabase.from('occasions').select('*'),
          supabase.from('products').select('*, product_occasions(occasion_id)'),
          supabase.from('orders').select('*, order_items(*, products(name))').order('created_at', { ascending: false }),
          supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
          supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(100)
        ]);

        if (configData) setSiteConfig(configData.data as SiteConfig);

        // 2. Categories & Subcategories
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
        if (ordersData) {
           const mappedOrders: Order[] = ordersData.map((o: any) => {
             const nameParts = o.customer_name ? o.customer_name.split(' ') : [''];
             return {
             id: o.id,
             date: o.created_at,
             status: o.status as any,
             stockDeducted: o.stock_deducted || false,
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

        // 6. Activity Logs
        if (logsData) {
          setActivityLogs(logsData.map((l: any) => ({
            id: l.id,
            type: l.type as any,
            message: l.message,
            userName: l.user_name,
            date: l.created_at
          })));
        }

      } catch (err) {
        console.error("Error fetching data from Supabase:", err);
      } finally {
        setIsInitialized(true);
      }
    };

    fetchData();
  }, []);

  // REALTIME SUBSCRIPTIONS
  useEffect(() => {
    if (!isInitialized) return;

    const channel = supabase.channel('aurum-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async (payload) => {
        if (payload.eventType === 'DELETE') {
          setProducts(prev => prev.filter(p => p.id !== payload.old.id));
        } else {
          const { data } = await supabase.from('products').select('*, product_occasions(occasion_id)').eq('id', payload.new.id).single();
          if (data) {
            const mapped: Product = {
              id: data.id, code: data.code, name: data.name, description: data.description,
              price: Number(data.price), previousPrice: data.previous_price ? Number(data.previous_price) : undefined,
              gender: data.gender as any, image: data.image, category: data.category, subCategory: data.sub_category,
              isFeatured: data.is_featured, stock: data.stock, occasion: data.product_occasions?.map((po: any) => po.occasion_id) || []
            };
            setProducts(prev => {
              if (payload.eventType === 'INSERT') {
                return prev.some(p => p.id === mapped.id) ? prev : [...prev, mapped];
              }
              return prev.map(p => p.id === mapped.id ? mapped : p);
            });
          }
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async (payload) => {
        if (payload.eventType === 'DELETE') {
          setOrders(prev => prev.filter(o => o.id !== payload.old.id));
        } else {
          const { data } = await supabase.from('orders').select('*, order_items(*, products(name))').eq('id', payload.new.id).single();
          if (data) {
            const nameParts = data.customer_name ? data.customer_name.split(' ') : [''];
            const mapped: Order = {
              id: data.id, date: data.created_at, status: data.status as any, stockDeducted: data.stock_deducted || false,
              total: Number(data.total), customer: { nombre: nameParts[0] || '', apellido: nameParts.slice(1).join(' ') || '', telefono: data.customer_phone || '', direccion: data.customer_address || '' },
              metodoPago: data.notes || 'Transferencia',
              items: data.order_items.map((oi: any) => ({ productId: oi.product_id, name: oi.products?.name || 'Agregado', quantity: oi.quantity, price: Number(oi.price_at_time) }))
            };
            setOrders(prev => {
              if (payload.eventType === 'INSERT') {
                return prev.some(o => o.id === mapped.id) ? prev : [mapped, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
              }
              return prev.map(o => o.id === mapped.id ? mapped : o);
            });
          }
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, async () => {
         const { data: catData } = await supabase.from('categories').select('*').order('order_index');
         if (catData) {
            setCategories(prev => {
               const newCats: Category[] = catData.map((c: any) => ({ id: c.id, name: c.name, isActive: c.is_active, subCategories: c.sub_categories || [] }));
               const occ = prev.find(p => p.id === 'ocasiones');
               if (occ) newCats.push(occ);
               return newCats;
            });
         }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, (payload) => {
         const l = payload.new;
         const mapped: ActivityLog = { id: l.id, type: l.type as any, message: l.message, userName: l.user_name, date: l.created_at };
         setActivityLogs(prev => prev.some(log => log.id === mapped.id) ? prev : [mapped, ...prev].slice(0, 100));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_config' }, (payload) => {
         if (payload.new.id === 1) setSiteConfig(payload.new.data as SiteConfig);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, (payload) => {
         if (payload.eventType === 'DELETE') {
            setTestimonials(prev => prev.filter(t => t.id !== payload.old.id));
         } else {
            const t = payload.new;
            const mapped: Testimonial = { id: t.id, name: t.author, title: t.role, text: t.content, rating: t.rating, isVisible: t.is_approved, date: t.created_at };
            setTestimonials(prev => {
               if (payload.eventType === 'INSERT') return prev.some(test => test.id === mapped.id) ? prev : [mapped, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
               return prev.map(test => test.id === mapped.id ? mapped : test);
            });
         }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isInitialized]);

  // Sync colors
  useEffect(() => {
    if (siteConfig?.colors?.primary) {
      document.documentElement.style.setProperty('--color-primary', siteConfig.colors.primary);
      document.documentElement.style.setProperty('--color-accent', siteConfig.colors.accent);
    }
  }, [siteConfig]);

  // WRITES TO SUPABASE (and local state optimism)
  
  const addLog = async (type: ActivityLog['type'], message: string, userName: string) => {
    const defaultName = userName.includes('@') ? userName.split('@')[0] : userName;
    const finalUserName = siteConfig.adminName || defaultName;
    const newId = crypto.randomUUID();
    const date = new Date().toISOString();
    const newLog: ActivityLog = { id: newId, type, message, userName: finalUserName, date };
    
    setActivityLogs(prev => [newLog, ...prev].slice(0, 100));
    
    await supabase.from('activity_logs').insert({
      id: newId, type, message, user_name: finalUserName, created_at: date
    });
  };

  const addProduct = async (p: Product) => {
    try {
      const { data, error } = await supabase.from('products').insert({
        code: p.code, name: p.name, description: p.description, price: p.price,
        previous_price: p.previousPrice, gender: p.gender, image: p.image,
        category: p.category, sub_category: p.subCategory, is_featured: p.isFeatured, stock: p.stock
      }).select().single();
      
      if (error) throw error;
      if (!data) throw new Error("No se devolvieron datos del servidor");

      const savedProduct: Product = {
        ...p,
        id: data.id,
        price: Number(data.price),
        previousPrice: data.previous_price ? Number(data.previous_price) : undefined
      };

      if (p.occasion && p.occasion.length > 0) {
        const occs = p.occasion.map(o => ({ product_id: data.id, occasion_id: o.toLowerCase() }));
        const { error: occError } = await supabase.from('product_occasions').insert(occs);
        if (occError) console.error("Error occasions:", occError);
      }
      
      setProducts(prev => [...prev, savedProduct]); 
      await addLog('product', `Nuevo producto creado: ${p.name}`, 'Sistema');
      // Success alert removed
    } catch (err: any) {
      console.error("Error creating product:", err);
      // alert removed
    }
  };

  const updateProduct = async (p: Product) => {
    try {
      const { error } = await supabase.from('products').update({
        code: p.code, name: p.name, description: p.description, price: p.price,
        previous_price: p.previousPrice, gender: p.gender, image: p.image,
        category: p.category, sub_category: p.subCategory, is_featured: p.isFeatured, stock: p.stock
      }).eq('id', p.id);

      if (error) throw error;

      await supabase.from('product_occasions').delete().eq('product_id', p.id);
      if (p.occasion && p.occasion.length > 0) {
        const occs = p.occasion.map(o => ({ product_id: p.id, occasion_id: o.toLowerCase() }));
        await supabase.from('product_occasions').insert(occs);
      }
      setProducts(prev => prev.map(item => item.id === p.id ? p : item));
      await addLog('product', `Producto actualizado: ${p.name}`, 'Sistema');
    } catch (err: any) {
      console.error("Error updating product:", err);
      // alert removed
    }
  };

  const deleteProduct = async (id: number | string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(item => item.id !== id));
      await addLog('product', `Producto eliminado permanentemente`, 'Sistema');
    } catch (err: any) {
      console.error("Error deleting product:", err);
      // alert removed
    }
  };

  const addOrder = async (o: Omit<Order, 'id' | 'date' | 'status'>) => {
    try {
      const newId = crypto.randomUUID();
      const date = new Date().toISOString();
      
      const { error } = await supabase.from('orders').insert({
        id: newId, customer_name: `${o.customer.nombre} ${o.customer.apellido}`.trim(),
        customer_email: 'aurum@joyeria.com', customer_phone: o.customer.telefono,
        customer_address: o.customer.direccion, status: 'Pendiente', total: o.total,
        notes: o.metodoPago, created_at: date, stock_deducted: false
      });

      if (error) throw error;
      
      if (o.items.length > 0) {
        const items = o.items.map(i => ({
          order_id: newId, product_id: i.productId || i.id, quantity: i.quantity, price_at_time: i.price
        }));
        await supabase.from('order_items').insert(items);
      }

      const newOrder: Order = { ...o, id: newId, date, status: 'Pendiente', stockDeducted: false };
      setOrders(prev => [newOrder, ...prev]);
      await addLog('order', `Pedido #${newId.slice(-6).toUpperCase()} registrado (Pendiente WA)`, 'Sistema');
    } catch (err: any) {
      console.error("Error adding order:", err);
      // alert removed
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const order = orders.find(o => o.id === id);
      if (!order) return;

      let updatedOrder = { ...order, status };

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
        await addLog('inventory', `Descuento automático de stock por pedido #${id.slice(-6).toUpperCase()}`, 'Sistema');
      }

      const { error } = await supabase.from('orders').update({ 
        status, 
        stock_deducted: updatedOrder.stockDeducted 
      }).eq('id', id);

      if (error) throw error;

      setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
    } catch (err: any) {
      console.error("Error updating order status:", err);
      // alert removed
    }
  };;

  const updateSiteConfig = async (config: SiteConfig) => {
    setSiteConfig(config);
    await supabase.from('site_config').update({ data: config }).eq('id', 1);
  };

  const updateCategories = async (cats: Category[]) => {
    const oldCats = [...categories];
    setCategories(cats);

    try {
      if (cats.length > oldCats.length) {
        const newCat = cats.find(c => !oldCats.find(oc => oc.id === c.id));
        if (newCat && newCat.id !== 'ocasiones') {
          await supabase.from('categories').insert({
            id: newCat.id, name: newCat.name, is_active: newCat.isActive,
            sub_categories: newCat.subCategories || [], order_index: cats.length
          });
          await addLog('config', `Nueva categoría creada: ${newCat.name}`, 'Sistema');
        }
      } 
      
      if (cats.length < oldCats.length) {
        const deletedCat = oldCats.find(oc => !cats.find(c => c.id === oc.id));
        if (deletedCat && deletedCat.id !== 'ocasiones') {
          await supabase.from('categories').delete().eq('id', deletedCat.id);
          await addLog('config', `Categoría eliminada: ${deletedCat.name}`, 'Sistema');
        }
      } 
      
      for (const cat of cats) {
        const oldCat = oldCats.find(oc => oc.id === cat.id);
        const hasChanged = !oldCat || 
          cat.name !== oldCat.name || cat.isActive !== oldCat.isActive || 
          JSON.stringify(cat.subCategories) !== JSON.stringify(oldCat.subCategories);

        if (hasChanged) {
          if (cat.id === 'ocasiones') {
            const oldSubs = oldCat?.subCategories || [];
            const newSubs = cat.subCategories || [];
            const added = newSubs.filter(s => !oldSubs.includes(s));
            for (const name of added) {
               await supabase.from('occasions').insert({
                 id: name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-'),
                 name: name
               });
            }
            const removed = oldSubs.filter(s => !newSubs.includes(s));
            for (const name of removed) {
               await supabase.from('occasions').delete().eq('name', name);
            }
          } else {
            const { data } = await supabase.from('categories').update({
              name: cat.name, is_active: cat.isActive, sub_categories: cat.subCategories || []
            }).eq('id', cat.id).select();
            
            if (!data || data.length === 0) {
              await supabase.from('categories').insert({
                id: cat.id, name: cat.name, is_active: cat.isActive, sub_categories: cat.subCategories || []
              });
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Error sincronización:", err);
      setCategories(oldCats);
      alert(`⚠️ ERROR DE PERSISTENCIA: ${err.message || 'Error en Supabase'}.`);
    }
  };

  const addTestimonial = async (t: Omit<Testimonial, 'id' | 'date' | 'isVisible'>) => {
    const newId = crypto.randomUUID();
    const date = new Date().toISOString();
    setTestimonials(prev => [{ ...t, id: newId, date, isVisible: true }, ...prev]);
    await supabase.from('testimonials').insert({
      id: newId, author: t.name, role: t.title, content: t.text, rating: t.rating, is_approved: true, created_at: date
    });
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
    const updated = products.map(p => ({ 
      ...p, previousPrice: p.price, price: Math.round(p.price * (1 + percentage / 100)) 
    }));
    setProducts(updated);
    for (const p of updated) {
      await supabase.from('products').update({ price: p.price, previous_price: p.previousPrice }).eq('id', p.id);
    }
    await addLog('inventory', `Ajuste global de precios: ${percentage > 0 ? '+' : ''}${percentage}% aplicado`, 'Sistema');
  };

  const undoLastPriceAdjustment = async () => {
    const updated = products.map(p => {
       if (p.previousPrice !== undefined && p.previousPrice !== null) {
         return { ...p, price: p.previousPrice, previousPrice: undefined };
       }
       return p;
    });
    setProducts(updated);
    for (const p of updated) {
      await supabase.from('products').update({ price: p.price, previous_price: null }).eq('id', p.id);
    }
    await addLog('inventory', 'Ajuste global de precios revertido', 'Admin');
  };

  const canUndoPriceAdjustment = products.some(p => p.previousPrice !== null && p.previousPrice !== undefined);

  const contextValue = React.useMemo(() => ({
    products, categories, orders, siteConfig, activityLogs, testimonials,
    addProduct, updateProduct, deleteProduct, 
    addOrder, updateOrderStatus, updateSiteConfig, updateCategories,
    updateAllPrices, undoLastPriceAdjustment, canUndoPriceAdjustment,
    addLog, addTestimonial, updateTestimonial, deleteTestimonial 
  }), [
    products, categories, orders, siteConfig, activityLogs, testimonials,
    canUndoPriceAdjustment
  ]);

  return (
    <DbContext.Provider value={contextValue}>
      {isInitialized ? children : null}
    </DbContext.Provider>
  );
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (!context) throw new Error('useDb must be used within a DbProvider');
  return context;
};
