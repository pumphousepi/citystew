import HeroSection from './components/HeroSection';
import Header from './components/Header'; // or Navbar
import Categories from './components/Categories';
import Sponsors from './components/Sponsors';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import EventList from './events/page';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="bg-white text-gray-900">
        <HeroSection />
        <Categories />

        {/* Event List Section */}
        <section className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Events Near You</h2>
          <EventList />
        </section>

        <Sponsors />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
