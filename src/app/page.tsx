'use client';

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrendingEvents from './components/TrendingEvents';
import Categories from './components/Categories';
import ThreeColumnSection from './components/ThreeColumnSection'; // now renders Sports/Concerts/Theater Near You
import TheaterList from './components/TheaterList';
import Sponsors from './components/Sponsors';
import Footer from './components/Footer';

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState('Austin, TX');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  return (
    <>
      <Navbar
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        onSelectCategory={setSelectedCategory}
        onSelectGenre={setSelectedGenre}
      />

      <main className="bg-white text-gray-900 min-h-screen pt-16">
        <HeroSection />

        <TrendingEvents
          location={selectedLocation}
          category={selectedCategory}
          genre={selectedGenre}
          onSelectLocation={setSelectedLocation}
        />

        <Categories />

        {/* ThreeColumnSection now only needs location */}
        <ThreeColumnSection location={selectedLocation} />

        {/* New Movie Theaters section */}
        <TheaterList location={selectedLocation} />

        <Sponsors />
      </main>

      <Footer />
    </>
  );
}
