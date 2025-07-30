// src/app/components/Navbar.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavButton from './NavButton';
import MegaDropdown from './MegaDropdown';
import { sportsData } from '../../data/sportsData';
import { concertData, theaterData } from './_megaData';


interface CityOption {
  name: string;
  abbreviation: string;
  label: string;
}

interface EventData {
  title: string;
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
  const navRef = useRef<HTMLDivElement>(null);

  const [cities, setCities] = useState<CityOption[]>([]);
  const [showInputs, setShowInputs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenu, setOpenMenu] = useState<'cities' | 'sports' | 'concerts' | 'theater' | null>(null);
  const [showAllCities, setShowAllCities] = useState(false);
  const [theaterItems, setTheaterItems] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<'cities' | 'sports' | 'concerts' | 'theater' | null>(null);

  const baseQuery = (): string => {
    const [city, state] = selectedLocation.split(',').map(s => s.trim());
    return city && state ? `?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}` : '';
  };
  const queryString = baseQuery();

  useEffect(() => {
    fetch('/api/locations/cities')
      .then(r => r.json())
      .then((data: CityOption[]) => setCities(data))
      .catch(console.error);
  }, []);

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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setShowAllCities(false);
        setMobileSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (openMenu === 'theater') {
      const [city, state] = selectedLocation.split(',').map(s => s.trim());
      if (!city || !state) {
        setTheaterItems([]);
        return;
      }
      fetch(`/api/events?category=theater&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`)
        .then(r => r.json())
        .then((json: { events?: EventData[] }) => {
          const events = json?.events ?? [];
          setTheaterItems(events.map(e => e.title));
        })
        .catch(() => setTheaterItems([]));
    }
  }, [openMenu, selectedLocation]);

  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const pickCity = (label: string) => {
    onSelectLocation(label);
    setOpenMenu(null);
  };

  const toggleMobileSubmenu = (key: typeof mobileSubmenu) =>
    setMobileSubmenu(prev => (prev === key ? null : key));

  return (
    <nav ref={navRef} className="sticky top-0 inset-x-0 bg-black text-white z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => router.push('/')} className="text-2xl font-bold">
          CityStew
        </button>

        <ul className="hidden md:flex items-center space-x-8">
          {(['cities', 'sports', 'concerts', 'theater'] as const).map(key => (
            <li key={key} onMouseEnter={() => setOpenMenu(key)}>
              <NavButton
                active={openMenu === key}
                onClick={() => {
                  if (key === 'cities') pickCity(selectedLocation);
                  else {
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

        {showInputs && (
          <div className="hidden md:flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search events…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={onSearchKey}
              className="w-72 px-3 py-2 rounded bg-white text-black"
            />
            <div className="relative" onMouseEnter={() => setOpenMenu('cities')}>
              <NavButton active={openMenu === 'cities'} onClick={() => pickCity(selectedLocation)}>
                <span className="text-blue-600">{selectedLocation}</span>
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 
                       0 111.06 1.06l-4.24 4.24a.75.75 
                       0 01-1.06 0L5.21 8.27a.75.75 
                       0 01.02-1.06z"
                  />
                </svg>
              </NavButton>
            </div>
          </div>
        )}

        <button className="md:hidden p-2" onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {openMenu === 'cities' && (
        <div className="absolute top-full inset-x-0 bg-white text-black shadow border border-gray-200 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-auto">
              {(showAllCities ? cities : cities.slice(0, 15)).map(c => (
                <button
                  key={c.label}
                  onClick={() => pickCity(c.label)}
                  className="w-full text-left px-2 py-1 text-blue-600 hover:underline text-sm"
                >
                  {c.name}, {c.abbreviation}
                </button>
              ))}
            </div>
            {cities.length > 15 && (
              <div className="mt-2 text-right">
                <button
                  onClick={() => setShowAllCities(x => !x)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {showAllCities ? 'Show Less' : 'View All Cities'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {openMenu && openMenu !== 'cities' && (
        <div className="absolute top-full inset-x-0 bg-white text-black shadow border border-gray-200 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <MegaDropdown
              category={openMenu}
              dataMap={
                openMenu === 'sports'
                  ? sportsData
                  : openMenu === 'concerts'
                    ? concertData
                    : theaterData
              }
              baseQuery={queryString}
            />
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="md:hidden bg-black bg-opacity-90 px-4 py-4">
          <NavButton onClick={() => toggleMobileSubmenu('cities')} className="w-full text-left text-white">
            CITIES
          </NavButton>
          {mobileSubmenu === 'cities' && (
            <div className="pl-4">
              {cities.map(c => (
                <button
                  key={c.label}
                  onClick={() => {
                    pickCity(c.label);
                    setMobileOpen(false);
                  }}
                  className="block w-full text-left text-white py-1"
                >
                  {c.name}, {c.abbreviation}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
