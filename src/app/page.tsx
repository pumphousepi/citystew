// src/app/page.tsx
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
  const [selectedLocation, setSelectedLocation] = useState('');

  return (
    <>
      <Navbar />
      <main className="bg-white text-gray-900 min-h-screen">
        <HeroSection />

        <LocationSearchBar
          onSelectLocation={(location) => {
            setSelectedLocation(location); // e.g. "New Braunfels, TX"
          }}
        />

        <TrendingEvents location={selectedLocation} />

        <Categories />

        {selectedLocation && selectedLocation.includes(',') ? (
          <ThreeColumnSection location={selectedLocation} />
        ) : (
          <div className="text-center py-10 text-gray-500">
            Please select a location to view more events.
          </div>
        )}

        <Sponsors />
      </main>
      <Footer />
    </>
  );
}
