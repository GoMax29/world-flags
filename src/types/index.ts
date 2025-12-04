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


