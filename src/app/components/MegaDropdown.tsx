'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MegaDropdownProps {
  category: 'sports' | 'concerts' | 'theater';
  dataMap: Record<string, string[]>;
  baseQuery: string; // e.g. "?city=Austin&state=TX"
}

export default function MegaDropdown({
  category,
  dataMap,
  baseQuery,
}: MegaDropdownProps) {
  const router = useRouter();
  const tabs = Object.keys(dataMap);
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const items = dataMap[activeTab] || [];

  const handleClick = (item: string) => {
    let path = `/events?category=${category}${baseQuery}`;
    if (category === 'sports') {
      path += `&league=${encodeURIComponent(activeTab)}&team=${encodeURIComponent(item)}`;
    } else if (category === 'concerts') {
      path += `&genre=${encodeURIComponent(item)}`;
    } else {
      const key = item.toLowerCase().replace(/\s+/g, '');
      path += `&genre=${encodeURIComponent(key)}`;
    }
    router.push(path);
  };

  const viewAll = () => {
    router.push(`/events?category=${category}${baseQuery}`);
  };

  return (
    <>
      {/* ─── Tabs Row (if more than one) ─── */}
      {tabs.length > 1 && (
        <nav className="flex space-x-6 border-b border-gray-200 pb-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onMouseEnter={() => setActiveTab(tab)}
              className={
                activeTab === tab
                  ? 'pb-2 text-sm font-semibold text-blue-600 border-b-2 border-blue-600'
                  : 'pb-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'
              }
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>
      )}

      {/* ─── Grid of Links ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => handleClick(item)}
            className="text-sm text-gray-700 hover:text-blue-600 transition-colors text-left"
          >
            {item}
          </button>
        ))}
      </div>

      {/* ─── View All Footer ─── */}
      <div className="border-t border-gray-200 mt-4 pt-2 flex justify-end">
        <button onClick={viewAll} className="text-sm text-blue-600 hover:underline">
          View All
        </button>
      </div>
    </>
  );
}
