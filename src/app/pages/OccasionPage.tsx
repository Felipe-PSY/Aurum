import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { SortBar } from '../components/SortBar';
import { useDb } from '../context/DbContext';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '../components/ui/sheet';

// Map of URL slugs → display names
const OCCASION_MAP: Record<string, { label: string; description: string }> = {
  matrimonio: {
    label: 'Matrimonio',
    description: 'Piezas eternas para el día más especial de tu vida.'
  },
  compromiso: {
    label: 'Compromiso',
    description: 'El símbolo perfecto para sellar un amor para siempre.'
  },
  graduaciones: {
    label: 'Graduaciones',
    description: 'Celebra los logros más importantes con una joya memorable.'
  },
  quinceanos: {
    label: 'Quinceañeros',
    description: 'La colección ideal para la celebración de los quince años.'
  }
};

// Quinceañeros doesn't have a gender filter – all products are feminine
// Matrimonio now also shouldn't have a gender filter.
const OCCASION_NO_GENDER_FILTER = ['quinceanos', 'matrimonio'];

export function OccasionPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useDb();

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');

  const isQuinceanos = slug === 'quinceanos';
  const occasionInfo = OCCASION_MAP[slug || ''];

  // Reset filters when slug changes
  useEffect(() => {
    setPriceRange([0, 5000000]);
    setSelectedGenders([]);
    setSortBy('relevance');
    window.scrollTo(0, 0);
  }, [slug]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Match occasion slug
        if (!product.occasion?.some(o => o.toLowerCase() === slug?.toLowerCase())) return false;

        // Gender filter (only for non-quinceanos occasions)
        if (!isQuinceanos && selectedGenders.length > 0 && !selectedGenders.includes(product.gender)) return false;

        // Price filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [products, slug, isQuinceanos, selectedGenders, priceRange, sortBy]);

  if (!occasionInfo) {
    return (
      <div className="min-h-screen bg-brand-primary pt-32 pb-24 px-6 flex flex-col items-center justify-center">
        <p className="text-white font-['Cormorant_Garamond'] text-3xl italic mb-6">Ocasión no encontrada.</p>
        <Link to="/" className="text-brand-accent font-['Montserrat'] text-xs tracking-[0.2em] uppercase hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const showGenderFilter = !OCCASION_NO_GENDER_FILTER.includes(slug || '');

  return (
    <div className="min-h-screen bg-brand-primary pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Hero Banner */}
        <div className="mb-12 text-center">
          <p className="text-brand-accent font-['Montserrat'] text-[10px] tracking-[0.4em] uppercase mb-3">Ocasiones</p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-white italic tracking-wide mb-4">
            {occasionInfo.label}
          </h1>
          <p className="text-white/40 font-['Montserrat'] text-sm max-w-md mx-auto">
            {occasionInfo.description}
          </p>
          <div className="mt-6 w-16 h-px bg-brand-accent/40 mx-auto" />
        </div>

        <SortBar
          totalResults={filteredProducts.length}
          sortBy={sortBy}
          setSortBy={setSortBy}
          title=""
        />

        <div className="flex flex-col lg:flex-row gap-10 mt-10">
          {/* Filtros Escritorio */}
          <aside className="hidden lg:block w-72 shrink-0">
            <FilterSidebar
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategories={[]}
              setSelectedCategories={() => {}}
              selectedGenders={selectedGenders}
              setSelectedGenders={setSelectedGenders}
              showCategoryFilter={false}
              showGenderFilter={showGenderFilter}
            />
          </aside>

          {/* Filtros Móvil */}
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
                  selectedCategories={[]}
                  setSelectedCategories={() => {}}
                  selectedGenders={selectedGenders}
                  setSelectedGenders={setSelectedGenders}
                  showCategoryFilter={false}
                  showGenderFilter={showGenderFilter}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Product Grid */}
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
                  <p className="text-white font-['Cormorant_Garamond'] text-2xl italic">
                    No se encontraron piezas para esta ocasión con los filtros seleccionados.
                  </p>
                  <button
                    onClick={() => {
                      setPriceRange([0, 5000000]);
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
