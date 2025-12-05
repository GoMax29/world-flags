import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Settings2, RotateCcw } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useFlags } from "../hooks/useFlags";
import { FilterButton } from "./FilterButton";
import { IconFilterButton, ColorButton, ExclusiveToggle, MultiColorButton, CommunistButton } from "./IconFilterButton";
import { PatternSchemaSelector } from "./PatternSchemaSelector";
import taxonomy from "../data/taxonomy.json";
import type { Taxonomy, ActiveFilter } from "../types";

const taxonomyData = taxonomy as Taxonomy;

// All Light filters - same as desktop
const lightFilters = {
  continents: [
    { id: 'Africa', icon: '🦁', label_en: 'AF', label_fr: 'AF' },
    { id: 'North America', icon: '🗽', label_en: 'N-A', label_fr: 'N-A' },
    { id: 'South America', icon: '🗿', label_en: 'S-A', label_fr: 'S-A' },
    { id: 'Europe', icon: '🐮', label_en: 'EU', label_fr: 'EU' },
    { id: 'Asia', icon: '🐲', label_en: 'AS', label_fr: 'AS' },
    { id: 'Oceania', icon: '🦘', label_en: 'OC', label_fr: 'OC' },
  ],
  regions: [
    { id: 'central_america', icon: '🌴', label_en: 'Central America', label_fr: 'Amérique Centrale', categoryId: 'culture_regions', type: 'icon' },
    { id: 'caribbean', icon: '🏝️', label_en: 'Caribbean', label_fr: 'Caraïbes', categoryId: 'culture_regions', type: 'icon' },
    { id: 'scandinavia', icon: '❄️', label_en: 'Nordic Countries', label_fr: 'Pays Nordiques', categoryId: 'culture_regions', type: 'icon' },
    { id: 'communist', colors: ['#DC2626'], label_en: 'Communist', label_fr: 'Communiste', categoryId: 'color_schemes', type: 'communist' },
    { id: 'pan_slavic', colors: ['#2563EB', '#FFFFFF', '#DC2626'], label_en: 'Pan-Slavic', label_fr: 'Panslave', categoryId: 'color_schemes', type: 'multicolor' },
    { id: 'pan_african', colors: ['#DC2626', '#16A34A', '#FCD34D'], label_en: 'Pan-African', label_fr: 'Panafricain', categoryId: 'color_schemes', type: 'multicolor' },
    { id: 'pan_arab', colors: ['#DC2626', '#16A34A', '#FFFFFF', '#1F2937'], label_en: 'Pan-Arab', label_fr: 'Panarabe', categoryId: 'color_schemes', type: 'multicolor' },
  ],
  colors: [
    { id: 'red', hex: '#DC2626', label_en: 'Red', label_fr: 'Rouge' },
    { id: 'blue', hex: '#2563EB', label_en: 'Blue', label_fr: 'Bleu' },
    { id: 'yellow', hex: '#FCD34D', label_en: 'Yellow', label_fr: 'Jaune' },
    { id: 'green', hex: '#16A34A', label_en: 'Green', label_fr: 'Vert' },
    { id: 'white', hex: '#FFFFFF', label_en: 'White', label_fr: 'Blanc' },
    { id: 'black', hex: '#1F2937', label_en: 'Black', label_fr: 'Noir' },
    { id: 'orange', hex: '#F97316', label_en: 'Orange', label_fr: 'Orange' },
    { id: 'gold', hex: '#D97706', label_en: 'Gold', label_fr: 'Or' },
  ],
  shapes: [
    { id: 'disk', icon: '⚪', label_en: 'Circle', label_fr: 'Cercle', categoryId: 'shapes' },
    { id: 'rectangle', icon: '⬛', label_en: 'Square', label_fr: 'Carré', categoryId: 'shapes' },
    { id: 'triangle', icon: '🔺', label_en: 'Triangle', label_fr: 'Triangle', categoryId: 'shapes' },
    { id: 'diamond', icon: '🔷', label_en: 'Diamond', label_fr: 'Losange', categoryId: 'shapes' },
  ],
  celestial: [
    { id: 'sun', icon: '☀️', label_en: 'Sun', label_fr: 'Soleil', categoryId: 'sun_moon' },
    { id: 'crescent', icon: '🌙', label_en: 'Moon', label_fr: 'Lune', categoryId: 'sun_moon' },
    { id: '0_stars', icon: '⭕', label_en: 'No Stars', label_fr: '0 étoile', categoryId: 'star_count' },
    { id: '1_star', icon: '⭐', label_en: '1 Star', label_fr: '1 étoile', categoryId: 'star_count' },
    { id: 'multiple_stars', icon: '✳️', label_en: 'Stars', label_fr: 'Étoiles', categoryId: 'stars' },
  ],
  animals: [
    { id: 'eagle', icon: '🦅', label_en: 'Eagle', label_fr: 'Aigle', categoryId: 'birds' },
    { id: 'lion', icon: '🦁', label_en: 'Lion', label_fr: 'Lion', categoryId: 'mammals' },
    { id: 'horse', icon: '🐎', label_en: 'Horse', label_fr: 'Cheval', categoryId: 'mammals' },
    { id: 'dragon', icon: '🐉', label_en: 'Dragon', label_fr: 'Dragon', categoryId: 'mythical' },
  ],
  nature: [
    { id: 'trees', icon: '🌳', label_en: 'Trees', label_fr: 'Arbres', categoryId: 'subcategory' },
    { id: 'wheat', icon: '🌾', label_en: 'Grain', label_fr: 'Céréales', categoryId: 'leaves_flowers' },
    { id: 'mountain', icon: '⛰️', label_en: 'Mountain', label_fr: 'Montagne', categoryId: 'terrain' },
    { id: 'sea', icon: '🌊', label_en: 'Sea', label_fr: 'Mer', categoryId: 'water_elements' },
  ],
  symbols: [
    { id: 'coat_of_arms', icon: '🛡️', label_en: 'Coat of Arms', label_fr: 'Blason', categoryId: 'heraldic_elements' },
    { id: 'crown', icon: '👑', label_en: 'Crown', label_fr: 'Couronne', categoryId: 'heraldic_elements' },
    { id: 'christian_cross', icon: '✝️', label_en: 'Cross', label_fr: 'Croix', categoryId: 'crosses' },
    { id: 'crescent_star', icon: '☪️', label_en: 'Islamic', label_fr: 'Islam', categoryId: 'islamic' },
    { id: 'motto', icon: '📜', label_en: 'Motto', label_fr: 'Devise', categoryId: 'inscriptions' },
  ],
  weapons: [
    { id: 'sword', icon: '🗡️', label_en: 'Bladed', label_fr: 'Blanches', categoryId: 'bladed' },
    { id: 'rifle', icon: '🔫', label_en: 'Firearms', label_fr: 'À feu', categoryId: 'ranged' },
    { id: 'spear', icon: '🏹', label_en: 'Spear', label_fr: 'Lance', categoryId: 'ranged' },
  ],
  humans: [
    { id: 'human_figure', icon: '👤', label_en: 'Human', label_fr: 'Humain', categoryId: 'people' },
    { id: 'hands', icon: '✋', label_en: 'Hands', label_fr: 'Mains', categoryId: 'people' },
    { id: 'phrygian_cap', icon: '🎩', label_en: 'Phrygian Cap', label_fr: 'Bonnet Phrygien', categoryId: 'people' },
  ],
};

