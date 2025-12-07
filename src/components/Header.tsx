import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Globe, Search, X, ChevronLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ZoomSelector } from './ZoomSelector';
import { cn, debounce } from '../lib/utils';

export function Header() {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    language, 
    setLanguage,
    searchQuery,
    setSearchQuery 
  } = useAppStore();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  
  // Debounced search update
  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearchQuery(value);
    }, 300)
  ).current;
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSearch(value);
  };
  
  const clearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };
  
  // Close search and clear if empty
  const closeSearch = () => {
    setIsSearchOpen(false);
    // If search is empty, fully close. If has text, keep the text but close UI
  };
  
  // Clear and close search
  const clearAndClose = () => {
    clearSearch();
    setIsSearchOpen(false);
  };
  
  useEffect(() => {
    if (isSearchOpen && mobileSearchInputRef.current) {
      // Small delay to ensure the animation has started
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);
  
  // Sync local search with global on mount
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);
  
  return (
    <header className="sticky top-0 z-30 h-16 glass border-b border-[var(--color-border)]">
      <div className="h-full max-w-[1920px] mx-auto px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 
                          flex items-center justify-center shadow-lg shadow-primary-500/20">
            <span className="text-2xl">🏳️</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display font-bold text-lg text-[var(--color-text)] leading-tight">
              World Flags
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {language === 'fr' ? 'Découvrez les drapeaux' : 'Discover world flags'}
            </p>
          </div>
        </motion.div>
        
        {/* Search Bar - Desktop */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'hidden md:flex flex-1 max-w-md items-center gap-2 px-4 py-2',
            'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl',
            'focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20',
            'transition-all duration-200'
          )}
        >
          <Search className="w-4 h-4 text-[var(--color-text-secondary)]" />
          <input
            ref={searchInputRef}
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder={language === 'fr' ? 'Pays, couleur, élément...' : 'Country, color, element...'}
            className="flex-1 bg-transparent text-sm text-[var(--color-text)] 
                       placeholder:text-[var(--color-text-secondary)] outline-none"
          />
          {localSearch && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={clearSearch}
              className="p-1 rounded-full hover:bg-[var(--color-border)] transition-colors"
            >
              <X className="w-3 h-3 text-[var(--color-text-secondary)]" />
            </motion.button>
          )}
        </motion.div>
        
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              localSearch 
                ? "bg-primary-500 text-white" 
                : "hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
            )}
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>
          
          {/* Zoom Selector */}
          <div className="hidden sm:block">
            <ZoomSelector />
          </div>
          
          {/* Language Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-surface)] 
                       border border-[var(--color-border)] hover:border-primary-500/50 transition-colors"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-[var(--color-text)] uppercase">
              {language}
            </span>
          </motion.button>
          
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] 
                       hover:border-primary-500/50 transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDarkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
      
      {/* Mobile Search Bar - Full width overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop to close on tap outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSearch}
              className="md:hidden fixed inset-0 top-16 bg-black/20 z-20"
            />
            
            {/* Search bar container */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute left-0 right-0 top-16 z-30 
                         bg-[var(--color-bg)] border-b border-[var(--color-border)] shadow-lg"
            >
              <div className="p-3 flex items-center gap-2">
                {/* Back/Close button */}
                <button 
                  onClick={closeSearch}
                  className="p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors shrink-0"
                  aria-label="Close search"
                >
                  <ChevronLeft className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </button>
                
                {/* Search input */}
                <div className="flex-1 flex items-center gap-2 px-3 py-2 
                                bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl
                                focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20">
                  <Search className="w-4 h-4 text-[var(--color-text-secondary)] shrink-0" />
                  <input
                    ref={mobileSearchInputRef}
                    type="text"
                    value={localSearch}
                    onChange={handleSearchChange}
                    placeholder={language === 'fr' ? 'Pays, couleur, élément...' : 'Country, color, element...'}
                    className="flex-1 bg-transparent text-sm text-[var(--color-text)] 
                               placeholder:text-[var(--color-text-secondary)] outline-none min-w-0"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  {localSearch && (
                    <button 
                      onClick={clearSearch}
                      className="p-1 rounded-full hover:bg-[var(--color-border)] transition-colors shrink-0"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    </button>
                  )}
                </div>
                
                {/* Cancel button */}
                <button
                  onClick={clearAndClose}
                  className="px-3 py-2 text-sm font-medium text-primary-500 
                             hover:bg-primary-500/10 rounded-lg transition-colors shrink-0"
                >
                  {language === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}



