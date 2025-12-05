// Flag aspect ratios (width:height) based on official proportions
// Source: https://fr.wikipedia.org/wiki/Liste_des_drapeaux_nationaux_par_proportions

export type AspectRatioCategory = 'square' | 'wide' | 'standard' | 'long' | 'extra_long' | 'unique';

export interface FlagRatio {
  ratio: number; // width / height
  category: AspectRatioCategory;
  label: string;
}

// Standard ratios grouped by category
export const RATIO_CATEGORIES: Record<AspectRatioCategory, { min: number; max: number; label_en: string; label_fr: string }> = {
  square: { min: 0.9, max: 1.1, label_en: 'Square (1:1)', label_fr: 'Carré (1:1)' },
  standard: { min: 1.3, max: 1.4, label_en: 'Standard (4:3)', label_fr: 'Standard (4:3)' },
  wide: { min: 1.45, max: 1.55, label_en: 'Wide (3:2)', label_fr: 'Large (3:2)' },
  long: { min: 1.6, max: 1.75, label_en: 'Long (5:3)', label_fr: 'Long (5:3)' },
  extra_long: { min: 1.9, max: 2.1, label_en: 'Extra Long (2:1)', label_fr: 'Très long (2:1)' },
  unique: { min: 0, max: 10, label_en: 'Unique shape', label_fr: 'Forme unique' },
};

