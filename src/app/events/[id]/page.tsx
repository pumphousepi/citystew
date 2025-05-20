'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

// Define interface for event data
interface EventData {
  name: string;
  dates?: {
    start?: {
      localDate?: string;
    };
  };
  _embedded?: {
    venues?: Array<{ name?: string }>;
  };
  info?: string;
  url?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const baseURL =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://www.citystew.com';

      try {
        const res = await fetch(`${baseURL}/api/event-details/${id}`);
        const data = await res.json();
        setEvent(data);
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  if (loading) return <p>Loading event details...</p>;
  if (!event) return <p>No event found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
      <p className="mb-2">{event.dates?.start?.localDate}</p>
      <p className="mb-2">{event._embedded?.venues?.[0]?.name}</p>
      <p className="mb-2">{event.info || 'No description available.'}</p>
      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Buy Tickets
      </a>
    </div>
  );
}
