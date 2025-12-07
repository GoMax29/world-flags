import { motion } from 'framer-motion';
import { Grid2X2, Grid3X3, LayoutGrid } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';
import type { ZoomLevel } from '../types';

const zoomOptions: { level: ZoomLevel; icon: React.ReactNode; label: { en: string; fr: string } }[] = [
  { level: 'small', icon: <Grid3X3 className="w-4 h-4" />, label: { en: 'Small', fr: 'Petit' } },
  { level: 'medium', icon: <Grid2X2 className="w-4 h-4" />, label: { en: 'Medium', fr: 'Moyen' } },
  { level: 'large', icon: <LayoutGrid className="w-4 h-4" />, label: { en: 'Large', fr: 'Grand' } },
];

export function ZoomSelector() {
  const { zoomLevel, setZoomLevel, language } = useAppStore();
  
  return (
    <div className="flex items-center gap-1 p-1 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
      {zoomOptions.map(option => (
        <motion.button
          key={option.level}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setZoomLevel(option.level)}
          className={cn(
            'relative px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors',
            zoomLevel === option.level
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
          )}
          aria-pressed={zoomLevel === option.level}
          title={option.label[language]}
        >
          {zoomLevel === option.level && (
            <motion.div
              layoutId="zoom-indicator"
              className="absolute inset-0 bg-primary-500/10 rounded-md"
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            />
          )}
          <span className="relative z-10">{option.icon}</span>
          <span className="relative z-10 text-sm font-medium hidden sm:inline">
            {option.label[language]}
          </span>
        </motion.button>
      ))}
    </div>
  );
}













