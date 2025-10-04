import { loadFamilyData, FamilyMember } from './gedcomParser';

// Load family members from GEDCOM file or use sample data
let cachedMembers: FamilyMember[] | null = null;

export function getFamilyMembers(): FamilyMember[] {
  if (!cachedMembers) {
    cachedMembers = loadFamilyData();
    console.log(`familyData.ts: Loaded ${cachedMembers.length} members`);
  }
  return cachedMembers;
}

export const familyMembers = getFamilyMembers();

export function getMemberById(id: string): FamilyMember | undefined {
  return getFamilyMembers().find(m => m.id === id);
}

export function getParents(member: FamilyMember): FamilyMember[] {
  return getFamilyMembers().filter(m => member.parentIds.includes(m.id));
}

export function getChildren(member: FamilyMember): FamilyMember[] {
  return getFamilyMembers().filter(m => m.parentIds.includes(member.id));
}

export function getSpouses(member: FamilyMember): FamilyMember[] {
  return getFamilyMembers().filter(m => member.spouseIds?.includes(m.id));
}

export function getSiblings(member: FamilyMember): FamilyMember[] {
  const parents = getParents(member);
  if (parents.length === 0) return [];

  // Find all children of the same parents
  return getFamilyMembers().filter(m =>
    m.id !== member.id && // Not the member themselves
    m.parentIds.some(parentId => member.parentIds.includes(parentId)) // Share at least one parent
  );
}

export type { FamilyMember };