// Individual country flag ratios
// Most flags use 3:2 (1.5) ratio
export const FLAG_RATIOS: Record<string, FlagRatio> = {
  // Square flags (1:1)
  'Switzerland': { ratio: 1, category: 'square', label: '1:1' },
  'Vatican City': { ratio: 1, category: 'square', label: '1:1' },
  
  // Unique shape
  'Nepal': { ratio: 0.82, category: 'unique', label: '~4:5 (double pennon)' },
  
  // Standard 4:3 (~1.33)
  'Belgium': { ratio: 1.3, category: 'standard', label: '13:15' },
  'Monaco': { ratio: 1.25, category: 'standard', label: '4:5' },
  'San Marino': { ratio: 1.33, category: 'standard', label: '4:3' },
  
  // Wide 3:2 (1.5) - Most common
  'Afghanistan': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Albania': { ratio: 1.4, category: 'wide', label: '5:7' },
  'Algeria': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Andorra': { ratio: 1.43, category: 'wide', label: '7:10' },
  'Angola': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Antigua and Barbuda': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Argentina': { ratio: 1.6, category: 'long', label: '5:8' },
  'Armenia': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Australia': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Austria': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Azerbaijan': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Bahamas': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Bahrain': { ratio: 1.67, category: 'long', label: '3:5' },
  'Bangladesh': { ratio: 1.67, category: 'long', label: '3:5' },
  'Barbados': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Belarus': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Belize': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Benin': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Bhutan': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Bolivia': { ratio: 1.47, category: 'wide', label: '15:22' },
  'Bosnia and Herzegovina': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Botswana': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Brazil': { ratio: 1.43, category: 'wide', label: '7:10' },
  'Brunei': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Bulgaria': { ratio: 1.67, category: 'long', label: '3:5' },
  'Burkina Faso': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Burundi': { ratio: 1.67, category: 'long', label: '3:5' },
  'Cabo Verde': { ratio: 1.7, category: 'long', label: '10:17' },
  'Cambodia': { ratio: 1.56, category: 'wide', label: '16:25' },
  'Cameroon': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Canada': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Central African Republic': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Chad': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Chile': { ratio: 1.5, category: 'wide', label: '3:2' },
  'China': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Colombia': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Comoros': { ratio: 1.67, category: 'long', label: '3:5' },
  'Congo (Democratic Republic)': { ratio: 1.33, category: 'standard', label: '3:4' },
  'Congo (Republic)': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Costa Rica': { ratio: 1.67, category: 'long', label: '3:5' },
  'Côte d\'Ivoire': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Croatia': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Cuba': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Cyprus': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Czech Republic': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Denmark': { ratio: 1.32, category: 'standard', label: '28:37' },
  'Djibouti': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Dominica': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Dominican Republic': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Ecuador': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Egypt': { ratio: 1.5, category: 'wide', label: '3:2' },
  'El Salvador': { ratio: 1.71, category: 'long', label: '189:335' },
  'Equatorial Guinea': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Eritrea': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Estonia': { ratio: 1.57, category: 'wide', label: '7:11' },
  'Eswatini': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Ethiopia': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Fiji': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Finland': { ratio: 1.64, category: 'long', label: '11:18' },
  'France': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Gabon': { ratio: 1.33, category: 'standard', label: '3:4' },
  'Gambia': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Georgia': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Germany': { ratio: 1.67, category: 'long', label: '3:5' },
  'Ghana': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Greece': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Grenada': { ratio: 1.67, category: 'long', label: '3:5' },
  'Guatemala': { ratio: 1.6, category: 'long', label: '5:8' },
  'Guinea': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Guinea-Bissau': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Guyana': { ratio: 1.67, category: 'long', label: '3:5' },
  'Haiti': { ratio: 1.67, category: 'long', label: '3:5' },
  'Honduras': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Hungary': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Iceland': { ratio: 1.39, category: 'standard', label: '18:25' },
  'India': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Indonesia': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Iran': { ratio: 1.75, category: 'long', label: '4:7' },
  'Iraq': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Ireland': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Israel': { ratio: 1.38, category: 'standard', label: '8:11' },
  'Italy': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Jamaica': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Japan': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Jordan': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Kazakhstan': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Kenya': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Kiribati': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Kuwait': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Kyrgyzstan': { ratio: 1.67, category: 'long', label: '3:5' },
  'Laos': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Latvia': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Lebanon': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Lesotho': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Liberia': { ratio: 1.9, category: 'extra_long', label: '10:19' },
  'Libya': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Liechtenstein': { ratio: 1.67, category: 'long', label: '3:5' },
  'Lithuania': { ratio: 1.67, category: 'long', label: '3:5' },
  'Luxembourg': { ratio: 1.67, category: 'long', label: '3:5' },
  'Madagascar': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Malawi': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Malaysia': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Maldives': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Mali': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Malta': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Marshall Islands': { ratio: 1.9, category: 'extra_long', label: '10:19' },
  'Mauritania': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Mauritius': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Mexico': { ratio: 1.75, category: 'long', label: '4:7' },
  'Micronesia': { ratio: 1.9, category: 'extra_long', label: '10:19' },
  'Moldova': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Mongolia': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Montenegro': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Morocco': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Mozambique': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Myanmar': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Namibia': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Nauru': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Netherlands': { ratio: 1.5, category: 'wide', label: '3:2' },
  'New Zealand': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Nicaragua': { ratio: 1.67, category: 'long', label: '3:5' },
  'Niger': { ratio: 1.17, category: 'standard', label: '6:7' },
  'Nigeria': { ratio: 2, category: 'extra_long', label: '1:2' },
  'North Korea': { ratio: 2, category: 'extra_long', label: '1:2' },
  'North Macedonia': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Norway': { ratio: 1.38, category: 'standard', label: '8:11' },
  'Oman': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Pakistan': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Palau': { ratio: 1.6, category: 'long', label: '5:8' },
  'Panama': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Papua New Guinea': { ratio: 1.33, category: 'standard', label: '3:4' },
  'Paraguay': { ratio: 1.82, category: 'extra_long', label: '11:20' },
  'Peru': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Philippines': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Poland': { ratio: 1.6, category: 'long', label: '5:8' },
  'Portugal': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Qatar': { ratio: 2.55, category: 'unique', label: '11:28' },
  'Romania': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Russia': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Rwanda': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Saint Kitts and Nevis': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Saint Lucia': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Saint Vincent and the Grenadines': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Samoa': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Sao Tome and Principe': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Saudi Arabia': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Senegal': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Serbia': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Seychelles': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Sierra Leone': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Singapore': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Slovakia': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Slovenia': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Solomon Islands': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Somalia': { ratio: 1.5, category: 'wide', label: '3:2' },
  'South Africa': { ratio: 1.5, category: 'wide', label: '3:2' },
  'South Korea': { ratio: 1.5, category: 'wide', label: '3:2' },
  'South Sudan': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Spain': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Sri Lanka': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Sudan': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Suriname': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Sweden': { ratio: 1.6, category: 'long', label: '5:8' },
  'Syria': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Tajikistan': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Tanzania': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Thailand': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Timor-Leste': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Togo': { ratio: 1.62, category: 'long', label: 'Golden ratio' },
  'Tonga': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Trinidad and Tobago': { ratio: 1.67, category: 'long', label: '3:5' },
  'Tunisia': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Turkey': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Turkmenistan': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Tuvalu': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Uganda': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Ukraine': { ratio: 1.5, category: 'wide', label: '3:2' },
  'United Arab Emirates': { ratio: 2, category: 'extra_long', label: '1:2' },
  'United Kingdom': { ratio: 2, category: 'extra_long', label: '1:2' },
  'United States': { ratio: 1.9, category: 'extra_long', label: '10:19' },
  'Uruguay': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Uzbekistan': { ratio: 2, category: 'extra_long', label: '1:2' },
  'Vanuatu': { ratio: 1.67, category: 'long', label: '3:5' },
  'Venezuela': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Vietnam': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Yemen': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Zambia': { ratio: 1.5, category: 'wide', label: '3:2' },
  'Zimbabwe': { ratio: 2, category: 'extra_long', label: '1:2' },
};

// Get ratio for a country, default to 1.5 (3:2) if not found
export function getFlagRatio(countryName: string): FlagRatio {
  return FLAG_RATIOS[countryName] || { ratio: 1.5, category: 'wide', label: '3:2' };
}

// Get display dimensions for a flag that fits within a container
export function getFlagDisplaySize(
  countryName: string,
  containerWidth: number,
  containerHeight: number
): { width: number; height: number } {
  const { ratio } = getFlagRatio(countryName);
  
  // Calculate dimensions that fit within container while maintaining aspect ratio
  const widthFromHeight = containerHeight * ratio;
  const heightFromWidth = containerWidth / ratio;
  
  if (widthFromHeight <= containerWidth) {
    // Height is the limiting factor
    return { width: widthFromHeight, height: containerHeight };
  } else {
    // Width is the limiting factor
    return { width: containerWidth, height: heightFromWidth };
  }
}






