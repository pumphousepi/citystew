'use client';

import { useState } from 'react';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LocationSearchBar from './components/LocationSearchBar';
import TrendingEvents from './components/TrendingEvents';
import Categories from './components/Categories';
import ThreeColumnSection from './components/ThreeColumnSection';
import Sponsors from './components/Sponsors';
import Footer from './components/Footer';

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');

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

        <TrendingEvents location={selectedCity} />

        <Categories />

        <ThreeColumnSection city={selectedCity} state={selectedState} />

        <Sponsors />
      </main>
      <Footer />
    </>
  );
}
