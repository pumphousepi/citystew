'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Event {
  id: string;
  name: string;
  dates?: {
    start?: {
      localDate?: string;
    };
  };
  images?: {
    url: string;
    width?: number;
    height?: number;
  }[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('New York, NY');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    async function fetchSearchResults() {
      try {
        const res = await fetch(`/api/events?query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Failed to fetch search results');
        const data = await res.json();
        setEvents(data._embedded?.events || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (query) fetchSearchResults();
  }, [query]);

      return (
      <div className="bg-white text-black min-h-screen flex flex-col">
        <Navbar 
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          onSelectCategory={setSelectedCategory}
          onSelectGenre={setSelectedGenre}
        />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Search Results for “{query}”</h1>

        {loading ? (
          <p className="text-lg">Loading search results...</p>
        ) : events.length === 0 ? (
          <p className="text-lg text-gray-600">No results found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events.map(event => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="rounded-lg border p-4 shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {event.images?.[0]?.url && (
                  <div className="relative w-full h-40 mb-3 rounded-md overflow-hidden">
                    <Image
                      src={event.images[0].url}
                      alt={event.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-lg">{event.name}</h3>
                <p className="text-sm text-gray-500">
                  {event.dates?.start?.localDate || 'Date TBD'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
