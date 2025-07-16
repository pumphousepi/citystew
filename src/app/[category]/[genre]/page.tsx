import { Metadata } from 'next';
import Footer from '../../components/Footer';
import EventHeader from '../../components/EventHeader';
import { notFound } from 'next/navigation';

type PageProps = {
  params: {
    category: string;
    genre: string;
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `${params.genre.toUpperCase()} ${params.category.toUpperCase()} | CityStew`,
    description: `Discover ${params.genre} ${params.category} events near you!`,
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
    <>
      <EventHeader
        eventName={`${genre.toUpperCase()} ${category.toUpperCase()}`}
        eventDateTime=""
        venueName=""
        venueLocation=""
      />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6">
          Showing results for {genre.toUpperCase()} in {category.toUpperCase()}
        </h2>

        {Array.isArray(events) && events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <div key={event.id} className="border p-4 rounded shadow">
                <h3 className="font-bold">{event.title}</h3>
                <p>{event.date}</p>
                <p>{event.venue}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No events found.</p>
        )}
      </main>

      <Footer />
    </>
  );
}
