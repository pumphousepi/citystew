'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './MegaDropdown.module.css';
import { slugify } from '../../utils/slugify';

export interface MegaDropdownProps {
  category: 'sports' | 'concerts' | 'theater';
  dataMap: Record<string, string[]>;
  baseQuery: string; // expected to be like "?city=...&state=..."
}

export default function MegaDropdown({
  category,
  dataMap,
  baseQuery,
}: MegaDropdownProps) {
  const tabs = Object.keys(dataMap);
  const [activeTab, setActiveTab] = useState<string>(tabs[0] ?? '');
  const items = (activeTab ? dataMap[activeTab] : [])?.slice(0, 30) || [];

  const linkFor = (item: string) => {
    if (category === 'sports') {
      const slug = slugify ? slugify(item) : item.toLowerCase().replace(/\s+/g, '-');
      return `/teams/${slug}`;
    }
    // copy base query (strip leading '?'), then add category-specific params
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
        {category === 'sports' && tabs.length > 0 && (
          <div className={styles.megaTabs}>
            {tabs.map((tab) => (
              <button
                key={tab}
                className={tab === activeTab ? styles.megaTabActive : styles.megaTabInactive}
                onMouseEnter={() => setActiveTab(tab)}
                onFocus={() => setActiveTab(tab)}
                type="button"
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
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
