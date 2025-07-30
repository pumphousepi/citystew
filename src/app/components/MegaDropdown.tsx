// src/app/components/MegaDropdown.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { slugify } from '../../utils/slugify'; // if you have slug util

export interface MegaDropdownProps {
  category: 'sports' | 'concerts' | 'theater';
  dataMap: Record<string, string[]>;
  baseQuery: string;
}

export default function MegaDropdown({
  category,
  dataMap,
  baseQuery,
}: MegaDropdownProps) {
  const tabs = Object.keys(dataMap);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const items = (dataMap[activeTab] || []).slice(0, 30);

  const linkFor = (item: string) => {
    if (category === 'sports') {
      const slug = slugify ? slugify(item) : item.toLowerCase().replace(/\s+/g, '-');
      return `/teams/${slug}`;
    }
    const params = new URLSearchParams(baseQuery.replace('?', ''));
    if (category === 'concerts') {
      params.set('category', 'concerts');
      params.set('artist', item);
    } else {
      params.set('category', 'theater');
      params.set('show', item);
    }
    return `/events?${params.toString()}`;
  };

  return (
    <div className="w-full bg-white text-black shadow rounded-b-lg overflow-auto">
      {category === 'sports' && (
        <nav className="flex border-b divide-x text-sm font-medium">
          {tabs.map(tab => (
            <button
              key={tab}
              onMouseEnter={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-center ${
                activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>
      )}

      <div className="grid grid-cols-3 gap-4 px-4 py-6">
        {items.map((item, idx) => (
          <Link
            key={`${activeTab}-${item}-${idx}`}
            href={linkFor(item)}
            className="block bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="bg-black text-white px-3 py-2 font-semibold text-sm truncate">
              {item}
            </div>
          </Link>
        ))}
      </div>

      <div className="px-4 pb-4 text-right">
        <Link
          href={`/events?category=${category}${baseQuery}`}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          View All {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>
      </div>
    </div>
  );
}
