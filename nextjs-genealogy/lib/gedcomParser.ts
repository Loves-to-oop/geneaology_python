import fs from 'fs';
import path from 'path';
const parseGedcom = require('parse-gedcom');

export interface FamilyMember {
  id: string;
  name: string;
  birthYear: number | null;
  deathYear: number | null;
  birthDate: string | null;
  deathDate: string | null;
  birthPlace: string | null;
  deathPlace: string | null;
  sex: string | null;
  parentIds: string[];
  spouseIds: string[];
  events: Array<{type: string; date?: string; place?: string}>;
}

interface GedcomNode {
  type: string;
  value?: string;
  data?: any;
  children: GedcomNode[];
}

function extractYear(dateString: string): number | null {
  if (!dateString) return null;
  const yearMatch = dateString.match(/\d{4}/);
  return yearMatch ? parseInt(yearMatch[0]) : null;
}

function getNodeValue(node: GedcomNode | undefined): string {
  return node?.value || '';
}

function findNode(nodes: GedcomNode[], tag: string): GedcomNode | undefined {
  return nodes?.find(n => n.type === tag);
}

function findAllNodes(nodes: GedcomNode[], tag: string): GedcomNode[] {
  return nodes?.filter(n => n.type === tag) || [];
}

export function parseGedcomFile(filePath: string): FamilyMember[] {
  const gedcomContent = fs.readFileSync(filePath, 'utf-8');
  const parsed = parseGedcom.parse(gedcomContent);

  const individuals: Map<string, FamilyMember> = new Map();
  const families: Map<string, { husbandId?: string; wifeId?: string; childIds: string[] }> = new Map();

  // Parse individuals - handle both array and object structures
  let parsedArray = Array.isArray(parsed) ? parsed : (parsed.children || []);
  const indiNodes = findAllNodes(parsedArray, 'INDI');

  console.log(`Found ${indiNodes.length} individuals in GEDCOM`);

  for (const indi of indiNodes) {
    // Extract ID - for INDI nodes it's in xref_id, not pointer
    let id = '';

    if (indi.data?.xref_id) {
      id = indi.data.xref_id.replace(/@/g, '');
    } else if (indi.data?.pointer) {
      id = indi.data.pointer.replace(/@/g, '');
    }

    // If no ID, use fallback
    if (!id) {
      id = `INDI_${indiNodes.indexOf(indi)}`;
      console.log('Warning: No xref_id found for individual, using fallback:', id);
    }

    const nameNode = findNode(indi.children, 'NAME');
    const name = getNodeValue(nameNode)?.replace(/\//g, '').trim() || 'Unknown';

    if (indiNodes.indexOf(indi) < 2) {
      console.log(`Parsing individual: ${id} - ${name}`);
    }

    const birthNode = findNode(indi.children, 'BIRT');
    const birthDateNode = birthNode ? findNode(birthNode.children, 'DATE') : undefined;
    const birthDate = getNodeValue(birthDateNode);
    const birthYear = extractYear(birthDate);
    const birthPlaceNode = birthNode ? findNode(birthNode.children, 'PLAC') : undefined;
    const birthPlace = getNodeValue(birthPlaceNode);

    const deathNode = findNode(indi.children, 'DEAT');
    const deathDateNode = deathNode ? findNode(deathNode.children, 'DATE') : undefined;
    const deathDate = getNodeValue(deathDateNode);
    const deathYear = extractYear(deathDate);
    const deathPlaceNode = deathNode ? findNode(deathNode.children, 'PLAC') : undefined;
    const deathPlace = getNodeValue(deathPlaceNode);

    const sexNode = findNode(indi.children, 'SEX');
    const sex = getNodeValue(sexNode);

    // Parse other events (marriages, immigration, etc.)
    const eventNodes = findAllNodes(indi.children, 'EVEN');
    const events: Array<{type: string; date?: string; place?: string}> = [];

    for (const event of eventNodes) {
      const typeNode = findNode(event.children, 'TYPE');
      const type = getNodeValue(typeNode);
      const dateNode = findNode(event.children, 'DATE');
      const date = getNodeValue(dateNode);
      const placeNode = findNode(event.children, 'PLAC');
      const place = getNodeValue(placeNode);

      if (type) {
        events.push({ type, date: date || undefined, place: place || undefined });
      }
    }

    individuals.set(id, {
      id,
      name,
      birthYear,
      deathYear,
      birthDate,
      deathDate,
      birthPlace,
      deathPlace,
      sex,
      parentIds: [],
      spouseIds: [],
      events,
    });
  }

  console.log(`Total individuals parsed: ${individuals.size}`);

  // Debug: Show first 5 individual IDs stored in the map
  const storedIds = Array.from(individuals.keys()).slice(0, 5);
  console.log('First 5 individual IDs stored in map:', storedIds);

  // Parse families
  const famNodes = findAllNodes(parsedArray, 'FAM');

  console.log(`Found ${famNodes.length} families in GEDCOM`);

  for (const fam of famNodes) {
    const famId = fam.data?.xref_id?.replace(/@/g, '') || fam.data?.pointer?.replace(/@/g, '') || '';

    const husbNode = findNode(fam.children, 'HUSB');
    let husbandId = '';
    if (husbNode?.data?.pointer) {
      husbandId = husbNode.data.pointer.replace(/@/g, '');
    } else if (husbNode?.value) {
      husbandId = husbNode.value.replace(/@/g, '');
    }

    // Debug first family
    if (famNodes.indexOf(fam) === 0) {
      console.log('First family HUSB node:', JSON.stringify(husbNode, null, 2));
    }

    const wifeNode = findNode(fam.children, 'WIFE');
    let wifeId = '';
    if (wifeNode?.data?.pointer) {
      wifeId = wifeNode.data.pointer.replace(/@/g, '');
    } else if (wifeNode?.value) {
      wifeId = wifeNode.value.replace(/@/g, '');
    }

    const childNodes = findAllNodes(fam.children, 'CHIL');
    const childIds = childNodes.map(c => {
      if (c.data?.pointer) {
        return c.data.pointer.replace(/@/g, '');
      } else if (c.value) {
        return c.value.replace(/@/g, '');
      }
      return '';
    }).filter(Boolean);

    if (husbandId || wifeId || childIds.length > 0) {
      console.log(`Family: H=${husbandId || 'none'}, W=${wifeId || 'none'}, Children=${childIds.length}`);
    }

    families.set(famId, { husbandId, wifeId, childIds });

    // Add spouse relationships
    if (husbandId && wifeId) {
      const husband = individuals.get(husbandId);
      const wife = individuals.get(wifeId);
      if (husband && !husband.spouseIds.includes(wifeId)) {
        husband.spouseIds.push(wifeId);
      }
      if (wife && !wife.spouseIds.includes(husbandId)) {
        wife.spouseIds.push(husbandId);
      }
      if (!husband) console.log(`Warning: Husband ${husbandId} not found in individuals map`);
      if (!wife) console.log(`Warning: Wife ${wifeId} not found in individuals map`);
    }

    // Add parent relationships to children
    for (const childId of childIds) {
      const child = individuals.get(childId);
      if (child) {
        if (husbandId && !child.parentIds.includes(husbandId)) {
          child.parentIds.push(husbandId);
        }
        if (wifeId && !child.parentIds.includes(wifeId)) {
          child.parentIds.push(wifeId);
        }
      }
    }
  }

  const result = Array.from(individuals.values());
  console.log(`Returning ${result.length} individuals`);
  return result;
}

// Load family data from GEDCOM file
export function loadFamilyData(): FamilyMember[] {
  try {
    const gedcomPath = path.join(process.cwd(), 'data', 'family.ged');
    if (fs.existsSync(gedcomPath)) {
      return parseGedcomFile(gedcomPath);
    }
  } catch (error) {
    console.error('Error loading GEDCOM file:', error);
  }

  // Fallback to sample data
  return [
    {
      id: '1',
      name: 'John Smith',
      birthYear: 1920,
      deathYear: 1995,
      birthDate: '1 JAN 1920',
      deathDate: '15 DEC 1995',
      birthPlace: 'New York, USA',
      deathPlace: 'Boston, USA',
      sex: 'M',
      parentIds: [],
      spouseIds: ['2'],
      events: []
    },
    {
      id: '2',
      name: 'Mary Smith',
      birthYear: 1925,
      deathYear: 2010,
      birthDate: '5 MAR 1925',
      deathDate: '20 JUN 2010',
      birthPlace: 'Chicago, USA',
      deathPlace: 'Boston, USA',
      sex: 'F',
      parentIds: [],
      spouseIds: ['1'],
      events: []
    },
    {
      id: '3',
      name: 'Robert Smith',
      birthYear: 1950,
      deathYear: null,
      birthDate: '10 JUL 1950',
      deathDate: null,
      birthPlace: 'Boston, USA',
      deathPlace: null,
      sex: 'M',
      parentIds: ['1', '2'],
      spouseIds: ['4'],
      events: []
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      birthYear: 1955,
      deathYear: null,
      birthDate: '22 APR 1955',
      deathDate: null,
      birthPlace: 'Philadelphia, USA',
      deathPlace: null,
      sex: 'F',
      parentIds: [],
      spouseIds: ['3'],
      events: []
    },
    {
      id: '5',
      name: 'Michael Smith',
      birthYear: 1980,
      deathYear: null,
      birthDate: '8 SEP 1980',
      deathDate: null,
      birthPlace: 'Boston, USA',
      deathPlace: null,
      sex: 'M',
      parentIds: ['3', '4'],
      spouseIds: [],
      events: []
    },
  ];
}
