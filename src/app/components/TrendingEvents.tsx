'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
}

const filters = [
  'Any Dates',
  'This Weekend',
  'Next 7 Days',
  'Next Weekend',
  'This Month',
  'Next 30 Days',
  'Next 60 Days',
];

const trendingEvents: Event[] = [
  {
    id: '1',
    title: 'Taylor Swift – Eras Tour',
    date: 'June 5, 2025',
    location: 'MetLife Stadium, NJ',
    imageUrl: '/assets/images/taylor.jpg',
  },
  {
    id: '2',
    title: 'NBA Finals: Game 1',
    date: 'June 10, 2025',
    location: 'TD Garden, Boston',
    imageUrl: '/assets/images/nba.jpg',
  },
  {
    id: '3',
    title: 'Hamilton Musical',
    date: 'May 25, 2025',
    location: 'Fox Theatre, Atlanta',
    imageUrl: '/assets/images/hamilton.jpg',
  },
  {
    id: '4',
    title: 'Monster Jam',
    date: 'May 30, 2025',
    location: 'Fox Theatre, Atlanta',
    imageUrl: '/assets/images/monstertruck.jpg',
  },
  {
    id: '5',
    title: 'Coldplay Concert',
    date: 'July 12, 2025',
    location: 'Wembley Stadium, London',
    imageUrl: '/assets/images/coldplay.jpg',
  },
  {
    id: '6',
    title: 'Chicago Bears Game',
    date: 'August 1, 2025',
    location: 'Soldier Field, Chicago',
    imageUrl: '/assets/images/chicago-bears.jpg',
  },
  {
    id: '7',
    title: 'Boston Red Sox vs Yankees',
    date: 'August 15, 2025',
    location: 'Fenway Park, Boston',
    imageUrl: '/assets/images/red-sox.jpg',
  },
  {
    id: '8',
    title: 'LA Lakers vs Miami Heat',
    date: 'September 5, 2025',
    location: 'Staples Center, LA',
    imageUrl: '/assets/images/lakers.jpg',
  },
];

export default function TrendingEvents() {
  const [activeFilter, setActiveFilter] = useState('Any Dates');

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Trending Events</h2>

        {/* Filters row */}
        <div
          className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 mb-8 px-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-shrink-0 px-4 py-2 rounded-full border ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              } transition`}
              style={{ scrollSnapAlign: 'start' }}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Events horizontal scroll */}
        <div
          className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {trendingEvents.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="flex-none w-60 rounded-lg bg-white shadow hover:shadow-lg transition duration-300"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.date}</p>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
