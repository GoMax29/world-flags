import { create } from 'zustand';

interface CountryData {
  population: number;
  area: number;
}

interface CountryDataStore {
  data: Record<string, CountryData>;
  isLoading: boolean;
  isLoaded: boolean;
  fetchAllCountryData: () => Promise<void>;
  getPopulation: (countryName: string) => number;
  getArea: (countryName: string) => number;
}

// Map our country names to RestCountries API names
const countryNameMapping: Record<string, string> = {
  'United States': 'United States of America',
  'United Kingdom': 'United Kingdom of Great Britain and Northern Ireland',
  'Russia': 'Russian Federation',
  'South Korea': 'Korea, Republic of',
  'North Korea': "Korea, Democratic People's Republic of",
  'Vatican City': 'Holy See',
  'Czech Republic': 'Czechia',
  'Côte d\'Ivoire': 'Ivory Coast',
  'Congo (Democratic Republic)': 'DR Congo',
  'Congo (Republic)': 'Republic of the Congo',
  'Cabo Verde': 'Cape Verde',
  'Timor-Leste': 'Timor-Leste',
  'Eswatini': 'Eswatini',
  'São Tomé and Príncipe': 'Sao Tome and Principe',
  'Sao Tome and Principe': 'Sao Tome and Principe',
  'Myanmar': 'Myanmar',
  'Laos': 'Laos',
  'Syria': 'Syria',
  'Palestine': 'Palestine',
  'Taiwan': 'Taiwan',
  'Micronesia': 'Micronesia',
  'East Timor': 'Timor-Leste',
};

// Reverse mapping from API names to our names
const apiToOurName: Record<string, string> = {
  'United States of America': 'United States',
  'United States': 'United States',
  'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
  'Russian Federation': 'Russia',
  'Russia': 'Russia',
  'Republic of Korea': 'South Korea',
  'Korea, Republic of': 'South Korea',
  "Korea (Democratic People's Republic of)": 'North Korea',
  "Korea, Democratic People's Republic of": 'North Korea',
  'Holy See': 'Vatican City',
  'Czechia': 'Czech Republic',
  "Côte d'Ivoire": 'Côte d\'Ivoire',
  'Ivory Coast': 'Côte d\'Ivoire',
  'Democratic Republic of the Congo': 'Congo (Democratic Republic)',
  'DR Congo': 'Congo (Democratic Republic)',
  'Republic of the Congo': 'Congo (Republic)',
  'Congo': 'Congo (Republic)',
  'Cabo Verde': 'Cabo Verde',
  'Cape Verde': 'Cabo Verde',
  // Sao Tome - map to our name WITHOUT accents (as stored in flags_en.json)
  'Sao Tome and Principe': 'Sao Tome and Principe',
  'São Tomé and Príncipe': 'Sao Tome and Principe',
  'Viet Nam': 'Vietnam',
  'Lao People\'s Democratic Republic': 'Laos',
  'Syrian Arab Republic': 'Syria',
  'State of Palestine': 'Palestine',
  'Micronesia (Federated States of)': 'Micronesia',
  'Timor-Leste': 'Timor-Leste',
};

export const useCountryDataStore = create<CountryDataStore>((set, get) => ({
  data: {},
  isLoading: false,
  isLoaded: false,

  fetchAllCountryData: async () => {
    if (get().isLoaded || get().isLoading) return;
    
    set({ isLoading: true });
    
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,population,area');
      const countries = await response.json();
      
      const dataMap: Record<string, CountryData> = {};
      
      for (const country of countries) {
        const commonName = country.name?.common || '';
        const officialName = country.name?.official || '';
        
        // Try to map to our country name
        let ourName = apiToOurName[commonName] || apiToOurName[officialName] || commonName;
        
        dataMap[ourName] = {
          population: country.population || 0,
          area: country.area || 0,
        };
        
        // Also store by common name if different
        if (commonName !== ourName) {
          dataMap[commonName] = {
            population: country.population || 0,
            area: country.area || 0,
          };
        }
      }
      
      set({ data: dataMap, isLoading: false, isLoaded: true });
    } catch (error) {
      console.error('Failed to fetch country data:', error);
      set({ isLoading: false });
    }
  },

  getPopulation: (countryName: string) => {
    const { data } = get();
    const mappedName = countryNameMapping[countryName] || countryName;
    return data[countryName]?.population || data[mappedName]?.population || 0;
  },

  getArea: (countryName: string) => {
    const { data } = get();
    const mappedName = countryNameMapping[countryName] || countryName;
    return data[countryName]?.area || data[mappedName]?.area || 0;
  },
}));

