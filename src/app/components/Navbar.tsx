// src/app/components/Navbar.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavButton from './NavButton';
import MegaDropdown from './MegaDropdown';
import { sportsData } from './_megaData';

interface CityOption {
  name: string;
  abbreviation: string;
  label: string;
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

  const [cities, setCities] = useState<CityOption[]>([]);
  const [showInputs, setShowInputs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenu, setOpenMenu] = useState<'cities'|'sports'|'concerts'|'theater'|null>(null);
  const [showAllCities, setShowAllCities] = useState(false);
  const [theaterItems, setTheaterItems] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // 1) Load cities once
  useEffect(() => {
    fetch('/api/locations/cities')
      .then(r => r.json())
      .then((data: CityOption[]) => setCities(data))
      .catch(console.error);
  }, []);

  // 2) Show search+small-city when hero scrolls under nav
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero-section');
      const navH = navRef.current?.offsetHeight || 0;
      if (hero) {
        setShowInputs(hero.getBoundingClientRect().bottom <= navH + 5);
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 3) Close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setShowAllCities(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 4) Fetch theater shows when hovering theater
  useEffect(() => {
    if (openMenu === 'theater') {
      const [city, state] = selectedLocation.split(',').map(s => s.trim());
      if (!city || !state) return;
      fetch(`/api/events?category=theater&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`)
        .then(r => r.json())
        .then((data: any) => {
          const arr = Array.isArray(data)
            ? data
            : Array.isArray(data.events)
              ? data.events
              : [];
          setTheaterItems(arr.map((e: any) => e.title));
        })
        .catch(() => setTheaterItems([]));
    }
  }, [openMenu, selectedLocation]);

  // Build “?city=…&state=…” once
  const baseQuery = () => {
    const [city, state] = selectedLocation.split(',').map(s => s.trim());
    return city && state
      ? `?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`
      : '';
  };

  // Search ENTER
  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  // When a city is chosen
  const chooseCity = (label: string) => {
    onSelectLocation(label);
    const [city, state] = label.split(',').map(s => s.trim());
    router.push(`/events?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`);
    setOpenMenu(null);
  };

  return (
    <nav
      ref={navRef}
      className={`relative sticky top-0 z-50 w-full transition-colors duration-300 ${
        showInputs ? 'bg-black bg-opacity-90 text-white' : 'bg-transparent text-white'
      }`}
    >
      {/* ─── HEADER ─── */}
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button onClick={() => router.push('/')} className="text-2xl font-bold">
          CityStew
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center space-x-6">
          {(['cities','sports','concerts','theater'] as const).map((key) => (
            <li
              key={key}
              className="relative"
              onMouseEnter={() => {
                setOpenMenu(key);
                if (key === 'sports') onSelectCategory('sports');
                if (key === 'concerts') onSelectCategory('music');
                if (key === 'theater') onSelectCategory('theater');
              }}
              onMouseLeave={() => setOpenMenu(openMenu === key ? null : openMenu)}
            >
              <NavButton className={`px-3 py-2 ${
                openMenu === key ? 'bg-gray-800 text-white' : 'text-white'
              }`}>
                {key.toUpperCase()}
              </NavButton>
            </li>
          ))}
        </ul>

        {/* Search + small city selector after scroll */}
        {showInputs && (
          <div className="hidden md:flex items-center space-x-4">
            <input
              type="text"
              className="w-72 px-3 py-2 border rounded bg-white text-black"
              placeholder="Search…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={onSearchKey}
            />
            {/* (your small city selector here) */}
          </div>
        )}

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen
            ? <span className="text-white text-2xl">&times;</span>
            : (
              <div className="space-y-1">
                <span className="block w-6 h-0.5 bg-white"/>
                <span className="block w-6 h-0.5 bg-white"/>
                <span className="block w-6 h-0.5 bg-white"/>
              </div>
            )}
        </button>
      </div>

      {/* ─── DROPDOWN / MEGA-MENU PANEL ─── */}
      {openMenu && (
        <div className="absolute top-full left-0 right-0 w-full bg-white shadow-lg z-30">
          <div className="max-w-7xl mx-auto px-6 py-4">

            {/* Cities */}
            {openMenu === 'cities' && (
              <>
                <ul className="space-y-1">
                  {(showAllCities ? cities : cities.slice(0,15)).map(c => (
                    <li key={c.label}>
                      <button
                        onClick={() => chooseCity(c.label)}
                        className="block w-full text-left px-2 py-1 text-gray-800 hover:bg-gray-100 text-sm"
                      >
                        {c.name}, {c.abbreviation}
                      </button>
                    </li>
                  ))}
                </ul>
                {cities.length > 15 && !showAllCities && (
                  <div className="mt-2 text-right">
                    <button
                      onClick={() => setShowAllCities(true)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View All Cities
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Sports / Concerts / Theater Mega */}
            {openMenu !== 'cities' && (
              <MegaDropdown
                category={openMenu}
                dataMap={
                  openMenu === 'sports'
                    ? sportsData
                    : openMenu === 'concerts'
                      ? { 'All Genres': ['Rock','Pop','Jazz','Country','Hip Hop','Electronic','Classical','R&B'] }
                      : { 'All Theater': theaterItems }
                }
                baseQuery={baseQuery()}
              />
            )}
          </div>
        </div>
      )}

      {/* ─── Mobile Panel (below md) ─── */}
      {mobileOpen && (
        <div className="md:hidden bg-black bg-opacity-90 px-4 py-4">
          {/* …your existing mobile menu… */}
        </div>
      )}
    </nav>
  );
}
