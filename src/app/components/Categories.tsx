'use client';

import EventCard from './EventCard'; // Adjust the import path

const categories = [
  { img: '/assets/images/fork_icon.jpg', title: 'Food', desc: 'Find local food events and more!' },
  { img: '/assets/images/music-note_icon.jpg', title: 'Music', desc: 'Explore music events in your area!' },
  { img: '/assets/images/soccer-ball_icon.jpg', title: 'Sports', desc: 'Catch the latest sports events!' },
];

export default function Categories() {
  return (
    <section id="categories" className="py-12 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-6">Popular Categories</h2>
      <div className="flex justify-center space-x-6 overflow-x-auto px-4">
        {categories.map(({ img, title, desc }) => (
          <EventCard
            key={title}
            title={title}
            image={img}
            description={desc}
            href={`/categories/${title.toLowerCase()}`} // Optional link if you want
          />
        ))}
      </div>
    </section>
  );
}
