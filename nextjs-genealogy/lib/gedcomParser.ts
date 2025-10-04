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
  sex: string | null;
  parentIds: string[];
  spouseIds: string[];
}

interface GedcomNode {
  tag: string;
  data: string;
  tree: GedcomNode[];
}

function extractYear(dateString: string): number | null {
  if (!dateString) return null;
  const yearMatch = dateString.match(/\d{4}/);
  return yearMatch ? parseInt(yearMatch[0]) : null;
}

function getNodeValue(node: GedcomNode | undefined): string {
  return node?.data || '';
}

function findNode(nodes: GedcomNode[], tag: string): GedcomNode | undefined {
  return nodes?.find(n => n.tag === tag);
}

function findAllNodes(nodes: GedcomNode[], tag: string): GedcomNode[] {
  return nodes?.filter(n => n.tag === tag) || [];
}

export function parseGedcomFile(filePath: string): FamilyMember[] {
  const gedcomContent = fs.readFileSync(filePath, 'utf-8');
  const parsed = parseGedcom.parse(gedcomContent);

  console.log('Parsed GEDCOM structure:', JSON.stringify(parsed, null, 2).substring(0, 500));

  const individuals: Map<string, FamilyMember> = new Map();
  const families: Map<string, { husbandId?: string; wifeId?: string; childIds: string[] }> = new Map();

  // Parse individuals - handle both array and object structures
  let parsedArray = Array.isArray(parsed) ? parsed : (parsed.children || []);
  const indiNodes = findAllNodes(parsedArray, 'INDI');

  for (const indi of indiNodes) {
    const id = indi.data.replace('@', '').replace('@', '');

    const nameNode = findNode(indi.tree, 'NAME');
    const name = getNodeValue(nameNode)?.replace(/\//g, '').trim() || 'Unknown';

    const birthNode = findNode(indi.tree, 'BIRT');
    const birthDateNode = birthNode ? findNode(birthNode.tree, 'DATE') : undefined;
    const birthDate = getNodeValue(birthDateNode);
    const birthYear = extractYear(birthDate);

    const deathNode = findNode(indi.tree, 'DEAT');
    const deathDateNode = deathNode ? findNode(deathNode.tree, 'DATE') : undefined;
    const deathDate = getNodeValue(deathDateNode);
    const deathYear = extractYear(deathDate);

    const sexNode = findNode(indi.tree, 'SEX');
    const sex = getNodeValue(sexNode);

    individuals.set(id, {
      id,
      name,
      birthYear,
      deathYear,
      birthDate,
      deathDate,
      sex,
      parentIds: [],
      spouseIds: [],
    });
  }

  // Parse families
  const famNodes = findAllNodes(parsedArray, 'FAM');

  for (const fam of famNodes) {
    const famId = fam.data.replace('@', '').replace('@', '');

    const husbNode = findNode(fam.tree, 'HUSB');
    const husbandId = husbNode ? getNodeValue(husbNode).replace('@', '').replace('@', '') : undefined;

    const wifeNode = findNode(fam.tree, 'WIFE');
    const wifeId = wifeNode ? getNodeValue(wifeNode).replace('@', '').replace('@', '') : undefined;

    const childNodes = findAllNodes(fam.tree, 'CHIL');
    const childIds = childNodes.map(c => getNodeValue(c).replace('@', '').replace('@', ''));

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

  return Array.from(individuals.values());
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
      sex: 'M',
      parentIds: [],
      spouseIds: ['2']
    },
    {
      id: '2',
      name: 'Mary Smith',
      birthYear: 1925,
      deathYear: 2010,
      birthDate: '5 MAR 1925',
      deathDate: '20 JUN 2010',
      sex: 'F',
      parentIds: [],
      spouseIds: ['1']
    },
    {
      id: '3',
      name: 'Robert Smith',
      birthYear: 1950,
      deathYear: null,
      birthDate: '10 JUL 1950',
      deathDate: null,
      sex: 'M',
      parentIds: ['1', '2'],
      spouseIds: ['4']
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      birthYear: 1955,
      deathYear: null,
      birthDate: '22 APR 1955',
      deathDate: null,
      sex: 'F',
      parentIds: [],
      spouseIds: ['3']
    },
    {
      id: '5',
      name: 'Michael Smith',
      birthYear: 1980,
      deathYear: null,
      birthDate: '8 SEP 1980',
      deathDate: null,
      sex: 'M',
      parentIds: ['3', '4'],
      spouseIds: []
    },
  ];
}
