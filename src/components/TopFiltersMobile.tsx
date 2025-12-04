import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useFlags } from '../hooks/useFlags';
import { FilterButton, ColorFilterButton } from './FilterButton';
import taxonomy from '../data/taxonomy.json';
import type { Taxonomy, ActiveFilter } from '../types';

const taxonomyData = taxonomy as Taxonomy;

// Quick access filters for mobile
const quickFilters = {
  colors: taxonomyData.categories.find(c => c.id === 'colors')?.subcategories[0]?.elements.slice(0, 8) || [],
  continents: [
    { id: 'africa', label_en: 'Africa', label_fr: 'Afrique' },
    { id: 'asia', label_en: 'Asia', label_fr: 'Asie' },
    { id: 'europe', label_en: 'Europe', label_fr: 'Europe' },
    { id: 'north_america', label_en: 'N. America', label_fr: 'Am. Nord' },
    { id: 'south_america', label_en: 'S. America', label_fr: 'Am. Sud' },
    { id: 'oceania', label_en: 'Oceania', label_fr: 'Océanie' },
  ],
};

export function TopFiltersMobile() {
  const { 
    language, 
    activeFilters, 
    addFilter, 
    removeFilter, 
    clearFilters,
    setFiltersPanelOpen 
  } = useAppStore();
  const { getAvailableFilters } = useFlags(activeFilters, '');
  
  const lang = language === 'fr' ? 'label_fr' : 'label_en';
  
  const isFilterActive = (categoryId: string, elementId: string) => {
    return activeFilters.some(f => f.categoryId === categoryId && f.elementId === elementId);
  };
  
  const handleFilterClick = (categoryId: string, elementId: string) => {
    const filter: ActiveFilter = { categoryId, elementId };
    if (isFilterActive(categoryId, elementId)) {
      removeFilter(filter);
    } else {
      addFilter(filter);
    }
  };
  
  return (
    <div className="lg:hidden sticky top-16 z-20 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      {/* Filter Toggle & Active Filters Count */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)]">
        <button
          onClick={() => setFiltersPanelOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] 
                     text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">
            {language === 'fr' ? 'Filtres' : 'Filters'}
          </span>
          {activeFilters.length > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-medium bg-primary-500 text-white rounded-full">
              {activeFilters.length}
            </span>
          )}
          <ChevronRight className="w-4 h-4" />
        </button>
        
        {activeFilters.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            {language === 'fr' ? 'Effacer' : 'Clear'}
          </button>
        )}
      </div>
      
      {/* Quick Filters - Horizontal Scroll */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
        {/* Continents Row */}
        <div className="mb-3">
          <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
            {language === 'fr' ? 'Continents' : 'Continents'}
          </p>
          <div className="flex gap-2">
            {quickFilters.continents.map(continent => {
              const isActive = isFilterActive('continents', continent.id);
              const isDisabled = !isActive && !getAvailableFilters('continents', continent.id);
              
              return (
                <FilterButton
                  key={continent.id}
                  label={continent[lang]}
                  isActive={isActive}
                  isDisabled={isDisabled}
                  onClick={() => handleFilterClick('continents', continent.id)}
                />
              );
            })}
          </div>
        </div>
        
        {/* Colors Row */}
        <div>
          <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
            {language === 'fr' ? 'Couleurs' : 'Colors'}
          </p>
          <div className="flex gap-2">
            {quickFilters.colors.map(color => {
              const isActive = isFilterActive('basic_colors', color.id);
              const isDisabled = !isActive && !getAvailableFilters('basic_colors', color.id);
              
              return (
                <ColorFilterButton
                  key={color.id}
                  label={color[lang]}
                  colorValue={color.id}
                  isActive={isActive}
                  isDisabled={isDisabled}
                  onClick={() => handleFilterClick('basic_colors', color.id)}
                />
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Active Filters Tags */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {activeFilters.map(filter => (
                <motion.button
                  key={`${filter.categoryId}-${filter.elementId}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => removeFilter(filter)}
                  className="px-2 py-1 text-xs bg-primary-500 text-white rounded-full 
                             flex items-center gap-1"
                >
                  {filter.elementId.replace(/_/g, ' ')}
                  <X className="w-3 h-3" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Full Filters Panel (Overlay) */}
      <MobileFiltersPanel />
    </div>
  );
}

function MobileFiltersPanel() {
  const { 
    language, 
    activeFilters, 
    addFilter, 
    removeFilter, 
    clearFilters,
    isFiltersPanelOpen,
    setFiltersPanelOpen 
  } = useAppStore();
  const { getAvailableFilters } = useFlags(activeFilters, '');
  
  const lang = language === 'fr' ? 'label_fr' : 'label_en';
  
  const isFilterActive = (categoryId: string, elementId: string) => {
    return activeFilters.some(f => f.categoryId === categoryId && f.elementId === elementId);
  };
  
  const handleFilterClick = (categoryId: string, elementId: string) => {
    const filter: ActiveFilter = { categoryId, elementId };
    if (isFilterActive(categoryId, elementId)) {
      removeFilter(filter);
    } else {
      addFilter(filter);
    }
  };
  
  const continents = [
    { id: 'africa', label_en: 'Africa', label_fr: 'Afrique' },
    { id: 'asia', label_en: 'Asia', label_fr: 'Asie' },
    { id: 'europe', label_en: 'Europe', label_fr: 'Europe' },
    { id: 'north_america', label_en: 'North America', label_fr: 'Amérique du Nord' },
    { id: 'south_america', label_en: 'South America', label_fr: 'Amérique du Sud' },
    { id: 'oceania', label_en: 'Oceania', label_fr: 'Océanie' },
  ];
  
  return (
    <AnimatePresence>
      {isFiltersPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFiltersPanelOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-full max-w-sm bg-[var(--color-bg)] 
                       shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {language === 'fr' ? 'Tous les filtres' : 'All Filters'}
              </h2>
              <button
                onClick={() => setFiltersPanelOpen(false)}
                className="p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Continents */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                  {language === 'fr' ? 'Continents' : 'Continents'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {continents.map(continent => {
                    const isActive = isFilterActive('continents', continent.id);
                    const isDisabled = !isActive && !getAvailableFilters('continents', continent.id);
                    
                    return (
                      <FilterButton
                        key={continent.id}
                        label={continent[lang]}
                        isActive={isActive}
                        isDisabled={isDisabled}
                        onClick={() => handleFilterClick('continents', continent.id)}
                      />
                    );
                  })}
                </div>
              </div>
              
              {/* Taxonomy Categories */}
              {taxonomyData.categories.map(category => (
                <div key={category.id}>
                  <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                    {category[lang]}
                  </h3>
                  {category.subcategories.map(subcategory => (
                    <div key={subcategory.id} className="mb-4">
                      <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                        {subcategory[lang]}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {subcategory.elements.map(element => {
                          const isActive = isFilterActive(subcategory.id, element.id);
                          const isDisabled = !isActive && !getAvailableFilters(subcategory.id, element.id);
                          
                          if (category.id === 'colors') {
                            return (
                              <ColorFilterButton
                                key={element.id}
                                label={element[lang]}
                                colorValue={element.id}
                                isActive={isActive}
                                isDisabled={isDisabled}
                                onClick={() => handleFilterClick(subcategory.id, element.id)}
                              />
                            );
                          }
                          
                          return (
                            <FilterButton
                              key={element.id}
                              label={element[lang]}
                              isActive={isActive}
                              isDisabled={isDisabled}
                              onClick={() => handleFilterClick(subcategory.id, element.id)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-[var(--color-border)] flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 btn-secondary"
              >
                {language === 'fr' ? 'Effacer tout' : 'Clear all'}
              </button>
              <button
                onClick={() => setFiltersPanelOpen(false)}
                className="flex-1 btn-primary"
              >
                {language === 'fr' ? 'Appliquer' : 'Apply'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



