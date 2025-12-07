import { AnimatePresence, motion } from 'framer-motion';
import { FlagCard } from './FlagCard';
import { SortSelector } from './SortSelector';
import { useAppStore } from '../store/useAppStore';
import { useFlags } from '../hooks/useFlags';
import { useTranslation } from '../hooks/useTranslation';
import { Flag } from 'lucide-react';

export function FlagGrid() {
  const { activeFilters, searchQuery, zoomLevel, sortBy } = useAppStore();
  const { flags, filteredCount, totalCount } = useFlags(activeFilters, searchQuery, sortBy);
  const { t } = useTranslation();
  
  if (flags.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-4"
      >
        <div className="w-24 h-24 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-6">
          <Flag className="w-12 h-12 text-[var(--color-text-secondary)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
          {t.ui('noResults')}
        </h3>
        <p className="text-[var(--color-text-secondary)] text-center max-w-md">
          {activeFilters.length > 0 
            ? "Essayez de modifier vos filtres pour voir plus de drapeaux."
            : "Aucun drapeau trouvé pour cette recherche."
          }
        </p>
      </motion.div>
    );
  }
  
  // Grid columns based on zoom level
  // PC: small=8, medium=6, large=4
  // Mobile: small=4, medium=3, large=2
  const getGridClass = () => {
    switch (zoomLevel) {
      case 'small':
        // Mobile: 4, Tablet: 6, PC: 8
        return 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2';
      case 'medium':
        // Mobile: 3, Tablet: 4, PC: 6
        return 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3';
      case 'large':
        // Mobile: 2, Tablet: 3, PC: 4
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
      default:
        return 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3';
    }
  };
  
  return (
    <div className="w-full">
      {/* Results Counter + Sort - Desktop only, mobile has its own toolbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-3 px-1 hidden lg:flex items-center justify-between"
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-text)]">{filteredCount}</span>
          {' '}/{' '}{totalCount}
          {activeFilters.length > 0 && (
            <span className="ml-2 text-primary-500">
              ({activeFilters.length} filtre{activeFilters.length > 1 ? 's' : ''})
            </span>
          )}
        </p>
        <SortSelector />
      </motion.div>
      
      {/* Grid */}
      <motion.div 
        layout
        className={`grid ${getGridClass()}`}
      >
        <AnimatePresence mode="popLayout">
          {flags.map(([countryName, countryData], index) => (
            <FlagCard
              key={countryName}
              countryName={countryName}
              countryCode={countryData.code}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
