import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, ActiveFilter, ZoomLevel, Language, SortOption } from '../types';

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
      clearFilters: () => set({ activeFilters: [] }),

      // Sorting
      sortBy: 'alphabetical' as SortOption,
      setSortBy: (sortBy: SortOption) => set({ sortBy }),

      // Selected country
      selectedCountry: null as string | null,
      setSelectedCountry: (selectedCountry: string | null) => set({ selectedCountry }),

      // Search
      searchQuery: '',
      setSearchQuery: (searchQuery: string) => set({ searchQuery }),

      // Mobile filters panel
      isFiltersPanelOpen: false,
      setFiltersPanelOpen: (isFiltersPanelOpen: boolean) => set({ isFiltersPanelOpen }),
    }),
    {
      name: 'world-flags-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        language: state.language,
        zoomLevel: state.zoomLevel,
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