export function TopFiltersMobile() {
  const {
    language,
    activeFilters,
    addFilter,
    removeFilter,
    clearFilters,
    setFiltersPanelOpen,
    menuMode,
    setMenuMode,
    exclusiveColorMode,
    setExclusiveColorMode,
  } = useAppStore();

  const lang = language === "fr" ? "label_fr" : "label_en";

  const isFilterActive = (categoryId: string, elementId: string) => {
    return activeFilters.some(
      (f) => f.categoryId === categoryId && f.elementId === elementId
    );
  };

  const handleFilterClick = (categoryId: string, elementId: string) => {
    const filter: ActiveFilter = { categoryId, elementId };
    if (isFilterActive(categoryId, elementId)) {
      removeFilter(filter);
    } else {
      addFilter(filter);
    }
  };

  // Exclusive continent handler - only one continent can be active at a time
  const handleExclusiveContinentClick = (elementId: string) => {
    const filter: ActiveFilter = { categoryId: 'regions', elementId };
    if (isFilterActive('regions', elementId)) {
      removeFilter(filter);
    } else {
      // Remove any other continent filters first
      const continentIds = ['Africa', 'North America', 'South America', 'Europe', 'Asia', 'Oceania'];
      continentIds.forEach(id => {
        if (isFilterActive('regions', id)) {
          removeFilter({ categoryId: 'regions', elementId: id });
        }
      });
      addFilter(filter);
    }
  };

  // Exclusive region/culture handler
  const handleExclusiveRegionClick = (categoryId: string, elementId: string) => {
    const filter: ActiveFilter = { categoryId, elementId };
    if (isFilterActive(categoryId, elementId)) {
      removeFilter(filter);
    } else {
      const regionIds = ['central_america', 'caribbean', 'scandinavia'];
      const colorSchemeIds = ['pan_slavic', 'pan_african', 'pan_arab', 'communist'];
      
      regionIds.forEach(id => {
        if (isFilterActive('culture_regions', id)) {
          removeFilter({ categoryId: 'culture_regions', elementId: id });
        }
      });
      colorSchemeIds.forEach(id => {
        if (isFilterActive('color_schemes', id)) {
          removeFilter({ categoryId: 'color_schemes', elementId: id });
        }
      });
      addFilter(filter);
    }
  };

  // Render region button based on type
  const renderRegionButton = (filter: typeof lightFilters.regions[0]) => {
    if (filter.type === 'communist') {
      return (
        <CommunistButton
          key={filter.id}
          label={filter[lang]}
          isActive={isFilterActive(filter.categoryId, filter.id)}
          onClick={() => handleExclusiveRegionClick(filter.categoryId, filter.id)}
          size="sm"
        />
      );
    }
    
    if (filter.type === 'multicolor' && filter.colors) {
      return (
        <MultiColorButton
          key={filter.id}
          colors={filter.colors}
          label={filter[lang]}
          isActive={isFilterActive(filter.categoryId, filter.id)}
          onClick={() => handleExclusiveRegionClick(filter.categoryId, filter.id)}
          size="sm"
        />
      );
    }
    
    return (
      <IconFilterButton
        key={filter.id}
        icon={filter.icon || ''}
        label={filter[lang]}
        isActive={isFilterActive(filter.categoryId, filter.id)}
        onClick={() => handleExclusiveRegionClick(filter.categoryId, filter.id)}
        size="sm"
      />
    );
  };

  return (
    <div className="lg:hidden sticky top-16 z-20 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      {/* Header with Light/Advanced toggle */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--color-border)]">
        <div className="flex rounded-lg bg-[var(--color-surface)] p-0.5">
          <button
            onClick={() => setMenuMode('light')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all
              ${menuMode === 'light' 
                ? 'bg-primary-500 text-white shadow-sm' 
                : 'text-[var(--color-text-secondary)]'
              }`}
          >
            <Sparkles className="w-3 h-3" />
            Light
          </button>
          <button
            onClick={() => setFiltersPanelOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-[var(--color-text-secondary)]"
          >
            <Settings2 className="w-3 h-3" />
            {language === 'fr' ? 'Avancé' : 'Advanced'}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {activeFilters.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary-500 text-white rounded-full">
              {activeFilters.length}
            </span>
          )}
          {activeFilters.length > 0 && (
            <button
              onClick={clearFilters}
              className="p-1 rounded-lg hover:bg-[var(--color-surface)] text-red-500"
              aria-label="Clear filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Light Mode - Compact filters without category titles */}
      {menuMode === 'light' && (
        <div className="px-2 py-2 overflow-x-auto scrollbar-hide">
          <div className="flex flex-wrap gap-1 items-center">
            {/* Continents - mutually exclusive (radio style) */}
            {lightFilters.continents.map((filter) => (
              <IconFilterButton
                key={filter.id}
                icon={filter.icon}
                label={filter[lang]}
                isActive={isFilterActive("regions", filter.id)}
                onClick={() => handleExclusiveContinentClick(filter.id)}
                size="sm"
              />
            ))}
            
            {/* Separator */}
            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
            
            {/* Regions/Cultures */}
            {lightFilters.regions.map(renderRegionButton)}
            
            {/* Separator */}
            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
            
            {/* Colors */}
            {lightFilters.colors.map((color) => (
              <ColorButton
                key={color.id}
                color={color.id}
                colorHex={color.hex}
                label={color[lang]}
                isActive={isFilterActive("primary_colors", color.id) || isFilterActive("secondary_colors", color.id)}
                onClick={() => handleFilterClick(color.id === 'orange' || color.id === 'gold' ? "secondary_colors" : "primary_colors", color.id)}
                size="sm"
              />
            ))}
            <ExclusiveToggle
              isActive={exclusiveColorMode}
              onClick={() => setExclusiveColorMode(!exclusiveColorMode)}
              label={language === 'fr' ? 'Exclusif' : 'Exclusive'}
            />
            
            {/* Separator */}
            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
            
            {/* Shapes */}
            {lightFilters.shapes.map((filter) => (
              <IconFilterButton
                key={filter.id}
                icon={filter.icon}
                label={filter[lang]}
                isActive={isFilterActive(filter.categoryId, filter.id)}
                onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                size="sm"
              />
            ))}
            
            {/* Separator */}
            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
            
            {/* Celestial */}
            {lightFilters.celestial.map((filter) => (
              <IconFilterButton
                key={filter.id}
                icon={filter.icon}
                label={filter[lang]}
                isActive={isFilterActive(filter.categoryId, filter.id)}
                onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                size="sm"
              />
            ))}
            
            {/* Separator */}
            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
            
            {/* Animals */}
            {lightFilters.animals.map((filter) => (
              <IconFilterButton
                key={filter.id}
                icon={filter.icon}
                label={filter[lang]}
                isActive={isFilterActive(filter.categoryId, filter.id)}
                onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                size="sm"
              />
            ))}
            
            {/* Separator */}
            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
            
            {/* Nature */}
            {lightFilters.nature.map((filter) => (
              <IconFilterButton
                key={filter.id}
                icon={filter.icon}
                label={filter[lang]}
                isActive={isFilterActive(filter.categoryId, filter.id)}
                onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                size="sm"
              />
            ))}
            
            {/* Separator */}
            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
            
            {/* Symbols */}
            {lightFilters.symbols.map((filter) => (
              <IconFilterButton
                key={filter.id}
                icon={filter.icon}
                label={filter[lang]}
                isActive={isFilterActive(filter.categoryId, filter.id)}
                onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                size="sm"
              />
            ))}
            
            {/* Separator */}
            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
            
            {/* Weapons */}
            {lightFilters.weapons.map((filter) => (
              <IconFilterButton
                key={filter.id}
                icon={filter.icon}
                label={filter[lang]}
                isActive={isFilterActive(filter.categoryId, filter.id)}
                onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                size="sm"
              />
            ))}
            
            {/* Separator */}
            <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
            
            {/* Humans */}
            {lightFilters.humans.map((filter) => (
              <IconFilterButton
                key={filter.id}
                icon={filter.icon}
                label={filter[lang]}
                isActive={isFilterActive(filter.categoryId, filter.id)}
                onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                size="sm"
              />
            ))}
          </div>
          
          {/* Layout patterns on separate row */}
          <div className="mt-2 pt-2 border-t border-[var(--color-border)]">
            <PatternSchemaSelector compact />
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[var(--color-border)]"
          >
            <div className="px-2 py-1.5 flex flex-wrap gap-1">
              {activeFilters.slice(0, 6).map((filter) => (
                <motion.button
                  key={`${filter.categoryId}-${filter.elementId}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => removeFilter(filter)}
                  className="px-1.5 py-0.5 text-[10px] bg-primary-500 text-white rounded-full 
                             flex items-center gap-0.5"
                >
                  {filter.elementId.replace(/_/g, " ").slice(0, 8)}
                  <X className="w-2.5 h-2.5" />
                </motion.button>
              ))}
              {activeFilters.length > 6 && (
                <span className="px-1.5 py-0.5 text-[10px] text-primary-500">
                  +{activeFilters.length - 6}
                </span>
              )}
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
    setFiltersPanelOpen,
  } = useAppStore();
  const { getAvailableFilters } = useFlags(activeFilters, "");

  const lang = language === "fr" ? "label_fr" : "label_en";

  const isFilterActive = (categoryId: string, elementId: string) => {
    return activeFilters.some(
      (f) => f.categoryId === categoryId && f.elementId === elementId
    );
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
    { id: "Africa", label_en: "Africa", label_fr: "Afrique" },
    { id: "Asia", label_en: "Asia", label_fr: "Asie" },
    { id: "Europe", label_en: "Europe", label_fr: "Europe" },
    { id: "North America", label_en: "North America", label_fr: "Amérique du Nord" },
    { id: "South America", label_en: "South America", label_fr: "Amérique du Sud" },
    { id: "Oceania", label_en: "Oceania", label_fr: "Océanie" },
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
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-full max-w-sm bg-[var(--color-bg)] 
                       shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary-500" />
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {language === "fr" ? "Filtres avancés" : "Advanced Filters"}
                </h2>
              </div>
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
                  {language === "fr" ? "Continents" : "Continents"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {continents.map((continent) => {
                    const isActive = isFilterActive("regions", continent.id);
                    const isAvailable = getAvailableFilters("regions", continent.id);

                    return (
                      <FilterButton
                        key={continent.id}
                        label={continent[lang]}
                        isActive={isActive}
                        isDisabled={!isActive && !isAvailable}
                        onClick={() => handleFilterClick("regions", continent.id)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Taxonomy Categories */}
              {taxonomyData.categories.map((category) => {
                if (["colors", "flag_shape"].includes(category.id)) return null;

                return (
                  <div key={category.id}>
                    <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                      {category[lang]}
                    </h3>
                    {category.subcategories.map((subcategory) => {
                      const visibleElements = subcategory.elements.filter(
                        (element) =>
                          getAvailableFilters(subcategory.id, element.id) ||
                          isFilterActive(subcategory.id, element.id)
                      );

                      if (visibleElements.length === 0) return null;

                      return (
                        <div key={subcategory.id} className="mb-4">
                          <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                            {subcategory[lang]}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {visibleElements.map((element) => {
                              const isActive = isFilterActive(subcategory.id, element.id);

                              return (
                                <FilterButton
                                  key={element.id}
                                  label={element[lang]}
                                  isActive={isActive}
                                  isDisabled={false}
                                  onClick={() => handleFilterClick(subcategory.id, element.id)}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--color-border)] flex gap-3">
              <button onClick={clearFilters} className="flex-1 btn-secondary">
                {language === "fr" ? "Effacer tout" : "Clear all"}
              </button>
              <button
                onClick={() => setFiltersPanelOpen(false)}
                className="flex-1 btn-primary"
              >
                {language === "fr" ? "Fermer" : "Close"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
