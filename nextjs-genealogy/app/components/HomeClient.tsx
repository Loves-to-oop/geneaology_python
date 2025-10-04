'use client';

import { FamilyMember } from '@/lib/familyData';
import { FamilySummary } from '@/lib/summaryAnalysis';
import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';
import Statistics from './Statistics';

interface HomeClientProps {
  members: FamilyMember[];
  summary: FamilySummary;
}

export default function HomeClient({ members, summary }: HomeClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'birthYear'>('name');

  // Filter members based on search
  const filteredMembers = members.filter(member => {
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.birthYear?.toString().includes(query) ||
      member.birthPlace?.toLowerCase().includes(query) ||
      member.deathPlace?.toLowerCase().includes(query)
    );
  });

  // Sort members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return (b.birthYear || 0) - (a.birthYear || 0);
    }
  });

  return (
    <div>
      {/* Compelling Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white rounded-3xl overflow-hidden shadow-2xl mb-12">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm uppercase tracking-wider text-blue-200 mb-4 text-center">
              A Story of Immigration, Family, and Survival
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center leading-tight">
              From Bohemian Villages to American Dreams
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 text-center mb-8 leading-relaxed">
              {summary.narrative[1] || 'Follow the remarkable journey of the Cozl and Maidl families across generations and continents.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/summary"
                className="inline-flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg"
              >
                <span>📖</span>
                <span>Read Their Story</span>
              </Link>
              <a
                href="#explore"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold py-4 px-8 rounded-xl transition-all text-lg"
              >
                <span>🔍</span>
                <span>Explore the Family</span>
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">{members.length}</div>
                <div className="text-sm text-blue-200">Family Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{summary.overview.newestBirthYear - summary.overview.oldestBirthYear}</div>
                <div className="text-sm text-blue-200">Years of History</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{summary.migration.keyLocations.length}</div>
                <div className="text-sm text-blue-200">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Highlights */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200 hover:shadow-xl transition">
          <div className="text-4xl mb-3">🏰</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Bohemian Roots</h3>
          <p className="text-gray-700 text-sm">
            The family's story begins in Kolovec, a small village in West Bohemia, Czech Republic, where they lived for generations as farmers.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 hover:shadow-xl transition">
          <div className="text-4xl mb-3">⚓</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Journey to America</h3>
          <p className="text-gray-700 text-sm">
            In the late 1800s and early 1900s, they made the brave crossing to America, seeking opportunity in the industrial cities of Illinois and Missouri.
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 hover:shadow-xl transition">
          <div className="text-4xl mb-3">🌳</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Legacy Preserved</h3>
          <p className="text-gray-700 text-sm">
            This digital archive preserves {members.length} family members' stories, ensuring their memory lives on for future generations.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <Statistics members={members} />

      {/* Explore Section Anchor */}
      <div id="explore" className="scroll-mt-20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Discover the Individuals
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each person has a unique story. Search by name, explore by year, or browse the complete family tree.
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={setSearchQuery} />

        {/* Sort Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {filteredMembers.length} {searchQuery ? 'Results' : 'Family Members'}
          </h2>
          <div className="flex gap-2">
          <button
            onClick={() => setSortBy('name')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === 'name'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Sort by Name
          </button>
          <button
            onClick={() => setSortBy('birthYear')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === 'birthYear'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Sort by Year
          </button>
          </div>
        </div>

      {/* Members Grid */}
      {sortedMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedMembers.map((member) => (
            <Link
              key={member.id}
              href={`/member/${member.id}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border-2 border-gray-100 hover:border-blue-400 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition flex-1">
                  {member.name}
                </h3>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                {(member.birthDate || member.birthYear) && (
                  <p className="flex items-center">
                    <span className="mr-2">🎂</span>
                    <span className="font-medium">Born:</span>
                    <span className="ml-1">{member.birthDate || member.birthYear}</span>
                  </p>
                )}
                {member.birthPlace && (
                  <p className="text-xs text-blue-600 hover:text-blue-800 truncate flex items-center">
                    <span className="mr-1">📍</span>
                    <span className="hover:underline">{member.birthPlace}</span>
                  </p>
                )}
                {(member.deathDate || member.deathYear) && (
                  <p className="flex items-center text-gray-500">
                    <span className="mr-2">†</span>
                    {member.deathDate || member.deathYear}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <p className="text-2xl text-gray-400 mb-2">🔍</p>
          <p className="text-gray-600 text-lg">No family members found matching "{searchQuery}"</p>
        </div>
      )}
      </div>
    </div>
  );
}
