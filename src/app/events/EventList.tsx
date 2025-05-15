'use client';

import { useEffect, useState } from 'react';

interface Event {
  id: string;
  name: string;
  date: string;
  image?: string;
  // add more fields based on your API data
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data.events || []); // adjust depending on your response shape
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (events.length === 0) return <p>No events found.</p>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {events.map(event => (
        <div key={event.id} className="border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300">
          {event.image && (
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-36 object-cover rounded-md mb-3"
            />
          )}
          <h3 className="font-semibold text-lg">{event.name}</h3>
          <p className="text-sm text-gray-500">{event.date}</p>
        </div>
      ))}
    </div>
  );
}
