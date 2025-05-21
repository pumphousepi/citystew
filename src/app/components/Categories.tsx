'use client';

import CategoryCard from './CategoryCard';

const categories = [
  { image: '/assets/images/NHL_card.jpg', title: 'NHL' },
  { image: '/assets/images/NCVVFB_card.jpg', title: 'NCAAFB' },
  { image: '/assets/images/NCAABB_card.jpg', title: 'NCAABB' },
  { image: '/assets/images/MLB_card.jpg', title: 'MLB' },
  { image: '/assets/images/MLS_card.jpg', title: 'MLS' },
  { image: '/assets/images/NFL_card.jpg', title: 'NFL' },
  { image: '/assets/images/NBA_card.jpg', title: 'NBA' },
  { image: '/assets/images/concert_card', title: 'Concerts' },
];

export default function Categories() {
  return (
    <section id="categories" className="py-12 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-6">Popular Categories</h2>
      <div className="flex space-x-6 overflow-x-auto px-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {categories.map(({ image, title }) => (
          <CategoryCard
            key={title}
            title={title}
            image={image}
            href={`/categories/${title.toLowerCase()}`}
          />
        ))}
      </div>
    </section>
  );
}
