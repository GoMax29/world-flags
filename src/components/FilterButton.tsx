import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export function FilterButton({ label, isActive, isDisabled, onClick, icon }: FilterButtonProps) {
  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'filter-chip flex items-center gap-1.5 whitespace-nowrap',
        isActive && 'filter-chip-active',
        !isActive && !isDisabled && 'filter-chip-inactive',
        isDisabled && 'filter-chip-disabled'
      )}
      aria-pressed={isActive}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span>{label}</span>
      {isActive && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-1"
        >
          ✕
        </motion.span>
      )}
    </motion.button>
  );
}

// Color filter button with color preview
interface ColorFilterButtonProps extends Omit<FilterButtonProps, 'icon'> {
  colorValue: string;
}

export function ColorFilterButton({ label, isActive, isDisabled, onClick, colorValue }: ColorFilterButtonProps) {
  // Map color names to actual colors
  const colorMap: Record<string, string> = {
    white: '#FFFFFF',
    black: '#000000',
    red: '#DC2626',
    blue: '#2563EB',
    green: '#16A34A',
    yellow: '#EAB308',
    orange: '#EA580C',
    brown: '#92400E',
    purple: '#9333EA',
    pink: '#EC4899',
    maroon: '#881337',
    gold: '#CA8A04',
    silver: '#9CA3AF',
    cyan: '#06B6D4',
    turquoise: '#14B8A6',
  };
  
  const bgColor = colorMap[colorValue] || colorValue;
  const needsBorder = ['white', 'yellow', 'gold', 'silver', 'cyan'].includes(colorValue);
  
  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'filter-chip flex items-center gap-2 whitespace-nowrap',
        isActive && 'filter-chip-active',
        !isActive && !isDisabled && 'filter-chip-inactive',
        isDisabled && 'filter-chip-disabled'
      )}
      aria-pressed={isActive}
    >
      <span 
        className={cn(
          'w-4 h-4 rounded-full shrink-0',
          needsBorder && 'border border-gray-300 dark:border-gray-600'
        )}
        style={{ backgroundColor: bgColor }}
      />
      <span>{label}</span>
      {isActive && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          ✕
        </motion.span>
      )}
    </motion.button>
  );
}







