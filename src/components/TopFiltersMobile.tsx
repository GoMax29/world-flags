import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Settings2, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useFlags } from "../hooks/useFlags";
import { FilterButton } from "./FilterButton";
import { IconFilterButton, ColorButton, ColorModeToggle, MultiColorButton, CommunistButton } from "./IconFilterButton";
import { PatternSchemaSelector } from "./PatternSchemaSelector";
import taxonomy from "../data/taxonomy.json";
import type { Taxonomy, ActiveFilter } from "../types";

const taxonomyData = taxonomy as Taxonomy;

// Compact mobile filter definitions
const mobileFilters = {
  continents: {
    title_en: 'Continents',
    title_fr: 'Continents',
    clickable: false,
    filters: [
      { id: 'Africa', icon: '🦁', categoryId: 'regions' },
      { id: 'Europe', icon: '🐮', categoryId: 'regions' },
      { id: 'North America', icon: '🗽', categoryId: 'regions' },
      { id: 'South America', icon: '🗿', categoryId: 'regions' },
      { id: 'Asia', icon: '🐲', categoryId: 'regions' },
      { id: 'Oceania', icon: '🦘', categoryId: 'regions' },
    ],
  },
  regions: {
    title_en: 'Regions / Cultures',
    title_fr: 'Régions / Cultures',
    clickable: false,
    filters: [
      { id: 'central_america', icon: '🌴', categoryId: 'culture_regions', type: 'icon' },
      { id: 'caribbean', icon: '🏝️', categoryId: 'culture_regions', type: 'icon' },
      { id: 'scandinavia', icon: '❄️', categoryId: 'culture_regions', type: 'icon' },
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
    title_en: 'Local',
    title_fr: 'Locaux',
    clickable: true,
    mainCategory: 'local_symbols',
    filters: [
      { id: 'local_symbols', icon: '🗿', categoryId: 'main_category' },
    ],
  },
  disposition: {
    title_en: 'Layout',
    title_fr: 'Disposition',
    clickable: false,
    filters: [],
  },
};

export function TopFiltersMobile() {
  const {
    language,
    activeFilters,
    addFilter,
    removeFilter,
    clearFilters,
    menuMode,
    setMenuMode,
    colorFilterMode,
    setColorFilterMode,
  } = useAppStore();

  // Single toggle for the entire filter menu
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);

  const lang = language === 'fr' ? 'title_fr' : 'title_en';

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

  // Handle clicking on category title to filter all flags in that category
  const handleCategoryClick = (mainCategory: string) => {
    const filter: ActiveFilter = { categoryId: 'main_category', elementId: mainCategory };
    if (isFilterActive('main_category', mainCategory)) {
      removeFilter(filter);
    } else {
      addFilter(filter);
    }
  };

  // Exclusive continent handler
  const handleExclusiveContinentClick = (elementId: string) => {
    const filter: ActiveFilter = { categoryId: 'regions', elementId };
    if (isFilterActive('regions', elementId)) {
      removeFilter(filter);
    } else {
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
  const renderRegionButton = (filter: typeof mobileFilters.regions.filters[0]) => {
    if (filter.type === 'communist') {
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
    
    if (filter.type === 'multicolor' && filter.colors) {
      return (
        <MultiColorButton
          key={filter.id}
          colors={filter.colors}
          label=""
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
        label=""
        isActive={isFilterActive(filter.categoryId, filter.id)}
        onClick={() => handleExclusiveRegionClick(filter.categoryId, filter.id)}
        size="sm"
      />
    );
  };

  return (
    <div className="lg:hidden sticky top-16 z-20 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      {/* Header with Light/Advanced toggle + Expand/Collapse */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-[var(--color-border)]">
        {/* Light / Advanced tabs */}
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
            onClick={() => setMenuMode('advanced')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all
              ${menuMode === 'advanced' 
                ? 'bg-primary-500 text-white shadow-sm' 
                : 'text-[var(--color-text-secondary)]'
              }`}
          >
            <Settings2 className="w-3 h-3" />
            {language === 'fr' ? 'Avancé' : 'Advanced'}
          </button>
        </div>

        {/* Right side: filter count + clear + expand/collapse toggle */}
        <div className="flex items-center gap-1">
          {activeFilters.length > 0 && (
            <>
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary-500 text-white rounded-full">
                {activeFilters.length}
              </span>
              <button
                onClick={clearFilters}
                className="p-1 rounded-lg hover:bg-[var(--color-surface)] text-red-500"
                aria-label="Clear filters"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </>
          )}
          <button
            onClick={() => setIsMenuExpanded(!isMenuExpanded)}
            className="p-1 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-border)]"
            aria-label={isMenuExpanded ? "Collapse filters" : "Expand filters"}
          >
            {isMenuExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible filter content - Light Mode */}
      <AnimatePresence>
        {isMenuExpanded && menuMode === 'light' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-2 py-1.5 space-y-1">
              {/* Continents */}
              <FilterRow 
                title={mobileFilters.continents[lang]} 
                clickable={false}
              >
                {mobileFilters.continents.filters.map((filter) => (
                  <IconFilterButton
                    key={filter.id}
                    icon={filter.icon}
                    label=""
                    isActive={isFilterActive("regions", filter.id)}
                    onClick={() => handleExclusiveContinentClick(filter.id)}
                    size="sm"
                  />
                ))}
              </FilterRow>

              {/* Regions/Cultures */}
              <FilterRow 
                title={mobileFilters.regions[lang]}
                clickable={false}
              >
                {mobileFilters.regions.filters.map((filter) => renderRegionButton(filter))}
              </FilterRow>

              {/* Colors */}
              <FilterRow 
                title={mobileFilters.colors[lang]}
                clickable={false}
              >
                {mobileFilters.colors.filters.map((color) => (
                  <ColorButton
                    key={color.id}
                    color={color.id}
                    colorHex={color.hex!}
                    label=""
                    isActive={isFilterActive("primary_colors", color.id) || isFilterActive("secondary_colors", color.id)}
                    onClick={() => handleFilterClick(color.id === 'orange' || color.id === 'gold' ? "secondary_colors" : "primary_colors", color.id)}
                    size="sm"
                  />
                ))}
                <ColorModeToggle
                  mode={colorFilterMode}
                  onModeChange={setColorFilterMode}
                  language={language}
                />
              </FilterRow>

              {/* Shapes | Celestial */}
              <FilterRow 
                title={`${mobileFilters.shapes[lang]} | ${mobileFilters.celestial[lang]}`}
                clickable={false}
              >
                {mobileFilters.shapes.filters.map((filter) => (
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
                {mobileFilters.celestial.filters.map((filter) => (
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
                title={`${mobileFilters.animals[lang]} | ${mobileFilters.nature[lang]}`}
                mainCategory="animals"
                mainCategory2="flora"
                clickable={true}
                onCategoryClick={handleCategoryClick}
                isActive={isFilterActive('main_category', 'animals') || isFilterActive('main_category', 'flora')}
              >
                {mobileFilters.animals.filters.map((filter) => (
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
                {mobileFilters.nature.filters.map((filter) => (
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
                title={`${mobileFilters.buildings[lang]} | ${mobileFilters.religious[lang]} | ${mobileFilters.heraldry[lang]}`}
                clickable={false}
              >
                {mobileFilters.buildings.filters.map((filter) => (
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
                {mobileFilters.religious.filters.map((filter) => (
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
                {mobileFilters.heraldry.filters.map((filter) => (
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
                title={`${mobileFilters.weapons[lang]} | ${mobileFilters.humans[lang]} | ${mobileFilters.inscriptions[lang]} | ${mobileFilters.localSymbols[lang]}`}
                clickable={false}
              >
                {mobileFilters.weapons.filters.map((filter) => (
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
                {mobileFilters.humans.filters.map((filter) => (
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
                {mobileFilters.inscriptions.filters.map((filter) => (
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
                {mobileFilters.localSymbols.filters.map((filter) => (
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

              {/* Layout/Disposition */}
              <FilterRow title={mobileFilters.disposition[lang]} clickable={false}>
                <div className="flex-1">
                  <PatternSchemaSelector compact />
                </div>
              </FilterRow>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsible filter content - Advanced Mode (inline, not sliding panel) */}
      <AnimatePresence>
        {isMenuExpanded && menuMode === 'advanced' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <AdvancedFiltersInline />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Tags */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[var(--color-border)]"
          >
            <div className="px-2 py-1 flex flex-wrap gap-1">
              {activeFilters.slice(0, 5).map((filter) => (
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
              {activeFilters.length > 5 && (
                <span className="px-1.5 py-0.5 text-[10px] text-primary-500">
                  +{activeFilters.length - 5}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact filter row with thin title
interface FilterRowProps {
  title: string;
  children: React.ReactNode;
  clickable?: boolean;
  mainCategory?: string;
  mainCategory2?: string;
  onCategoryClick?: (category: string) => void;
  isActive?: boolean;
}

function FilterRow({ title, children, clickable = false, mainCategory, mainCategory2, onCategoryClick, isActive }: FilterRowProps) {
  const handleClick = () => {
    if (clickable && mainCategory && onCategoryClick) {
      onCategoryClick(mainCategory);
      if (mainCategory2) {
        onCategoryClick(mainCategory2);
      }
    }
  };

  return (
    <div className="pb-1 border-b border-[var(--color-border)]/30">
      {clickable && mainCategory ? (
        <button 
          onClick={handleClick}
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

// Advanced filters inline (not sliding panel)
function AdvancedFiltersInline() {
  const {
    language,
    activeFilters,
    addFilter,
    removeFilter,
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
    { id: "North America", label_en: "N. America", label_fr: "Am. Nord" },
    { id: "South America", label_en: "S. America", label_fr: "Am. Sud" },
    { id: "Oceania", label_en: "Oceania", label_fr: "Océanie" },
  ];

  return (
    <div className="p-2 max-h-[50vh] overflow-y-auto space-y-3">
      {/* Continents */}
      <div>
        <h3 className="text-xs font-semibold text-[var(--color-text)] mb-1.5">
          {language === "fr" ? "Continents" : "Continents"}
        </h3>
        <div className="flex flex-wrap gap-1.5">
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
        if (["colors", "flag_shape", "continents"].includes(category.id)) return null;

        const visibleSubcategories = category.subcategories.filter((subcategory) =>
          subcategory.elements.some((element) =>
            getAvailableFilters(subcategory.id, element.id) ||
            isFilterActive(subcategory.id, element.id)
          )
        );

        if (visibleSubcategories.length === 0) return null;

        return (
          <div key={category.id}>
            <h3 className="text-xs font-semibold text-[var(--color-text)] mb-1.5">
              {category[lang]}
            </h3>
            {visibleSubcategories.map((subcategory) => {
              const visibleElements = subcategory.elements.filter(
                (element) =>
                  getAvailableFilters(subcategory.id, element.id) ||
                  isFilterActive(subcategory.id, element.id)
              );

              if (visibleElements.length === 0) return null;

              return (
                <div key={subcategory.id} className="mb-2">
                  <p className="text-[10px] text-[var(--color-text-secondary)] mb-1">
                    {subcategory[lang]}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
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
  );
}
