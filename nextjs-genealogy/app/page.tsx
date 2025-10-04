import { familyMembers } from '@/lib/familyData';
import HomeClient from './components/HomeClient';

export const dynamic = 'force-dynamic';

export default function Home() {
  console.log(`Home page rendering with ${familyMembers.length} members`);

  return <HomeClient members={familyMembers} />;
}
