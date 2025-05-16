import Navbar from './components/Navbar';
import EventList from './events/page';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
          Live Music Near You
        </h1>
        <EventList />
      </main>
    </>
  );
}
