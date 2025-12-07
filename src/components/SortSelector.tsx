import { motion } from 'framer-motion';
import { SortAsc, SortDesc, Users, Map, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { SortOption } from '../types';

interface SortOptionItem {
  value: SortOption;
  label_en: string;
  label_fr: string;
  icon: React.ReactNode;
  direction: 'asc' | 'desc';
}

// Icons now match arrow direction: SortAsc (A→Z with ↑) for ascending, SortDesc (Z→A with ↓) for descending
const sortOptions: SortOptionItem[] = [
  { 
    value: 'name_asc', 
    label_en: 'Name', 
    label_fr: 'Nom', 
    icon: <SortAsc className="w-4 h-4" />,
    direction: 'asc'
  },
  { 
    value: 'name_desc', 
    label_en: 'Name', 
    label_fr: 'Nom', 
    icon: <SortDesc className="w-4 h-4" />,
    direction: 'desc'
  },
  { 
    value: 'population_desc', 
    label_en: 'Population', 
    label_fr: 'Population', 
    icon: <Users className="w-4 h-4" />,
    direction: 'desc'
  },
  { 
    value: 'population_asc', 
    label_en: 'Population', 
    label_fr: 'Population', 
    icon: <Users className="w-4 h-4" />,
    direction: 'asc'
  },
  { 
    value: 'area_desc', 
    label_en: 'Area', 
    label_fr: 'Superficie', 
    icon: <Map className="w-4 h-4" />,
    direction: 'desc'
  },
  { 
    value: 'area_asc', 
    label_en: 'Area', 
    label_fr: 'Superficie', 
    icon: <Map className="w-4 h-4" />,
    direction: 'asc'
  },
];

export function SortSelector() {
  const { sortBy, setSortBy, language, showNames, setShowNames } = useAppStore();
  
  const currentSort = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];
  const label = language === 'fr' ? currentSort.label_fr : currentSort.label_en;
  
  return (
    <div className="flex items-center gap-2">
      {/* Show Names Toggle Button - EyeOff = names visible (inverted logic) */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowNames(!showNames)}
        className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all
          border focus:outline-none focus:ring-2 focus:ring-primary-500
          ${showNames 
            ? 'bg-primary-500 text-white border-primary-500' 
            : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-primary-500/50 text-[var(--color-text)]'
          }
        `}
        title={language === 'fr' ? 'Afficher/masquer les noms' : 'Show/hide names'}
        aria-label={language === 'fr' ? 'Afficher/masquer les noms' : 'Show/hide names'}
      >
        {showNames ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
        <span className="text-xs font-medium">
          {language === 'fr' ? 'Noms' : 'Names'}
        </span>
      </motion.button>

      {/* Sort Selector */}
      <div className="relative group">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] 
                   border border-[var(--color-border)] hover:border-primary-500/50 transition-colors"
        aria-label="Sort options"
      >
          {currentSort.icon}
        <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
          {currentSort.direction === 'asc' ? (
            <ArrowUp className="w-3.5 h-3.5 text-primary-500" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-primary-500" />
          )}
      </motion.button>
      
      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-1 opacity-0 invisible 
                      group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] 
                          rounded-lg shadow-xl p-1 min-w-[160px]">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`
                  w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm
                transition-colors
                ${sortBy === option.value 
                  ? 'bg-primary-500 text-white' 
                  : 'hover:bg-[var(--color-border)] text-[var(--color-text)]'
                }
              `}
            >
                <div className="flex items-center gap-2">
              {option.icon}
              <span>{language === 'fr' ? option.label_fr : option.label_en}</span>
                </div>
                {option.direction === 'asc' ? (
                  <ArrowUp className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5" />
                )}
            </button>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact sort selector for mobile toolbar
export function SortSelectorCompact() {
  const { sortBy, setSortBy, language } = useAppStore();
  
  const currentSort = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];
  
  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--color-surface)] 
                   border border-[var(--color-border)] text-[var(--color-text)]"
        aria-label="Sort"
      >
        {currentSort.icon}
        {currentSort.direction === 'asc' ? (
          <ArrowUp className="w-3 h-3 text-primary-500" />
        ) : (
          <ArrowDown className="w-3 h-3 text-primary-500" />
        )}
      </button>
      
      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-1 opacity-0 invisible 
                      group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] 
                        rounded-lg shadow-xl p-1 min-w-[140px]">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`
                w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-xs
                transition-colors
                ${sortBy === option.value 
                  ? 'bg-primary-500 text-white' 
                  : 'hover:bg-[var(--color-border)] text-[var(--color-text)]'
                }
              `}
            >
              <div className="flex items-center gap-1.5">
                {option.icon}
                <span>{language === 'fr' ? option.label_fr : option.label_en}</span>
              </div>
              {option.direction === 'asc' ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
