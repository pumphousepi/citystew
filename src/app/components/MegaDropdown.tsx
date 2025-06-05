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

  // Build “View All” path:
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

  // “View All” click:
  const handleViewAll = () => {
    router.push(viewAllPath);
  };

  return (
    <div
      className="
        absolute top-full left-0 w-screen bg-white text-black shadow-lg z-50
        md:left-1/2 md:-translate-x-1/2 md:w-screen
      "
    >
      <div className="max-w-7xl mx-auto">
        {/* ─── Tabs Row ─── */}
        <nav className="flex space-x-8 border-b border-gray-200 px-6 py-2 bg-white">
          {tabs.map((tabLabel) => (
            <button
              key={tabLabel}
              onMouseEnter={() => setActiveTab(tabLabel)}
              className={
                activeTab === tabLabel
                  ? 'pb-2 text-sm font-medium border-b-2 border-blue-600 text-blue-600'
                  : 'pb-2 text-sm font-medium text-gray-700 hover:text-blue-600'
              }
            >
              {tabLabel.toUpperCase()}
            </button>
          ))}
        </nav>

        {/* ─── Three Columns of Items ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-6">
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

        {/* ─── View All at bottom-right ─── */}
        <div className="border-t border-gray-200 px-6 py-2 flex justify-end bg-white">
          <button
            onClick={handleViewAll}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>
      </div>
    </div>
  );
}
