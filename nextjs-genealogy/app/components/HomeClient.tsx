'use client';

import { FamilyMember } from '@/lib/familyData';
import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';
import Statistics from './Statistics';

interface HomeClientProps {
  members: FamilyMember[];
}

export default function HomeClient({ members }: HomeClientProps) {
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 md:p-12 mb-12 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          The Cozl-Maidl Family Tree
        </h1>
        <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto mb-3">
          Explore {members.length} family members from the Cozl and Maidl families
        </p>
        <p className="text-md text-blue-200 text-center max-w-2xl mx-auto">
          📍 Originating from Kolovec, West Bohemia, Czech Republic
        </p>
      </div>

      {/* Statistics */}
      <Statistics members={members} />

      {/* Search Bar */}
      <SearchBar onSearch={setSearchQuery} />

      {/* Sort Controls */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          All Family Members ({filteredMembers.length})
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
  );
}
