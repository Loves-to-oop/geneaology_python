'use client';

import { FamilyMember } from '@/lib/familyData';

interface StatisticsProps {
  members: FamilyMember[];
}

export default function Statistics({ members }: StatisticsProps) {
  const totalMembers = members.length;
  const maleMembers = members.filter(m => m.sex === 'M').length;
  const femaleMembers = members.filter(m => m.sex === 'F').length;

  // Calculate age ranges
  const ages = members
    .filter(m => m.birthYear && m.deathYear)
    .map(m => m.deathYear! - m.birthYear!);

  const avgAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;

  // Find oldest and newest birth years
  const oldestYear = Math.min(...members.filter(m => m.birthYear).map(m => m.birthYear!));
  const newestYear = Math.max(...members.filter(m => m.birthYear).map(m => m.birthYear!));

  // Count unique places
  const places = new Set(
    members
      .map(m => m.birthPlace)
      .filter(Boolean)
  );

  const stats = [
    { label: 'Total Family Members', value: totalMembers, icon: '👥', color: 'blue' },
    { label: 'Male / Female', value: `${maleMembers} / ${femaleMembers}`, icon: '⚖️', color: 'purple' },
    { label: 'Average Lifespan', value: avgAge > 0 ? `${avgAge} years` : 'N/A', icon: '📅', color: 'orange' },
    { label: 'Earliest Birth Year', value: oldestYear !== Infinity ? oldestYear : 'Unknown', icon: '📜', color: 'amber' },
    { label: 'Latest Birth Year', value: newestYear !== -Infinity ? newestYear : 'Unknown', icon: '🕐', color: 'green' },
    { label: 'Unique Locations', value: places.size, icon: '🌍', color: 'teal' },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    teal: 'bg-teal-50 border-teal-200 text-teal-700',
  };

  return (
    <div id="statistics" className="mb-12 scroll-mt-20">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        📊 Family Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`${colorClasses[stat.color as keyof typeof colorClasses]} border-2 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{stat.icon}</span>
              <span className="text-3xl font-bold">{stat.value}</span>
            </div>
            <p className="text-sm font-medium opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
