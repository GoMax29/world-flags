import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useFlags } from '../hooks/useFlags';
import { IconFilterButton, ColorButton, MultiColorButton, CommunistButton } from './IconFilterButton';
import { ColorModeSelector } from './ColorModeSelector';
import { PatternSchemaSelector } from './PatternSchemaSelector';
import type { ActiveFilter } from '../types';

// Compact filter categories
const filterCategories = {
  continents: {
    title_en: 'Continents',
    title_fr: 'Continents',
    clickable: false,
    filters: [
      { id: 'Africa', label_en: 'AF', label_fr: 'AF', categoryId: 'regions' },
      { id: 'Europe', label_en: 'EU', label_fr: 'EU', categoryId: 'regions' },
      { id: 'North America', label_en: 'N.A', label_fr: 'A.N', categoryId: 'regions' },
      { id: 'South America', label_en: 'S.A', label_fr: 'A.S', categoryId: 'regions' },
      { id: 'Asia', label_en: 'AS', label_fr: 'AS', categoryId: 'regions' },
      { id: 'Oceania', label_en: 'OC', label_fr: 'OC', categoryId: 'regions' },
    ],
  },
  regions: {
    title_en: 'Regions / Cultures',
    title_fr: 'Régions / Cultures',
    clickable: false,
    filters: [
      { id: 'central_america', label_en: 'C.A', label_fr: 'A.C', categoryId: 'culture_regions', type: 'text' },
      { id: 'communist', colors: ['#DC2626'], categoryId: 'color_schemes', type: 'communist' },
      { id: 'pan_slavic', colors: ['#2563EB', '#FFFFFF', '#DC2626'], categoryId: 'color_schemes', type: 'multicolor' },
      { id: 'pan_african', colors: ['#DC2626', '#16A34A', '#FCD34D'], categoryId: 'color_schemes', type: 'multicolor' },
      { id: 'pan_arab', colors: ['#DC2626', '#16A34A', '#FFFFFF', '#1F2937'], categoryId: 'color_schemes', type: 'multicolor' },
    ],
  },
  colors: {
    title_en: 'Colors',
    title_fr: 'Couleurs',
    clickable: false,
    filters: [
      { id: 'red', hex: '#DC2626', categoryId: 'primary_colors' },
      { id: 'blue', hex: '#2563EB', categoryId: 'primary_colors' },
      { id: 'yellow', hex: '#FCD34D', categoryId: 'primary_colors' },
      { id: 'green', hex: '#16A34A', categoryId: 'primary_colors' },
      { id: 'white', hex: '#FFFFFF', categoryId: 'primary_colors' },
      { id: 'black', hex: '#1F2937', categoryId: 'primary_colors' },
      { id: 'orange', hex: '#F97316', categoryId: 'secondary_colors' },
      { id: 'gold', hex: '#D97706', categoryId: 'secondary_colors' },
    ],
  },
  shapes: {
    title_en: 'Shapes',
    title_fr: 'Formes',
    clickable: true,
    mainCategory: 'geometric',
    filters: [
      { id: 'disk', icon: '⭕', categoryId: 'shapes' },
      { id: 'rectangle', icon: '⬛', categoryId: 'shapes' },
      { id: 'triangle', icon: '🔺', categoryId: 'shapes' },
      { id: 'diamond', icon: '🔷', categoryId: 'shapes' },
    ],
  },
  celestial: {
    title_en: 'Celestial',
    title_fr: 'Astres',
    clickable: true,
    mainCategory: 'celestial',
    filters: [
      { id: 'sun', icon: '☀️', categoryId: 'sun_moon' },
      { id: 'crescent', icon: '🌙', categoryId: 'sun_moon' },
      { id: 'multiple_stars', icon: '✨', categoryId: 'stars' },
    ],
  },
  animals: {
    title_en: 'Animals',
    title_fr: 'Animaux',
    clickable: true,
    mainCategory: 'animals',
    filters: [
      { id: 'eagle', icon: '🦅', categoryId: 'birds' },
      { id: 'birds', icon: '🐦', categoryId: 'subcategory' },
      { id: 'lion', icon: '🦁', categoryId: 'mammals' },
      { id: 'horse', icon: '🐎', categoryId: 'mammals' },
      { id: 'dragon', icon: '🐉', categoryId: 'mythical' },
    ],
  },
  nature: {
    title_en: 'Nature',
    title_fr: 'Nature',
    clickable: true,
    mainCategory: 'flora',
    filters: [
      { id: 'trees', icon: '🌳', categoryId: 'subcategory' },
      { id: 'leaves_flowers', icon: '🍃', categoryId: 'subcategory' },
      { id: 'mountain', icon: '⛰️', categoryId: 'terrain' },
      { id: 'sea', icon: '💧', categoryId: 'water_elements' },
      { id: 'rainbow', icon: '🌈', categoryId: 'other_symbols' },
    ],
  },
  buildings: {
    title_en: 'Buildings',
    title_fr: 'Bâtiments',
    clickable: true,
    mainCategory: 'architecture',
    filters: [
      { id: 'buildings', icon: '🏛️', categoryId: 'subcategory' },
      { id: 'castle', icon: '🏰', categoryId: 'buildings' },
      { id: 'mosque', icon: '🕌', categoryId: 'buildings' },
    ],
  },
  religious: {
    title_en: 'Religious',
    title_fr: 'Religieux',
    clickable: true,
    mainCategory: 'religious',
    filters: [
      { id: 'christian_cross', icon: '✝️', categoryId: 'crosses' },
      { id: 'crescent_star', icon: '☪️', categoryId: 'islamic' },
    ],
  },
  heraldry: {
    title_en: 'Heraldry',
    title_fr: 'Armoiries',
    clickable: true,
    mainCategory: 'heraldry',
    filters: [
      { id: 'coat_of_arms', icon: '🛡️', categoryId: 'heraldic_elements' },
      { id: 'crown', icon: '👑', categoryId: 'heraldic_elements' },
    ],
  },
  inscriptions: {
    title_en: 'Inscriptions',
    title_fr: 'Inscriptions',
    clickable: true,
    mainCategory: 'text',
    filters: [
      { id: 'motto', icon: '📜', categoryId: 'inscriptions' },
      { id: 'text', icon: '✒️', categoryId: 'main_category' },
    ],
  },
  weapons: {
    title_en: 'Weapons',
    title_fr: 'Armes',
    clickable: true,
    mainCategory: 'weapons',
    filters: [
      { id: 'sword', icon: '🗡️', categoryId: 'bladed' },
      { id: 'rifle', icon: '🔫', categoryId: 'ranged' },
      { id: 'spear', icon: '🏹', categoryId: 'ranged' },
      { id: 'cannon', icon: '💣', categoryId: 'ranged' },
    ],
  },
  humans: {
    title_en: 'Humans',
    title_fr: 'Humains',
    clickable: true,
    mainCategory: 'human',
    filters: [
      { id: 'human_figure', icon: '👤', categoryId: 'people' },
      { id: 'hands', icon: '✋', categoryId: 'people' },
      { id: 'phrygian_cap', icon: '🎅', categoryId: 'people' },
    ],
  },
  localSymbols: {
    title_en: 'Local Symbols',
    title_fr: 'Symboles Locaux',
    clickable: true,
    mainCategory: 'local_symbols',
    filters: [
      { id: 'local_symbols', icon: '🗿', categoryId: 'main_category' },
    ],
  },
};

