// src/app/components/HeroSection.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = search.trim();
    if (q) {
      router.push(`/search?query=${encodeURIComponent(q)}`);
    }
  };

  return (
    <section id="hero-section" className="hero-section">
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-title">Discover Local Events Near You</h1>
        <p className="hero-subtitle">
          Music, food, sports, and more — happening in your city now.
        </p>

        {/* only the search form */}
        <form onSubmit={handleSearch} className="hero-search-form">
          <input
            type="text"
            placeholder="Search events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="hero-search-input"
          />
          <button type="submit" className="hero-search-button">
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
