'use client';

import { FamilyMember } from '@/lib/familyData';
import Link from 'next/link';

interface FamilyTreeProps {
  member: FamilyMember;
  parents: FamilyMember[];
  spouses: FamilyMember[];
  children: FamilyMember[];
  siblings: FamilyMember[];
}

export default function FamilyTree({ member, parents, spouses, children, siblings }: FamilyTreeProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Family Tree</h3>

      <div className="flex flex-col items-center space-y-8">
        {/* Parents Level */}
        {parents.length > 0 && (
          <div className="w-full">
            <p className="text-center text-sm text-gray-500 mb-3">Parents</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {parents.map((parent) => (
                <Link
                  key={parent.id}
                  href={`/member/${parent.id}`}
                  className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 hover:bg-blue-200 transition min-w-[150px] text-center"
                >
                  <p className="font-semibold text-gray-800">{parent.name}</p>
                  <p className="text-xs text-gray-600">
                    {parent.birthYear ? `b. ${parent.birthYear}` : ''}
                  </p>
                </Link>
              ))}
            </div>
            {/* Connection line down */}
            <div className="w-px h-8 bg-gray-400 mx-auto"></div>
          </div>
        )}

        {/* Current Person + Spouse(s) Level */}
        <div className="w-full">
          <p className="text-center text-sm text-gray-500 mb-3">
            {spouses.length > 0 ? 'Couple' : 'Individual'}
          </p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <div className="bg-yellow-100 border-4 border-yellow-400 rounded-lg p-4 min-w-[150px] text-center shadow-lg">
              <p className="font-bold text-gray-800">{member.name}</p>
              <p className="text-xs text-gray-600">
                {member.birthYear ? `b. ${member.birthYear}` : ''}
              </p>
              <p className="text-xs text-yellow-600 font-semibold mt-1">(You are viewing)</p>
            </div>

            {spouses.map((spouse) => (
              <>
                <div className="text-2xl text-gray-400">⚭</div>
                <Link
                  key={spouse.id}
                  href={`/member/${spouse.id}`}
                  className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4 hover:bg-purple-200 transition min-w-[150px] text-center"
                >
                  <p className="font-semibold text-gray-800">{spouse.name}</p>
                  <p className="text-xs text-gray-600">
                    {spouse.birthYear ? `b. ${spouse.birthYear}` : ''}
                  </p>
                </Link>
              </>
            ))}
          </div>
          {children.length > 0 && (
            <div className="w-px h-8 bg-gray-400 mx-auto"></div>
          )}
        </div>

        {/* Children Level */}
        {children.length > 0 && (
          <div className="w-full">
            <p className="text-center text-sm text-gray-500 mb-3">Children</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {children.map((child) => (
                <Link
                  key={child.id}
                  href={`/member/${child.id}`}
                  className="bg-green-100 border-2 border-green-300 rounded-lg p-4 hover:bg-green-200 transition min-w-[150px] text-center"
                >
                  <p className="font-semibold text-gray-800">{child.name}</p>
                  <p className="text-xs text-gray-600">
                    {child.birthYear ? `b. ${child.birthYear}` : ''}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Siblings Section */}
        {siblings.length > 0 && (
          <div className="w-full border-t pt-6">
            <p className="text-center text-sm text-gray-500 mb-3">Siblings</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {siblings.map((sibling) => (
                <Link
                  key={sibling.id}
                  href={`/member/${sibling.id}`}
                  className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 hover:bg-gray-200 transition min-w-[150px] text-center"
                >
                  <p className="font-semibold text-gray-800">{sibling.name}</p>
                  <p className="text-xs text-gray-600">
                    {sibling.birthYear ? `b. ${sibling.birthYear}` : ''}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t text-center text-xs text-gray-500">
        <p className="mb-2"><span className="font-semibold">Legend:</span></p>
        <div className="flex justify-center gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded"></span> Current
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></span> Parents
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded"></span> Spouse
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></span> Children
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></span> Siblings
          </span>
        </div>
      </div>
    </div>
  );
}
