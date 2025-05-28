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
  // 1) Always seed with New Braunfels, TX so feeds load immediately
  const [selectedLocation, setSelectedLocation] =
    useState('New Braunfels, TX');

  // 2) Track category (food, sports, theater, music) from the navbar
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // 3) Track genre/sub‑type (for concerts or theater) from the navbar
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  return (
    <>
      {/* 
        Wire your Navbar up to page‑level state:
        - onSelectLocation updates location 
        - onSelectCategory updates category 
        - onSelectGenre updates genre/sub‑type 
      */}
      <Navbar
        onSelectLocation={setSelectedLocation}
        onSelectCategory={setSelectedCategory}
        onSelectGenre={setSelectedGenre}
      />

      <main className="bg-white text-gray-900 min-h-screen pt-16">
        <HeroSection />

        {/* Keep your LocationSearchBar so the user can type/select as well */}
        <LocationSearchBar onSelectLocation={setSelectedLocation} />

        {/* Pass category & genre into your feeds */}
        <TrendingEvents
          location={selectedLocation}
          category={selectedCategory}
          genre={selectedGenre}
        />

        <Categories />

        {/* ThreeColumnSection can also respond to category & genre */}
        {selectedLocation.includes(',') ? (
          <ThreeColumnSection
            location={selectedLocation}
            category={selectedCategory}
            genre={selectedGenre}
          />
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
