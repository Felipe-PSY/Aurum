import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface FilterSidebarProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedGenders: string[];
  setSelectedGenders: (genders: string[]) => void;
  showCategoryFilter?: boolean;
  showGenderFilter?: boolean;
  availableSubCategories?: string[];
  selectedSubCategories?: string[];
  setSelectedSubCategories?: (subs: string[]) => void;
}

export function FilterSidebar({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  selectedGenders,
  setSelectedGenders,
  showCategoryFilter = true,
  showGenderFilter = true,
  availableSubCategories = [],
  selectedSubCategories = [],
  setSelectedSubCategories = () => {},
}: FilterSidebarProps) {
  const categories = ["Anillos", "Pulseras", "Cadenas", "Aretes", "Dijes", "Balines", "Piedras", "Estuches"];
  const genders = ["Hombre", "Mujer"];

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleGenderChange = (gender: string) => {
    if (selectedGenders.includes(gender)) {
      setSelectedGenders(selectedGenders.filter(g => g !== gender));
    } else {
      setSelectedGenders([...selectedGenders, gender]);
    }
  };

  const handleSubCategoryChange = (sub: string) => {
    if (selectedSubCategories.includes(sub)) {
      setSelectedSubCategories(selectedSubCategories.filter(s => s !== sub));
    } else {
      setSelectedSubCategories([...selectedSubCategories, sub]);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Build default open accordion sections
  const defaultOpen = [
    "price", 
    ...(showGenderFilter ? ["gender"] : []), 
    ...(showCategoryFilter ? ["category"] : []),
    ...(availableSubCategories.length > 0 ? ["subcategory"] : [])
  ];

  return (
    <div className="w-full space-y-8 p-6 bg-white/5 border border-white/10 backdrop-blur-md">
      <h2 className="font-['Cormorant_Garamond'] text-2xl text-brand-accent mb-6">Filtros</h2>

      <Accordion type="multiple" defaultValue={defaultOpen} className="w-full">
        {/* Rango de Precio */}
        <AccordionItem value="price" className="border-white/10">
          <AccordionTrigger className="text-white hover:text-brand-accent font-['Montserrat'] text-sm tracking-widest uppercase">
            Rango de Precio
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6 px-1">
            <Slider
              defaultValue={[priceRange[0], priceRange[1]]}
              max={30000000}
              step={50000}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="mb-6"
            />
            <div className="flex justify-between text-brand-text font-['Montserrat'] text-[10px] tracking-wider">
              <span>{formatCurrency(priceRange[0])}</span>
              <span>{formatCurrency(priceRange[1])}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Género – hidden for Quinceañeros */}
        {showGenderFilter && (
          <AccordionItem value="gender" className="border-white/10">
            <AccordionTrigger className="text-white hover:text-brand-accent font-['Montserrat'] text-sm tracking-widest uppercase">
              Género
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              {genders.map((gender) => (
                <div key={gender} className="flex items-center space-x-3 group cursor-pointer" onClick={() => handleGenderChange(gender)}>
                  <Checkbox 
                    id={`gender-${gender}`} 
                    checked={selectedGenders.includes(gender)}
                    className="border-white/20 data-[state=checked]:bg-brand-accent data-[state=checked]:border-brand-accent"
                  />
                  <Label 
                    htmlFor={`gender-${gender}`}
                    className="text-brand-text group-hover:text-white transition-colors cursor-pointer font-['Montserrat'] font-light"
                  >
                    {gender}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Subcategoría – shown only if there are specific subcategories available */}
        {availableSubCategories.length > 0 && (
          <AccordionItem value="subcategory" className="border-white/10">
            <AccordionTrigger className="text-white hover:text-brand-accent font-['Montserrat'] text-sm tracking-widest uppercase">
              Subcategoría
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              {availableSubCategories.map((sub) => (
                <div key={sub} className="flex items-center space-x-3 group cursor-pointer" onClick={() => handleSubCategoryChange(sub)}>
                  <Checkbox 
                    id={`sub-${sub}`} 
                    checked={selectedSubCategories.includes(sub)}
                    className="border-white/20 data-[state=checked]:bg-brand-accent data-[state=checked]:border-brand-accent"
                  />
                  <Label 
                    htmlFor={`sub-${sub}`}
                    className="text-brand-text group-hover:text-white transition-colors cursor-pointer font-['Montserrat'] font-light"
                  >
                    {sub}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Categoría – hidden when browsing within a specific category */}
        {showCategoryFilter && (
          <AccordionItem value="category" className="border-white/10">
            <AccordionTrigger className="text-white hover:text-brand-accent font-['Montserrat'] text-sm tracking-widest uppercase">
              Categoría
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-3 group cursor-pointer" onClick={() => handleCategoryChange(category)}>
                  <Checkbox 
                    id={`cat-${category}`} 
                    checked={selectedCategories.includes(category)}
                    className="border-white/20 data-[state=checked]:bg-brand-accent data-[state=checked]:border-brand-accent"
                  />
                  <Label 
                    htmlFor={`cat-${category}`}
                    className="text-brand-text group-hover:text-white transition-colors cursor-pointer font-['Montserrat'] font-light"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
      
      <button 
        onClick={() => {
            setPriceRange([0, 30000000]);
            setSelectedCategories([]);
            setSelectedGenders([]);
            setSelectedSubCategories([]);
        }}
        className="w-full py-3 text-brand-accent border border-brand-accent/30 hover:bg-brand-accent hover:text-black transition-all duration-300 font-['Montserrat'] text-[10px] tracking-widest uppercase"
      >
        Limpiar Filtros
      </button>
    </div>
  );
}
