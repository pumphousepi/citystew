// src/app/components/Categories.tsx
'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryCard from './CategoryCard';

const categories = [
  { image: '/assets/images/NHL_card.jpg', title: 'NHL' },
  { image: '/assets/images/NCAAFB_card.jpg', title: 'NCAAFB' },
  { image: '/assets/images/NCAABB_card.jpg', title: 'NCAABB' },
  { image: '/assets/images/MLB_card.jpg', title: 'MLB' },
  { image: '/assets/images/MLS_card.jpg', title: 'MLS' },
  { image: '/assets/images/NFL_card.jpg', title: 'NFL' },
  { image: '/assets/images/NBA_card.jpg', title: 'NBA' },
  { image: '/assets/images/concert_card.jpg', title: 'Concerts' },
];

export default function Categories() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (distance: number) => {
    scrollerRef.current?.scrollBy({ left: distance, behavior: 'smooth' });
  };

  return (
    <section id="categories" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 relative">
        <h2 className="text-2xl font-bold text-left mb-6">Popular Categories</h2>

        {/* Left arrow */}
        <button
          onClick={() => scrollBy(-200)}
          className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Scroll container */}
        <div
          ref={scrollerRef}
          className="flex space-x-4 overflow-x-auto scroll-smooth scrollbar-hidden pb-2"
        >
          {categories.map(({ image, title }) => (
            <div key={title} className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
              <CategoryCard title={title} image={image} />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scrollBy(200)}
          className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </section>
  );
}
