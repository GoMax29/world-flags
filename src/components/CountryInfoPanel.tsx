import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Users,
  Map,
  Coins,
  Globe,
  Languages,
  Loader2,
  Tag,
  Quote,
  Flag,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import {
  useFetchCountry,
  formatNumber,
  formatArea,
} from "../hooks/useFetchCountry";
import { useTranslation } from "../hooks/useTranslation";
import { getFlagSvgUrl } from "../lib/utils";
import { getFlagByCountry, useFlags } from "../hooks/useFlags";
import { getFlagRatio } from "../data/flagRatios";
import type { ActiveFilter } from "../types";

// Special coat of arms URLs - ONLY for countries where API doesn't work or is wrong
const SPECIAL_COAT_OF_ARMS_URLS: Record<string, string> = {
  'Afghanistan': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/National_Emblem_of_Afghanistan_001.svg',
  'Spain': 'https://upload.wikimedia.org/wikipedia/commons/5/56/Coat_of_Arms_of_Spain_%28corrections_of_heraldist_requests%29.svg',
  'Iran': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Emblem_of_Iran_%28red%29.svg',
  'Peru': 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Escudo_nacional_del_Per%C3%BA.svg',
  'Fiji': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Arms_of_Fiji.svg',
  'Malta': 'https://upload.wikimedia.org/wikipedia/commons/f/f5/George_Cross_of_Malta_737x737.svg',
  'Chad': 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Coat_of_arms_of_Chad.svg',
  'Portugal': 'https://upload.wikimedia.org/wikipedia/commons/9/95/Coat_of_arms_of_Portugal_%28lesser%29.svg',
  'Serbia': 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Coat_of_arms_of_Serbia_small.svg',
};

// Generate coat of arms URL - use API for most countries, override only for special cases
function getCoatOfArmsUrl(countryName: string, apiCoatOfArms?: string): string {
  // Check special cases FIRST (these 6 countries don't work with API)
  if (SPECIAL_COAT_OF_ARMS_URLS[countryName]) {
    return SPECIAL_COAT_OF_ARMS_URLS[countryName];
  }
  
  // Use API coat of arms for all other countries (this worked!)
  if (apiCoatOfArms) {
    return apiCoatOfArms;
  }

  // Fallback (shouldn't be needed)
  return '';
}

