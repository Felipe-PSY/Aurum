import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string; colorClass?: string }[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function CustomDropdown({ value, onChange, options, placeholder, icon, className }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className || ''}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-full min-h-[40px] text-left bg-white/5 border border-white/10 px-4 py-3 text-[10px] text-white/60 uppercase tracking-widest outline-none hover:border-white/20 focus:border-brand-accent transition-all"
      >
        <span className="flex items-center gap-2">
          {icon && <span className="text-white/40">{icon}</span>}
          {selectedOption ? (
            <>
              {selectedOption.colorClass && (
                <span className={`w-2 h-2 rounded-full ${selectedOption.colorClass}`} />
              )}
              {selectedOption.label}
            </>
          ) : (
             <span className="text-white/40">{placeholder || 'Seleccionar'}</span>
          )}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-white/40`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-1 bg-brand-secondary border border-white/10 shadow-2xl z-50 overflow-hidden"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 text-left px-4 py-3 text-[10px] uppercase tracking-widest hover:bg-brand-accent/10 transition-colors ${value === option.value ? 'text-brand-accent bg-white/[0.02]' : 'text-white/60'}`}
              >
                {option.colorClass && (
                  <span className={`w-2 h-2 rounded-full ${option.colorClass}`} />
                )}
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
