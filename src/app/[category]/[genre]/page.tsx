import EventHeader from '../../components/EventHeader';
import Footer from '../../components/Footer';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    category: string;
    genre: string;
  };
}

export default async function CategoryGenrePage({ params }: PageProps) {
  const { category, genre } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events?category=${category}&genre=${genre}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return notFound();

  const events = await res.json();

  return (
    <div className="bg-white min-h-screen text-black">
      <EventHeader
        eventName={`${genre} ${category}`}
        eventDateTime=""
        venueName=""
        venueLocation=""
      />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6">
          Showing results for <span className="capitalize">{genre}</span> in{' '}
          <span className="capitalize">{category}</span>
        </h2>

        {Array.isArray(events) && events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <div key={event.id} className="border p-4 rounded shadow">
                <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.date}</p>
                <p className="text-sm text-gray-600">{event.venue}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No events found.</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
