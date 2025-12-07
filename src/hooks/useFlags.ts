import { useMemo, useEffect } from 'react';
import flagsData from '../data/flags_en.json';
import translationsData from '../data/translations.json';
import { FLAG_RATIOS, type AspectRatioCategory } from '../data/flagRatios';
import taxonomy from '../data/taxonomy.json';
import type { FlagsData, ActiveFilter, FlagAttribute, Taxonomy, PatternColorFilter } from '../types';
import { useAppStore } from '../store/useAppStore';
import { useCountryDataStore } from '../store/countryDataStore';

const flags = flagsData as FlagsData;
const taxonomyData = taxonomy as Taxonomy;
const translations = translationsData as {
  countries: Record<string, { en: string; fr: string }>;
  continents: Record<string, { en: string; fr: string }>;
  ui: Record<string, { en: string; fr: string }>;
};

// Create reverse lookup maps for French to English country names
const frenchToEnglishCountry: Record<string, string> = {};
Object.entries(translations.countries).forEach(([enName, trans]) => {
  frenchToEnglishCountry[trans.fr.toLowerCase()] = enName;
});

// Keywords in French and English for element search
const elementKeywords: Record<string, string[]> = {
  // Stars
  'single_star': ['star', 'étoile', 'estrella'],
  'multiple_stars': ['stars', 'étoiles', 'estrellas'],
  'constellation': ['constellation', 'southern cross', 'croix du sud'],
  'stars_arc': ['arc', 'arc d\'étoiles'],
  'stars_circle': ['circle of stars', 'cercle d\'étoiles'],
  'star_of_david': ['star of david', 'étoile de david', 'david'],
  'pentagram': ['pentagram', 'pentagramme'],
  // Sun & Moon
  'sun': ['sun', 'soleil', 'sol'],
  'sun_of_may': ['sun of may', 'soleil de mai', 'sol de mayo'],
  'rising_sun': ['rising sun', 'soleil levant'],
  'crescent': ['crescent', 'croissant', 'moon', 'lune'],
  'moon': ['moon', 'lune', 'luna'],
  // Animals - Birds
  'eagle': ['eagle', 'aigle', 'águila'],
  'parrot': ['parrot', 'perroquet', 'sisserou'],
  'bird_of_paradise': ['bird of paradise', 'oiseau de paradis'],
  'crane': ['crane', 'grue'],
  'frigatebird': ['frigatebird', 'frégate'],
  'dove': ['dove', 'pigeon', 'colombe'],
  'condor': ['condor'],
  'quetzal': ['quetzal'],
  // Animals - Mammals
  'lion': ['lion', 'león'],
  'horse': ['horse', 'cheval', 'caballo'],
  'elephant': ['elephant', 'éléphant', 'elefante'],
  'cow_bull': ['cow', 'bull', 'cattle', 'vache', 'taureau', 'bétail', 'aurochs'],
  'dragon': ['dragon'],
  'serpent': ['serpent', 'snake', 'serpiente'],
  // Flora
  'cedar': ['cedar', 'cèdre', 'cedro'],
  'palm': ['palm', 'palmier', 'palma'],
  'olive': ['olive', 'olivier', 'olivo'],
  'maple_leaf': ['maple', 'érable', 'arce', 'feuille d\'érable'],
  'laurel': ['laurel', 'laurier'],
  'wheat': ['wheat', 'blé', 'trigo'],
  'cactus': ['cactus'],
  // Heraldry
  'coat_of_arms': ['coat of arms', 'armoiries', 'blason', 'escudo'],
  'crown': ['crown', 'couronne', 'corona'],
  'shield': ['shield', 'bouclier', 'escudo'],
  // Religious
  'christian_cross': ['cross', 'croix', 'cruz'],
  'crescent_star': ['crescent and star', 'croissant et étoile'],
  // Shapes
  'disk': ['disk', 'circle', 'disque', 'cercle', 'círculo'],
  'triangle': ['triangle', 'triángulo'],
  'diamond': ['diamond', 'losange', 'diamante'],
  // Layout
  'horizontal_triband': ['horizontal triband', 'tricolore horizontal', 'triband'],
  'vertical_triband': ['vertical triband', 'tricolore vertical'],
  'nordic_cross': ['nordic cross', 'croix nordique', 'scandinavian'],
  'union_jack': ['union jack', 'british'],
  // Colors (for keyword search)
  'red': ['red', 'rouge', 'rojo'],
  'blue': ['blue', 'bleu', 'azul'],
  'green': ['green', 'vert', 'verde'],
  'yellow': ['yellow', 'jaune', 'amarillo'],
  'white': ['white', 'blanc', 'blanco'],
  'black': ['black', 'noir', 'negro'],
  'orange': ['orange', 'naranja'],
  'gold': ['gold', 'or', 'doré', 'oro'],
  // Tools & Weapons
  'sword': ['sword', 'épée', 'espada'],
  'spear': ['spear', 'lance', 'lanza'],
  'anchor': ['anchor', 'ancre', 'ancla'],
  'gear': ['gear', 'cogwheel', 'engrenage'],
  // Other
  'motto': ['motto', 'devise', 'slogan', 'lema'],
  'arabic_script': ['arabic', 'arabe', 'árabe'],
  'ship': ['ship', 'boat', 'navire', 'bateau', 'barco'],
  'tower': ['tower', 'castle', 'tour', 'château', 'torre', 'castillo'],
};

