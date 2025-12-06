import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import type { ColorFilterMode } from '../types';

interface IconFilterButtonProps {
  icon: string;
  label: string;
  isActive: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}

export function IconFilterButton({
  icon,
  label,
  isActive,
  isDisabled = false,
  onClick,
  size = 'md',
}: IconFilterButtonProps) {
  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.05 } : undefined}
      whileTap={!isDisabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'flex items-center justify-center rounded-lg transition-all duration-200',
        'border focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
        size === 'sm' ? 'w-8 h-8 text-base' : 'w-10 h-10 text-lg',
        isActive && 'bg-primary-500 border-primary-500 shadow-md',
        !isActive && !isDisabled && 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20',
        isDisabled && 'bg-gray-100 dark:bg-gray-800 border-transparent cursor-not-allowed opacity-40'
      )}
      aria-pressed={isActive}
      aria-label={label}
      title={label}
    >
      <span className={cn(isActive ? 'grayscale-0' : isDisabled ? 'grayscale' : '')}>
        {icon}
      </span>
    </motion.button>
  );
}

// Color button for the color palette
interface ColorButtonProps {
  color: string;
  colorHex: string;
  label: string;
  isActive: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
  showStriped?: boolean;
}

export function ColorButton({
  color,
  colorHex,
  label,
  isActive,
  isDisabled = false,
  onClick,
  size = 'md',
  showStriped = false,
}: ColorButtonProps) {
  const needsBorder = ['white', 'yellow', 'gold', 'light_blue'].includes(color);
  const sizeClass = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.1 } : undefined}
      whileTap={!isDisabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500',
        sizeClass,
        isActive && 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900',
        needsBorder && 'border border-gray-300 dark:border-gray-600',
        isDisabled && 'opacity-40 cursor-not-allowed'
      )}
      style={{
        backgroundColor: showStriped ? 'transparent' : colorHex,
        backgroundImage: showStriped
          ? `repeating-linear-gradient(
              45deg,
              #e5e7eb,
              #e5e7eb 2px,
              transparent 2px,
              transparent 6px
            )`
          : undefined,
      }}
      aria-pressed={isActive}
      aria-label={label}
      title={label}
    />
  );
}

// Color filter mode toggle (3 states: OR, AND, NOT)

interface ColorModeToggleProps {
  mode: ColorFilterMode;
  onModeChange: (mode: ColorFilterMode) => void;
  language: 'en' | 'fr';
}

export function ColorModeToggle({ mode, onModeChange, language }: ColorModeToggleProps) {
  const cycleMode = () => {
    const modes: ColorFilterMode[] = ['or', 'and', 'not'];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    onModeChange(modes[nextIndex]);
  };

  const getModeConfig = () => {
    switch (mode) {
      case 'or':
        return {
          icon: '🔓',
          label: language === 'fr' ? 'Multi' : 'Multi',
          bgClass: 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
          hint: language === 'fr' ? 'Inclut ces couleurs' : 'Include these colors',
        };
      case 'and':
        return {
          icon: '🔒',
          label: language === 'fr' ? 'Exact' : 'Exact',
          bgClass: 'bg-amber-500 text-white border-amber-500',
          hint: language === 'fr' ? 'Seulement ces couleurs' : 'Only these colors',
        };
      case 'not':
        return {
          icon: '🚫',
          label: language === 'fr' ? 'Exclure' : 'Exclude',
          bgClass: 'bg-red-500 text-white border-red-500',
          hint: language === 'fr' ? 'Exclut ces couleurs' : 'Exclude these colors',
        };
    }
  };

  const config = getModeConfig();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={cycleMode}
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all',
        'border focus:outline-none focus:ring-2 focus:ring-primary-500',
        config.bgClass
      )}
      aria-label={config.hint}
      title={config.hint}
    >
      <span className="text-sm">{config.icon}</span>
      <span className="hidden sm:inline">{config.label}</span>
    </motion.button>
  );
}

// Legacy ExclusiveToggle for backward compatibility (deprecated)
interface ExclusiveToggleProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

export function ExclusiveToggle({ isActive, onClick, label }: ExclusiveToggleProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all',
        'border focus:outline-none focus:ring-2 focus:ring-primary-500',
        isActive
          ? 'bg-amber-500 text-white border-amber-500'
          : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-amber-300'
      )}
      aria-pressed={isActive}
      aria-label={label}
    >
      <span>🔒</span>
      <span>{isActive ? 'Exclusif' : 'Multi'}</span>
    </motion.button>
  );
}

// Multi-color button for pan-color schemes (Pan-Slavic, Pan-African, Pan-Arab)
interface MultiColorButtonProps {
  colors: string[]; // Array of hex colors
  label: string;
  isActive: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}

export function MultiColorButton({
  colors,
  label,
  isActive,
  isDisabled = false,
  onClick,
  size = 'md',
}: MultiColorButtonProps) {
  const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const segmentCount = colors.length;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.1 } : undefined}
      whileTap={!isDisabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 overflow-hidden',
        sizeClass,
        isActive && 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900',
        'border border-gray-300 dark:border-gray-600',
        isDisabled && 'opacity-40 cursor-not-allowed'
      )}
      aria-pressed={isActive}
      aria-label={label}
      title={label}
    >
      <div className="w-full h-full flex">
        {colors.map((color, index) => (
          <div
            key={index}
            className="h-full"
            style={{
              backgroundColor: color,
              width: `${100 / segmentCount}%`,
            }}
          />
        ))}
      </div>
    </motion.button>
  );
}

// Communist button (red background with yellow star)
interface CommunistButtonProps {
  label: string;
  isActive: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}

export function CommunistButton({
  label,
  isActive,
  isDisabled = false,
  onClick,
  size = 'md',
}: CommunistButtonProps) {
  const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.1 } : undefined}
      whileTap={!isDisabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 overflow-hidden flex items-center justify-center',
        sizeClass,
        isActive && 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900',
        'border border-gray-300 dark:border-gray-600',
        isDisabled && 'opacity-40 cursor-not-allowed'
      )}
      style={{ backgroundColor: '#DC2626' }}
      aria-pressed={isActive}
      aria-label={label}
      title={label}
    >
      <svg 
        viewBox="0 0 24 24" 
        className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}
        fill="#FCD34D"
      >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    </motion.button>
  );
}


