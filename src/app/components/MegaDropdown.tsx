// src/app/components/MegaDropdown.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './MegaDropdown.module.css';

export interface MegaDropdownProps {
  category: 'sports' | 'concerts' | 'theater';
  dataMap: Record<string, string[]>;    // e.g. sportsData, concertData, theaterData
  baseQuery: { city: string; state: string };
}

export default function MegaDropdown({
  category,
  dataMap,
  baseQuery,
}: MegaDropdownProps) {
  const [activeTab, setActiveTab] = useState(Object.keys(dataMap)[0]);
  const items = dataMap[activeTab] || [];

  // Build each item’s link:
  const linkFor = (item: string) => {
    const { city, state } = baseQuery;
    const common = `city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`;
    if (category === 'sports') {
      return `/events?category=sports&league=${encodeURIComponent(activeTab)}&team=${encodeURIComponent(item)}&${common}`;
    }
    if (category === 'concerts') {
      return `/events?category=concerts&genre=${encodeURIComponent(item)}&${common}`;
    }
    // theater
    return `/events?category=theater&genre=${encodeURIComponent(item)}&${common}`;
  };

  // View All link:
  const viewAllLink = `/events?category=${category}&city=${encodeURIComponent(baseQuery.city)}&state=${encodeURIComponent(baseQuery.state)}`;

  return (
    <div className={styles.megaWrapper}>
      <div className={styles.megaInner}>
        {/* Tabs (only sports) */}
        {category === 'sports' && (
          <nav className={styles.megaTabs}>
            {Object.keys(dataMap).map(tab => (
              <button
                key={tab}
                onMouseEnter={() => setActiveTab(tab)}
                className={activeTab === tab ? styles.megaTabButtonActive : styles.megaTabButton}
              >
                {tab}
              </button>
            ))}
          </nav>
        )}

        {/* Grid */}
        <div className={styles.megaGrid}>
          {items.map(item => (
            <Link key={item} href={linkFor(item)} className={styles.megaItem}>
              {item}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.megaFooter}>
          <Link href={viewAllLink} className={styles.megaViewAll}>
            View All {category.charAt(0).toUpperCase() + category.slice(1)}
          </Link>
        </div>
      </div>
    </div>
  );
}
