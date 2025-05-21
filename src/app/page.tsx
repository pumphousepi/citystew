'use client';

import { useEffect, useState } from 'react';

import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import TrendingEvents from './components/TrendingEvents';
import Sponsors from './components/Sponsors';
import Footer from './components/Footer';
import EventList from './components/EventList';
import Navbar from './components/Navbar';
import Categories from './components/Categories';
import ThreeColumnSection from './components/ThreeColumnSection';

interface State {
  name: string;
  abbreviation: string;
}

export default function HomePage() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [timeFilter, setTimeFilter] = useState('Today');
  const [states, setStates] = useState<State[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);

  useEffect(() => {
    async function fetchStates() {
      try {
        const res = await fetch('/api/locations/states');
        const data = await res.json();

        if (Array.isArray(data)) {
          setStates(data);
        } else {
          console.warn('Invalid states response:', data);
          setStates([]);
        }
      } catch (error) {
        console.error('Failed to fetch states:', error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    }

    fetchStates();
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-white text-gray-900 min-h-screen">
        <HeroSection />

        <FilterBar
          states={states}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          loadingStates={loadingStates}  // pass loading state
        />

        <TrendingEvents location={selectedCity} timeFilter={timeFilter} />

        <Categories />
        <ThreeColumnSection location={selectedCity} timeFilter={timeFilter} />
        <Sponsors />
      </main>
      <Footer />
    </>
  );
}
