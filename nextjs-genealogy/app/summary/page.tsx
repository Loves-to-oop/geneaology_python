import { familyMembers } from '@/lib/familyData';
import { generateFamilySummary } from '@/lib/summaryAnalysis';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function SummaryPage() {
  const summary = generateFamilySummary(familyMembers);

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 md:p-12 mb-12 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          📖 Family History Summary
        </h1>
        <p className="text-xl text-purple-100 text-center max-w-3xl mx-auto">
          An automatically generated narrative of the Cozl-Maidl family journey
        </p>
      </div>

      {/* Narrative Section */}
      <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border-t-4 border-purple-600">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📜</span>
          The Family Story
        </h2>
        <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
          {summary.narrative.map((paragraph, idx) => (
            <p key={idx} className="border-l-4 border-purple-300 pl-4 py-2">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
          <div className="text-blue-600 text-3xl mb-2">👥</div>
          <div className="text-3xl font-bold text-gray-800">{summary.overview.totalMembers}</div>
          <div className="text-sm text-gray-600">Total Family Members</div>
          <div className="text-xs text-gray-500 mt-2">
            {summary.overview.maleCount} male, {summary.overview.femaleCount} female
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
          <div className="text-green-600 text-3xl mb-2">📅</div>
          <div className="text-3xl font-bold text-gray-800">{summary.demographics.averageLifespan}</div>
          <div className="text-sm text-gray-600">Average Lifespan (years)</div>
          <div className="text-xs text-gray-500 mt-2">
            Longest: {summary.demographics.longestLifespan.name} ({summary.demographics.longestLifespan.years} years)
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border-2 border-amber-200">
          <div className="text-amber-600 text-3xl mb-2">👨‍👩‍👧‍👦</div>
          <div className="text-3xl font-bold text-gray-800">{summary.demographics.familySize.averageChildren}</div>
          <div className="text-sm text-gray-600">Average Children per Family</div>
          <div className="text-xs text-gray-500 mt-2">
            Largest: {summary.demographics.familySize.largestFamily.childrenCount} children
          </div>
        </div>
      </div>

      {/* Migration Journey */}
      {summary.migration.originCountry !== 'Unknown' && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">✈️</span>
            Migration Journey
          </h2>
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🇨🇿</div>
              <div className="font-bold text-lg text-gray-800">{summary.migration.originCountry}</div>
              <div className="text-sm text-gray-600">Origin</div>
            </div>
            <div className="text-4xl text-gray-400">→</div>
            <div className="text-center">
              <div className="text-4xl mb-2">🇺🇸</div>
              <div className="font-bold text-lg text-gray-800">{summary.migration.destinationCountry}</div>
              <div className="text-sm text-gray-600">Destination</div>
            </div>
          </div>
          <div className="text-center bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Immigration Period</div>
            <div className="font-bold text-purple-700">{summary.migration.immigrationPeriod}</div>
          </div>
        </div>
      )}

      {/* Key Locations */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">🗺️</span>
          Key Locations
        </h2>
        <div className="space-y-3">
          {summary.migration.keyLocations.map((loc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-teal-600">#{idx + 1}</span>
                <span className="font-semibold text-gray-800">{loc.location}</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-700">{loc.count}</div>
                <div className="text-xs text-gray-600">members</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium hover:underline"
          >
            View detailed location history →
          </Link>
        </div>
      </div>

      {/* Surnames */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📛</span>
          Family Names
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {summary.surnames.primarySurnames.map((surname, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border-2 border-indigo-200 text-center"
            >
              <div className="text-2xl font-bold text-indigo-700">{surname.count}</div>
              <div className="text-sm font-semibold text-gray-800">{surname.surname}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Period */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">⏳</span>
          Time Period
        </h2>
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-3xl">
            <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"></div>
            <div className="flex justify-between mt-4">
              <div className="text-center">
                <div className="font-bold text-2xl text-blue-600">{summary.overview.oldestBirthYear}</div>
                <div className="text-sm text-gray-600">First Generation</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-purple-600">{summary.demographics.mostCommonBirthDecade}</div>
                <div className="text-sm text-gray-600">Peak Decade</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-pink-600">{summary.overview.newestBirthYear}</div>
                <div className="text-sm text-gray-600">Latest Generation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 flex-wrap">
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
