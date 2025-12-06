// Flag attribute types
export interface FlagAttribute {
  element: string;
  value?: string;
  color?: string;
  colors?: string[];
  count?: number;
  position?: string;
  type?: string;
  points?: number;
  size?: string;
  border?: string;
  borders?: string;
  rays?: number;
  proportions?: string;
  direction?: string;
  includes?: string[];
  optional?: boolean;
  background?: string;
  text?: string;
  translation?: string;
  border_only?: boolean;
  different_sides?: boolean;
}

export interface FlagData {
  code: string;
  continent: string;
  colors: string[];
  color_count: number;
  layout: string;
  attributes: FlagAttribute[];
  band_colors?: string[]; // Explicit band colors in order (1st, 2nd, 3rd band) for triband/biband flags
}

export interface FlagsData {
  [countryName: string]: FlagData;
}

// Taxonomy types
export interface TaxonomyElement {
  id: string;
  label_en: string;
  label_fr: string;
}

export interface TaxonomySubcategory {
  id: string;
  label_en: string;
  label_fr: string;
  elements: TaxonomyElement[];
}

export interface TaxonomyCategory {
  id: string;
  label_en: string;
  label_fr: string;
  subcategories: TaxonomySubcategory[];
}

export interface Taxonomy {
  categories: TaxonomyCategory[];
}

// Country info from API
export interface CountryInfo {
  name: string;
  capital: string;
  population: number;
  area: number;
  continent: string;
  currencies: string[];
  languages: string[];
  flagUrl: string;
  coatOfArms?: string;
}

// Filter types
export interface ActiveFilter {
  categoryId: string;
  elementId: string;
}

// Pattern schema with color painting
export interface PatternSchema {
  id: string;
  label_en: string;
  label_fr: string;
  segments: number; // Number of colorable segments
  type: 'horizontal' | 'vertical' | 'diagonal' | 'special';
}

export interface PatternColorFilter {
  schemaId: string | null;
  colors: (string | null)[]; // Array of colors for each segment, null = any color
  requireSymbol: boolean; // If true, only show flags with coat of arms/symbol
}

// Menu mode
export type MenuMode = 'light' | 'advanced';

// Color filter mode (3 states)
export type ColorFilterMode = 'or' | 'and' | 'not';

// Zoom levels
export type ZoomLevel = 'small' | 'medium' | 'large';

export interface ZoomConfig {
  size: number;
  quality: 64 | 128 | 256;
}

export const ZOOM_CONFIGS: Record<ZoomLevel, ZoomConfig> = {
  small: { size: 80, quality: 64 },
  medium: { size: 160, quality: 128 },
  large: { size: 280, quality: 256 },
};

// Language
export type Language = 'en' | 'fr';

// Sort options
export type SortOption = 'alphabetical' | 'stars_desc' | 'stars_asc' | 'colors_desc' | 'colors_asc';

// App state
export interface AppState {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // Zoom
  zoomLevel: ZoomLevel;
  setZoomLevel: (level: ZoomLevel) => void;

  // Filters
  activeFilters: ActiveFilter[];
  addFilter: (filter: ActiveFilter) => void;
  removeFilter: (filter: ActiveFilter) => void;
  clearFilters: () => void;

  // Color filter mode (or/and/not)
  colorFilterMode: ColorFilterMode;
  setColorFilterMode: (mode: ColorFilterMode) => void;

  // Pattern schema with colors
  patternColorFilter: PatternColorFilter;
  setPatternSchema: (schemaId: string | null) => void;
  setPatternColor: (index: number, color: string | null) => void;
  clearPatternColors: () => void;
  setPatternRequireSymbol: (requireSymbol: boolean) => void;

  // Menu mode (light/advanced)
  menuMode: MenuMode;
  setMenuMode: (mode: MenuMode) => void;

  // Sorting
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;

  // Selected country
  selectedCountry: string | null;
  setSelectedCountry: (country: string | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Mobile filters panel
  isFiltersPanelOpen: boolean;
  setFiltersPanelOpen: (open: boolean) => void;
}


