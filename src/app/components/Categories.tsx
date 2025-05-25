'use client';

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
  return (
    <section id="categories" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-left mb-6">Popular Categories</h2>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <div className="flex space-x-4">
            {categories.map(({ image, title }) => (
              <div key={title} className="flex-shrink-0 w-1/4">
                <CategoryCard title={title} image={image} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
