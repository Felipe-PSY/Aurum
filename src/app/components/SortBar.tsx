import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SortBarProps {
  totalResults: number;
  sortBy: string;
  setSortBy: (value: string) => void;
  title: string;
}

export function SortBar({ totalResults, sortBy, setSortBy, title }: SortBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between py-6 border-b border-white/10 gap-4">
      <div>
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white tracking-wide">{title}</h1>
        <p className="text-brand-accent/60 font-['Montserrat'] text-[10px] tracking-[0.2em] mt-1 uppercase">
            {totalResults} {totalResults === 1 ? 'Resultado' : 'Resultados'}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-brand-text/60 font-['Montserrat'] text-[10px] tracking-widest uppercase whitespace-nowrap">Ordenar por:</span>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white font-['Montserrat'] text-xs tracking-wider">
            <SelectValue placeholder="Relevancia" />
          </SelectTrigger>
          <SelectContent className="bg-black/95 border-white/10 text-white font-['Montserrat']">
            <SelectItem value="relevance">Relevancia</SelectItem>
            <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
