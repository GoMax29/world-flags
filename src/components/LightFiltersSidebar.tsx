import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useFlags } from '../hooks/useFlags';
import { IconFilterButton, ColorButton, ExclusiveToggle, MultiColorButton, CommunistButton } from './IconFilterButton';
import { PatternSchemaSelector } from './PatternSchemaSelector';
import type { ActiveFilter } from '../types';

// Filter category definitions with emoji icons
const filterCategories = {
  continents: {
    label_en: 'Continents',
    label_fr: 'Continents',
    filters: [
      { id: 'Africa', icon: '🦁', label_en: 'Africa', label_fr: 'Afrique', categoryId: 'regions' },
      { id: 'North America', icon: '🗽', label_en: 'N. America', label_fr: 'Am. Nord', categoryId: 'regions' },
      { id: 'South America', icon: '🗿', label_en: 'S. America', label_fr: 'Am. Sud', categoryId: 'regions' },
      { id: 'Europe', icon: '🐮', label_en: 'Europe', label_fr: 'Europe', categoryId: 'regions' },
      { id: 'Asia', icon: '🐲', label_en: 'Asia', label_fr: 'Asie', categoryId: 'regions' },
      { id: 'Oceania', icon: '🦘', label_en: 'Oceania', label_fr: 'Océanie', categoryId: 'regions' },
    ],
  },
  regions: {
    label_en: 'Regions/Cultures',
    label_fr: 'Régions/Cultures',
    filters: [
      { id: 'central_america', icon: '🌴', label_en: 'Central America', label_fr: 'Amérique Centrale', categoryId: 'culture_regions', type: 'icon' },
      { id: 'caribbean', icon: '🏝️', label_en: 'Caribbean', label_fr: 'Caraïbes', categoryId: 'culture_regions', type: 'icon' },
      { id: 'scandinavia', icon: '❄️', label_en: 'Nordic Countries', label_fr: 'Pays Nordiques', categoryId: 'culture_regions', type: 'icon' },
      { id: 'communist', icon: '⭐', colors: ['#DC2626'], label_en: 'Communist', label_fr: 'Communiste', categoryId: 'color_schemes', type: 'communist' },
      { id: 'pan_slavic', colors: ['#2563EB', '#FFFFFF', '#DC2626'], label_en: 'Pan-Slavic', label_fr: 'Panslave', categoryId: 'color_schemes', type: 'multicolor' },
      { id: 'pan_african', colors: ['#DC2626', '#16A34A', '#FCD34D'], label_en: 'Pan-African', label_fr: 'Panafricain', categoryId: 'color_schemes', type: 'multicolor' },
      { id: 'pan_arab', colors: ['#DC2626', '#16A34A', '#FFFFFF', '#1F2937'], label_en: 'Pan-Arab', label_fr: 'Panarabe', categoryId: 'color_schemes', type: 'multicolor' },
    ],
  },
  colors: {
    label_en: 'Colors',
    label_fr: 'Couleurs',
    filters: [
      { id: 'red', hex: '#DC2626', label_en: 'Red', label_fr: 'Rouge', categoryId: 'primary_colors' },
      { id: 'blue', hex: '#2563EB', label_en: 'Blue', label_fr: 'Bleu', categoryId: 'primary_colors' },
      { id: 'yellow', hex: '#FCD34D', label_en: 'Yellow', label_fr: 'Jaune', categoryId: 'primary_colors' },
      { id: 'green', hex: '#16A34A', label_en: 'Green', label_fr: 'Vert', categoryId: 'primary_colors' },
      { id: 'white', hex: '#FFFFFF', label_en: 'White', label_fr: 'Blanc', categoryId: 'primary_colors' },
      { id: 'black', hex: '#1F2937', label_en: 'Black', label_fr: 'Noir', categoryId: 'primary_colors' },
      { id: 'orange', hex: '#F97316', label_en: 'Orange', label_fr: 'Orange', categoryId: 'secondary_colors' },
      { id: 'gold', hex: '#D97706', label_en: 'Gold', label_fr: 'Or', categoryId: 'secondary_colors' },
      { id: 'light_blue', hex: '#38BDF8', label_en: 'Light Blue', label_fr: 'Bleu Clair', categoryId: 'secondary_colors' },
      { id: 'maroon', hex: '#7F1D1D', label_en: 'Maroon', label_fr: 'Bordeaux', categoryId: 'secondary_colors' },
    ],
  },
  shapes: {
    label_en: 'Shapes',
    label_fr: 'Formes',
    filters: [
      { id: 'disk', icon: '⚪', label_en: 'Circle', label_fr: 'Cercle', categoryId: 'shapes' },
      { id: 'rectangle', icon: '⬛', label_en: 'Square', label_fr: 'Carré', categoryId: 'shapes' },
      { id: 'triangle', icon: '🔺', label_en: 'Triangle', label_fr: 'Triangle', categoryId: 'shapes' },
      { id: 'diamond', icon: '🔷', label_en: 'Diamond', label_fr: 'Losange', categoryId: 'shapes' },
    ],
  },
  celestial: {
    label_en: 'Celestial',
    label_fr: 'Astres',
    filters: [
      { id: 'sun', icon: '☀️', label_en: 'Sun', label_fr: 'Soleil', categoryId: 'sun_moon' },
      { id: 'crescent', icon: '🌙', label_en: 'Moon', label_fr: 'Lune', categoryId: 'sun_moon' },
      { id: '0_stars', icon: '⭕', label_en: 'No Stars', label_fr: '0 étoile', categoryId: 'star_count' },
      { id: '1_star', icon: '⭐', label_en: '1 Star', label_fr: '1 étoile', categoryId: 'star_count' },
      { id: 'constellation', icon: '✨', label_en: 'Constellation', label_fr: 'Constellation', categoryId: 'stars' },
      { id: 'multiple_stars', icon: '✳️', label_en: 'Stars', label_fr: 'Étoiles', categoryId: 'stars' },
    ],
  },
  animals: {
    label_en: 'Animals',
    label_fr: 'Animaux',
    filters: [
      { id: 'birds', icon: '🐦', label_en: 'Birds', label_fr: 'Oiseaux', categoryId: 'subcategory' },
      { id: 'eagle', icon: '🦅', label_en: 'Eagle', label_fr: 'Aigle', categoryId: 'birds' },
      { id: 'mammals', icon: '🐾', label_en: 'Mammals', label_fr: 'Mammifères', categoryId: 'subcategory' },
      { id: 'lion', icon: '🦁', label_en: 'Lion', label_fr: 'Lion', categoryId: 'mammals' },
      { id: 'horse', icon: '🐎', label_en: 'Horse', label_fr: 'Cheval', categoryId: 'mammals' },
      { id: 'dragon', icon: '🐉', label_en: 'Dragon', label_fr: 'Dragon', categoryId: 'mythical' },
      { id: 'serpent', icon: '🐍', label_en: 'Serpent', label_fr: 'Serpent', categoryId: 'reptiles_fish' },
    ],
  },
  nature: {
    label_en: 'Nature',
    label_fr: 'Nature',
    filters: [
      { id: 'trees', icon: '🌳', label_en: 'Trees', label_fr: 'Arbres', categoryId: 'subcategory' },
      { id: 'leaves_flowers', icon: '🍃', label_en: 'Leaves', label_fr: 'Feuilles', categoryId: 'subcategory' },
      { id: 'wheat', icon: '🌾', label_en: 'Grain', label_fr: 'Céréales', categoryId: 'leaves_flowers' },
      { id: 'mountain', icon: '⛰️', label_en: 'Mountain', label_fr: 'Montagne', categoryId: 'terrain' },
      { id: 'sea', icon: '🌊', label_en: 'Sea', label_fr: 'Mer', categoryId: 'water_elements' },
    ],
  },
  buildings: {
    label_en: 'Buildings',
    label_fr: 'Bâtiments',
    filters: [
      { id: 'buildings', icon: '🏛️', label_en: 'All', label_fr: 'Tous', categoryId: 'subcategory' },
      { id: 'castle', icon: '🏰', label_en: 'Castle', label_fr: 'Château', categoryId: 'buildings' },
      { id: 'mosque', icon: '🕌', label_en: 'Mosque', label_fr: 'Mosquée', categoryId: 'buildings' },
    ],
  },
  localSymbols: {
    label_en: 'Local Symbols',
    label_fr: 'Symboles Locaux',
    filters: [
      { id: 'local_symbols', icon: '🗿', label_en: 'All', label_fr: 'Tous', categoryId: 'main_category' },
    ],
  },
  religious: {
    label_en: 'Religious',
    label_fr: 'Religieux',
    filters: [
      { id: 'religious', icon: '⛪', label_en: 'All', label_fr: 'Tous', categoryId: 'main_category' },
      { id: 'christian_cross', icon: '✝️', label_en: 'Cross', label_fr: 'Croix', categoryId: 'crosses' },
      { id: 'crescent_star', icon: '☪️', label_en: 'Islamic', label_fr: 'Islam', categoryId: 'islamic' },
    ],
  },
  heraldry: {
    label_en: 'Heraldry',
    label_fr: 'Armoiries',
    filters: [
      { id: 'heraldry', icon: '🛡️', label_en: 'All', label_fr: 'Tous', categoryId: 'main_category' },
      { id: 'coat_of_arms', icon: '🏴', label_en: 'Coat of Arms', label_fr: 'Blason', categoryId: 'heraldic_elements' },
      { id: 'crown', icon: '👑', label_en: 'Crown', label_fr: 'Couronne', categoryId: 'heraldic_elements' },
    ],
  },
  inscriptions: {
    label_en: 'Inscriptions',
    label_fr: 'Inscriptions',
    filters: [
      { id: 'text', icon: '✒️', label_en: 'All', label_fr: 'Tous', categoryId: 'main_category' },
      { id: 'motto', icon: '📜', label_en: 'Motto', label_fr: 'Devise', categoryId: 'inscriptions' },
    ],
  },
  weapons: {
    label_en: 'Tools/Weapons',
    label_fr: 'Outils/Armes',
    filters: [
      { id: 'weapons', icon: '⚔️', label_en: 'All', label_fr: 'Tous', categoryId: 'main_category' },
      { id: 'sword', icon: '🗡️', label_en: 'Bladed', label_fr: 'Blanches', categoryId: 'bladed' },
      { id: 'rifle', icon: '🔫', label_en: 'Firearms', label_fr: 'À feu', categoryId: 'ranged' },
      { id: 'spear', icon: '🏹', label_en: 'Spear', label_fr: 'Lance', categoryId: 'ranged' },
    ],
  },
  humans: {
    label_en: 'Humans',
    label_fr: 'Humains',
    filters: [
      { id: 'human', icon: '👤', label_en: 'All', label_fr: 'Tous', categoryId: 'main_category' },
      { id: 'hands', icon: '✋', label_en: 'Hands', label_fr: 'Mains', categoryId: 'people' },
      { id: 'phrygian_cap', icon: '🎩', label_en: 'Phrygian Cap', label_fr: 'Bonnet Phrygien', categoryId: 'people' },
    ],
  },
};