export function CountryInfoPanel() {
  const {
    selectedCountry,
    setSelectedCountry,
    language,
    addFilter,
    clearFilters,
    activeFilters,
    searchQuery,
    sortBy,
  } = useAppStore();
  const { t } = useTranslation();
  const {
    data: countryInfo,
    isLoading,
    error,
  } = useFetchCountry(selectedCountry);

  // Get current filtered flags list for navigation
  const { flags: filteredFlags } = useFlags(activeFilters, searchQuery, sortBy);
  
  // Toggle between flag and coat of arms
  const [displayMode, setDisplayMode] = useState<'flag' | 'coatOfArms'>('flag');
  const [coatOfArmsError, setCoatOfArmsError] = useState(false);
  
  // Store displayMode in ref to preserve across navigation
  const displayModeRef = useRef<'flag' | 'coatOfArms'>('flag');

  const flagData = selectedCountry ? getFlagByCountry(selectedCountry) : null;
  const flagRatio = selectedCountry
    ? getFlagRatio(selectedCountry)
    : { ratio: 1.5, label: "3:2" };
  const locale = language === "fr" ? "fr-FR" : "en-US";
  
  // Check if country has coat of arms (from API data)
  const hasCoatOfArms = countryInfo?.coatOfArms || selectedCountry === 'Malta';
  
  // Get current index and navigation info
  const currentIndex = useMemo(() => {
    if (!selectedCountry) return -1;
    return filteredFlags.findIndex(([name]) => name === selectedCountry);
  }, [selectedCountry, filteredFlags]);
  
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < filteredFlags.length - 1;
  
  // Navigate to previous/next country while preserving displayMode
  const navigatePrevious = () => {
    if (hasPrevious) {
      displayModeRef.current = displayMode;
      setCoatOfArmsError(false);
      setSelectedCountry(filteredFlags[currentIndex - 1][0]);
    }
  };
  
  const navigateNext = () => {
    if (hasNext) {
      displayModeRef.current = displayMode;
      setCoatOfArmsError(false);
      setSelectedCountry(filteredFlags[currentIndex + 1][0]);
    }
  };
  
  // Reset display mode when country changes (unless navigating)
  useEffect(() => {
    if (selectedCountry) {
      // Use stored mode if navigating, otherwise reset to flag
      setDisplayMode(displayModeRef.current);
      setCoatOfArmsError(false);
      // Reset ref after applying
      displayModeRef.current = 'flag';
    }
  }, [selectedCountry]);

  // Extract motto from flag data
  const mottoAttr = flagData?.attributes.find(
    (attr) => attr.element === "motto" || attr.element === "banner_text"
  );
  const motto = mottoAttr
    ? {
        text: mottoAttr.text || "",
        translation: mottoAttr.translation || "",
      }
    : null;

  // Extract flag elements for tags
  const flagElements =
    flagData?.attributes
      .filter((attr) => !attr.element.startsWith("color_"))
      .map((attr) => ({
        element: attr.element,
        type: attr.type,
        color: attr.color,
      })) || [];

  // Handle tag click - filter by this element
  const handleTagClick = (elementId: string) => {
    clearFilters();
    const filter: ActiveFilter = {
      categoryId: "elements",
      elementId: elementId.toLowerCase(),
    };
    addFilter(filter);
    setSelectedCountry(null);
  };

  // Calculate flag display dimensions - reduced max height for desktop (300px)
  const maxFlagWidth =
    typeof window !== "undefined"
      ? Math.min(window.innerWidth * 0.85, 600)
      : 500;
  const flagHeight = Math.min(maxFlagWidth / flagRatio.ratio, 300);
  
  // Get the image URL based on display mode
  const getDisplayImageUrl = () => {
    if (displayMode === 'coatOfArms' && selectedCountry) {
      // Use our verified URLs first, fall back to API
      return getCoatOfArmsUrl(selectedCountry, countryInfo?.coatOfArms);
    }
    return flagData ? getFlagSvgUrl(flagData.code) : '';
  };

  return (
    <AnimatePresence>
      {selectedCountry && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCountry(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          />

          {/* Centered Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div
              className="relative bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] 
                           shadow-2xl max-w-[850px] w-full max-h-[90vh] overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCountry(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[var(--color-surface)]
                           border border-[var(--color-border)]
                           flex items-center justify-center text-[var(--color-text)] 
                           hover:bg-[var(--color-border)] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Content */}
              <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Flag Section - Large centered flag */}
                <div className="pt-12 pb-6 px-6 flex flex-col items-center bg-gradient-to-b from-[var(--color-surface)] to-transparent">
                  {/* Large Flag / Coat of Arms */}
                  <motion.div
                    key={displayMode} // Force re-render on mode change
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-[var(--color-border)]"
                    style={{
                      width: displayMode === 'coatOfArms' ? 'auto' : maxFlagWidth,
                      height: flagHeight,
                      maxWidth: maxFlagWidth,
                    }}
                  >
                    {flagData && (
                      <img
                        src={getDisplayImageUrl()}
                        alt={displayMode === 'coatOfArms' 
                          ? `Coat of Arms of ${selectedCountry}` 
                          : `Flag of ${selectedCountry}`}
                        className="w-full h-full object-contain bg-gray-100 dark:bg-gray-800"
                        onError={() => {
                          if (displayMode === 'coatOfArms') {
                            setCoatOfArmsError(true);
                          }
                        }}
                      />
                    )}
                    {coatOfArmsError && displayMode === 'coatOfArms' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <p className="text-[var(--color-text-secondary)] text-sm">
                          {language === 'fr' ? 'Armoiries non disponibles' : 'Coat of Arms not available'}
                        </p>
                      </div>
                    )}
                  </motion.div>

                  {/* Navigation & Toggle Buttons - BELOW the flag */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center gap-3 mt-4"
                  >
                    {/* Previous Button */}
                    <button
                      onClick={navigatePrevious}
                      disabled={!hasPrevious}
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all
                        ${hasPrevious
                          ? 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-primary-500 hover:bg-primary-500/10'
                          : 'bg-[var(--color-surface)]/50 border border-[var(--color-border)]/50 text-[var(--color-text-secondary)]/50 cursor-not-allowed'
                        }
                      `}
                      title={language === 'fr' ? 'Précédent' : 'Previous'}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Flag/Coat of Arms Toggle Buttons */}
                    {hasCoatOfArms ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDisplayMode('flag')}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                            ${displayMode === 'flag'
                              ? 'bg-primary-500 text-white shadow-md'
                              : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-primary-500'
                            }
                          `}
                        >
                          <Flag className="w-4 h-4" />
                          {language === 'fr' ? 'Drapeau' : 'Flag'}
                        </button>
                        <button
                          onClick={() => {
                            setDisplayMode('coatOfArms');
                            setCoatOfArmsError(false);
                          }}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                            ${displayMode === 'coatOfArms'
                              ? 'bg-primary-500 text-white shadow-md'
                              : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-primary-500'
                            }
                          `}
                        >
                          <Shield className="w-4 h-4" />
                          {language === 'fr' ? 'Armoiries' : 'Coat of Arms'}
                        </button>
                      </div>
                    ) : (
                      /* Placeholder for spacing when no coat of arms */
                      <div className="flex gap-2">
                        <div className="px-4 py-2 rounded-lg font-medium text-sm bg-primary-500/20 text-primary-500 flex items-center gap-2">
                          <Flag className="w-4 h-4" />
                          {language === 'fr' ? 'Drapeau' : 'Flag'}
                        </div>
                      </div>
                    )}

                    {/* Next Button */}
                    <button
                      onClick={navigateNext}
                      disabled={!hasNext}
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all
                        ${hasNext
                          ? 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-primary-500 hover:bg-primary-500/10'
                          : 'bg-[var(--color-surface)]/50 border border-[var(--color-border)]/50 text-[var(--color-text-secondary)]/50 cursor-not-allowed'
                        }
                      `}
                      title={language === 'fr' ? 'Suivant' : 'Next'}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>

                  {/* Country Name */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-5 text-3xl font-bold text-center text-[var(--color-text)]"
                  >
                    {t.country(selectedCountry)}
                  </motion.h2>

                  {/* Ratio badge */}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-2 px-3 py-1 text-xs bg-[var(--color-surface)] border border-[var(--color-border)]
                               rounded-full text-[var(--color-text-secondary)]"
                  >
                    Ratio: {flagRatio.label}
                  </motion.span>

                  {/* Motto Display */}
                  {motto && motto.text && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="mt-4 px-5 py-3 bg-gradient-to-r from-primary-500/10 to-cyan-500/10 
                                 border border-primary-500/30 rounded-xl text-center max-w-md"
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Quote className="w-4 h-4 text-primary-500" />
                        <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">
                          {language === "fr" ? "Devise" : "Motto"}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-[var(--color-text)] italic">
                        "{motto.text}"
                      </p>
                      {motto.translation && (
                        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                          ({motto.translation})
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <div className="px-6 pb-8">
                  {/* Loading State */}
                  {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
                      <p className="text-[var(--color-text-secondary)]">
                        {t.ui("loading")}
                      </p>
                    </div>
                  )}

                  {/* Error State */}
                  {error && (
                    <div className="text-center py-8">
                      <p className="text-red-500">{t.ui("error")}</p>
                    </div>
                  )}

                  {/* Country Info */}
                  {countryInfo && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <InfoCard
                          icon={<MapPin className="w-5 h-5" />}
                          label={t.ui("capital")}
                          value={countryInfo.capital}
                          delay={0.25}
                        />
                        <InfoCard
                          icon={<Globe className="w-5 h-5" />}
                          label={t.ui("continent")}
                          value={t.continent(countryInfo.continent)}
                          delay={0.3}
                        />
                        <InfoCard
                          icon={<Users className="w-5 h-5" />}
                          label={t.ui("population")}
                          value={formatNumber(countryInfo.population, locale)}
                          delay={0.35}
                        />
                        <InfoCard
                          icon={<Map className="w-5 h-5" />}
                          label={t.ui("area")}
                          value={formatArea(countryInfo.area, locale)}
                          delay={0.4}
                        />
                      </div>

                      {/* Currencies */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="card p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Coins className="w-5 h-5 text-primary-500" />
                          <span className="font-medium text-[var(--color-text)]">
                            {t.ui("currency")}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {countryInfo.currencies.map((currency, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 
                                       rounded-full text-sm font-medium"
                            >
                              {currency}
                            </span>
                          ))}
                        </div>
                      </motion.div>

                      {/* Languages */}
                      {countryInfo.languages.length > 0 &&
                        countryInfo.languages[0] !== "N/A" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="card p-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Languages className="w-5 h-5 text-primary-500" />
                              <span className="font-medium text-[var(--color-text)]">
                                {language === "fr" ? "Langues" : "Languages"}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {countryInfo.languages
                                .slice(0, 5)
                                .map((lang, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-[var(--color-surface)] border border-[var(--color-border)]
                                         text-[var(--color-text-secondary)] rounded-full text-sm"
                                  >
                                    {lang}
                                  </span>
                                ))}
                            </div>
                          </motion.div>
                        )}

                      {/* Flag Elements Tags */}
                      {flagElements.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.55 }}
                          className="card p-4"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-5 h-5 text-primary-500" />
                            <span className="font-medium text-[var(--color-text)]">
                              {language === "fr"
                                ? "Éléments du drapeau"
                                : "Flag elements"}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {flagElements.map((item, i) => (
                              <button
                                key={i}
                                onClick={() => handleTagClick(item.element)}
                                className="px-3 py-1.5 bg-gradient-to-r from-primary-500/10 to-cyan-500/10
                                         border border-primary-500/30 hover:border-primary-500
                                         text-[var(--color-text)] rounded-full text-sm
                                         hover:bg-primary-500/20 transition-all cursor-pointer
                                         flex items-center gap-1"
                              >
                                <span>{formatElementName(item.element)}</span>
                                {item.type && (
                                  <span className="text-[var(--color-text-secondary)]">
                                    ({formatElementName(item.type)})
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                            {language === "fr"
                              ? "Cliquez sur un élément pour filtrer"
                              : "Click an element to filter"}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}

function InfoCard({ icon, label, value, delay }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card p-4"
    >
      <div className="flex items-center gap-2 text-primary-500 mb-1">
        {icon}
        <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p
        className="font-semibold text-[var(--color-text)] truncate"
        title={value}
      >
        {value}
      </p>
    </motion.div>
  );
}

// Format element names for display
function formatElementName(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
