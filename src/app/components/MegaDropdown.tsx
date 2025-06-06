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

  // Split items for activeTab into three columns:
  const columns: string[][] = [[], [], []];
  dataMap[activeTab]?.forEach((item, idx) => {
    columns[idx % 3].push(item);
  });

  // Build “View All” path:
  const viewAllPath = `/events?category=${menuKey}${baseQuery}`;

  // When a single item is clicked:
  const handleItemClick = (item: string) => {
    let path = `/events?category=${menuKey}${baseQuery}`;
    if (menuKey === 'sports') {
      path += `&league=${encodeURIComponent(activeTab)}&team=${encodeURIComponent(item)}`;
    } else if (menuKey === 'concerts') {
      path += `&genre=${encodeURIComponent(item)}`;
    } else if (menuKey === 'theater') {
      const showKey = item.toLowerCase().replace(/\s+/g, '');
      path += `&genre=${encodeURIComponent(showKey)}`;
    }
    router.push(path);
  };

  // “View All” click:
  const handleViewAll = () => {
    router.push(viewAllPath);
  };

  return (
    <div
      className="absolute left-0 top-full w-100 bg-white text-black shadow-lg z-50 rounded-none"
      style={{ marginTop: '0' }}
    >
      {/* ─── Tabs Row ─── */}
      <div className="flex border-b border-gray-200 px-4">
        {tabs.map((tabLabel) => (
          <button
            key={tabLabel}
            onMouseEnter={() => setActiveTab(tabLabel)}
            className={
              activeTab === tabLabel
                ? 'py-2 px-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600'
                : 'py-2 px-3 text-sm font-medium text-gray-600 hover:text-blue-600'
            }
          >
            {tabLabel.toUpperCase()}
          </button>
        ))}
        <div className="flex-grow" />
      </div>

      {/* ─── Three Columns of Items (no scroll) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-4">
        {columns.map((colItems, colIdx) => (
          <ul key={colIdx} className="space-y-2">
            {colItems.map((item) => (
              <li key={item}>
                <button
                  onClick={() => handleItemClick(item)}
                  className="w-full text-left text-gray-700 text-sm hover:text-blue-600"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* ─── View All at bottom‑right ─── */}
      <div className="border-t border-gray-200 px-4 py-2 flex justify-end">
        <button
          onClick={handleViewAll}
          className="text-sm text-blue-600 hover:underline"
        >
          View All
        </button>
      </div>
    </div>
  );
}
