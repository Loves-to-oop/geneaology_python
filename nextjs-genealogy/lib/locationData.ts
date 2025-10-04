export interface LocationInfo {
  name: string;
  country: string;
  region?: string;
  description: string;
  history?: string;
  coordinates?: { lat: number; lng: number };
}

// Historical information about key family locations
export const locationDescriptions: Record<string, LocationInfo> = {
  'Kolovec, West Bohemia, Czech Republic': {
    name: 'Kolovec',
    country: 'Czech Republic',
    region: 'West Bohemia',
    description: 'A small village in the West Bohemia region of the Czech Republic, the ancestral home of the Cozl and Maidl families.',
    history: 'Kolovec has a rich agricultural history dating back to medieval times. The region was known for its farming communities and traditional Bohemian culture. Many families from this area emigrated to America in the late 19th and early 20th centuries seeking better economic opportunities.',
  },
  'Madison, Illinois': {
    name: 'Madison',
    country: 'United States',
    region: 'Madison County, Illinois',
    description: 'A city in Madison County, Illinois, part of the Greater St. Louis metropolitan area.',
    history: 'Madison, Illinois became home to many Czech immigrants in the early 20th century. The area was known for its industrial opportunities, particularly in manufacturing and railroads, which attracted immigrant families seeking work.',
  },
  'Granite City, Illinois': {
    name: 'Granite City',
    country: 'United States',
    region: 'Madison County, Illinois',
    description: 'A city in Madison County, Illinois, known for its steel industry.',
    history: 'Granite City was founded in 1896 and became a major steel manufacturing center. It attracted many immigrant workers, including Czechs, Germans, and other Europeans who came to work in the steel mills and related industries.',
  },
  'Edwardsville, Illinois': {
    name: 'Edwardsville',
    country: 'United States',
    region: 'Madison County, Illinois',
    description: 'The county seat of Madison County, Illinois.',
    history: 'Edwardsville, established in 1813, served as an important administrative and commercial center for Madison County. Many immigrant families passed through or settled in Edwardsville as they established themselves in southwestern Illinois.',
  },
  'St. Louis, Missouri': {
    name: 'St. Louis',
    country: 'United States',
    region: 'Missouri',
    description: 'A major city on the Mississippi River, St. Louis was a key destination for European immigrants.',
    history: 'St. Louis served as a gateway to the American West and attracted waves of Czech and German immigrants in the 19th and 20th centuries. The city offered industrial jobs and established ethnic communities that helped new arrivals settle. This includes historic neighborhoods like Carondelet.',
  },
};

// Normalize location names for matching
export function normalizeLocation(location: string): string {
  return location
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,]/g, '') // Remove commas and periods
    .trim();
}

// Get canonical location name (preferred name for a location)
export function getCanonicalLocation(location: string): string {
  const normalized = normalizeLocation(location);

  // Map variations to canonical names
  const locationMappings: Record<string, string> = {
    // Madison City (specific city)
    'madison madison illinois usa': 'Madison, Illinois',
    'madison madison illinois': 'Madison, Illinois',
    'nameokia tow madison madison illinois usa': 'Madison, Illinois',

    // Granite City is separate from Madison
    'granite city madison illinois usa': 'Granite City, Illinois',
    'granite city illinois': 'Granite City, Illinois',

    // Edwardsville is separate from Madison (it's in Madison County)
    'edwardsville madison illinois usa': 'Edwardsville, Illinois',
    'edwardsville madison county illinois united states of america': 'Edwardsville, Illinois',
    'edwardsville madison illinois': 'Edwardsville, Illinois',

    // St. Louis variations
    'st louis missouri': 'St. Louis, Missouri',
    'st louis mo': 'St. Louis, Missouri',
    'saint louis missouri': 'St. Louis, Missouri',
    'carondelet st louis missouri': 'St. Louis, Missouri',
    'carondelet': 'St. Louis, Missouri',

    // Kolovec variations - keep full detail to avoid duplicates
    'kolovec west bohemia czech republic': 'Kolovec, West Bohemia, Czech Republic',

    // Illinois general
    'illinois': 'Illinois',
    'il': 'Illinois',

    // Missouri general
    'missouri': 'Missouri',
    'mo': 'Missouri',
  };

  // Check for exact normalized match first (most specific)
  if (locationMappings[normalized]) {
    return locationMappings[normalized];
  }

  // Return original if no mapping found
  return location;
}

// Get location info with fallback
export function getLocationInfo(location: string): LocationInfo | null {
  // Get canonical location first
  const canonical = getCanonicalLocation(location);

  // Try exact match with canonical name
  if (locationDescriptions[canonical]) {
    return locationDescriptions[canonical];
  }

  // Try normalized match
  const normalized = normalizeLocation(canonical);
  for (const [key, value] of Object.entries(locationDescriptions)) {
    if (normalizeLocation(key) === normalized) {
      return value;
    }
  }

  // Try partial match
  for (const [key, value] of Object.entries(locationDescriptions)) {
    if (normalizeLocation(key).includes(normalized) || normalized.includes(normalizeLocation(key))) {
      return value;
    }
  }

  // Return generic info if no match
  const parts = canonical.split(',').map(s => s.trim());
  return {
    name: parts[0] || canonical,
    country: parts[parts.length - 1] || 'Unknown',
    region: parts.length > 2 ? parts.slice(1, -1).join(', ') : undefined,
    description: `A location in the ${parts[parts.length - 1] || 'family history'}.`,
  };
}
