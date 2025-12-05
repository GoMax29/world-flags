import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

// Pattern schema definitions
const patternSchemas = [
  { id: 'vertical_triband', label_en: '3 Vertical', label_fr: '3 Verticales', segments: 3, type: 'vertical' as const, hasColorPicker: true },
  { id: 'horizontal_triband', label_en: '3 Horizontal', label_fr: '3 Horizontales', segments: 3, type: 'horizontal' as const, hasColorPicker: true },
  { id: 'vertical_biband', label_en: '2 Vertical', label_fr: '2 Verticales', segments: 2, type: 'vertical' as const, hasColorPicker: true },
  { id: 'horizontal_biband', label_en: '2 Horizontal', label_fr: '2 Horizontales', segments: 2, type: 'horizontal' as const, hasColorPicker: true },
  { id: 'diagonal_division', label_en: 'Diagonal', label_fr: 'Diagonale', segments: 0, type: 'diagonal' as const, hasColorPicker: false },
  { id: 'canton', label_en: 'Canton', label_fr: 'Canton', segments: 0, type: 'special' as const, hasColorPicker: false },
  { id: 'nordic_cross', label_en: 'Nordic Cross', label_fr: 'Croix Nordique', segments: 0, type: 'cross' as const, hasColorPicker: false },
];

// Color palette (simplified - removed gold, maroon, light_blue)
const colorPalette = [
  { id: 'red', hex: '#DC2626', label_en: 'Red', label_fr: 'Rouge' },
  { id: 'blue', hex: '#2563EB', label_en: 'Blue', label_fr: 'Bleu' },
  { id: 'yellow', hex: '#FCD34D', label_en: 'Yellow', label_fr: 'Jaune' },
  { id: 'green', hex: '#16A34A', label_en: 'Green', label_fr: 'Vert' },
  { id: 'white', hex: '#FFFFFF', label_en: 'White', label_fr: 'Blanc' },
  { id: 'black', hex: '#1F2937', label_en: 'Black', label_fr: 'Noir' },
  { id: 'orange', hex: '#F97316', label_en: 'Orange', label_fr: 'Orange' },
];

interface PatternSchemaSelectorProps {
  compact?: boolean;
}

