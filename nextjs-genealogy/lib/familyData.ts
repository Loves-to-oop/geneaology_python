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

export type { FamilyMember };
