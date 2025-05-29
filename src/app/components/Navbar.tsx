// src/app/components/Navbar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NavButton from './NavButton';
import styles from './Navbar.module.css';

interface CityOption {
  name: string;
  abbreviation: string;
  label: string; // e.g. "Austin, TX"
}

interface NavbarProps {
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  onSelectCategory: (cat: string) => void;
  onSelectGenre: (genre: string) => void;
}

export default function Navbar({
  selectedLocation,
  onSelectLocation,
  onSelectCategory,
  onSelectGenre,
}: NavbarProps) {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  const [cities, setCities]             = useState<CityOption[]>([]);
  const [searchTerm, setSearchTerm]     = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showInputs, setShowInputs]     = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);

  const categoryList = ['Food', 'Sports'];
  const genreList    = ['Rock','Pop','Jazz','Country','Hip Hop','Electronic','Classical','R&B'];
  const theaterList  = ['Movies','Live Performances'];

  // 1️⃣ Fetch city list
  useEffect(() => {
    fetch('/api/locations/cities')
      .then(r => r.json())
      .then((data: CityOption[]) => setCities(data))
      .catch(console.error);
  }, []);

  // 2️⃣ Show search + city picker when hero scrolls under nav
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero-section');
      const navH  = navRef.current?.offsetHeight || 0;
      if (hero) {
        setShowInputs(hero.getBoundingClientRect().bottom <= navH + 5);
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 3️⃣ Close all dropdowns when clicking outside
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setMobileSubmenu(null);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  // 4️⃣ Search on Enter
  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMobileOpen(false);
    }
  };

  const toggleDropdown = (menu: string) =>
    setOpenDropdown(prev => (prev === menu ? null : menu));
  const toggleMobile = () => {
    setMobileOpen(prev => !prev);
    setMobileSubmenu(null);
  };
  const toggleMobileSubmenu = (menu: string) =>
    setMobileSubmenu(prev => (prev === menu ? null : menu));

  return (
    <nav
      ref={navRef}
      className={`
        sticky top-0 left-0 w-full backdrop-blur-sm z-50 transition-colors duration-300
        ${showInputs ? 'bg-black bg-opacity-90 text-white' : 'bg-transparent text-white'}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          CityStew
        </Link>

        {/* Desktop main nav */}
        <ul className="hidden md:flex items-center space-x-8">
          {/* Cities */}
          <li className="relative">
            <NavButton
              onClick={() => toggleDropdown('cities')}
              className={
                openDropdown === 'cities'
                  ? styles.navButtonActive
                  : styles.navButton
              }
            >
              CITIES
            </NavButton>
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

          {/* Categories */}
          <li className="relative">
            <NavButton
              onClick={() => toggleDropdown('categories')}
              className={
                openDropdown === 'categories'
                  ? styles.navButtonActive
                  : styles.navButton
              }
            >
              CATEGORIES
            </NavButton>
            {openDropdown === 'categories' && (
              <ul className="absolute mt-2 w-48 bg-white text-black rounded shadow-lg">
                {categoryList.map(cat => (
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

          {/* Concerts */}
          <li className="relative">
            <NavButton
              onClick={() => toggleDropdown('concerts')}
              className={
                openDropdown === 'concerts'
                  ? styles.navButtonActive
                  : styles.navButton
              }
            >
              CONCERTS
            </NavButton>
            {openDropdown === 'concerts' && (
              <ul className="absolute mt-2 w-48 bg-white text-black rounded shadow-lg overflow-auto max-h-64">
                {genreList.map(g => (
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

          {/* Theater */}
          <li className="relative">
            <NavButton
              onClick={() => toggleDropdown('theater')}
              className={
                openDropdown === 'theater'
                  ? styles.navButtonActive
                  : styles.navButton
              }
            >
              THEATER
            </NavButton>
            {openDropdown === 'theater' && (
              <ul className="absolute mt-2 w-48 bg-white text-black rounded shadow-lg">
                {theaterList.map(t => (
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

        {/* Search + City dropdown on scroll */}
        {showInputs && (
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search events…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={onSearchKey}
              className="w-64 px-3 py-2 border rounded bg-white text-black"
            />

            {/* City selector */}
            <div className="relative">
              <NavButton
                onClick={() => toggleDropdown('nav-city')}
                className="flex items-center space-x-1"
                ariaHasPopup
              >
                <span className="text-blue-400">{selectedLocation}</span>
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0
                       011.06.02L10 10.94l3.71-3.71a.75.75
                       0 111.06 1.06l-4.24 4.24a.75.75
                       0 01-1.06 0L5.21 8.27a.75.75
                       0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </NavButton>
              {openDropdown === 'nav-city' && (
                <ul className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg overflow-auto max-h-64">
                  {cities.map(c => (
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
            </div>
          </div>
        )}

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded bg-gray-200 hover:bg-gray-300"
          onClick={toggleMobile}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-inner px-4 py-4 space-y-4">
          <input
            type="text"
            placeholder="Search events…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={onSearchKey}
            className="w-full px-3 py-2 border rounded bg-white text-black"
          />

          {/* Reuse same city dropdown in mobile */}
          <NavButton onClick={() => toggleMobileSubmenu('cities')}>
            {selectedLocation}
          </NavButton>
          {mobileSubmenu === 'cities' && (
            <div className="pl-4 space-y-1">
              {cities.map(c => (
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

          {/* You can add mobileSubmenu blocks for categories, concerts, theater here */}
        </div>
      )}
    </nav>
  );
}
