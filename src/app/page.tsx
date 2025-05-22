'use client';

import { useState } from 'react';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LocationSearchBar from './components/LocationSearchBar';
import TimeFilter from './components/TimeFilter';
import TrendingEvents from './components/TrendingEvents';
import Categories from './components/Categories';
import ThreeColumnSection from './components/ThreeColumnSection';
import Sponsors from './components/Sponsors';
import Footer from './components/Footer';

export default function HomePage() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [timeFilter, setTimeFilter] = useState('Today');

  return (
    <>
      <Navbar />
      <main className="bg-white text-gray-900 min-h-screen">
        <HeroSection />

        <LocationSearchBar
          onSelectLocation={(city, state) => {
            setSelectedCity(city);
            setSelectedState(state);
          }}
        />

        <TimeFilter selected={timeFilter} onChange={setTimeFilter} />

        <TrendingEvents location={selectedCity} timeFilter={timeFilter} />

        <Categories />

        <ThreeColumnSection location={selectedCity} timeFilter={timeFilter} />

        <Sponsors />
      </main>
      <Footer />
    </>
  );
}