// Extract all elements/symbols from flag attributes
function extractElements(attributes: FlagAttribute[]): string[] {
  const elements: string[] = [];

  attributes.forEach(attr => {
    if (attr.element && !attr.element.startsWith('color_')) {
      elements.push(attr.element.toLowerCase());
    }
    if (attr.type) {
      elements.push(attr.type.toLowerCase());
    }
    if (attr.includes) {
      elements.push(...attr.includes.map(e => e.toLowerCase()));
    }
  });

  return [...new Set(elements)];
}

// Count total stars on a flag
export function countStars(attributes: FlagAttribute[]): number {
  let total = 0;

  attributes.forEach(attr => {
    if (attr.element === 'single_star') {
      total += 1;
    }
    if (attr.element === 'multiple_stars') {
      total += attr.count || 2;
    }
    if (attr.element === 'constellation') {
      total += attr.count || 4;
    }
    if (attr.element === 'stars_arc') {
      total += attr.count || 5;
    }
    if (attr.element === 'stars_circle') {
      total += attr.count || 10;
    }
  });

  return total;
}

// Check if flag has constellation
function hasConstellation(attributes: FlagAttribute[]): boolean {
  return attributes.some(attr =>
    attr.element === 'constellation' ||
    attr.type === 'southern_cross' ||
    attr.type === 'commonwealth_star'
  );
}

// Get all element IDs in a subcategory
function getSubcategoryElements(subcategoryId: string): string[] {
  for (const category of taxonomyData.categories) {
    const sub = category.subcategories.find(s => s.id === subcategoryId);
    if (sub) {
      return sub.elements.map(e => e.id);
    }
  }
  return [];
}

// Get all subcategory IDs in a category
function getCategorySubcategories(categoryId: string): string[] {
  const category = taxonomyData.categories.find(c => c.id === categoryId);
  return category ? category.subcategories.map(s => s.id) : [];
}

// Map of color shades/nuances - defined early for use in matchesFilter
const colorFamilyMapping: Record<string, string[]> = {
  // Blue family - aquamarine, turquoise, teal, light_blue, navy all match "blue"
  'blue': ['blue', 'navy', 'azure', 'light_blue', 'cerulean', 'aquamarine', 'turquoise', 'teal', 'sky_blue', 'cobalt', 'indigo'],
  'light_blue': ['light_blue', 'azure', 'sky_blue', 'cerulean', 'aquamarine', 'turquoise', 'teal', 'blue'],
  'aquamarine': ['aquamarine', 'turquoise', 'teal', 'light_blue', 'blue'],

  // Red family - crimson, burgundy, scarlet match "red" (maroon is separate!)
  'red': ['red', 'crimson', 'burgundy', 'scarlet', 'vermilion', 'carmine'],
  // Maroon is its own family - NOT matched with red (for Sri Lanka, Qatar, etc.)
  'maroon': ['maroon'],

  // Yellow/gold family
  'yellow': ['yellow', 'gold', 'amber', 'golden'],
  'gold': ['gold', 'yellow', 'amber', 'golden'],

  // Green family
  'green': ['green', 'olive', 'lime', 'emerald', 'forest_green'],

  // Neutral colors
  'white': ['white', 'silver'],
  'black': ['black'],

  // Orange family
  'orange': ['orange', 'copper', 'tangerine'],
  'copper': ['copper', 'orange', 'bronze'],

  // Purple family
  'purple': ['purple', 'violet', 'magenta', 'lavender'],

  // Gray family
  'gray': ['gray', 'grey', 'silver'],
};

// Check if a flag color matches an expected color (handling nuances/shades)
function colorMatchesBasic(flagColor: string, expectedColor: string): boolean {
  const flagLower = flagColor.toLowerCase();
  const expectedLower = expectedColor.toLowerCase();

  // Direct match
  if (flagLower === expectedLower) return true;

  // Check if flagColor belongs to the same color family as expectedColor
  const expectedFamily = colorFamilyMapping[expectedLower];
  if (expectedFamily && expectedFamily.some(fc => flagLower === fc || flagLower.includes(fc) || fc.includes(flagLower))) {
    return true;
  }

  // Check reverse - if expectedColor belongs to the same family as flagColor
  const flagFamily = colorFamilyMapping[flagLower];
  if (flagFamily && flagFamily.some(ec => expectedLower === ec || expectedLower.includes(ec) || ec.includes(expectedLower))) {
    return true;
  }

  return false;
}

