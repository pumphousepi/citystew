// src/app/components/MegaDropdown.tsx
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
    const slug = item.toLowerCase().replace(/\s+/g, '-');
    
    if (category === 'sports') {
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