// Filter name translations for notification
const filterNames: Record<string, { en: string; fr: string }> = {
  'Africa': { en: 'Africa', fr: 'Afrique' },
  'Europe': { en: 'Europe', fr: 'Europe' },
  'North America': { en: 'North America', fr: 'Amérique du Nord' },
  'South America': { en: 'South America', fr: 'Amérique du Sud' },
  'Asia': { en: 'Asia', fr: 'Asie' },
  'Oceania': { en: 'Oceania', fr: 'Océanie' },
  'central_america': { en: 'Central America', fr: 'Amérique centrale' },
  'communist': { en: 'Communist', fr: 'Communiste' },
  'pan_slavic': { en: 'Pan-Slavic', fr: 'Panslave' },
  'pan_african': { en: 'Pan-African', fr: 'Panafricain' },
  'pan_arab': { en: 'Pan-Arab', fr: 'Panarabe' },
  'red': { en: 'Red', fr: 'Rouge' },
  'blue': { en: 'Blue', fr: 'Bleu' },
  'yellow': { en: 'Yellow', fr: 'Jaune' },
  'green': { en: 'Green', fr: 'Vert' },
  'white': { en: 'White', fr: 'Blanc' },
  'black': { en: 'Black', fr: 'Noir' },
  'orange': { en: 'Orange', fr: 'Orange' },
  'gold': { en: 'Gold', fr: 'Or' },
  'disk': { en: 'Circle', fr: 'Cercle' },
  'rectangle': { en: 'Rectangle', fr: 'Rectangle' },
  'triangle': { en: 'Triangle', fr: 'Triangle' },
  'diamond': { en: 'Diamond', fr: 'Losange' },
  'sun': { en: 'Sun', fr: 'Soleil' },
  'crescent': { en: 'Crescent', fr: 'Croissant' },
  'multiple_stars': { en: 'Stars', fr: 'Étoiles' },
  'eagle': { en: 'Eagle', fr: 'Aigle' },
  'birds': { en: 'Birds', fr: 'Oiseaux' },
  'lion': { en: 'Lion', fr: 'Lion' },
  'horse': { en: 'Horse', fr: 'Cheval' },
  'dragon': { en: 'Dragon', fr: 'Dragon' },
  'trees': { en: 'Trees', fr: 'Arbres' },
  'leaves_flowers': { en: 'Leaves & Flowers', fr: 'Feuilles & Fleurs' },
  'mountain': { en: 'Mountain', fr: 'Montagne' },
  'sea': { en: 'Sea', fr: 'Mer' },
  'rainbow': { en: 'Rainbow', fr: 'Arc-en-ciel' },
  'buildings': { en: 'Buildings', fr: 'Bâtiments' },
  'castle': { en: 'Castle', fr: 'Château' },
  'mosque': { en: 'Mosque', fr: 'Mosquée' },
  'christian_cross': { en: 'Christian Cross', fr: 'Croix chrétienne' },
  'crescent_star': { en: 'Crescent & Star', fr: 'Croissant & Étoile' },
  'coat_of_arms': { en: 'Coat of Arms', fr: 'Armoiries' },
  'crown': { en: 'Crown', fr: 'Couronne' },
  'motto': { en: 'Motto', fr: 'Devise' },
  'text': { en: 'Text', fr: 'Texte' },
  'sword': { en: 'Sword', fr: 'Épée' },
  'rifle': { en: 'Rifle', fr: 'Fusil' },
  'spear': { en: 'Spear', fr: 'Lance' },
  'cannon': { en: 'Cannon', fr: 'Canon' },
  'human_figure': { en: 'Human Figure', fr: 'Figure humaine' },
  'hands': { en: 'Hands', fr: 'Mains' },
  'phrygian_cap': { en: 'Phrygian Cap', fr: 'Bonnet phrygien' },
  'local_symbols': { en: 'Local Symbols', fr: 'Symboles locaux' },
};

