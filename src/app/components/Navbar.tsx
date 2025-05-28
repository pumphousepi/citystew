'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CityOption {
  name: string;
  abbreviation: string;
  label: string;  // e.g. "Austin, TX"
}

interface NavbarProps {
  onSelectLocation: (loc: string) => void;
  onSelectCategory: (cat: string) => void;
  onSelectGenre: (genre: string) => void;
}

export default function Navbar({
  onSelectLocation,
  onSelectCategory,
  onSelectGenre,
}: NavbarProps) {
  const [cities, setCities] = useState<CityOption[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Load city list once
  useEffect(() => {
    fetch('/api/locations/cities')
      .then((res) => res.json())
      .then((data: CityOption[]) => setCities(data))
      .catch(console.error);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (menu: string) =>
    setOpenDropdown((prev) => (prev === menu ? null : menu));

  // Static lists for categories/genres/theater
  const categoryList = ['Food', 'Sports'];
  const genreList = [
    'Rock',
    'Pop',
    'Jazz',
    'Country',
    'Hip Hop',
    'Electronic',
    'Classical',
    'R&B',
  ];
  const theaterList = ['Movies', 'Live Performances'];

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full bg-black bg-opacity-60 backdrop-blur-md z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-white">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold">
          CityStew
        </a>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-8">
          {/* CITIES */}
          <li className="relative">
            <button
              onClick={() => toggle('cities')}
              className="hover:text-gray-300"
            >
              CITIES
            </button>
            {openDropdown === 'cities' && (
              <ul className="absolute mt-2 w-48 bg-white text-black rounded shadow-lg overflow-auto max-h-64">
                {cities.map((c) => (
                  <li key={c.label}>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        onSelectLocation(c.label);
                        setOpenDropdown(null);
                      }}
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* CATEGORIES */}
          <li className="relative">
            <button
              onClick={() => toggle('categories')}
              className="hover:text-gray-300"
            >
              CATEGORIES
            </button>
            {openDropdown === 'categories' && (
              <ul className="absolute mt-2 w-48 bg-white text-black rounded shadow-lg">
                {categoryList.map((cat) => (
                  <li key={cat}>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        onSelectCategory(cat.toLowerCase());
                        setOpenDropdown(null);
                      }}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* CONCERTS */}
          <li className="relative">
            <button
              onClick={() => toggle('concerts')}
              className="hover:text-gray-300"
            >
              CONCERTS
            </button>
            {openDropdown === 'concerts' && (
              <ul className="absolute mt-2 w-48 bg-white text-black rounded shadow-lg overflow-auto max-h-64">
                {genreList.map((g) => (
                  <li key={g}>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        onSelectCategory('music');
                        onSelectGenre(g);
                        setOpenDropdown(null);
                      }}
                    >
                      {g}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* THEATER */}
          <li className="relative">
            <button
              onClick={() => toggle('theater')}
              className="hover:text-gray-300"
            >
              THEATER
            </button>
            {openDropdown === 'theater' && (
              <ul className="absolute mt-2 w-48 bg-white text-black rounded shadow-lg">
                {theaterList.map((t) => (
                  <li key={t}>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        onSelectCategory('theater');
                        onSelectGenre(t.toLowerCase().replace(/\s+/g, ''));
                        setOpenDropdown(null);
                      }}
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        {/* Mobile menu toggle (optional) */}
        {/* …you can re‑use your existing mobile panel here… */}
      </div>
    </nav>
  );
}
