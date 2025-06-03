// src/app/components/MegaDropdown.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MegaDropdownProps {
  menuKey: 'sports' | 'concerts' | 'theater';
  dataMap: Record<string, string[]>;   // e.g. { NBA: ['Lakers','Celtics'], … }
  baseQuery: string;                   // e.g. "" or "&city=Austin&state=TX"
}

export default function MegaDropdown({
  menuKey,
  dataMap,
  baseQuery,
}: MegaDropdownProps) {
  const router = useRouter();
  const tabs = Object.keys(dataMap);
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  // Split items for activeTab into three columns
  const columns: string[][] = [[], [], []];
  dataMap[activeTab].forEach((item, idx) => {
    columns[idx % 3].push(item);
  });

  // “View All” path:
  const viewAllPath = `/events?category=${menuKey}${baseQuery}&viewAll=true`;

  return (
    <div
      className="absolute 100% bg-white text-black shadow-lg z-50"
      style={{ top: '100%' }}
    >
      {/* Inner wrapper limits width to match nav (e.g. max-w-7xl) */}
      <div className="max-w-7xl mx-auto">
        {/* Tabs Row */}
        <div className="border-b border-gray-200 px-6 py-2 flex items-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              onMouseEnter={() => setActiveTab(tab)}
              className={
                'mx-3 pb-2 font-medium ' +
                (activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600')
              }
            >
              {tab}
            </button>
          ))}
          <div className="flex-grow" />
          <button
            onClick={() => router.push(viewAllPath)}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            View All {menuKey.charAt(0).toUpperCase() + menuKey.slice(1)}
          </button>
        </div>

        {/* Three Columns of Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-6">
          {columns.map((colItems, colIdx) => (
            <ul key={colIdx} className="space-y-2">
              {colItems.map((item) => {
                // Build navigation path
                let path = `/events?category=${menuKey}`;
                if (menuKey === 'sports') {
                  path += `&league=${encodeURIComponent(activeTab)}&team=${encodeURIComponent(item)}`;
                } else if (menuKey === 'concerts') {
                  path += `&genre=${encodeURIComponent(item)}`;
                } else if (menuKey === 'theater') {
                  path += `&genre=${encodeURIComponent(item.toLowerCase().replace(/\s+/g, ''))}`;
                }
                path += baseQuery;

                return (
                  <li key={item}>
                    <button
                      onClick={() => router.push(path)}
                      className="text-left text-gray-700 hover:text-blue-600"
                    >
                      {item}
                    </button>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
