import HeroSection from './components/HeroSection';
import TrendingEvents from './components/TrendingEvents';
import Categories from './components/Categories';
import Sponsors from './components/Sponsors';
import Footer from './components/Footer';
import EventList from './components/EventList';
import Navbar from './components/Navbar';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-white text-gray-900">
        <HeroSection />
        <TrendingEvents/>
        <Categories />

        {/* Event List Section */}
        <section className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Events Near You</h2>
          <EventList />
        </section>

        <Sponsors />
      </main>
      <Footer />
    </>
  );
}
