import { familyMembers } from '@/lib/familyData';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Family Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map((member) => (
          <Link
            key={member.id}
            href={`/member/${member.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-blue-400"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {member.name}
            </h3>
            <p className="text-gray-600">
              {member.birthYear} - {member.deathYear ?? 'Present'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
