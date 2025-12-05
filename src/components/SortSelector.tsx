import { motion } from 'framer-motion';
import { ArrowDownAZ, Star, Palette, ArrowUpDown } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { SortOption } from '../types';

const sortOptions: { value: SortOption; label_en: string; label_fr: string; icon: React.ReactNode }[] = [
  { value: 'alphabetical', label_en: 'A-Z', label_fr: 'A-Z', icon: <ArrowDownAZ className="w-4 h-4" /> },
  { value: 'stars_desc', label_en: 'Stars ↓', label_fr: 'Étoiles ↓', icon: <Star className="w-4 h-4" /> },
  { value: 'stars_asc', label_en: 'Stars ↑', label_fr: 'Étoiles ↑', icon: <Star className="w-4 h-4" /> },
  { value: 'colors_desc', label_en: 'Colors ↓', label_fr: 'Couleurs ↓', icon: <Palette className="w-4 h-4" /> },
  { value: 'colors_asc', label_en: 'Colors ↑', label_fr: 'Couleurs ↑', icon: <Palette className="w-4 h-4" /> },
];

export function SortSelector() {
  const { sortBy, setSortBy, language } = useAppStore();
  
  const currentSort = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];
  const label = language === 'fr' ? currentSort.label_fr : currentSort.label_en;
  
  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] 
                   border border-[var(--color-border)] hover:border-primary-500/50 transition-colors"
        aria-label="Sort options"
      >
        <ArrowUpDown className="w-4 h-4 text-primary-500" />
        <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
      </motion.button>
      
      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-1 opacity-0 invisible 
                      group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] 
                        rounded-lg shadow-xl p-1 min-w-[140px]">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`
                w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm
                transition-colors
                ${sortBy === option.value 
                  ? 'bg-primary-500 text-white' 
                  : 'hover:bg-[var(--color-border)] text-[var(--color-text)]'
                }
              `}
            >
              {option.icon}
              <span>{language === 'fr' ? option.label_fr : option.label_en}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}






