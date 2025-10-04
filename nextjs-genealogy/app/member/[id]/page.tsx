import { getMemberById, getParents, getChildren, getSpouses } from '@/lib/familyData';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function MemberPage({ params }: { params: { id: string } }) {
  const memberId = params.id;
  const member = getMemberById(memberId);

  if (!member) {
    notFound();
  }

  const parents = getParents(member);
  const children = getChildren(member);
  const spouses = getSpouses(member);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 border-b-4 border-blue-500 pb-3">
          {member.name}
        </h2>

        <div className="space-y-3 text-lg mb-8 bg-gray-50 p-6 rounded-lg">
          {member.sex && (
            <p className="text-gray-700">
              <span className="font-semibold">Gender:</span> {member.sex === 'M' ? 'Male' : member.sex === 'F' ? 'Female' : member.sex}
            </p>
          )}

          {(member.birthDate || member.birthYear) && (
            <div className="text-gray-700">
              <span className="font-semibold">Born:</span> {member.birthDate || member.birthYear}
              {member.birthPlace && (
                <div className="ml-6 text-gray-600">📍 {member.birthPlace}</div>
              )}
            </div>
          )}

          {member.deathDate || member.deathYear ? (
            <div className="text-gray-700">
              <span className="font-semibold">Died:</span> {member.deathDate || member.deathYear}
              {member.deathPlace && (
                <div className="ml-6 text-gray-600">📍 {member.deathPlace}</div>
              )}
            </div>
          ) : (
            <p className="text-green-600 font-semibold">● Living</p>
          )}
        </div>

        {member.events && member.events.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Life Events</h3>
            <div className="space-y-3">
              {member.events.map((event, idx) => (
                <div key={idx} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="font-semibold text-gray-800">{event.type}</p>
                  {event.date && <p className="text-gray-600">📅 {event.date}</p>}
                  {event.place && <p className="text-gray-600">📍 {event.place}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {spouses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {spouses.length === 1 ? 'Spouse' : 'Spouses'}
            </h3>
            <ul className="space-y-2">
              {spouses.map((spouse) => (
                <li key={spouse.id} className="border-b border-gray-200 pb-2">
                  <Link
                    href={`/member/${spouse.id}`}
                    className="text-blue-600 hover:text-blue-800 text-lg font-medium hover:underline"
                  >
                    {spouse.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {parents.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Parents</h3>
            <ul className="space-y-2">
              {parents.map((parent) => (
                <li key={parent.id} className="border-b border-gray-200 pb-2">
                  <Link
                    href={`/member/${parent.id}`}
                    className="text-blue-600 hover:text-blue-800 text-lg font-medium hover:underline"
                  >
                    {parent.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {children.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Children</h3>
            <ul className="space-y-2">
              {children.map((child) => (
                <li key={child.id} className="border-b border-gray-200 pb-2">
                  <Link
                    href={`/member/${child.id}`}
                    className="text-blue-600 hover:text-blue-800 text-lg font-medium hover:underline"
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Link
        href="/"
        className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        ← Back to all members
      </Link>
    </div>
  );
}
