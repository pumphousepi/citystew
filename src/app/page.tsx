import HeroSection from './components/HeroSection';
import TrendingEvents from './components/TrendingEvents';
import Sponsors from './components/Sponsors';
import Footer from './components/Footer';
import EventList from './components/EventList';
import Navbar from './components/Navbar';
import Categories from './components/Categories';

export default function HomePage() {
  return (
    <>
      <Navbar />
<main className="bg-white text-gray-900">
  <HeroSection />
  <TrendingEvents />
  
  {/* Full width Events Near You Section */}
<section className="py-12">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Events Near You</h2>
    <EventList />
  </div>
</section>
  
  <Categories/>
  <Sponsors />
</main>
      <Footer />
    </>
  );
}
