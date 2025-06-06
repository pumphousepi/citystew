// src/app/components/Categories.tsx
'use client';

import React from 'react';
import CategoryCard from './CategoryCard';
import Link from 'next/link';

const categories = [
  { image: '/assets/images/NHL_card.jpg',     title: 'NHL'      },
  { image: '/assets/images/NCAAFB_card.jpg',  title: 'NCAAFB'   },
  { image: '/assets/images/NCAABB_card.jpg',  title: 'NCAABB'   },
  { image: '/assets/images/MLB_card.jpg',     title: 'MLB'      },
  { image: '/assets/images/MLS_card.jpg',     title: 'MLS'      },
  { image: '/assets/images/NFL_card.jpg',     title: 'NFL'      },
  { image: '/assets/images/NBA_card.jpg',     title: 'NBA'      },
  { image: '/assets/images/concert_card.jpg', title: 'Concerts' },
];

export default function Categories() {
  const visible = categories.slice(0, 4);

  return (
    <section id="categories" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-left mb-6">Popular Categories</h2>

        {/* ─── Grid of first four ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {visible.map(({ image, title }) => (
            <div key={title} className="h-full">
              <CategoryCard title={title} image={image} />
            </div>
          ))}
        </div>

        {/* ─── “View All” Link ─── */}
        <div className="mt-6 flex justify-end">
          <Link
            href="/categories"
            className="text-sm text-blue-600 hover:underline"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
