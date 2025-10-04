import { FamilyMember } from './familyData';
import { getCanonicalLocation } from './locationData';

export interface FamilySummary {
  overview: {
    totalMembers: number;
    maleCount: number;
    femaleCount: number;
    generationSpan: string;
    oldestBirthYear: number;
    newestBirthYear: number;
  };
  migration: {
    originCountry: string;
    destinationCountry: string;
    immigrationPeriod: string;
    keyLocations: Array<{ location: string; count: number }>;
  };
  demographics: {
    averageLifespan: number;
    longestLifespan: { name: string; years: number };
    mostCommonBirthDecade: string;
    familySize: {
      largestFamily: { parents: string[]; childrenCount: number };
      averageChildren: number;
    };
  };
  surnames: {
    primarySurnames: Array<{ surname: string; count: number }>;
    maidenNames: string[];
  };
  narrative: string[];
}

export function generateFamilySummary(members: FamilyMember[]): FamilySummary {
  // Overview stats
  const maleCount = members.filter(m => m.sex === 'M').length;
  const femaleCount = members.filter(m => m.sex === 'F').length;
  const birthYears = members.filter(m => m.birthYear).map(m => m.birthYear!);
  const oldestBirthYear = Math.min(...birthYears);
  const newestBirthYear = Math.max(...birthYears);
  const yearSpan = newestBirthYear - oldestBirthYear;

  // Migration analysis
  const birthPlaces = members
    .filter(m => m.birthPlace)
    .map(m => getCanonicalLocation(m.birthPlace!));

  const locationCounts = new Map<string, number>();
  birthPlaces.forEach(place => {
    locationCounts.set(place, (locationCounts.get(place) || 0) + 1);
  });

  const keyLocations = Array.from(locationCounts.entries())
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const czechMembers = members.filter(m =>
    m.birthPlace?.toLowerCase().includes('czech') ||
    m.birthPlace?.toLowerCase().includes('bohemia') ||
    m.birthPlace?.toLowerCase().includes('kolovec')
  );

  const usMembers = members.filter(m =>
    m.birthPlace?.toLowerCase().includes('illinois') ||
    m.birthPlace?.toLowerCase().includes('missouri') ||
    m.birthPlace?.toLowerCase().includes('usa')
  );

  // Demographics
  const lifespans = members
    .filter(m => m.birthYear && m.deathYear)
    .map(m => ({ name: m.name, years: m.deathYear! - m.birthYear! }));

  const averageLifespan = lifespans.length > 0
    ? Math.round(lifespans.reduce((sum, l) => sum + l.years, 0) / lifespans.length)
    : 0;

  const longestLifespan = lifespans.length > 0
    ? lifespans.reduce((max, l) => l.years > max.years ? l : max, lifespans[0])
    : { name: 'Unknown', years: 0 };

  // Birth decades
  const decades = members
    .filter(m => m.birthYear)
    .map(m => Math.floor(m.birthYear! / 10) * 10);

  const decadeCounts = new Map<number, number>();
  decades.forEach(d => decadeCounts.set(d, (decadeCounts.get(d) || 0) + 1));

  const mostCommonDecade = decadeCounts.size > 0
    ? Array.from(decadeCounts.entries()).reduce((max, entry) =>
        entry[1] > max[1] ? entry : max
      )[0]
    : 0;

  // Family sizes
  const parents = members.filter(m => {
    const children = members.filter(child => child.parentIds.includes(m.id));
    return children.length > 0;
  });

  const familySizes = parents.map(parent => {
    const children = members.filter(child => child.parentIds.includes(parent.id));
    return { parent: parent.name, childrenCount: children.length };
  });

  const largestFamily = familySizes.length > 0
    ? familySizes.reduce((max, f) => f.childrenCount > max.childrenCount ? f : max)
    : null;

  // Find the parents of the largest family
  const largestFamilyParents = largestFamily
    ? members
        .filter(m => {
          const children = members.filter(child => child.parentIds.includes(m.id));
          return children.length === largestFamily.childrenCount;
        })
        .map(m => m.name)
    : [];

  const averageChildren = familySizes.length > 0
    ? Math.round((familySizes.reduce((sum, f) => sum + f.childrenCount, 0) / familySizes.length) * 10) / 10
    : 0;

  // Surnames
  const surnames = members.map(m => {
    const parts = m.name.split(' ');
    return parts[parts.length - 1]; // Last name
  });

  const surnameCounts = new Map<string, number>();
  surnames.forEach(s => surnameCounts.set(s, (surnameCounts.get(s) || 0) + 1));

  const primarySurnames = Array.from(surnameCounts.entries())
    .map(([surname, count]) => ({ surname, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Generate narrative
  const narrative = [
    `The ${primarySurnames[0]?.surname || 'family'} genealogy spans ${yearSpan} years, from ${oldestBirthYear} to ${newestBirthYear}, documenting ${members.length} family members across multiple generations.`,

    czechMembers.length > 0 && usMembers.length > 0
      ? `This family's story is one of immigration: ${czechMembers.length} members were born in the Czech Republic (primarily in Kolovec, West Bohemia), while ${usMembers.length} were born in the United States, representing the family's migration journey.`
      : `The family history is documented across ${keyLocations.length} key locations.`,

    `The most significant concentration of family members (${keyLocations[0]?.count || 0} people) was in ${keyLocations[0]?.location || 'the ancestral homeland'}.`,

    usMembers.length > 0
      ? `The American branch of the family primarily settled in the Illinois-Missouri region, particularly around the St. Louis metropolitan area, where industrial opportunities attracted Czech immigrants in the early 20th century.`
      : null,

    `Family members lived an average of ${averageLifespan} years, with ${longestLifespan.name} living the longest at ${longestLifespan.years} years.`,

    mostCommonDecade > 0
      ? `The ${mostCommonDecade}s saw the most births in the family, representing a peak generation in the family's growth.`
      : null,

    largestFamilyParents.length > 0
      ? `${largestFamilyParents.join(' and ')} had the largest family with ${largestFamily?.childrenCount} children, reflecting the family values and circumstances of their time.`
      : null,

    primarySurnames.length > 1
      ? `The genealogy includes several family lines, with the most common surnames being ${primarySurnames.slice(0, 3).map(s => s.surname).join(', ')}.`
      : null,
  ].filter(Boolean) as string[];

  return {
    overview: {
      totalMembers: members.length,
      maleCount,
      femaleCount,
      generationSpan: `${oldestBirthYear} - ${newestBirthYear} (${yearSpan} years)`,
      oldestBirthYear,
      newestBirthYear,
    },
    migration: {
      originCountry: czechMembers.length > 0 ? 'Czech Republic' : 'Unknown',
      destinationCountry: usMembers.length > 0 ? 'United States' : 'Unknown',
      immigrationPeriod: czechMembers.length > 0 && usMembers.length > 0
        ? 'Late 19th - Early 20th Century'
        : 'N/A',
      keyLocations,
    },
    demographics: {
      averageLifespan,
      longestLifespan,
      mostCommonBirthDecade: mostCommonDecade > 0 ? `${mostCommonDecade}s` : 'Unknown',
      familySize: {
        largestFamily: {
          parents: largestFamilyParents,
          childrenCount: largestFamily?.childrenCount || 0,
        },
        averageChildren,
      },
    },
    surnames: {
      primarySurnames,
      maidenNames: [], // Could be enhanced with more analysis
    },
    narrative,
  };
}
