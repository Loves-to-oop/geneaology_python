import { familyMembers } from '@/lib/familyData';
import { getLocationInfo, getCanonicalLocation } from '@/lib/locationData';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LocationsPage() {
  // Gather all unique locations from birth and death places, using canonical names
  const locationMap = new Map<string, { birthCount: number; deathCount: number; members: typeof familyMembers }>();

  familyMembers.forEach(member => {
    if (member.birthPlace) {
      const canonical = getCanonicalLocation(member.birthPlace);
      const existing = locationMap.get(canonical) || { birthCount: 0, deathCount: 0, members: [] };
      existing.birthCount++;
      if (!existing.members.find(m => m.id === member.id)) {
        existing.members.push(member);
      }
      locationMap.set(canonical, existing);
    }

    if (member.deathPlace) {
      const canonical = getCanonicalLocation(member.deathPlace);
      const existing = locationMap.get(canonical) || { birthCount: 0, deathCount: 0, members: [] };
      existing.deathCount++;
      if (!existing.members.find(m => m.id === member.id)) {
        existing.members.push(member);
      }
      locationMap.set(canonical, existing);
    }
  });

  // Sort locations by total member count
  const locations = Array.from(locationMap.entries())
    .map(([place, data]) => ({
      place,
      ...data,
      total: data.birthCount + data.deathCount,
      info: getLocationInfo(place),
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white rounded-2xl p-8 md:p-12 mb-12 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          📍 Family Locations
        </h1>
        <p className="text-xl text-green-100 text-center max-w-3xl mx-auto">
          Explore the places where the Cozl-Maidl family lived across {locations.length} locations
        </p>
      </div>

      {/* Locations Grid */}
      <div className="space-y-8">
        {locations.map(({ place, birthCount, deathCount, total, members, info }) => (
          <div
            key={place}
            className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500 hover:shadow-2xl transition-shadow"
          >
            {/* Location Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{info?.name || place}</h2>
                  <p className="text-lg text-gray-600">
                    {info?.region && <span>{info.region}, </span>}
                    <span className="font-semibold">{info?.country}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{total}</div>
                  <div className="text-sm text-gray-500">family members</div>
                </div>
              </div>

              {/* Statistics */}
              <div className="flex gap-4 mb-4">
                {birthCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    🎂 {birthCount} born here
                  </span>
                )}
                {deathCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    † {deathCount} died here
                  </span>
                )}
              </div>

              {/* Description */}
              {info?.description && (
                <p className="text-gray-700 mb-3">{info.description}</p>
              )}

              {/* History */}
              {info?.history && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-4">
                  <h3 className="font-semibold text-amber-900 mb-2 flex items-center">
                    <span className="mr-2">📜</span> Historical Context
                  </h3>
                  <p className="text-amber-800 text-sm">{info.history}</p>
                </div>
              )}
            </div>

            {/* Family Members */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Family Members ({members.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {members.map(member => (
                  <Link
                    key={member.id}
                    href={`/member/${member.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition group"
                  >
                    <span className="font-medium text-gray-800 group-hover:text-blue-600">
                      {member.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {member.birthYear && `b. ${member.birthYear}`}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Links */}
      <div className="mt-12 flex gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          <span>←</span>
          <span>Back to All Members</span>
        </Link>
        <Link
          href="/#statistics"
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg border-2 border-gray-300"
        >
          <span>📊</span>
          <span>View Statistics</span>
        </Link>
      </div>
    </div>
  );
}