export function LightFiltersSidebar() {
  const {
    language,
    activeFilters,
    addFilter,
    removeFilter,
    clearFilters,
    setFilterNotification,
  } = useAppStore();
  const { getAvailableFilters } = useFlags(activeFilters, '');

  const lang = language === 'fr' ? 'title_fr' : 'title_en';

  const isFilterActive = (categoryId: string, elementId: string) => {
    return activeFilters.some(
      (f) => f.categoryId === categoryId && f.elementId === elementId
    );
  };

  // Show filter notification - universal for all filters
  const showNotification = (filterId: string) => {
    const filterName = filterNames[filterId];
    if (filterName) {
      const name = language === 'fr' ? filterName.fr : filterName.en;
      setFilterNotification(name);
      setTimeout(() => setFilterNotification(null), 1000);
    } else {
      // Fallback: show the ID formatted nicely
      const name = filterId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      setFilterNotification(name);
      setTimeout(() => setFilterNotification(null), 1000);
    }
  };

  const handleFilterClick = (categoryId: string, elementId: string) => {
    const filter: ActiveFilter = { categoryId, elementId };
    if (isFilterActive(categoryId, elementId)) {
      removeFilter(filter);
    } else {
      addFilter(filter);
      showNotification(elementId);
    }
  };

  // Handle clicking on category title to filter all flags in that category
  const handleCategoryClick = (mainCategory: string) => {
    const filter: ActiveFilter = { categoryId: 'main_category', elementId: mainCategory };
    if (isFilterActive('main_category', mainCategory)) {
      removeFilter(filter);
    } else {
      addFilter(filter);
      showNotification(mainCategory);
    }
  };

  // Exclusive continent handler - also clears region/culture filters
  const handleExclusiveContinentClick = (categoryId: string, elementId: string) => {
    const filter: ActiveFilter = { categoryId, elementId };
    if (isFilterActive(categoryId, elementId)) {
      removeFilter(filter);
    } else {
      // Clear all continents
      const continentIds = ['Africa', 'North America', 'South America', 'Europe', 'Asia', 'Oceania'];
      continentIds.forEach(id => {
        if (isFilterActive('regions', id)) {
          removeFilter({ categoryId: 'regions', elementId: id });
        }
      });
      // Clear all regions/cultures too
      const regionIds = ['central_america'];
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
      showNotification(elementId);
    }
  };

  // Exclusive region/culture handler - also clears continent filters
  const handleExclusiveRegionClick = (categoryId: string, elementId: string) => {
    const filter: ActiveFilter = { categoryId, elementId };
    if (isFilterActive(categoryId, elementId)) {
      removeFilter(filter);
    } else {
      // Clear all continents
      const continentIds = ['Africa', 'North America', 'South America', 'Europe', 'Asia', 'Oceania'];
      continentIds.forEach(id => {
        if (isFilterActive('regions', id)) {
          removeFilter({ categoryId: 'regions', elementId: id });
        }
      });
      // Clear all regions/cultures
      const regionIds = ['central_america'];
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
      showNotification(elementId);
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-4 px-2 flex flex-col">
      {/* Active filters badge */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-2"
          >
            <div className="flex flex-wrap gap-1 p-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20">
              {activeFilters.slice(0, 4).map((filter) => (
                <motion.button
                  key={`${filter.categoryId}-${filter.elementId}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => removeFilter(filter)}
                  className="px-1.5 py-0.5 text-[10px] bg-primary-500 text-white rounded-full flex items-center gap-0.5"
                >
                  {filter.elementId.replace(/_/g, ' ').slice(0, 10)}
                  <X className="w-2.5 h-2.5" />
                </motion.button>
              ))}
              {activeFilters.length > 4 && (
                <span className="px-1.5 py-0.5 text-[10px] text-primary-500">
                  +{activeFilters.length - 4}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="px-1.5 py-0.5 text-[10px] text-red-500 hover:text-red-600"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="space-y-1.5">
              {/* Continents - Text labels only, no emojis */}
            <FilterRow 
              title={filterCategories.continents[lang]}
              clickable={false}
            >
              {filterCategories.continents.filters.map((filter) => (
                  <TextFilterButton
                  key={filter.id}
                  label={filter[language === 'fr' ? 'label_fr' : 'label_en']}
                  isActive={isFilterActive(filter.categoryId, filter.id)}
                  isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
                  onClick={() => handleExclusiveContinentClick(filter.categoryId, filter.id)}
                  size="sm"
                />
              ))}
            </FilterRow>

              {/* Regions/Cultures - removed Nordic and Caribbean */}
            <FilterRow 
              title={filterCategories.regions[lang]}
              clickable={false}
            >
              {filterCategories.regions.filters.map((filter) => {
                  const filterWithType = filter as typeof filter & { type?: string; colors?: string[]; label_en?: string; label_fr?: string };
                  
                  if (filterWithType.type === 'text') {
                    return (
                      <TextFilterButton
                        key={filter.id}
                        label={filterWithType[language === 'fr' ? 'label_fr' : 'label_en'] || ''}
                        isActive={isFilterActive(filter.categoryId, filter.id)}
                        onClick={() => handleExclusiveRegionClick(filter.categoryId, filter.id)}
                        size="sm"
                      />
                    );
                  }
                
                if (filterWithType.type === 'communist') {
                  return (
                    <CommunistButton
                      key={filter.id}
                      label=""
                      isActive={isFilterActive(filter.categoryId, filter.id)}
                      onClick={() => handleExclusiveRegionClick(filter.categoryId, filter.id)}
                      size="sm"
                    />
                  );
                }
                
                if (filterWithType.type === 'multicolor' && filterWithType.colors) {
                  return (
                    <MultiColorButton
                      key={filter.id}
                      colors={filterWithType.colors}
                      label=""
                      isActive={isFilterActive(filter.categoryId, filter.id)}
                      onClick={() => handleExclusiveRegionClick(filter.categoryId, filter.id)}
                      size="sm"
                    />
                  );
                }
                
                  return null;
              })}
            </FilterRow>

              {/* Colors with 3-button mode selector */}
            <FilterRow 
              title={filterCategories.colors[lang]}
              clickable={false}
            >
              {filterCategories.colors.filters.map((filter) => (
                <ColorButton
                  key={filter.id}
                  color={filter.id}
                  colorHex={filter.hex!}
                  label=""
                  isActive={isFilterActive(filter.categoryId, filter.id)}
                  isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
                  onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                  size="sm"
                />
              ))}
                <ColorModeSelector />
            </FilterRow>

            {/* Layout/Disposition */}
            <FilterRow 
              title={language === 'fr' ? 'Disposition' : 'Layout'}
              clickable={false}
            >
              <div className="flex-1">
                <PatternSchemaSelector compact />
              </div>
            </FilterRow>

            {/* Shapes | Celestial */}
            <FilterRow 
              title={`${filterCategories.shapes[lang]} | ${filterCategories.celestial[lang]}`}
              clickable={false}
            >
              {filterCategories.shapes.filters.map((filter) => (
                <IconFilterButton
                  key={filter.id}
                  icon={filter.icon}
                  label=""
                  isActive={isFilterActive(filter.categoryId, filter.id)}
                  onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                  size="sm"
                />
              ))}
              <Separator />
              {filterCategories.celestial.filters.map((filter) => (
                <IconFilterButton
                  key={filter.id}
                  icon={filter.icon}
                  label=""
                  isActive={isFilterActive(filter.categoryId, filter.id)}
                  onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                  size="sm"
                />
              ))}
            </FilterRow>

            {/* Animals | Nature */}
            <FilterRow 
              title={`${filterCategories.animals[lang]} | ${filterCategories.nature[lang]}`}
              clickable={true}
              mainCategory="animals"
              onCategoryClick={handleCategoryClick}
              isActive={isFilterActive('main_category', 'animals')}
            >
              {filterCategories.animals.filters.map((filter) => (
                <IconFilterButton
                  key={filter.id}
                  icon={filter.icon}
                  label=""
                  isActive={isFilterActive(filter.categoryId, filter.id)}
                  onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                  size="sm"
                />
              ))}
              <Separator />
              {filterCategories.nature.filters.map((filter) => (
                <IconFilterButton
                  key={filter.id}
                  icon={filter.icon}
                  label=""
                  isActive={isFilterActive(filter.categoryId, filter.id)}
                  onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                  size="sm"
                />
              ))}
            </FilterRow>

            {/* Buildings | Religious | Heraldry */}
            <FilterRow 
              title={`${filterCategories.buildings[lang]} | ${filterCategories.religious[lang]} | ${filterCategories.heraldry[lang]}`}
              clickable={false}
            >
              {filterCategories.buildings.filters.map((filter) => (
                <IconFilterButton
                  key={filter.id}
                  icon={filter.icon}
                  label=""
                  isActive={isFilterActive(filter.categoryId, filter.id)}
                  onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                  size="sm"
                />
              ))}
              <Separator />
              {filterCategories.religious.filters.map((filter) => (
                <IconFilterButton
                  key={filter.id}
                  icon={filter.icon}
                  label=""
                  isActive={isFilterActive(filter.categoryId, filter.id)}
                  onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                  size="sm"
                />
              ))}
              <Separator />
              {filterCategories.heraldry.filters.map((filter) => (
                <IconFilterButton
                  key={filter.id}
                  icon={filter.icon}
                  label=""
                  isActive={isFilterActive(filter.categoryId, filter.id)}
                  onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                  size="sm"
                />
              ))}
            </FilterRow>

            {/* Weapons | Humans | Inscriptions | Local */}
            <FilterRow 
              title={`${filterCategories.weapons[lang]} | ${filterCategories.humans[lang]} | ${filterCategories.inscriptions[lang]} | ${filterCategories.localSymbols[lang]}`}
              clickable={false}
            >
              {filterCategories.weapons.filters.map((filter) => (
                <IconFilterButton
                  key={filter.id}
                  icon={filter.icon}
                  label=""
                  isActive={isFilterActive(filter.categoryId, filter.id)}
                  onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                  size="sm"
                />
              ))}
              <Separator />
              {filterCategories.humans.filters.map((filter) => (
                <IconFilterButton
                  key={filter.id}
                  icon={filter.icon}
                  label=""
                  isActive={isFilterActive(filter.categoryId, filter.id)}
                  onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                  size="sm"
                />
              ))}
              <Separator />
              {filterCategories.inscriptions.filters.map((filter) => (
                <IconFilterButton
                  key={filter.id}
                  icon={filter.icon}
                  label=""
                  isActive={isFilterActive(filter.categoryId, filter.id)}
                  onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                  size="sm"
                />
              ))}
              <Separator />
              {filterCategories.localSymbols.filters.map((filter) => (
                <IconFilterButton
                  key={filter.id}
                  icon={filter.icon}
                  label=""
                  isActive={isFilterActive(filter.categoryId, filter.id)}
                  onClick={() => handleFilterClick(filter.categoryId, filter.id)}
                  size="sm"
                />
              ))}
            </FilterRow>
      </div>
    </div>
  );
}

// Text-based filter button (for continents and regions)
interface TextFilterButtonProps {
  label: string;
  isActive: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}

function TextFilterButton({
  label,
  isActive,
  isDisabled = false,
  onClick,
  size = 'md',
}: TextFilterButtonProps) {
  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.05 } : undefined}
      whileTap={!isDisabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        flex items-center justify-center rounded-lg transition-all duration-200
        border focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
        font-bold
        ${size === 'sm' ? 'px-2 h-8 text-[10px]' : 'px-3 h-10 text-xs'}
        ${isActive 
          ? 'bg-primary-500 border-primary-500 text-white shadow-md' 
          : !isDisabled 
            ? 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-[var(--color-text)]'
            : 'bg-gray-100 dark:bg-gray-800 border-transparent cursor-not-allowed opacity-40 text-[var(--color-text-secondary)]'
        }
      `}
      aria-pressed={isActive}
      aria-label={label}
      title={label}
    >
      {label}
    </motion.button>
  );
}

// Compact filter row with thin title
interface FilterRowProps {
  title: string;
  children: React.ReactNode;
  clickable?: boolean;
  mainCategory?: string;
  onCategoryClick?: (category: string) => void;
  isActive?: boolean;
}

function FilterRow({ title, children, clickable = false, mainCategory, onCategoryClick, isActive }: FilterRowProps) {
  return (
    <div className="pb-1 border-b border-[var(--color-border)]/30">
      {clickable && mainCategory && onCategoryClick ? (
        <button 
          onClick={() => onCategoryClick(mainCategory)}
          className={`text-[9px] font-medium uppercase tracking-wide mb-0.5 block hover:text-primary-500 transition-colors ${isActive ? 'text-primary-500' : 'text-[var(--color-text-secondary)]'}`}
        >
          {title}
        </button>
      ) : (
        <div className="text-[9px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wide mb-0.5">
          {title}
        </div>
      )}
      <div className="flex flex-wrap gap-1 items-center">
        {children}
      </div>
    </div>
  );
}

// Visual separator between filter groups
function Separator() {
  return <div className="w-px h-5 bg-[var(--color-border)] mx-0.5 flex-shrink-0" />;
}
