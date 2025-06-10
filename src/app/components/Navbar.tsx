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

  const [cities, setCities]               = useState<CityOption[]>([]);
  const [showInputs, setShowInputs]       = useState(false);
  const [searchTerm, setSearchTerm]       = useState('');
  const [openMenu, setOpenMenu]           = useState<'cities'|'sports'|'concerts'|'theater'|null>(null);
  const [showAllCities, setShowAllCities] = useState(false);
  const [theaterItems, setTheaterItems]   = useState<string[]>([]);
  const [mobileOpen, setMobileOpen]       = useState(false);

  // 1) Load cities once
  useEffect(() => {
    fetch('/api/locations/cities')
      .then(res => res.json())
      .then((data: CityOption[]) => setCities(data))
      .catch(console.error);
  }, []);

  // 2) Sticky search + city on scroll
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero-section');
      const navH = navRef.current?.offsetHeight ?? 0;
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

  // 4) Fetch theater titles when “THEATER” opens
  useEffect(() => {
    if (openMenu === 'theater') {
      const [city, state] = selectedLocation.split(',').map(s => s.trim());
      if (!city || !state) {
        setTheaterItems([]);
        return;
      }
      fetch(`/api/events?category=theater&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`)
        .then(res => res.json())
        .then((json: unknown) => {
          let arr: Array<{ title: string }> = [];
          if (Array.isArray(json)) {
            arr = json as Array<{ title: string }>;
          } else if (
            typeof json === 'object' &&
            json !== null &&
            Array.isArray((json as any).events)
          ) {
            arr = (json as { events: Array<{ title: string }> }).events;
          }
          setTheaterItems(arr.map(evt => evt.title));
        })
        .catch(() => setTheaterItems([]));
    }
  }, [openMenu, selectedLocation]);

  // Build “?city=…&state=…” for mega dropdown
  const baseQuery = () => {
    const [city, state] = selectedLocation.split(',').map(s => s.trim());
    return city && state
      ? `?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`
      : '';
  };

  // Search on Enter
  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  // Pick city (updates parent state only)
  const pickCity = (label: string) => {
    onSelectLocation(label);
    setOpenMenu(null);
  };

  return (
    <nav
      ref={navRef}
      onMouseLeave={() => setOpenMenu(null)}
      className={`sticky top-0 w-full z-50 transition-colors duration-200 ${
        showInputs ? 'bg-black bg-opacity-90 text-white' : 'bg-transparent text-white'
      }`}
    >
      {/* Header bar */}
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <button onClick={() => router.push('/')} className="text-2xl font-bold">
          CityStew
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center space-x-8">
          {(['cities','sports','concerts','theater'] as const).map(key => (
            <li key={key} onMouseEnter={() => setOpenMenu(key)}>
              <NavButton
                active={openMenu === key}
                onClick={() => {
                  if (key === 'cities') {
                    pickCity(selectedLocation);
                  } else {
                    onSelectCategory(key === 'concerts' ? 'music' : key);
                    setOpenMenu(key);
                  }
                }}
              >
                {key.toUpperCase()}
              </NavButton>
            </li>
          ))}
        </ul>

        {/* Sticky search + small city selector */}
        {showInputs && (
          <div className="hidden md:flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search events…"
              className="w-72 px-3 py-2 border rounded bg-white text-black"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={onSearchKey}
            />
            <div className="relative" onMouseEnter={() => setOpenMenu('cities')}>
              <NavButton active={openMenu === 'cities'}>
                <span className="text-blue-400">{selectedLocation}</span>
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 
                      0 111.06 1.06l-4.24 4.24a.75.75 0 
                      01-1.06 0L5.21 8.27a.75.75 0 
                      01.02-1.06z"
                  />
                </svg>
              </NavButton>
              {openMenu === 'cities' && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-40">
                  <ul className="grid grid-cols-2 gap-2 max-h-60 overflow-auto p-2">
                    {cities.map(c => (
                      <li key={c.label}>
                        <button
                          onClick={() => pickCity(c.label)}
                          className="block w-full text-left px-2 py-1 text-gray-800 hover:bg-gray-100 text-sm"
                        >
                          {c.name}, {c.abbreviation}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <span className="text-2xl">&times;</span>
          ) : (
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-6 h-0.5 bg-white" />
            </div>
          )}
        </button>
      </div>

      {/* Cities dropdown */}
      {openMenu === 'cities' && (
        <div className="absolute top-full left-0 right-0 w-full bg-white shadow-lg z-30">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-auto">
              {(showAllCities ? cities : cities.slice(0, 15)).map(c => (
                <button
                  key={c.label}
                  onClick={() => pickCity(c.label)}
                  className="text-left px-2 py-1 text-gray-800 hover:bg-gray-100 text-sm rounded"
                >
                  {c.name}, {c.abbreviation}
                </button>
              ))}
            </div>
            {cities.length > 15 && (
              <div className="mt-2 text-right">
                <button
                  onClick={() => setShowAllCities(v => !v)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {showAllCities ? 'Show Less' : 'View All Cities'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mega menus */}
      {openMenu && openMenu !== 'cities' && (
        <div className="absolute top-full left-0 right-0 w-full bg-white shadow-lg z-30">
          <div className="max-w-7xl mx-auto px-6 py-4">
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
          </div>
        </div>
      )}

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden bg-black bg-opacity-90 px-4 py-4">
          {/* existing mobile submenu */}
        </div>
      )}
    </nav>
  );
}
