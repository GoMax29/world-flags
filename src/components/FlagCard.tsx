import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { getFlagSvgUrl } from '../lib/utils';

interface FlagCardProps {
  countryName: string;
  countryCode: string;
  index: number;
}

export function FlagCard({ countryName, countryCode, index }: FlagCardProps) {
  const { selectedCountry, setSelectedCountry } = useAppStore();
  const { t } = useTranslation();
  
  const isSelected = selectedCountry === countryName;
  
  const handleClick = () => {
    setSelectedCountry(isSelected ? null : countryName);
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.25, 
        delay: Math.min(index * 0.01, 0.3),
        layout: { duration: 0.2 }
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
          // Fixed aspect ratio box - all flags fit in the same container
          aspectRatio: '3 / 2'
        }}
        aria-label={t.country(countryName)}
      >
        {/* Flag Image - centered and contained within the box */}
        <img
          src={getFlagSvgUrl(countryCode)}
          alt={`Flag of ${countryName}`}
          className="max-w-full max-h-full object-contain"
          loading="lazy"
          decoding="async"
        />
        
        {/* Hover Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                     flex items-end justify-center p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span className="text-white text-[10px] sm:text-xs font-medium text-center line-clamp-2 drop-shadow-lg">
            {t.country(countryName)}
          </span>
        </div>
        
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
}
