import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { SortBar } from '../components/SortBar';
import { useDb } from '../context/DbContext';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '../components/ui/sheet';

export function CatalogPage() {
  const { products } = useDb();
  const { param1, param2, param3 } = useParams();
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");

  // Al cargar, parseamos los parámetros dinámicos
  const parsedParams = useMemo(() => {
    let gender = null;
    let category = null;
    let subCategory = null;
    let occasion = null;

    if (param1?.toLowerCase() === 'hombre' || param1?.toLowerCase() === 'mujer') {
      gender = param1;
      category = param2;
      subCategory = param3;
    } else {
      category = param1;
      subCategory = param2;
    }

    // Si la categoría es "ocasiones", el siguiente param es la ocasión
    if (category === 'ocasiones') {
      occasion = param2;
      category = null;
      subCategory = null;
    }

    return { gender, category, subCategory, occasion };
  }, [param1, param2, param3]);

  const { gender, category, subCategory, occasion } = parsedParams;

  // Sincronizar filtros del sidebar con la URL
  useEffect(() => {
    if (category) setSelectedCategories([category.charAt(0).toUpperCase() + category.slice(1)]);
    if (gender) setSelectedGenders([gender.charAt(0).toUpperCase() + gender.slice(1)]);
    
    window.scrollTo(0, 0);
  }, [category, gender]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filtro de Género (desde la URL o desde el Sidebar)
      if (gender) {
        const urlGender = gender.charAt(0).toUpperCase() + gender.slice(1);
        if (product.gender !== urlGender) return false;
      }
      if (selectedGenders.length > 0 && !selectedGenders.includes(product.gender)) return false;

      // Filtro de Categoría (desde la URL o desde el Sidebar)
      if (category && product.category.toLowerCase() !== category.toLowerCase()) {
         if (selectedCategories.length === 0) return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.some(c => c.toLowerCase() === product.category.toLowerCase())) return false;

      // Filtro de Subcategoría
      if (subCategory && product.subCategory?.toLowerCase() !== subCategory.toLowerCase()) return false;

      // Filtro de Ocasión
      if (occasion && !product.occasion?.some(o => o.toLowerCase() === occasion.toLowerCase())) return false;

      // Filtro de Precio
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0; // Relevancia / Default
    });
  }, [gender, category, subCategory, occasion, priceRange, selectedCategories, selectedGenders, sortBy]);

  const pageTitle = useMemo(() => {
    if (occasion) return `Mesa de ${occasion.charAt(0).toUpperCase() + occasion.slice(1)}`;
    
    let title = "";
    if (category) title = category.charAt(0).toUpperCase() + category.slice(1);
    if (subCategory) title = `${subCategory.charAt(0).toUpperCase() + subCategory.slice(1)} ${title}`.trim();
    
    if (gender) {
        const genderSuffix = gender.toLowerCase() === 'hombre' ? ' para Hombre' : ' para Mujer';
        if (title) title += genderSuffix;
        else title = gender.toLowerCase() === 'hombre' ? 'Colección Hombre' : 'Colección Mujer';
    }

    return title || 'Todas las Piezas';
  }, [gender, category, subCategory, occasion]);

  return (
    <div className="min-h-screen bg-brand-primary pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SortBar 
          totalResults={filteredProducts.length} 
          sortBy={sortBy} 
          setSortBy={setSortBy}
          title={pageTitle}
        />

        <div className="flex flex-col lg:flex-row gap-10 mt-10">
          {/* Filtros Escritorio */}
          <aside className="hidden lg:block w-72 shrink-0">
            <FilterSidebar 
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedGenders={selectedGenders}
              setSelectedGenders={setSelectedGenders}
              showCategoryFilter={!category}
            />
          </aside>

          {/* Filtros Móvil (Trigger) */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center gap-2 px-6 py-3 border border-white/10 text-white font-['Montserrat'] text-xs tracking-widest uppercase hover:bg-white/5 transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtrar y Ordenar
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-black border-white/10 p-0 overflow-y-auto">
                <SheetHeader className="p-6 border-b border-white/10">
                  <SheetTitle className="text-white font-['Cormorant_Garamond'] text-2xl">Filtros</SheetTitle>
                </SheetHeader>
                <FilterSidebar 
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedGenders={selectedGenders}
                  setSelectedGenders={setSelectedGenders}
                  showCategoryFilter={!category}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Cuadrícula de Productos */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div 
                  key="grid"
                  className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  className="flex flex-col items-center justify-center py-32 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <X className="w-12 h-12 text-brand-accent/30 mb-4" />
                  <p className="text-white font-['Cormorant_Garamond'] text-2xl italic">No se encontraron piezas que coincidan con los filtros seleccionados.</p>
                  <button 
                    onClick={() => {
                        setPriceRange([0, 5000000]);
                        setSelectedCategories([]);
                        setSelectedGenders([]);
                    }}
                    className="mt-6 text-brand-accent font-['Montserrat'] text-xs tracking-[0.2em] uppercase hover:underline"
                  >
                    Ver todas las piezas
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