// Check if a flag matches a specific filter
function matchesFilter(countryName: string, countryData: FlagsData[string], filter: ActiveFilter): boolean {
  const { categoryId, elementId } = filter;
  const attributes = countryData.attributes;
  const elements = extractElements(attributes);
  const colors = countryData.colors || [];
  const colorCount = countryData.color_count || 0;
  const layout = countryData.layout || '';

  // ===== MAIN CATEGORY FILTER (all elements in category) =====
  if (categoryId === 'main_category') {
    const subcategoryIds = getCategorySubcategories(elementId);
    // Check if flag has any element from any subcategory of this category
    for (const subId of subcategoryIds) {
      const subElements = getSubcategoryElements(subId);
      for (const elemId of subElements) {
        if (matchesFilter(countryName, countryData, { categoryId: subId, elementId: elemId })) {
          return true;
        }
      }
    }
    return false;
  }

  // ===== SUBCATEGORY FILTER (all elements in subcategory) =====
  if (categoryId === 'subcategory') {
    const subElements = getSubcategoryElements(elementId);
    // Check if flag has any element from this subcategory
    for (const elemId of subElements) {
      // Find the correct category for this subcategory
      for (const cat of taxonomyData.categories) {
        const sub = cat.subcategories.find(s => s.id === elementId);
        if (sub) {
          if (matchesFilter(countryName, countryData, { categoryId: elementId, elementId: elemId })) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // ===== OTHER BANDS FILTER (non-triband layouts) =====
  if (categoryId === 'band_layouts' && elementId === 'other_bands') {
    const otherBandLayouts = [
      'horizontal_biband', 'vertical_biband', 'multiple_horizontal_stripes',
      'diagonal_division', 'diagonal_band'
    ];
    return otherBandLayouts.some(l => layout.toLowerCase().includes(l.toLowerCase())) ||
      elements.some(e => otherBandLayouts.some(l => e.toLowerCase().includes(l.toLowerCase())));
  }

  // ===== STAR COUNT FILTER =====
  if (categoryId === 'star_count') {
    const starCount = countStars(attributes);
    switch (elementId) {
      case '0_stars': return starCount === 0;
      case '1_star': return starCount === 1;
      case '2_stars': return starCount === 2;
      case '3_stars': return starCount === 3;
      case '4_stars': return starCount === 4;
      case '5_stars': return starCount === 5;
      case '6plus_stars': return starCount >= 6;
      case '10plus_stars': return starCount >= 10;
      case '50plus_stars': return starCount >= 50;
      default: return false;
    }
  }

  // ===== CONTINENTS =====
  if (categoryId === 'continents' || categoryId === 'regions') {
    return countryData.continent === elementId;
  }

  // ===== COLORS =====
  if (categoryId === 'colors' || categoryId === 'primary_colors' || categoryId === 'secondary_colors') {
    // Use colorMatchesBasic for inclusive mode (OR) - handles color nuances
    return colors.some(c => colorMatchesBasic(c, elementId));
  }

  // ===== COLOR COUNT =====
  if (categoryId === 'color_count' || categoryId === 'colors_quantity') {
    switch (elementId) {
      case '2_colors': return colorCount === 2;
      case '3_colors': return colorCount === 3;
      case '4_colors': return colorCount === 4;
      case '5_colors': return colorCount === 5;
      case '6plus_colors': return colorCount >= 6;
      default: return false;
    }
  }

  // ===== FLAG LAYOUT/SHAPE =====
  if (categoryId === 'flag_shape' || categoryId === 'band_layouts' ||
    categoryId === 'cross_layouts' || categoryId === 'special_layouts' || categoryId === 'unique_shapes') {
    const layoutMappings: Record<string, string[]> = {
      'horizontal_triband': ['horizontal_triband'],
      'vertical_triband': ['vertical_triband'],
      'horizontal_biband': ['horizontal_biband'],
      'vertical_biband': ['vertical_biband'],
      'multiple_horizontal_stripes': ['multiple_horizontal_stripes'],
      'diagonal_division': ['diagonal_division'],
      'diagonal_band': ['diagonal_band'],
      'cross': ['cross', 'greek_cross'],
      'nordic_cross': ['nordic_cross'],
      'saltire': ['saltire'],
      'greek_cross': ['greek_cross'],
      'canton': ['canton'],
      'union_jack': ['union_jack'],
      'quartered': ['quartered'],
      'y_shape': ['y_shape'],
      'triangle_hoist': ['triangle_hoist'],
      'plain_field': ['plain_field'],
      'seychelles_rays': ['seychelles_rays'],
      'non_rectangular': ['non_rectangular'],
      'serrated': ['serrated']
    };

    const mappedLayouts = layoutMappings[elementId] || [elementId];

    if (mappedLayouts.some(m => layout.toLowerCase().includes(m.toLowerCase()))) {
      return true;
    }

    return elements.some(e =>
      mappedLayouts.some(m => e.toLowerCase().includes(m.toLowerCase()))
    );
  }

  // ===== GEOMETRIC ELEMENTS =====
  if (categoryId === 'geometric' || categoryId === 'shapes') {
    const shapeMappings: Record<string, string[]> = {
      'disk': ['disk', 'disc', 'circle'],
      'triangle': ['triangle', 'triangle_hoist'],
      'diamond': ['diamond', 'lozenge'],
      'rectangle': ['rectangle', 'square'],
      'border': ['border', 'bordure'],
      'fimbriation': ['fimbriation', 'fimbriated']
    };

    const mappedShapes = shapeMappings[elementId] || [elementId];
    return elements.some(e =>
      mappedShapes.some(m => e.toLowerCase().includes(m.toLowerCase()))
    );
  }

  // ===== PROPORTIONS =====
  if (categoryId === 'proportions' || categoryId === 'ratios') {
    const countryRatio = FLAG_RATIOS[countryName];
    if (!countryRatio) return elementId === 'wide';
    return countryRatio.category === elementId as AspectRatioCategory;
  }

  // ===== CELESTIAL - STARS =====
  if (categoryId === 'celestial' || categoryId === 'stars') {
    if (elementId === 'single_star') {
      return elements.includes('single_star') && !hasConstellation(attributes);
    }

    if (elementId === 'multiple_stars') {
      return elements.includes('multiple_stars') && !hasConstellation(attributes);
    }

    if (elementId === 'constellation') {
      return hasConstellation(attributes) || elements.includes('constellation');
    }

    if (elementId === 'stars_arc') {
      return elements.includes('stars_arc');
    }

    if (elementId === 'stars_circle') {
      return elements.includes('stars_circle');
    }

    // Star of David is ONLY in religious category, not celestial
    if (elementId === 'star_of_david') {
      return false; // Not in celestial
    }

    if (elementId === 'pentagram') {
      return elements.includes('pentagram');
    }
  }

  // ===== CELESTIAL - SUN & MOON =====
  if (categoryId === 'celestial' || categoryId === 'sun_moon') {
    if (elementId === 'sun') {
      return elements.some(e => e === 'sun' || e === 'rising_sun');
    }
    if (elementId === 'sun_of_may') {
      return elements.includes('sun_of_may');
    }
    if (elementId === 'rising_sun') {
      return elements.includes('rising_sun');
    }
    if (elementId === 'crescent') {
      return elements.includes('crescent') || elements.includes('crescent_star');
    }
    if (elementId === 'moon') {
      return elements.includes('moon');
    }
  }

  // ===== ANIMALS =====
  if (categoryId === 'animals' || categoryId === 'birds' ||
    categoryId === 'mammals' || categoryId === 'reptiles_fish' || categoryId === 'mythical') {
    const animalMappings: Record<string, string[]> = {
      'eagle': ['eagle', 'double_headed_eagle'],
      'double_headed_eagle': ['double_headed_eagle', 'double_headed'],
      'parrot': ['parrot', 'sisserou'],
      'bird_of_paradise': ['bird_of_paradise'],
      'crane': ['crane', 'grey_crowned_crane'],
      'frigatebird': ['frigatebird'],
      'dove': ['dove', 'pigeon'],
      'condor': ['condor'],
      'other_bird': ['bird', 'crane', 'frigatebird', 'zimbabwe_bird', 'quetzal'],
      'lion': ['lion'],
      'horse': ['horse'],
      'elephant': ['elephant'],
      'cow_bull': ['cow', 'bull', 'aurochs', 'cattle'],
      'boar': ['boar', 'boars_tusk'],
      'kangaroo': ['kangaroo'],
      'leopard': ['leopard', 'jaguar'],
      'serpent': ['serpent', 'snake'],
      'dragon': ['dragon'],
      'crocodile': ['crocodile', 'alligator'],
      'fish': ['fish'],
      'dolphin': ['dolphin'],
      'turtle': ['turtle'],
      'phoenix': ['phoenix'],
      'griffin': ['griffin'],
      'quetzal': ['quetzal']
    };

    const mappedAnimals = animalMappings[elementId] || [elementId];
    return elements.some(e =>
      mappedAnimals.some(m => e.toLowerCase().includes(m.toLowerCase()))
    );
  }

  // ===== FLORA =====
  if (categoryId === 'flora' || categoryId === 'trees' || categoryId === 'leaves_flowers') {
    const floraMappings: Record<string, string[]> = {
      'cedar': ['cedar'],
      'palm': ['palm'],
      'olive': ['olive', 'olive_branch'],
      'banana_tree': ['banana_tree', 'banana'],
      'baobab': ['baobab'],
      'cotton': ['cotton'],
      'mahogany': ['mahogany'],
      'maple_leaf': ['maple_leaf'],
      'laurel': ['laurel', 'wreath'],
      'olive_branch': ['olive', 'olive_branch'],
      'wheat': ['wheat', 'grain'],
      'nutmeg': ['nutmeg'],
      'cactus': ['cactus', 'prickly_pear'],
      'lotus': ['lotus']
    };

    const mappedFlora = floraMappings[elementId] || [elementId];
    return elements.some(e =>
      mappedFlora.some(m => e.toLowerCase().includes(m.toLowerCase()))
    );
  }

  // ===== WEAPONS & TOOLS =====
  if (categoryId === 'weapons' || categoryId === 'bladed' ||
    categoryId === 'ranged' || categoryId === 'defensive' || categoryId === 'tools') {
    const weaponMappings: Record<string, string[]> = {
      'sword': ['sword'],
      'sabre': ['sabre'],
      'khanjar': ['khanjar'],
      'machete': ['machete'],
      'bayonet': ['bayonet'],
      'halberd': ['halberd'],
      'rifle': ['rifle', 'gun'],
      'cannon': ['cannon'],
      'bow_arrow': ['bow', 'arrow'],
      'spear': ['spear', 'lance'],
      'shield': ['shield', 'maasai'],
      'helmet': ['helmet'],
      'armor': ['armor'],
      'axe': ['axe'],
      'hoe': ['hoe'],
      'pickaxe': ['pickaxe'],
      'saw': ['saw'],
      'hammer': ['hammer'],
      'gear': ['gear', 'cogwheel'],
      'anchor': ['anchor'],
      'trident': ['trident']
    };

    const mappedWeapons = weaponMappings[elementId] || [elementId];
    return elements.some(e =>
      mappedWeapons.some(m => e.toLowerCase().includes(m.toLowerCase()))
    );
  }

  // ===== HUMAN FIGURES =====
  if (categoryId === 'human' || categoryId === 'people') {
    const humanMappings: Record<string, string[]> = {
      'human_figure': ['human_figure', 'human', 'figure'],
      'worker': ['worker', 'laborer'],
      'warrior': ['warrior', 'soldier'],
      'supporters': ['supporters', 'human_figure'],
      'hands': ['hands', 'hand'],
      'phrygian_cap': ['phrygian_cap', 'liberty_cap', 'bonnet']
    };

    const mappedHuman = humanMappings[elementId] || [elementId];
    return elements.some(e =>
      mappedHuman.some(m => e.toLowerCase().includes(m.toLowerCase()))
    );
  }

  // ===== MARITIME =====
  if (categoryId === 'maritime' || categoryId === 'vessels' || categoryId === 'water_elements') {
    const maritimeMappings: Record<string, string[]> = {
      'ship': ['ship', 'boat'],
      'canoe': ['canoe', 'pirogue'],
      'dhow': ['dhow'],
      'waves': ['waves'],
      'sea': ['sea', 'ocean'],
      'river': ['river']
    };

    const mappedMaritime = maritimeMappings[elementId] || [elementId];
    return elements.some(e =>
      mappedMaritime.some(m => e.toLowerCase().includes(m.toLowerCase()))
    );
  }

  // ===== ARCHITECTURE =====
  if (categoryId === 'architecture' || categoryId === 'buildings' || categoryId === 'monuments') {
    const archMappings: Record<string, string[]> = {
      'castle': ['castle', 'fortress'],
      'temple': ['temple'],
      'angkor_wat': ['angkor_wat'],
      'mosque': ['mosque'],
      'tower': ['tower'],
      'pyramid': ['pyramid'],
      'monument': ['monument'],
      'column': ['column', 'pillar']
    };

    const mappedArch = archMappings[elementId] || [elementId];
    return elements.some(e =>
      mappedArch.some(m => e.toLowerCase().includes(m.toLowerCase()))
    );
  }

  // ===== HERALDRY =====
  if (categoryId === 'heraldry' || categoryId === 'heraldic_elements') {
    const heraldryMappings: Record<string, string[]> = {
      'coat_of_arms': ['coat_of_arms', 'emblem'],
      'crown': ['crown', 'tiara'],
      'crest': ['crest'],
      'scepter': ['scepter'],
      'papal_keys': ['papal_keys'],
      'orb': ['orb']
    };

    const mappedHeraldry = heraldryMappings[elementId] || [elementId];
    return elements.some(e =>
      mappedHeraldry.some(m => e.toLowerCase().includes(m.toLowerCase()))
    );
  }

  // ===== RELIGIOUS SYMBOLS =====
  if (categoryId === 'religious' || categoryId === 'crosses' ||
    categoryId === 'islamic' || categoryId === 'other_religious') {
    const religiousMappings: Record<string, string[]> = {
      'christian_cross': ['christian_cross', 'george_cross'],
      'orthodox_cross': ['orthodox_cross'],
      'george_cross': ['george_cross'],
      'shahada': ['shahada'],
      'takbir': ['takbir'],
      'crescent_star': ['crescent_star'],
      'star_of_david': ['star_of_david'],
      'dharma_wheel': ['dharma_wheel', 'chakra', 'ashoka'],
      'menorah': ['menorah']
    };

    const mappedReligious = religiousMappings[elementId] || [elementId];
    return elements.some(e =>
      mappedReligious.some(m => e.toLowerCase().includes(m.toLowerCase()))
    );
  }

  // ===== TEXT & INSCRIPTIONS =====
  if (categoryId === 'text' || categoryId === 'inscriptions') {
    const textMappings: Record<string, string[]> = {
      'arabic_script': ['arabic_script', 'shahada', 'takbir'],
      'latin_script': ['latin_script', 'banner_text', 'motto'],
      'motto': ['motto', 'banner_text'],
      'banner_text': ['banner_text', 'motto']
    };

    const mappedText = textMappings[elementId] || [elementId];
    return elements.some(e =>
      mappedText.some(m => e.toLowerCase().includes(m.toLowerCase()))
    );
  }

  // ===== LOCAL & CULTURAL SYMBOLS =====
  if (categoryId === 'local_symbols' || categoryId === 'asian' ||
    categoryId === 'african' || categoryId === 'european' || categoryId === 'other_symbols') {
    const localMappings: Record<string, string[]> = {
      'taeguk': ['taeguk'],
      'trigrams': ['trigrams'],
      'soyombo': ['soyombo'],
      'tunduk': ['tunduk'],
      'chakra': ['chakra', 'ashoka'],
      'folk_pattern': ['folk_pattern', 'carpet_pattern'],
      'mokorotlo': ['mokorotlo'],
      'zimbabwe_bird': ['zimbabwe_bird'],
      'kente': ['kente'],
      'georgian_crosses': ['georgian_crosses', 'bolnisi_cross'],
      'bolnisi_cross': ['bolnisi_cross'],
      'map_silhouette': ['map_silhouette'],
      'armillary_sphere': ['armillary_sphere'],
      'boars_tusk': ['boars_tusk'],
      'book': ['book'],
      'flag': ['flag']
    };

    const mappedLocal = localMappings[elementId] || [elementId];
    return elements.some(e =>
      mappedLocal.some(m => e.toLowerCase().includes(m.toLowerCase()))
    );
  }

  // ===== DIRECT ELEMENT MATCH (element filter from tags) =====
  if (categoryId === 'elements') {
    return elements.some(e =>
      e === elementId ||
      e.toLowerCase().includes(elementId.toLowerCase()) ||
      elementId.toLowerCase().includes(e.toLowerCase())
    );
  }

  // Default: try direct match
  return elements.some(e =>
    e === elementId ||
    e.toLowerCase().includes(elementId.toLowerCase()) ||
    elementId.toLowerCase().includes(e.toLowerCase())
  );
}

// Check if a search query matches flag elements/keywords
function matchesKeyword(countryData: FlagsData[string], query: string): boolean {
  const elements = extractElements(countryData.attributes);
  const colors = countryData.colors || [];

  // Check against element keywords
  for (const [elementId, keywords] of Object.entries(elementKeywords)) {
    if (keywords.some(kw => kw.toLowerCase().includes(query) || query.includes(kw.toLowerCase()))) {
      // Check if this country has this element
      if (elements.includes(elementId.toLowerCase())) {
        return true;
      }
      // Special check for colors
      if (colors.some(c => c.toLowerCase() === elementId.toLowerCase())) {
        return true;
      }
    }
  }

  // Direct element match
  if (elements.some(e => e.toLowerCase().includes(query))) {
    return true;
  }

  // Direct color match
  if (colors.some(c => c.toLowerCase().includes(query))) {
    return true;
  }

  // Check for motto text if searching for specific text
  const mottoAttr = countryData.attributes.find(a => a.element === 'motto' || a.element === 'banner_text');
  if (mottoAttr && mottoAttr.text && mottoAttr.text.toLowerCase().includes(query)) {
    return true;
  }

  return false;
}

// Check if a flag matches the exclusive color mode (only these colors, no others)
function matchesExclusiveColors(countryData: FlagsData[string], selectedColors: string[]): boolean {
  const flagColors = countryData.colors || [];

  // Flag must have exactly the selected colors (or subset of them)
  // Uses colorMatchesBasic to handle color nuances (aquamarine = blue, etc.)
  return flagColors.every(color =>
    selectedColors.some(sc => colorMatchesBasic(color, sc))
  );
}

// Extract band colors from flag data for strict position matching
function extractBandColors(countryData: FlagsData[string], schemaId: string): (string | null)[] {
  const colors = countryData.colors || [];
  const attributes = countryData.attributes;

  // PRIORITY 1: Use explicit band_colors if defined (most accurate)
  if (countryData.band_colors && countryData.band_colors.length > 0) {
    return countryData.band_colors;
  }

  // PRIORITY 2: Try to extract colors from band attribute if specified
  const bandAttr = attributes.find(a =>
    a.element === 'horizontal_triband' ||
    a.element === 'vertical_triband' ||
    a.element === 'horizontal_biband' ||
    a.element === 'vertical_biband'
  );

  if (bandAttr && bandAttr.colors && bandAttr.colors.length > 0) {
    return bandAttr.colors;
  }

  // PRIORITY 3: For tribands with exactly 2 colors, assume A/B/A pattern
  if ((schemaId === 'vertical_triband' || schemaId === 'horizontal_triband') && colors.length === 2) {
    return [colors[0], colors[1], colors[0]];
  }

  // PRIORITY 4: For tribands with 3+ colors, use first 3
  if ((schemaId === 'vertical_triband' || schemaId === 'horizontal_triband') && colors.length >= 3) {
    return [colors[0], colors[1], colors[2]];
  }

  // PRIORITY 5: For bibands, use first 2 colors
  if ((schemaId === 'vertical_biband' || schemaId === 'horizontal_biband') && colors.length >= 2) {
    return [colors[0], colors[1]];
  }

  return colors;
}

// Check if a color matches (considering similar colors) - handles null for pattern matching
function colorMatches(flagColor: string | null, expectedColor: string): boolean {
  if (!flagColor) return false;
  return colorMatchesBasic(flagColor, expectedColor);
}

// Check if a flag matches pattern color filter with STRICT position matching
function matchesPatternColors(countryData: FlagsData[string], patternColorFilter: PatternColorFilter): boolean {
  if (!patternColorFilter.schemaId) return true;

  const schemaId = patternColorFilter.schemaId;
  const layout = countryData.layout || '';
  const attributes = countryData.attributes;

  // For special layouts (diagonal, nordic_cross, canton) - no color matching needed
  if (['diagonal_division', 'nordic_cross', 'canton'].includes(schemaId)) {
    // Just check layout
    if (schemaId === 'diagonal_division') {
      // Check if flag has diagonal layout or diagonal attributes
      return layout.toLowerCase().includes('diagonal') ||
        attributes.some(a => a.element === 'diagonal_division' || a.element === 'diagonal_band');
    }
    return layout.toLowerCase().includes(schemaId.toLowerCase());
  }

  // Check if the flag has the correct layout
  if (!layout.toLowerCase().includes(schemaId.toLowerCase())) {
    return false;
  }

  // Get band colors from flag data
  const bandColors = extractBandColors(countryData, schemaId);

  // If no colors are selected in the filter, just check layout
  const hasSelectedColors = patternColorFilter.colors.some(c => c !== null);
  if (!hasSelectedColors) return true;

  // STRICT POSITION MATCHING
  // Check each band position where a color is selected
  for (let i = 0; i < patternColorFilter.colors.length; i++) {
    const expectedColor = patternColorFilter.colors[i];

    // null = "any color" - skip this position
    if (expectedColor === null) continue;

    // Get the flag's color at this position
    const flagColorAtPosition = bandColors[i];

    // If flag doesn't have enough colors for this position, no match
    if (!flagColorAtPosition) return false;

    // Check if colors match at this position
    if (!colorMatches(flagColorAtPosition, expectedColor)) {
      return false;
    }
  }

  return true;
}

// Check if flag has a symbol/coat of arms
function hasSymbolOrCoatOfArms(countryData: FlagsData[string]): boolean {
  const elements = countryData.attributes.map(a => a.element?.toLowerCase() || '');
  const symbolElements = [
    'coat_of_arms', 'emblem', 'seal', 'shield', 'crest',
    'eagle', 'lion', 'bird', 'dragon', 'serpent',
    'sun', 'star', 'single_star', 'multiple_stars',
    'crown', 'sword', 'spear', 'anchor',
    'chakra', 'taeguk', 'soyombo', 'tunduk',
    'christian_cross', 'crescent_star', 'crescent',
    'human_figure', 'supporters'
  ];

  return elements.some(e => symbolElements.some(s => e.includes(s)));
}

// Check if flag matches pattern filter including requireSymbol
function matchesPatternFilter(countryData: FlagsData[string], patternColorFilter: PatternColorFilter): boolean {
  // First check pattern colors
  if (!matchesPatternColors(countryData, patternColorFilter)) {
    return false;
  }

  // Then check symbol requirement
  if (patternColorFilter.requireSymbol) {
    return hasSymbolOrCoatOfArms(countryData);
  }

  return true;
}

// Region/culture mappings for special filters
const cultureRegionMappings: Record<string, string[]> = {
  'central_america': ['Belize', 'Costa Rica', 'El Salvador', 'Guatemala', 'Honduras', 'Nicaragua', 'Panama'],
  'caribbean': ['Antigua and Barbuda', 'Bahamas', 'Barbados', 'Cuba', 'Dominica', 'Dominican Republic', 'Grenada', 'Haiti', 'Jamaica', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Trinidad and Tobago'],
  'scandinavia': ['Denmark', 'Finland', 'Iceland', 'Norway', 'Sweden'],
};

// Pan-color scheme country lists (only specified countries)
const panColorCountries: Record<string, string[]> = {
  'pan_slavic': [
    'Russia', 'Serbia', 'Slovenia', 'Slovakia', 'Croatia', 'Bulgaria', 'Czech Republic'
  ],
  'pan_african': [
    'Grenada', 'Guyana', 'Saint Kitts and Nevis', 'Suriname', 'Mauritania', 'Mali',
    'Senegal', 'Guinea', 'Cameroon', 'Ethiopia', 'Ghana', 'Congo (Republic)',
    'Sao Tome and Principe', 'Burkina Faso', 'Benin', 'Togo', 'Guinea-Bissau'
  ],
  'pan_arab': [
    'Palestine', 'Yemen', 'Egypt', 'Syria', 'Iraq', 'Libya',
    'Sudan', 'Jordan', 'United Arab Emirates', 'Kuwait'
  ],
  'communist': [
    'China', 'North Korea', 'Cuba', 'Laos', 'Vietnam'
  ],
};

function matchesCultureRegion(countryName: string, regionId: string): boolean {
  const countries = cultureRegionMappings[regionId];
  if (countries) {
    return countries.includes(countryName);
  }
  return false;
}

function matchesPanColorScheme(countryName: string, schemeId: string): boolean {
  const countries = panColorCountries[schemeId];
  if (!countries) return false;
  return countries.includes(countryName);
}

export function useFlags(activeFilters: ActiveFilter[], searchQuery: string, sortBy: string = 'name_asc') {
  const { colorFilterMode, patternColorFilter, language } = useAppStore();
  const { fetchAllCountryData, getPopulation, getArea, isLoaded } = useCountryDataStore();

  // Fetch country data on first use
  useEffect(() => {
    fetchAllCountryData();
  }, [fetchAllCountryData]);

  // Helper to get display name in current language
  const getDisplayName = (countryName: string): string => {
    const trans = translations.countries[countryName];
    if (trans) {
      return language === 'fr' ? trans.fr : trans.en;
    }
    return countryName;
  };

  const filteredFlags = useMemo(() => {
    let result = Object.entries(flags);

    // Apply search filter (country name in EN/FR + keyword search)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(([countryName, countryData]) => {
        // Match English country name
        if (countryName.toLowerCase().includes(query)) {
          return true;
        }

        // Match French country name
        const countryTrans = translations.countries[countryName];
        if (countryTrans && countryTrans.fr.toLowerCase().includes(query)) {
          return true;
        }

        // Match by keywords (elements, colors, etc.)
        if (matchesKeyword(countryData, query)) {
          return true;
        }

        return false;
      });
    }

    // Apply color filter mode (OR / AND / NOT)
    const colorFilters = activeFilters.filter(f =>
      f.categoryId === 'primary_colors' || f.categoryId === 'secondary_colors'
    );

    if (colorFilters.length > 0) {
      const selectedColors = colorFilters.map(f => f.elementId);

      if (colorFilterMode === 'and') {
        // Exclusive mode: flag must have ONLY these colors (no others)
        result = result.filter(([, countryData]) =>
          matchesExclusiveColors(countryData, selectedColors)
        );
      } else if (colorFilterMode === 'not') {
        // Exclusion mode: flag must NOT have any of these colors (including shades/nuances)
        result = result.filter(([, countryData]) => {
          const flagColors = countryData.colors || [];
          // Use colorMatches to detect color nuances (aquamarine = blue, maroon = red, etc.)
          return !flagColors.some(fc =>
            selectedColors.some(sc => colorMatches(fc, sc))
          );
        });
      }
      // 'or' mode is handled by the normal activeFilters logic below
    }

    // Apply pattern color filter (includes strict position matching and symbol requirement)
    if (patternColorFilter.schemaId) {
      result = result.filter(([countryName, countryData]) => {
        // Special handling for diagonal division with specific countries
        if (patternColorFilter.schemaId === 'diagonal_division') {
          const diagonalCountries = [
            'Seychelles', 'Democratic Republic of the Congo', 'Saint Kitts and Nevis',
            'Brunei', 'Marshall Islands', 'Trinidad and Tobago', 'Namibia', 'Tanzania',
            'Bosnia and Herzegovina', 'Bhutan', 'Republic of the Congo', 'Philippines'
          ];
          const layout = countryData.layout || '';
          const isDiagonal = diagonalCountries.includes(countryName) ||
            layout.toLowerCase().includes('diagonal');

          // If requireSymbol is on, also check for symbol
          if (patternColorFilter.requireSymbol && isDiagonal) {
            return hasSymbolOrCoatOfArms(countryData);
          }
          return isDiagonal;
        }

        return matchesPatternFilter(countryData, patternColorFilter);
      });
    }

    // Apply attribute filters (AND logic)
    // Exclude color filters if they were already processed by colorFilterMode (and/not)
    const filtersToApply = colorFilterMode === 'or'
      ? activeFilters
      : activeFilters.filter(f => f.categoryId !== 'primary_colors' && f.categoryId !== 'secondary_colors');

    if (filtersToApply.length > 0) {
      result = result.filter(([countryName, countryData]) =>
        filtersToApply.every(filter => {
          // Handle culture region filters
          if (filter.categoryId === 'culture_regions') {
            return matchesCultureRegion(countryName, filter.elementId);
          }
          // Handle pan color scheme filters
          if (filter.categoryId === 'color_schemes') {
            return matchesPanColorScheme(countryName, filter.elementId);
          }
          return matchesFilter(countryName, countryData, filter);
        })
      );
    }

    // Apply sorting - language-aware for names, use store data for population/area
    switch (sortBy) {
      case 'name_asc':
        result.sort(([aName], [bName]) => {
          const aDisplay = getDisplayName(aName);
          const bDisplay = getDisplayName(bName);
          return aDisplay.localeCompare(bDisplay, language === 'fr' ? 'fr' : 'en');
        });
        break;
      case 'name_desc':
        result.sort(([aName], [bName]) => {
          const aDisplay = getDisplayName(aName);
          const bDisplay = getDisplayName(bName);
          return bDisplay.localeCompare(aDisplay, language === 'fr' ? 'fr' : 'en');
        });
        break;
      case 'population_desc':
        // Use data from RestCountries API (fetched via countryDataStore)
        result.sort(([aName], [bName]) => {
          return getPopulation(bName) - getPopulation(aName);
        });
        break;
      case 'population_asc':
        result.sort(([aName], [bName]) => {
          return getPopulation(aName) - getPopulation(bName);
        });
        break;
      case 'area_desc':
        // Use data from RestCountries API (fetched via countryDataStore)
        result.sort(([aName], [bName]) => {
          return getArea(bName) - getArea(aName);
        });
        break;
      case 'area_asc':
        result.sort(([aName], [bName]) => {
          return getArea(aName) - getArea(bName);
        });
        break;
      default:
        result.sort(([aName], [bName]) => {
          const aDisplay = getDisplayName(aName);
          const bDisplay = getDisplayName(bName);
          return aDisplay.localeCompare(bDisplay, language === 'fr' ? 'fr' : 'en');
        });
        break;
    }

    return result;
  }, [activeFilters, searchQuery, sortBy, colorFilterMode, patternColorFilter, language, getDisplayName, getPopulation, getArea, isLoaded]);

  // Get all countries for availability checking
  const allCountries = useMemo(() => Object.entries(flags), []);

  // Check which filter elements would result in matches
  const getAvailableFilters = useMemo(() => {
    return (categoryId: string, elementId: string): boolean => {
      const testFilter: ActiveFilter = { categoryId, elementId };

      // Check if this exact filter is already active
      const isAlreadyActive = activeFilters.some(
        f => f.categoryId === categoryId && f.elementId === elementId
      );

      if (isAlreadyActive) return true;

      // Check if adding this filter would result in any matches
      const wouldMatch = filteredFlags.some(([countryName, countryData]) =>
        matchesFilter(countryName, countryData, testFilter)
      );

      return wouldMatch;
    };
  }, [activeFilters, filteredFlags]);

  // Check if a whole category has any matches
  const checkCategoryHasMatches = useMemo(() => {
    return (categoryId: string): boolean => {
      const category = taxonomyData.categories.find(c => c.id === categoryId);
      if (!category) return false;

      return category.subcategories.some(sub =>
        sub.elements.some(elem =>
          getAvailableFilters(sub.id, elem.id)
        )
      );
    };
  }, [getAvailableFilters]);

  // Check if a subcategory has any matches
  const checkSubcategoryHasMatches = useMemo(() => {
    return (subcategoryId: string): boolean => {
      for (const category of taxonomyData.categories) {
        const sub = category.subcategories.find(s => s.id === subcategoryId);
        if (sub) {
          return sub.elements.some(elem =>
            getAvailableFilters(sub.id, elem.id)
          );
        }
      }
      return false;
    };
  }, [getAvailableFilters]);

  return {
    flags: filteredFlags,
    totalCount: allCountries.length,
    filteredCount: filteredFlags.length,
    getAvailableFilters,
    checkCategoryHasMatches,
    checkSubcategoryHasMatches,
  };
}

export function useAllFlags() {
  return useMemo(() => Object.entries(flags), []);
}

export function getFlagByCountry(countryName: string) {
  return flags[countryName];
}

// Export for use in element extraction
export function getFlagElements(countryName: string): string[] {
  const flagData = flags[countryName];
  if (!flagData) return [];
  return extractElements(flagData.attributes);
}

// Get flag colors
export function getFlagColors(countryName: string): string[] {
  const flagData = flags[countryName];
  return flagData?.colors || [];
}

// Get flag color count
export function getFlagColorCount(countryName: string): number {
  const flagData = flags[countryName];
  return flagData?.color_count || 0;
}

// Get star count for a country
export function getFlagStarCount(countryName: string): number {
  const flagData = flags[countryName];
  if (!flagData) return 0;
  return countStars(flagData.attributes);
}
