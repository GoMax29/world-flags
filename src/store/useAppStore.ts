import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, ActiveFilter, ZoomLevel, Language, SortOption, MenuMode, PatternColorFilter, ColorFilterMode } from '../types';

const initialPatternColorFilter: PatternColorFilter = {
  schemaId: null,
  colors: [],
  requireSymbol: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      toggleDarkMode: () =>
        set((state) => {
          const newDarkMode = !state.isDarkMode;
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: newDarkMode };
        }),

      // Language
      language: 'fr' as Language,
      setLanguage: (language: Language) => set({ language }),

      // Zoom
      zoomLevel: 'medium' as ZoomLevel,
      setZoomLevel: (zoomLevel: ZoomLevel) => set({ zoomLevel }),

      // Filters
      activeFilters: [] as ActiveFilter[],
      addFilter: (filter: ActiveFilter) =>
        set((state) => ({
          activeFilters: [...state.activeFilters, filter],
        })),
      removeFilter: (filter: ActiveFilter) =>
        set((state) => ({
          activeFilters: state.activeFilters.filter(
            (f) => !(f.categoryId === filter.categoryId && f.elementId === filter.elementId)
          ),
        })),
      clearFilters: () => set({ 
        activeFilters: [],
        patternColorFilter: initialPatternColorFilter,
        colorFilterMode: 'or' as ColorFilterMode,
      }),

      // Color filter mode (or/and/not)
      colorFilterMode: 'or' as ColorFilterMode,
      setColorFilterMode: (mode: ColorFilterMode) => set({ colorFilterMode: mode }),

      // Pattern schema with colors
      patternColorFilter: initialPatternColorFilter,
      setPatternSchema: (schemaId: string | null) =>
        set((state) => {
          // Get segment count for this schema
          const segmentCounts: Record<string, number> = {
            'vertical_triband': 3,
            'horizontal_triband': 3,
            'vertical_biband': 2,
            'horizontal_biband': 2,
            'diagonal_division': 0, // No color selector for diagonal
            'canton': 0, // No color selector for canton
            'nordic_cross': 0, // No color selector for nordic cross
          };
          const segments = schemaId ? segmentCounts[schemaId] || 0 : 0;
          return {
            patternColorFilter: {
              schemaId,
              colors: Array(segments).fill(null),
              requireSymbol: state.patternColorFilter.requireSymbol,
            },
            // Also add/remove the layout filter
            activeFilters: schemaId
              ? [
                  ...state.activeFilters.filter(f => f.categoryId !== 'band_layouts' && f.categoryId !== 'cross_layouts' && f.categoryId !== 'special_layouts'),
                  { categoryId: 'band_layouts', elementId: schemaId },
                ]
              : state.activeFilters.filter(f => f.categoryId !== 'band_layouts' && f.categoryId !== 'cross_layouts' && f.categoryId !== 'special_layouts'),
          };
        }),
      setPatternRequireSymbol: (requireSymbol: boolean) =>
        set((state) => ({
          patternColorFilter: {
            ...state.patternColorFilter,
            requireSymbol,
          },
        })),
      setPatternColor: (index: number, color: string | null) =>
        set((state) => {
          const newColors = [...state.patternColorFilter.colors];
          newColors[index] = color;
          return {
            patternColorFilter: {
              ...state.patternColorFilter,
              colors: newColors,
            },
          };
        }),
      clearPatternColors: () =>
        set((state) => ({
          patternColorFilter: {
            ...state.patternColorFilter,
            colors: state.patternColorFilter.colors.map(() => null),
          },
        })),

      // Menu mode
      menuMode: 'light' as MenuMode,
      setMenuMode: (menuMode: MenuMode) => set({ menuMode }),

      // Sorting - default to name ascending
      sortBy: 'name_asc' as SortOption,
      setSortBy: (sortBy: SortOption) => set({ sortBy }),

      // Show names on flags
      showNames: false,
      setShowNames: (showNames: boolean) => set({ showNames }),

      // Selected country
      selectedCountry: null as string | null,
      setSelectedCountry: (selectedCountry: string | null) => set({ selectedCountry }),

      // Search - resets all filters when searching
      searchQuery: '',
      setSearchQuery: (searchQuery: string) => set((state) => {
        // If user is typing a search, reset all filters
        if (searchQuery.trim() !== '' && state.searchQuery.trim() === '') {
          return {
            searchQuery,
            activeFilters: [],
            patternColorFilter: initialPatternColorFilter,
            colorFilterMode: 'or' as ColorFilterMode,
          };
        }
        return { searchQuery };
      }),

      // Mobile filters panel
      isFiltersPanelOpen: false,
      setFiltersPanelOpen: (isFiltersPanelOpen: boolean) => set({ isFiltersPanelOpen }),

      // Filter notification
      filterNotification: null as string | null,
      setFilterNotification: (filterNotification: string | null) => set({ filterNotification }),
    }),
    {
      name: 'world-flags-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        language: state.language,
        zoomLevel: state.zoomLevel,
        menuMode: state.menuMode,
        showNames: state.showNames,
      }),
    }
  )
);

// Initialize dark mode on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('world-flags-storage');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.state?.isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  }
}
