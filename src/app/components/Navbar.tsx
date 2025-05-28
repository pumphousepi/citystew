// src/app/components/Navbar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CityOption {
  name: string;
  abbreviation: string;
  label: string;  // e.g. "New Braunfels, TX"
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Load cities once
  useEffect(() => {
    fetch('/api/locations/cities')
      .then((r) => r.json())
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

  const toggleDropdown = (menu: string) =>
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  const toggleMobile = () => {
    setMobileOpen((p) => !p);
    setMobileSubmenu(null);
  };
  const toggleMobileSubmenu = (menu: string) =>
    setMobileSubmenu((prev) => (prev === menu ? null : menu));

  const categoryList = ['Food', 'Sports'];
  const genreList = [
    'Rock', 'Pop', 'Jazz', 'Country',
    'Hip Hop','Electronic','Classical','R&B',
  ];
  const theaterList = ['Movies', 'Live Performances'];

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full bg-black bg-opacity-60 backdrop-blur-md z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-white">
        <a href="/" className="text-2xl font-bold">CityStew</a>

        {/* Desktop */}
        <ul className="hidden md:flex space-x-8">
          {/** CITIES **/}
          <li className="relative">
            <button onClick={() => toggleDropdown('cities')} className="hover:text-gray-300">
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

          {/** CATEGORIES **/}
          <li className="relative">
            <button onClick={() => toggleDropdown('categories')} className="hover:text-gray-300">
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

          {/** CONCERTS **/}
          <li className="relative">
            <button onClick={() => toggleDropdown('concerts')} className="hover:text-gray-300">
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

          {/** THEATER **/}
          <li className="relative">
            <button onClick={() => toggleDropdown('theater')} className="hover:text-gray-300">
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

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded bg-gray-800 hover:bg-gray-700"
          onClick={toggleMobile}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white text-black shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-4">
            {/* Cities */}
            <div>
              <button
                className="w-full text-left font-semibold"
                onClick={() => toggleMobileSubmenu('cities')}
              >
                CITIES
              </button>
              {mobileSubmenu === 'cities' && (
                <div className="pl-4 space-y-1">
                  {cities.map((c) => (
                    <button
                      key={c.label}
                      className="block w-full text-left py-1"
                      onClick={() => {
                        onSelectLocation(c.label);
                        setMobileOpen(false);
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Categories */}
            <div>
              <button
                className="w-full text-left font-semibold"
                onClick={() => toggleMobileSubmenu('categories')}
              >
                CATEGORIES
              </button>
              {mobileSubmenu === 'categories' && (
                <div className="pl-4 space-y-1">
                  {categoryList.map((cat) => (
                    <button
                      key={cat}
                      className="block w-full text-left py-1"
                      onClick={() => {
                        onSelectCategory(cat.toLowerCase());
                        setMobileOpen(false);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Concerts */}
            <div>
              <button
                className="w-full text-left font-semibold"
                onClick={() => toggleMobileSubmenu('concerts')}
              >
                CONCERTS
              </button>
              {mobileSubmenu === 'concerts' && (
                <div className="pl-4 space-y-1">
                  {genreList.map((g) => (
                    <button
                      key={g}
                      className="block w-full text-left py-1"
                      onClick={() => {
                        onSelectCategory('music');
                        onSelectGenre(g);
                        setMobileOpen(false);
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theater */}
            <div>
              <button
                className="w-full text-left font-semibold"
                onClick={() => toggleMobileSubmenu('theater')}
              >
                THEATER
              </button>
              {mobileSubmenu === 'theater' && (
                <div className="pl-4 space-y-1">
                  {theaterList.map((t) => (
                    <button
                      key={t}
                      className="block w-full text-left py-1"
                      onClick={() => {
                        onSelectCategory('theater');
                        onSelectGenre(t.toLowerCase().replace(/\s+/g, ''));
                        setMobileOpen(false);
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
