'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './MegaDropdown.module.css';

export interface MegaDropdownProps {
  category: 'sports' | 'concerts' | 'theater';
  dataMap: Record<string,string[]>;
  baseQuery: string;
}

export default function MegaDropdown({
  category,
  dataMap,
  baseQuery,
}: MegaDropdownProps) {
  const tabs = Object.keys(dataMap);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const items = dataMap[activeTab] || [];

  const linkFor = (item: string) => {
    if (category === 'sports') {
      return `/events?category=sports&league=${encodeURIComponent(activeTab)}&team=${encodeURIComponent(item)}${baseQuery}`;
    }
    if (category === 'concerts') {
      return `/events?category=concerts&artist=${encodeURIComponent(item)}${baseQuery}`;
    }
    return `/events?category=theater&show=${encodeURIComponent(item)}${baseQuery}`;
  };

  return (
    <div className={styles.megaWrapper}>
      <div className={styles.megaInner}>
        {category === 'sports' && (
          <nav className={styles.megaTabs}>
            {tabs.map(tab => (
              <button
                key={tab}
                onMouseEnter={() => setActiveTab(tab)}
                className={activeTab === tab ? styles.megaTabActive : styles.megaTabInactive}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </nav>
        )}

        <div className={styles.megaGrid}>
          {items.map((item, idx) => (
            <Link
              key={`${activeTab}-${item}-${idx}`}
              href={linkFor(item)}
              className={styles.megaItem}
            >
              {item}
            </Link>
          ))}
        </div>

        <div className={styles.megaFooter}>
          <Link
            href={`/events?category=${category}${baseQuery}`}
            className={styles.megaViewAll}
          >
            View All {category.charAt(0).toUpperCase() + category.slice(1)}
          </Link>
        </div>
      </div>
    </div>
  );
}