export function LightFiltersSidebar() {
  const {
    language,
    activeFilters,
    addFilter,
    removeFilter,
    clearFilters,
    exclusiveColorMode,
    setExclusiveColorMode,
  } = useAppStore();
  const { getAvailableFilters } = useFlags(activeFilters, '');

  const lang = language === 'fr' ? 'label_fr' : 'label_en';

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

  // Exclusive continent handler - only one continent can be active at a time (radio button style)
  const handleExclusiveContinentClick = (categoryId: string, elementId: string) => {
    const filter: ActiveFilter = { categoryId, elementId };
    if (isFilterActive(categoryId, elementId)) {
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

  // Exclusive region/culture handler - only one can be active at a time
  const handleExclusiveRegionClick = (categoryId: string, elementId: string) => {
    const filter: ActiveFilter = { categoryId, elementId };
    if (isFilterActive(categoryId, elementId)) {
      removeFilter(filter);
    } else {
      // Remove any other region/culture filters first
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

  const activeColorFilters = activeFilters.filter(
    f => f.categoryId === 'primary_colors' || f.categoryId === 'secondary_colors'
  );

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pb-6 px-3">
      {/* Active filters badge */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-3"
          >
            <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
              {activeFilters.slice(0, 5).map((filter) => (
                <motion.button
                  key={`${filter.categoryId}-${filter.elementId}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => removeFilter(filter)}
                  className="px-2 py-0.5 text-xs bg-primary-500 text-white rounded-full flex items-center gap-1"
                >
                  {filter.elementId.replace(/_/g, ' ').slice(0, 12)}
                  <X className="w-3 h-3" />
                </motion.button>
              ))}
              {activeFilters.length > 5 && (
                <span className="px-2 py-0.5 text-xs text-primary-500">
                  +{activeFilters.length - 5}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="px-2 py-0.5 text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continents - mutually exclusive (radio style) */}
      <FilterSection title={filterCategories.continents[lang]}>
        <div className="flex flex-wrap gap-1.5">
          {filterCategories.continents.filters.map((filter) => (
            <IconFilterButton
              key={filter.id}
              icon={filter.icon}
              label={filter[lang]}
              isActive={isFilterActive(filter.categoryId, filter.id)}
              isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
              onClick={() => handleExclusiveContinentClick(filter.categoryId, filter.id)}
              size="sm"
            />
          ))}
        </div>
      </FilterSection>

      {/* Regions/Cultures (exclusive - only one at a time) */}
      <FilterSection title={filterCategories.regions[lang]}>
        <div className="flex flex-wrap gap-1.5">
          {filterCategories.regions.filters.map((filter) => {
            const filterWithType = filter as typeof filter & { type?: string; colors?: string[] };
            
            if (filterWithType.type === 'communist') {
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
            
            if (filterWithType.type === 'multicolor' && filterWithType.colors) {
              return (
                <MultiColorButton
                  key={filter.id}
                  colors={filterWithType.colors}
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
                icon={(filter as typeof filter & { icon: string }).icon}
                label={filter[lang]}
                isActive={isFilterActive(filter.categoryId, filter.id)}
                onClick={() => handleExclusiveRegionClick(filter.categoryId, filter.id)}
                size="sm"
              />
            );
          })}
        </div>
      </FilterSection>

      {/* Colors with exclusive toggle */}
      <FilterSection 
        title={filterCategories.colors[lang]}
        extra={
          <ExclusiveToggle
            isActive={exclusiveColorMode}
            onClick={() => setExclusiveColorMode(!exclusiveColorMode)}
            label={language === 'fr' ? 'Mode exclusif' : 'Exclusive mode'}
          />
        }
      >
        <div className="flex flex-wrap gap-1.5">
          {filterCategories.colors.filters.map((filter) => (
            <ColorButton
              key={filter.id}
              color={filter.id}
              colorHex={filter.hex}
              label={filter[lang]}
              isActive={isFilterActive(filter.categoryId, filter.id)}
              isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
              onClick={() => handleFilterClick(filter.categoryId, filter.id)}
              size="sm"
            />
          ))}
        </div>
        {exclusiveColorMode && activeColorFilters.length > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            🔒 {language === 'fr' ? 'Uniquement ces couleurs' : 'Only these colors'}
          </p>
        )}
      </FilterSection>

      {/* Pattern Schemas */}
      <FilterSection title={language === 'fr' ? 'Disposition' : 'Layout'}>
        <PatternSchemaSelector compact />
      </FilterSection>

      {/* Shapes */}
      <FilterSection title={filterCategories.shapes[lang]}>
        <div className="flex flex-wrap gap-1.5">
          {filterCategories.shapes.filters.map((filter) => (
            <IconFilterButton
              key={filter.id}
              icon={filter.icon}
              label={filter[lang]}
              isActive={isFilterActive(filter.categoryId, filter.id)}
              isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
              onClick={() => handleFilterClick(filter.categoryId, filter.id)}
              size="sm"
            />
          ))}
        </div>
      </FilterSection>

      {/* Celestial */}
      <FilterSection title={filterCategories.celestial[lang]}>
        <div className="flex flex-wrap gap-1.5">
          {filterCategories.celestial.filters.map((filter) => (
            <IconFilterButton
              key={filter.id}
              icon={filter.icon}
              label={filter[lang]}
              isActive={isFilterActive(filter.categoryId, filter.id)}
              isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
              onClick={() => handleFilterClick(filter.categoryId, filter.id)}
              size="sm"
            />
          ))}
        </div>
      </FilterSection>

      {/* Animals */}
      <FilterSection title={filterCategories.animals[lang]}>
        <div className="flex flex-wrap gap-1.5">
          {filterCategories.animals.filters.map((filter) => (
            <IconFilterButton
              key={filter.id}
              icon={filter.icon}
              label={filter[lang]}
              isActive={isFilterActive(filter.categoryId, filter.id)}
              isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
              onClick={() => handleFilterClick(filter.categoryId, filter.id)}
              size="sm"
            />
          ))}
        </div>
      </FilterSection>

      {/* Nature */}
      <FilterSection title={filterCategories.nature[lang]}>
        <div className="flex flex-wrap gap-1.5">
          {filterCategories.nature.filters.map((filter) => (
            <IconFilterButton
              key={filter.id}
              icon={filter.icon}
              label={filter[lang]}
              isActive={isFilterActive(filter.categoryId, filter.id)}
              isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
              onClick={() => handleFilterClick(filter.categoryId, filter.id)}
              size="sm"
            />
          ))}
        </div>
      </FilterSection>

      {/* Buildings */}
      <FilterSection title={filterCategories.buildings[lang]}>
        <div className="flex flex-wrap gap-1.5">
          {filterCategories.buildings.filters.map((filter) => (
            <IconFilterButton
              key={filter.id}
              icon={filter.icon}
              label={filter[lang]}
              isActive={isFilterActive(filter.categoryId, filter.id)}
              isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
              onClick={() => handleFilterClick(filter.categoryId, filter.id)}
              size="sm"
            />
          ))}
        </div>
      </FilterSection>

      {/* Religious */}
      <FilterSection title={filterCategories.religious[lang]}>
        <div className="flex flex-wrap gap-1.5">
          {filterCategories.religious.filters.map((filter) => (
            <IconFilterButton
              key={filter.id}
              icon={filter.icon}
              label={filter[lang]}
              isActive={isFilterActive(filter.categoryId, filter.id)}
              isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
              onClick={() => handleFilterClick(filter.categoryId, filter.id)}
              size="sm"
            />
          ))}
        </div>
      </FilterSection>

      {/* Heraldry */}
      <FilterSection title={filterCategories.heraldry[lang]}>
        <div className="flex flex-wrap gap-1.5">
          {filterCategories.heraldry.filters.map((filter) => (
            <IconFilterButton
              key={filter.id}
              icon={filter.icon}
              label={filter[lang]}
              isActive={isFilterActive(filter.categoryId, filter.id)}
              isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
              onClick={() => handleFilterClick(filter.categoryId, filter.id)}
              size="sm"
            />
          ))}
        </div>
      </FilterSection>

      {/* Inscriptions */}
      <FilterSection title={filterCategories.inscriptions[lang]}>
        <div className="flex flex-wrap gap-1.5">
          {filterCategories.inscriptions.filters.map((filter) => (
            <IconFilterButton
              key={filter.id}
              icon={filter.icon}
              label={filter[lang]}
              isActive={isFilterActive(filter.categoryId, filter.id)}
              isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
              onClick={() => handleFilterClick(filter.categoryId, filter.id)}
              size="sm"
            />
          ))}
        </div>
      </FilterSection>

      {/* Weapons/Tools */}
      <FilterSection title={filterCategories.weapons[lang]}>
        <div className="flex flex-wrap gap-1.5">
          {filterCategories.weapons.filters.map((filter) => (
            <IconFilterButton
              key={filter.id}
              icon={filter.icon}
              label={filter[lang]}
              isActive={isFilterActive(filter.categoryId, filter.id)}
              isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
              onClick={() => handleFilterClick(filter.categoryId, filter.id)}
              size="sm"
            />
          ))}
        </div>
      </FilterSection>

      {/* Humans */}
      <FilterSection title={filterCategories.humans[lang]}>
        <div className="flex flex-wrap gap-1.5">
          {filterCategories.humans.filters.map((filter) => (
            <IconFilterButton
              key={filter.id}
              icon={filter.icon}
              label={filter[lang]}
              isActive={isFilterActive(filter.categoryId, filter.id)}
              isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
              onClick={() => handleFilterClick(filter.categoryId, filter.id)}
              size="sm"
            />
          ))}
        </div>
      </FilterSection>

      {/* Local Symbols */}
      <FilterSection title={filterCategories.localSymbols[lang]}>
        <div className="flex flex-wrap gap-1.5">
          {filterCategories.localSymbols.filters.map((filter) => (
            <IconFilterButton
              key={filter.id}
              icon={filter.icon}
              label={filter[lang]}
              isActive={isFilterActive(filter.categoryId, filter.id)}
              isDisabled={!isFilterActive(filter.categoryId, filter.id) && !getAvailableFilters(filter.categoryId, filter.id)}
              onClick={() => handleFilterClick(filter.categoryId, filter.id)}
              size="sm"
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

// Filter section component
interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
}

function FilterSection({ title, children, extra }: FilterSectionProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          {title}
        </h3>
        {extra}
      </div>
      {children}
    </div>
  );
}


