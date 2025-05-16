// src/app/events/[id]/page.tsx
import { notFound } from 'next/navigation';

interface Params {
  params: {
    id: string;
  };
}

async function fetchEventDetails(id: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/event-details/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export default async function EventDetailsPage({ params }: Params) {
  const event = await fetchEventDetails(params.id);

  if (!event) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
      {event.image && (
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-64 object-cover mb-4 rounded"
        />
      )}
      <p className="text-gray-600 mb-2">{event.date}</p>
      <p className="text-gray-700">{event.description || 'No description available.'}</p>
    </div>
  );
}
