import { familyMembers } from '@/lib/familyData';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  console.log(`Home page rendering with ${familyMembers.length} members`);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Family Members ({familyMembers.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map((member) => (
          <Link
            key={member.id}
            href={`/member/${member.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-blue-400"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {member.name}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              {member.birthDate && (
                <p><span className="font-medium">Born:</span> {member.birthDate}</p>
              )}
              {!member.birthDate && member.birthYear && (
                <p><span className="font-medium">Born:</span> {member.birthYear}</p>
              )}
              {member.deathDate && (
                <p><span className="font-medium">Died:</span> {member.deathDate}</p>
              )}
              {!member.deathDate && member.deathYear && (
                <p><span className="font-medium">Died:</span> {member.deathYear}</p>
              )}
              {!member.deathDate && !member.deathYear && (
                <p className="text-green-600 font-medium">Living</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
