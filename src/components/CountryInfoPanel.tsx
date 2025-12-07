import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import {
  useFetchCountry,
  formatNumber,
  formatArea,
} from "../hooks/useFetchCountry";
import { useTranslation } from "../hooks/useTranslation";
import { getFlagSvgUrl } from "../lib/utils";
import { getFlagByCountry } from "../hooks/useFlags";
import { getFlagRatio } from "../data/flagRatios";
import type { ActiveFilter } from "../types";

// Verified coat of arms URLs mapping
const COAT_OF_ARMS_URLS: Record<string, string> = {
  // User-specified fixes (PRIORITY)
  'Afghanistan': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/National_Emblem_of_Afghanistan_001.svg',
  'Spain': 'https://upload.wikimedia.org/wikipedia/commons/5/56/Coat_of_Arms_of_Spain_%28corrections_of_heraldist_requests%29.svg',
  'Iran': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Emblem_of_Iran_%28red%29.svg',
  'Peru': 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Escudo_nacional_del_Per%C3%BA.svg',
  'Fiji': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Arms_of_Fiji.svg',
  'Malta': 'https://upload.wikimedia.org/wikipedia/commons/f/f5/George_Cross_of_Malta_737x737.svg',
  // Other verified special cases
  'United States': 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Great_Seal_of_the_United_States_%28obverse%29.svg',
  'United Kingdom': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Royal_Coat_of_Arms_of_the_United_Kingdom.svg',
  'Vatican City': 'https://upload.wikimedia.org/wikipedia/commons/0/00/Coat_of_arms_of_the_Vatican_City.svg',
  'Côte d\'Ivoire': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Coat_of_arms_of_Ivory_Coast.svg',
  'Czech Republic': 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Coat_of_arms_of_the_Czech_Republic.svg',
  'South Korea': 'https://upload.wikimedia.org/wikipedia/commons/8/84/Emblem_of_South_Korea.svg',
  'North Korea': 'https://upload.wikimedia.org/wikipedia/commons/3/35/Emblem_of_North_Korea.svg',
  'Russia': 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Coat_of_Arms_of_the_Russian_Federation.svg',
  'Congo (Democratic Republic)': 'https://upload.wikimedia.org/wikipedia/commons/3/39/Coat_of_arms_of_the_Democratic_Republic_of_the_Congo.svg',
  'Congo (Republic)': 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Coat_of_arms_of_the_Republic_of_the_Congo.svg',
  'Mexico': 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Coat_of_arms_of_Mexico.svg',
  'Haiti': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Coat_of_arms_of_Haiti.svg',
  'Andorra': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Coat_of_arms_of_Andorra.svg',
  'Ecuador': 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Coat_of_arms_of_Ecuador.svg',
  'Bolivia': 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Coat_of_arms_of_Bolivia.svg',
  'Nicaragua': 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Coat_of_arms_of_Nicaragua.svg',
  'Paraguay': 'https://upload.wikimedia.org/wikipedia/commons/7/71/Coat_of_arms_of_Paraguay.svg',
  'El Salvador': 'https://upload.wikimedia.org/wikipedia/commons/8/80/Coat_of_arms_of_El_Salvador.svg',
  'Guatemala': 'https://upload.wikimedia.org/wikipedia/commons/6/64/Coat_of_arms_of_Guatemala.svg',
  'Dominican Republic': 'https://upload.wikimedia.org/wikipedia/commons/3/36/Coat_of_arms_of_the_Dominican_Republic.svg',
  'Costa Rica': 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Coat_of_arms_of_Costa_Rica.svg',
  'Honduras': 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Coat_of_arms_of_Honduras.svg',
  'Belize': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Coat_of_arms_of_Belize.svg',
  'San Marino': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Coat_of_arms_of_San_Marino.svg',
  'Serbia': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Coat_of_arms_of_Serbia.svg',
  'Croatia': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Coat_of_arms_of_Croatia.svg',
  'Slovenia': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Coat_of_arms_of_Slovenia.svg',
  'Slovakia': 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Coat_of_arms_of_Slovakia.svg',
  'Montenegro': 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Coat_of_arms_of_Montenegro.svg',
  'Moldova': 'https://upload.wikimedia.org/wikipedia/commons/5/56/Coat_of_arms_of_Moldova.svg',
  'Equatorial Guinea': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Coat_of_arms_of_Equatorial_Guinea.svg',
};

// Generate coat of arms URL - check special cases first, then fallback to API
function getCoatOfArmsUrl(countryName: string, apiCoatOfArms?: string): string {
  // ALWAYS check our verified URLs first
  if (COAT_OF_ARMS_URLS[countryName]) {
    return COAT_OF_ARMS_URLS[countryName];
  }
  
  // Fall back to API coat of arms if available
  if (apiCoatOfArms) {
    return apiCoatOfArms;
  }

  // Last resort: try standard pattern
  const formattedName = countryName.replace(/ /g, '_');
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Coat_of_arms_of_${formattedName}.svg/500px-Coat_of_arms_of_${formattedName}.svg.png`;
}

export function CountryInfoPanel() {
  const {
    selectedCountry,
    setSelectedCountry,
    language,
    addFilter,
    clearFilters,
  } = useAppStore();
  const { t } = useTranslation();
  const {
    data: countryInfo,
    isLoading,
    error,
  } = useFetchCountry(selectedCountry);

  // Toggle between flag and coat of arms
  const [displayMode, setDisplayMode] = useState<'flag' | 'coatOfArms'>('flag');
  const [coatOfArmsError, setCoatOfArmsError] = useState(false);

  const flagData = selectedCountry ? getFlagByCountry(selectedCountry) : null;
  const flagRatio = selectedCountry
    ? getFlagRatio(selectedCountry)
    : { ratio: 1.5, label: "3:2" };
  const locale = language === "fr" ? "fr-FR" : "en-US";
  
  // Check if country has coat of arms (from API data)
  const hasCoatOfArms = countryInfo?.coatOfArms || selectedCountry === 'Malta';
  
  // Reset display mode when country changes
  useEffect(() => {
    setDisplayMode('flag');
    setCoatOfArmsError(false);
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

                  {/* Flag/Coat of Arms Toggle Buttons - BELOW the flag */}
                  {hasCoatOfArms && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="flex gap-2 mt-4"
                    >
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
                    </motion.div>
                  )}

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
