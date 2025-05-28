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
  const [selectedLocation, setSelectedLocation] = useState('New Braunfels, TX');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  return (
    <>
      <Navbar
        onSelectLocation={setSelectedLocation}
        onSelectCategory={setSelectedCategory}
        onSelectGenre={setSelectedGenre}
      />

      <main className="bg-white text-gray-900 min-h-screen pt-16">
        <HeroSection />
        <LocationSearchBar onSelectLocation={setSelectedLocation} />
        <TrendingEvents
          location={selectedLocation}
          category={selectedCategory}
          genre={selectedGenre}
        />
        <Categories />
        <ThreeColumnSection
          location={selectedLocation}
          category={selectedCategory}
          genre={selectedGenre}
        />
        <Sponsors />
      </main>
      <Footer />
    </>
  );
}
