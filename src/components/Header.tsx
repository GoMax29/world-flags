import { motion } from 'framer-motion';
import { Moon, Sun, Globe, Search, X } from 'lucide-react';
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
    searchInputRef.current?.focus();
  };
  
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  
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
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5 text-[var(--color-text-secondary)]" />
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
      
      {/* Mobile Search Bar */}
      <motion.div
        initial={false}
        animate={{ 
          height: isSearchOpen ? 'auto' : 0,
          opacity: isSearchOpen ? 1 : 0
        }}
        className="md:hidden overflow-hidden border-b border-[var(--color-border)]"
      >
        <div className="p-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] 
                          border border-[var(--color-border)] rounded-xl">
            <Search className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder={language === 'fr' ? 'Pays, couleur, élément...' : 'Country, color, element...'}
              className="flex-1 bg-transparent text-sm text-[var(--color-text)] 
                         placeholder:text-[var(--color-text-secondary)] outline-none"
            />
            {localSearch && (
              <button onClick={clearSearch} className="p-1">
                <X className="w-4 h-4 text-[var(--color-text-secondary)]" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </header>
  );
}



