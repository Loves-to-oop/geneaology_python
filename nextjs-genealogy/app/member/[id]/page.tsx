import { getMemberById, getParents, getChildren, getSpouses, getSiblings } from '@/lib/familyData';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FamilyTree from '@/app/components/FamilyTree';

export default function MemberPage({ params }: { params: { id: string } }) {
  const memberId = params.id;
  const member = getMemberById(memberId);

  if (!member) {
    notFound();
  }

  const parents = getParents(member);
  const children = getChildren(member);
  const spouses = getSpouses(member);
  const siblings = getSiblings(member);

  console.log(`Member ${member.name}: Parents=${parents.length}, Spouses=${spouses.length}, Children=${children.length}, Siblings=${siblings.length}`);
  console.log(`Member parentIds:`, member.parentIds);
  console.log(`Member spouseIds:`, member.spouseIds);

  return (
    <div className="max-w-4xl mx-auto">
      <FamilyTree
        member={member}
        parents={parents}
        spouses={spouses}
        children={children}
        siblings={siblings}
      />
      <div className="bg-white rounded-xl shadow-xl p-8 mb-6 border-t-4 border-blue-600">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              {member.name}
            </h2>
            {member.sex && (
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {member.sex === 'M' ? '👨 Male' : member.sex === 'F' ? '👩 Female' : member.sex}
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {(member.birthDate || member.birthYear) && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-3">🎂</span>
                <div>
                  <p className="text-sm text-blue-600 font-semibold">Born</p>
                  <p className="text-xl font-bold text-gray-800">{member.birthDate || member.birthYear}</p>
                </div>
              </div>
              {member.birthPlace && (
                <Link
                  href="/locations"
                  className="text-sm text-blue-600 hover:text-blue-800 mt-2 flex items-center hover:underline"
                >
                  <span className="mr-1">📍</span> {member.birthPlace}
                </Link>
              )}
            </div>
          )}

          {(member.deathDate || member.deathYear) && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-3">†</span>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Died</p>
                  <p className="text-xl font-bold text-gray-800">{member.deathDate || member.deathYear}</p>
                </div>
              </div>
              {member.deathPlace && (
                <Link
                  href="/locations"
                  className="text-sm text-blue-600 hover:text-blue-800 mt-2 flex items-center hover:underline"
                >
                  <span className="mr-1">📍</span> {member.deathPlace}
                </Link>
              )}
            </div>
          )}
        </div>

        {member.events && member.events.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📜</span> Life Events
            </h3>
            <div className="space-y-3">
              {member.events.map((event, idx) => (
                <div key={idx} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition">
                  <p className="font-bold text-gray-800 text-lg mb-1">{event.type}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    {event.date && (
                      <span className="flex items-center">
                        <span className="mr-1">📅</span> {event.date}
                      </span>
                    )}
                    {event.place && (
                      <span className="flex items-center">
                        <span className="mr-1">📍</span> {event.place}
                      </span>
                    )}
                  </div>
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

      <div className="flex gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          <span>←</span>
          <span>Back to All Members</span>
        </Link>
        <Link
          href="/locations"
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg border-2 border-gray-300"
        >
          <span>📍</span>
          <span>View Locations</span>
        </Link>
      </div>
    </div>
  );
}
