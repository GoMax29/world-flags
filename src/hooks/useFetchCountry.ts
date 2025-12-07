import { useQuery } from '@tanstack/react-query';
import type { CountryInfo } from '../types';

interface RestCountryResponse {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  population: number;
  area: number;
  region: string;
  subregion?: string;
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  coatOfArms?: {
    png?: string;
    svg?: string;
  };
  cca2: string;
}

async function fetchCountryData(countryName: string): Promise<CountryInfo> {
  // Handle special country name mappings
  const nameMapping: Record<string, string> = {
    'United States': 'United States of America',
    'United Kingdom': 'United Kingdom of Great Britain and Northern Ireland',
    'Russia': 'Russian Federation',
    'South Korea': 'Korea, Republic of',
    'North Korea': "Korea, Democratic People's Republic of",
    'Vatican City': 'Holy See',
    'Czech Republic': 'Czechia',
    'Côte d\'Ivoire': 'Ivory Coast',
    'Congo (Democratic Republic)': 'Congo, Democratic Republic of the',
    'Congo (Republic)': 'Republic of the Congo',
    'Cabo Verde': 'Cape Verde',
    'Timor-Leste': 'Timor-Leste',
    'Eswatini': 'Eswatini',
  };

  const searchName = nameMapping[countryName] || countryName;
  
  try {
    // Try exact name match first
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(searchName)}?fullText=true`
    );
    
    if (!response.ok) {
      // Fall back to partial match
      const fallbackResponse = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(searchName)}`
      );
      
      if (!fallbackResponse.ok) {
        throw new Error('Country not found');
      }
      
      const fallbackData: RestCountryResponse[] = await fallbackResponse.json();
      return transformCountryData(fallbackData[0], countryName);
    }
    
    const data: RestCountryResponse[] = await response.json();
    return transformCountryData(data[0], countryName);
  } catch (error) {
    console.error('Error fetching country data:', error);
    throw error;
  }
}

function transformCountryData(data: RestCountryResponse, originalName: string): CountryInfo {
  const currencies = data.currencies
    ? Object.values(data.currencies).map(c => `${c.name} (${c.symbol || 'N/A'})`)
    : ['N/A'];
    
  const languages = data.languages
    ? Object.values(data.languages)
    : ['N/A'];

  return {
    name: originalName,
    capital: data.capital?.[0] || 'N/A',
    population: data.population,
    area: data.area,
    continent: data.region,
    currencies,
    languages,
    flagUrl: data.flags.svg || data.flags.png,
    coatOfArms: data.coatOfArms?.svg || data.coatOfArms?.png,
  };
}

export function useFetchCountry(countryName: string | null) {
  return useQuery({
    queryKey: ['country', countryName],
    queryFn: () => fetchCountryData(countryName!),
    enabled: !!countryName,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
    retry: 2,
  });
}

// Utility function to format numbers with smart formatting
// Billions → 2 decimals, Millions → 2 decimals, Otherwise → integer with space separator
export function formatNumber(num: number, locale: string = 'fr-FR'): string {
  const isFr = locale.startsWith('fr');
  
  if (num >= 1_000_000_000) {
    // Billions
    const value = num / 1_000_000_000;
    const formatted = value.toFixed(2).replace('.', isFr ? ',' : '.');
    return `${formatted} ${isFr ? 'Mrd' : 'B'}`;
  } else if (num >= 1_000_000) {
    // Millions
    const value = num / 1_000_000;
    const formatted = value.toFixed(2).replace('.', isFr ? ',' : '.');
    return `${formatted} M`;
  } else {
    // Regular number with space as thousand separator
    return num.toLocaleString(locale).replace(/,/g, ' ').replace(/\./g, ' ');
  }
}

// Utility function to format area with smart formatting
export function formatArea(area: number, locale: string = 'fr-FR'): string {
  const isFr = locale.startsWith('fr');
  
  if (area >= 1_000_000) {
    // Millions km²
    const value = area / 1_000_000;
    const formatted = value.toFixed(2).replace('.', isFr ? ',' : '.');
    return `${formatted} M km²`;
  } else {
    // Regular number with space separator
    const formatted = area.toLocaleString(locale).replace(/,/g, ' ').replace(/\./g, ' ');
    return `${formatted} km²`;
  }
}













