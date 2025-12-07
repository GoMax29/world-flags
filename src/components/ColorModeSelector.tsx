import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { ColorFilterMode } from '../types';

interface ModeConfig {
  mode: ColorFilterMode;
  emoji: string;
  label_en: string;
  label_fr: string;
  tooltip_en: string;
  tooltip_fr: string;
  bgClass: string;
  activeClass: string;
}

const modeConfigs: ModeConfig[] = [
  {
    mode: 'or',
    emoji: '🔓',
    label_en: 'OR',
    label_fr: 'OU',
    tooltip_en: 'Flags containing these colors (among others)',
    tooltip_fr: 'Drapeaux contenant ces couleurs (parmi d\'autres)',
    bgClass: 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]',
    activeClass: 'bg-blue-500 text-white border-blue-500',
  },
  {
    mode: 'and',
    emoji: '🔒',
    label_en: 'AND',
    label_fr: 'ET',
    tooltip_en: 'Flags containing ONLY these colors',
    tooltip_fr: 'Drapeaux contenant UNIQUEMENT ces couleurs',
    bgClass: 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]',
    activeClass: 'bg-amber-500 text-white border-amber-500',
  },
  {
    mode: 'not',
    emoji: '🚫',
    label_en: 'NOT',
    label_fr: 'NON',
    tooltip_en: 'Flags NOT containing these colors',
    tooltip_fr: 'Drapeaux NE contenant PAS ces couleurs',
    bgClass: 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]',
    activeClass: 'bg-red-500 text-white border-red-500',
  },
];

export function ColorModeSelector() {
  const { colorFilterMode, setColorFilterMode, language } = useAppStore();
  const [hoveredMode, setHoveredMode] = useState<ColorFilterMode | null>(null);

  return (
    <div className="relative flex items-center gap-0.5">
      {modeConfigs.map((config) => {
        const isActive = colorFilterMode === config.mode;
        const isHovered = hoveredMode === config.mode;
        
        return (
          <div key={config.mode} className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setColorFilterMode(config.mode)}
              onMouseEnter={() => setHoveredMode(config.mode)}
              onMouseLeave={() => setHoveredMode(null)}
              className={`
                flex items-center justify-center gap-0.5 px-1.5 py-1 rounded-md text-[10px] font-bold
                transition-all duration-200 border min-w-[40px]
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
                ${isActive ? config.activeClass : config.bgClass}
                ${!isActive && 'hover:border-primary-300'}
              `}
              aria-pressed={isActive}
              aria-label={language === 'fr' ? config.tooltip_fr : config.tooltip_en}
            >
              <span className="text-sm">{config.emoji}</span>
              <span className="hidden sm:inline">{language === 'fr' ? config.label_fr : config.label_en}</span>
            </motion.button>

            {/* Tooltip on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
                >
                  <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
                                  text-[10px] px-2.5 py-2 rounded-lg shadow-lg whitespace-nowrap
                                  max-w-[220px] text-center leading-tight">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-base">{config.emoji}</span>
                      <span className="font-bold">{language === 'fr' ? config.label_fr : config.label_en}</span>
                    </div>
                    <p className="opacity-90">
                      {language === 'fr' ? config.tooltip_fr : config.tooltip_en}
                    </p>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 
                                      border-l-transparent border-r-transparent 
                                      border-t-gray-900 dark:border-t-gray-100" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
