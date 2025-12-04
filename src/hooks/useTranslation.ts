import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import translations from '../data/translations.json';

type TranslationData = typeof translations;

export function useTranslation() {
  const { language } = useAppStore();
  
  const t = useMemo(() => {
    return {
      // Get country name in current language
      country: (countryName: string): string => {
        const countryData = (translations.countries as Record<string, { en: string; fr: string }>)[countryName];
        return countryData ? countryData[language] : countryName;
      },
      
      // Get continent name in current language
      continent: (continentName: string): string => {
        const continentData = (translations.continents as Record<string, { en: string; fr: string }>)[continentName];
        return continentData ? continentData[language] : continentName;
      },
      
      // Get UI string in current language
      ui: (key: keyof TranslationData['ui']): string => {
        const uiData = translations.ui[key];
        return uiData ? uiData[language] : key;
      },
    };
  }, [language]);
  
  return { t, language };
}



