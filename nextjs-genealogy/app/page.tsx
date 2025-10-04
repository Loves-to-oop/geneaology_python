import { familyMembers } from '@/lib/familyData';
import { generateFamilySummary } from '@/lib/summaryAnalysis';
import HomeClient from './components/HomeClient';

export const dynamic = 'force-dynamic';

export default function Home() {
  console.log(`Home page rendering with ${familyMembers.length} members`);
  const summary = generateFamilySummary(familyMembers);

  return <HomeClient members={familyMembers} summary={summary} />;
}
