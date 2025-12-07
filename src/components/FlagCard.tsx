import { useState, useRef, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { getFlagSvgUrl } from '../lib/utils';

interface FlagCardProps {
  countryName: string;
  countryCode: string;
  index: number;
}

// Memoized FlagCard to prevent unnecessary re-renders
export const FlagCard = memo(function FlagCard({ countryName, countryCode, index }: FlagCardProps) {
  const { selectedCountry, setSelectedCountry, showNames } = useAppStore();
  const { t } = useTranslation();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isSelected = selectedCountry === countryName;
  
  // IntersectionObserver for lazy loading - only load when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0,
      }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  const handleClick = () => {
    setSelectedCountry(isSelected ? null : countryName);
  };
  
  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.2, 
        delay: Math.min(index * 0.005, 0.15),
        layout: { duration: 0.15 }
      }}
      className="relative group w-full"
    >
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative w-full overflow-hidden rounded-lg
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          dark:focus:ring-offset-slate-900
          bg-gray-100 dark:bg-gray-800
          flex items-center justify-center
          ${isSelected 
            ? 'ring-2 ring-primary-500 shadow-lg shadow-primary-500/25' 
            : 'hover:shadow-md hover:shadow-black/10 dark:hover:shadow-black/30'
          }
        `}
        style={{ 
          aspectRatio: '3 / 2'
        }}
        aria-label={t.country(countryName)}
      >
        {/* Loading Skeleton */}
        {(!isVisible || !isLoaded) && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 
                          dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 
                          animate-pulse" />
        )}
        
        {/* Flag Image - only render when visible */}
        {isVisible && (
          <img
            src={getFlagSvgUrl(countryCode)}
            alt={`Flag of ${countryName}`}
            className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
          />
        )}
        
        {/* Persistent Name Overlay (when showNames is true) */}
        {showNames && (
          <div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                       flex items-end justify-center p-1.5 pointer-events-none"
          >
            <span className="text-white text-[9px] sm:text-[10px] font-medium text-center line-clamp-1 drop-shadow-lg">
              {t.country(countryName)}
            </span>
          </div>
        )}
        
        {/* Hover Overlay (only when showNames is false) */}
        {!showNames && (
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                     flex items-end justify-center p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span className="text-white text-[10px] sm:text-xs font-medium text-center line-clamp-2 drop-shadow-lg">
            {t.country(countryName)}
          </span>
        </div>
        )}
        
        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary-500 rounded-full 
                       flex items-center justify-center shadow-lg"
          >
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
});
