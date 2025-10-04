import { loadFamilyData, FamilyMember } from './gedcomParser';

// Load family members from GEDCOM file or use sample data
export const familyMembers: FamilyMember[] = loadFamilyData();

export function getMemberById(id: string): FamilyMember | undefined {
  return familyMembers.find(m => m.id === id);
}

export function getParents(member: FamilyMember): FamilyMember[] {
  return familyMembers.filter(m => member.parentIds.includes(m.id));
}

export function getChildren(member: FamilyMember): FamilyMember[] {
  return familyMembers.filter(m => m.parentIds.includes(member.id));
}

export function getSpouses(member: FamilyMember): FamilyMember[] {
  return familyMembers.filter(m => member.spouseIds?.includes(m.id));
}

export type { FamilyMember };
