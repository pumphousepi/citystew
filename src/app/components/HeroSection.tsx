'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (trimmed) {
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-title">Discover Local Events Near You</h1>
        <p className="hero-subtitle">
          Music, food, sports, and more — happening in your city now.
        </p>
        <form onSubmit={handleSearch} className="hero-search-form">
          <input
            type="text"
            placeholder="Search events, cities, or categories"
            className="hero-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="hero-search-button">
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