export function PatternSchemaSelector({ compact = false }: PatternSchemaSelectorProps) {
  const { language, patternColorFilter, setPatternSchema, setPatternColor, clearPatternColors, setPatternRequireSymbol } = useAppStore();
  const [selectedBand, setSelectedBand] = useState<number | null>(null);
  const lang = language === 'fr' ? 'label_fr' : 'label_en';

  const selectedSchema = patternSchemas.find(s => s.id === patternColorFilter.schemaId);
  const showColorPicker = selectedSchema?.hasColorPicker && patternColorFilter.colors.length > 0;

  const handleBandClick = (index: number) => {
    setSelectedBand(selectedBand === index ? null : index);
  };

  const handleColorSelect = (colorId: string | null) => {
    if (selectedBand !== null) {
      setPatternColor(selectedBand, colorId);
      setSelectedBand(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Schema selection */}
      <div className="flex flex-wrap gap-2">
        {patternSchemas.map((schema) => (
          <PatternButton
            key={schema.id}
            schema={schema}
            isActive={patternColorFilter.schemaId === schema.id}
            onClick={() => {
              setPatternSchema(patternColorFilter.schemaId === schema.id ? null : schema.id);
              setSelectedBand(null);
            }}
            compact={compact}
          />
        ))}
      </div>

      {/* Color painting area - only for biband/triband patterns */}
      <AnimatePresence>
        {showColorPicker && selectedSchema && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
              {/* Interactive band preview */}
              <div className="flex items-start gap-4 mb-3">
                <div className="relative">
                  <BandPreview
                    schema={selectedSchema}
                    colors={patternColorFilter.colors}
                    selectedBand={selectedBand}
                    onBandClick={handleBandClick}
                  />
                  
                  {/* Color tooltip palette - positioned to the right of the band preview */}
                  <AnimatePresence>
                    {selectedBand !== null && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: -5 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -5 }}
                        className="absolute left-full top-0 ml-2 p-2 bg-[var(--color-bg)] rounded-lg shadow-lg border border-[var(--color-border)] z-10"
                      >
                        <p className="text-[10px] text-[var(--color-text-secondary)] mb-1.5 whitespace-nowrap">
                          {language === 'fr' ? `Bande ${selectedBand + 1}` : `Band ${selectedBand + 1}`}
                        </p>
                        <div className="flex gap-1">
                          {/* Any color option FIRST */}
                          <button
                            onClick={() => handleColorSelect(null)}
                            className={cn(
                              'w-5 h-5 rounded-full transition-all focus:outline-none',
                              'border border-gray-300 dark:border-gray-600',
                              'hover:scale-110 hover:ring-2 hover:ring-primary-400',
                              patternColorFilter.colors[selectedBand] === null && 'ring-2 ring-primary-500',
                              'flex items-center justify-center text-[8px] font-bold text-gray-600 dark:text-gray-300'
                            )}
                            style={{
                              backgroundImage: `repeating-linear-gradient(45deg, #9ca3af, #9ca3af 2px, #e5e7eb 2px, #e5e7eb 4px)`,
                            }}
                            title={language === 'fr' ? 'N\'importe' : 'Any'}
                            aria-label={language === 'fr' ? 'N\'importe quelle couleur' : 'Any color'}
                          >
                            ?
                          </button>
                          {/* Color palette */}
                          {colorPalette.map((color) => (
                            <button
                              key={color.id}
                              onClick={() => handleColorSelect(color.id)}
                              className={cn(
                                'w-5 h-5 rounded-full transition-all focus:outline-none',
                                'border border-gray-300 dark:border-gray-600',
                                'hover:scale-110 hover:ring-2 hover:ring-primary-400',
                                patternColorFilter.colors[selectedBand] === color.id && 'ring-2 ring-primary-500'
                              )}
                              style={{ backgroundColor: color.hex }}
                              title={color[lang]}
                              aria-label={color[lang]}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                    {language === 'fr' ? 'Cliquez sur une bande pour choisir sa couleur' : 'Click a band to choose its color'}
                  </p>
                  <button
                    onClick={() => {
                      clearPatternColors();
                      setSelectedBand(null);
                    }}
                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    {language === 'fr' ? 'Réinitialiser' : 'Reset'}
                  </button>
                </div>
              </div>

              {/* Symbol/Coat of Arms toggle */}
              <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]">
                <button
                  onClick={() => setPatternRequireSymbol(!patternColorFilter.requireSymbol)}
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all',
                    'border focus:outline-none focus:ring-2 focus:ring-primary-500',
                    patternColorFilter.requireSymbol
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-primary-300'
                  )}
                  aria-pressed={patternColorFilter.requireSymbol}
                >
                  <Shield className="w-3.5 h-3.5" />
                  {language === 'fr' ? 'Avec blason' : 'With symbol'}
                </button>
                <span className="text-[10px] text-[var(--color-text-secondary)]">
                  {patternColorFilter.requireSymbol 
                    ? (language === 'fr' ? 'Drapeaux avec blason uniquement' : 'Only flags with coat of arms')
                    : (language === 'fr' ? 'Tous les drapeaux' : 'All flags')
                  }
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message for schemas without color picker */}
      <AnimatePresence>
        {selectedSchema && !selectedSchema.hasColorPicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
              {language === 'fr' 
                ? `Filtre "${selectedSchema.label_fr}" activé`
                : `"${selectedSchema.label_en}" filter active`
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Pattern button component
interface PatternButtonProps {
  schema: typeof patternSchemas[0];
  isActive: boolean;
  onClick: () => void;
  compact?: boolean;
}

function PatternButton({ schema, isActive, onClick, compact }: PatternButtonProps) {
  const { language } = useAppStore();
  const lang = language === 'fr' ? 'label_fr' : 'label_en';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 p-2 rounded-lg transition-all',
        'border focus:outline-none focus:ring-2 focus:ring-primary-500',
        isActive && 'bg-primary-500 border-primary-500',
        !isActive && 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-primary-300'
      )}
      aria-pressed={isActive}
      aria-label={schema[lang]}
    >
      <PatternIcon schema={schema} isActive={isActive} size={compact ? 24 : 32} />
      {!compact && (
        <span className={cn('text-[10px] font-medium', isActive ? 'text-white' : 'text-[var(--color-text-secondary)]')}>
          {schema[lang]}
        </span>
      )}
    </motion.button>
  );
}

// Pattern icon SVG
interface PatternIconProps {
  schema: typeof patternSchemas[0];
  isActive: boolean;
  size?: number;
}

function PatternIcon({ schema, isActive, size = 32 }: PatternIconProps) {
  const strokeColor = isActive ? '#fff' : 'var(--color-text-secondary)';
  const fillColor1 = isActive ? 'rgba(255,255,255,0.3)' : 'rgba(99,102,241,0.2)';
  const fillColor2 = isActive ? 'rgba(255,255,255,0.6)' : 'rgba(99,102,241,0.4)';
  const fillColor3 = isActive ? 'rgba(255,255,255,0.9)' : 'rgba(99,102,241,0.6)';

  switch (schema.type) {
    case 'vertical':
      if (schema.segments === 3) {
        return (
          <svg width={size} height={size * 0.67} viewBox="0 0 48 32">
            <rect x="0" y="0" width="16" height="32" fill={fillColor1} stroke={strokeColor} strokeWidth="1" />
            <rect x="16" y="0" width="16" height="32" fill={fillColor2} stroke={strokeColor} strokeWidth="1" />
            <rect x="32" y="0" width="16" height="32" fill={fillColor3} stroke={strokeColor} strokeWidth="1" />
          </svg>
        );
      }
      return (
        <svg width={size} height={size * 0.67} viewBox="0 0 48 32">
          <rect x="0" y="0" width="24" height="32" fill={fillColor1} stroke={strokeColor} strokeWidth="1" />
          <rect x="24" y="0" width="24" height="32" fill={fillColor2} stroke={strokeColor} strokeWidth="1" />
        </svg>
      );

    case 'horizontal':
      if (schema.segments === 3) {
        return (
          <svg width={size} height={size * 0.67} viewBox="0 0 48 32">
            <rect x="0" y="0" width="48" height="10.67" fill={fillColor1} stroke={strokeColor} strokeWidth="1" />
            <rect x="0" y="10.67" width="48" height="10.67" fill={fillColor2} stroke={strokeColor} strokeWidth="1" />
            <rect x="0" y="21.33" width="48" height="10.67" fill={fillColor3} stroke={strokeColor} strokeWidth="1" />
          </svg>
        );
      }
      return (
        <svg width={size} height={size * 0.67} viewBox="0 0 48 32">
          <rect x="0" y="0" width="48" height="16" fill={fillColor1} stroke={strokeColor} strokeWidth="1" />
          <rect x="0" y="16" width="48" height="16" fill={fillColor2} stroke={strokeColor} strokeWidth="1" />
        </svg>
      );

    case 'diagonal':
      return (
        <svg width={size} height={size * 0.67} viewBox="0 0 48 32">
          <polygon points="0,0 48,0 48,32" fill={fillColor1} stroke={strokeColor} strokeWidth="1" />
          <polygon points="0,0 0,32 48,32" fill={fillColor2} stroke={strokeColor} strokeWidth="1" />
        </svg>
      );

    case 'special':
      return (
        <svg width={size} height={size * 0.67} viewBox="0 0 48 32">
          <rect x="0" y="0" width="48" height="32" fill={fillColor1} stroke={strokeColor} strokeWidth="1" />
          <rect x="0" y="0" width="16" height="16" fill={fillColor2} stroke={strokeColor} strokeWidth="1" />
        </svg>
      );

    case 'cross':
      return (
        <svg width={size} height={size * 0.67} viewBox="0 0 48 32">
          <rect x="0" y="0" width="48" height="32" fill={fillColor1} stroke={strokeColor} strokeWidth="1" />
          <rect x="12" y="0" width="8" height="32" fill={fillColor2} stroke={strokeColor} strokeWidth="1" />
          <rect x="0" y="12" width="48" height="8" fill={fillColor2} stroke={strokeColor} strokeWidth="1" />
        </svg>
      );

    default:
      return null;
  }
}

// Interactive band preview with clickable segments
interface BandPreviewProps {
  schema: typeof patternSchemas[0];
  colors: (string | null)[];
  selectedBand: number | null;
  onBandClick: (index: number) => void;
}

function BandPreview({ schema, colors, selectedBand, onBandClick }: BandPreviewProps) {
  const getColorHex = (colorId: string | null): string => {
    if (!colorId) return '#e5e7eb';
    const color = colorPalette.find(c => c.id === colorId);
    return color?.hex || '#e5e7eb';
  };

  const getAnyColorPattern = () => ({
    backgroundImage: `repeating-linear-gradient(45deg, #d1d5db, #d1d5db 3px, transparent 3px, transparent 6px)`,
    backgroundColor: '#f3f4f6',
  });

  const renderBand = (index: number, style: React.CSSProperties) => {
    const colorId = colors[index];
    const isSelected = selectedBand === index;
    const isAnyColor = colorId === null;
    
    return (
      <motion.div
        key={index}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onBandClick(index)}
        className={cn(
          'cursor-pointer transition-all flex items-center justify-center',
          'border border-gray-400 dark:border-gray-500',
          isSelected && 'ring-2 ring-primary-500 ring-offset-1 z-10'
        )}
        style={{
          ...style,
          backgroundColor: isAnyColor ? undefined : getColorHex(colorId),
          ...(isAnyColor ? getAnyColorPattern() : {}),
        }}
      >
        <span className={cn(
          'text-xs font-bold',
          colorId === 'white' || colorId === 'yellow' || isAnyColor ? 'text-gray-600' : 'text-white',
          'drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]'
        )}>
          {isAnyColor ? '?' : index + 1}
        </span>
      </motion.div>
    );
  };

  switch (schema.type) {
    case 'vertical':
      return (
        <div className="flex w-[90px] h-[60px] rounded overflow-hidden shadow-sm">
          {Array.from({ length: schema.segments }).map((_, i) => 
            renderBand(i, { width: `${100 / schema.segments}%`, height: '100%' })
          )}
        </div>
      );

    case 'horizontal':
      return (
        <div className="flex flex-col w-[90px] h-[60px] rounded overflow-hidden shadow-sm">
          {Array.from({ length: schema.segments }).map((_, i) => 
            renderBand(i, { width: '100%', height: `${100 / schema.segments}%` })
          )}
        </div>
      );

    default:
      return (
        <div className="w-[90px] h-[60px] rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
          N/A
        </div>
      );
  }
}
