import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get flag image URL from FlagsAPI or Flagpedia
export function getFlagUrl(countryCode: string, size: 64 | 128 | 256 = 128): string {
  // Use Flagpedia for better quality flags
  const sizeMap: Record<number, string> = {
    64: 'w80',
    128: 'w160',
    256: 'w320',
  };

  return `https://flagcdn.com/${sizeMap[size]}/${countryCode.toLowerCase()}.png`;
}

// Get high resolution flag from Flagpedia
export function getFlagUrlHQ(countryCode: string): string {
  return `https://flagcdn.com/w640/${countryCode.toLowerCase()}.png`;
}

// Alternative: use REST Countries API flags (SVG)
export function getFlagSvgUrl(countryCode: string): string {
  return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
}

// Debounce function
export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}



