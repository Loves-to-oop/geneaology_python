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
  'Madison, Madison, Illinois': {
    name: 'Madison',
    country: 'United States',
    region: 'Illinois',
    description: 'A city in Madison County, Illinois, part of the Greater St. Louis metropolitan area.',
    history: 'Madison, Illinois became home to many Czech immigrants in the early 20th century. The area was known for its industrial opportunities, particularly in manufacturing and railroads, which attracted immigrant families seeking work.',
  },
  'St Louis, Missouri': {
    name: 'St. Louis',
    country: 'United States',
    region: 'Missouri',
    description: 'A major city on the Mississippi River, St. Louis was a key destination for European immigrants.',
    history: 'St. Louis served as a gateway to the American West and attracted waves of Czech and German immigrants in the 19th and 20th centuries. The city offered industrial jobs and established ethnic communities that helped new arrivals settle.',
  },
  'Carondelet, St Louis, Missouri': {
    name: 'Carondelet',
    country: 'United States',
    region: 'St. Louis, Missouri',
    description: 'A historic neighborhood in south St. Louis, originally a separate city before annexation.',
    history: 'Carondelet was an independent city until 1870 and became a diverse working-class neighborhood. It attracted many immigrant families, including Czechs, Germans, and Irish, who worked in nearby industries and breweries.',
  },
};

// Normalize location names for matching
export function normalizeLocation(location: string): string {
  return location
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Get location info with fallback
export function getLocationInfo(location: string): LocationInfo | null {
  // Try exact match first
  if (locationDescriptions[location]) {
    return locationDescriptions[location];
  }

  // Try normalized match
  const normalized = normalizeLocation(location);
  for (const [key, value] of Object.entries(locationDescriptions)) {
    if (normalizeLocation(key) === normalized) {
      return value;
    }
  }

  // Try partial match (e.g., "Madison, Illinois" matches "Madison, Madison, Illinois")
  for (const [key, value] of Object.entries(locationDescriptions)) {
    if (normalizeLocation(key).includes(normalized) || normalized.includes(normalizeLocation(key))) {
      return value;
    }
  }

  // Return generic info if no match
  const parts = location.split(',').map(s => s.trim());
  return {
    name: parts[0] || location,
    country: parts[parts.length - 1] || 'Unknown',
    region: parts.length > 2 ? parts.slice(1, -1).join(', ') : undefined,
    description: `A location in the ${parts[parts.length - 1] || 'family history'}.`,
  };
}
