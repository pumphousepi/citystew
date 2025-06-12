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
}

export default function Navbar({
  selectedLocation,
  onSelectLocation,
  onSelectCategory,
}: NavbarProps) {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  const [cities, setCities]         = useState<CityOption[]>([]);
  const [showInputs, setShowInputs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenu, setOpenMenu]     = useState<'cities'|'sports'|'concerts'|'theater'|null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<'cities'|'sports'|'concerts'|'theater'|null>(null);
  const [showAllCities, setShowAllCities] = useState(false);

  // 1) load cities
  useEffect(() => {
    fetch('/api/locations/cities')
      .then(r => r.json())
      .then((data: CityOption[]) => setCities(data))
      .catch(console.error);
  }, []);

  // 2) show inputs on scroll past hero
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

  // 3) click outside closes menus
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setMobileSubmenu(null);
        setShowAllCities(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // build “?city=..&state=..”
  const baseQuery = () => {
    const [city, state] = selectedLocation.split(',').map(s => s.trim());
    return city && state
      ? `?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`
      : '';
  };

  // pick city (desktop)
  const pickCity = (label: string) => {
    onSelectLocation(label);
    setOpenMenu(null);
    setMobileOpen(false);
    setShowAllCities(false);
  };

  // search ENTER
  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  // mobile submenu toggle
  const toggleMobileSubmenu = (menu: typeof mobileSubmenu) =>
    setMobileSubmenu(prev => prev === menu ? null : menu);

  return (
    <nav
      ref={navRef}
      className={`
        sticky top-0 w-full z-50 backdrop-blur-sm transition-colors duration-300
        ${showInputs ? 'bg-black bg-opacity-90 text-white' : 'bg-transparent text-white'}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => router.push('/')} className="text-2xl font-bold">
          CityStew
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center space-x-6">
          {(['cities','sports','concerts','theater'] as const).map((key) => (
            <li
              key={key}
              className="relative"
              onMouseEnter={() => {
                setOpenMenu(key);
                if (key !== 'cities') {
                  onSelectCategory(key === 'concerts' ? 'music' : key);
                }
              }}
              onMouseLeave={() => setOpenMenu(prev => prev === key ? null : prev)}
            >
              <NavButton className={openMenu === key ? 'text-blue-400' : ''}>
                {key.toUpperCase()}
              </NavButton>
            </li>
          ))}
        </ul>

        {/* Desktop: sticky search + city selector */}
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
            <div className="relative"
                 onMouseEnter={() => setOpenMenu('cities')}
                 onMouseLeave={() => setOpenMenu(prev => prev === 'cities' ? null : prev)}
            >
              <NavButton ariaHasPopup className="flex items-center space-x-1">
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

              {/* City dropdown (sticky) */}
              {openMenu === 'cities' && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-40">
                  <ul className="grid grid-cols-2 gap-2 max-h-60 overflow-auto p-2">
                    {(showAllCities ? cities : cities.slice(0,15)).map(c => (
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
                  {cities.length > 15 && (
                    <div className="px-2 py-1 text-right">
                      <button
                        onClick={() => setShowAllCities(v => !v)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {showAllCities ? 'Show Less' : 'View All Cities'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => {
            setMobileOpen(v => !v);
            setMobileSubmenu(null);
          }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <span className="text-2xl">&times;</span>
                      : <div className="space-y-1">
                          <span className="block w-6 h-0.5 bg-white" />
                          <span className="block w-6 h-0.5 bg-white" />
                          <span className="block w-6 h-0.5 bg-white" />
                        </div>}
        </button>
      </div>

      {/* Desktop dropdowns */}
      {openMenu === 'cities' && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-30">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <ul className="grid grid-cols-2 gap-2 max-h-60 overflow-auto">
              {(showAllCities ? cities : cities.slice(0,15)).map(c => (
                <li key={c.label}>
                  <button
                    onClick={() => pickCity(c.label)}
                    className="w-full text-left px-2 py-1 text-gray-800 hover:bg-gray-100 rounded text-sm"
                  >
                    {c.name}, {c.abbreviation}
                  </button>
                </li>
              ))}
            </ul>
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

      {openMenu && openMenu !== 'cities' && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-30">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <MegaDropdown
              category={openMenu}
              dataMap={
                openMenu === 'sports'
                  ? sportsData
                  : openMenu === 'concerts'
                    ? { 'All Genres': ['Rock','Pop','Jazz','Country','Hip Hop','Electronic','Classical','R&B'] }
                    : { 'All Theater': [] }
              }
              baseQuery={baseQuery()}
            />
          </div>
        </div>
      )}

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden bg-black bg-opacity-90 px-4 py-4 space-y-4">
          {(['cities','sports','concerts','theater'] as const).map(menu => (
            <div key={menu}>
              <NavButton
                className="w-full text-left text-white"
                onClick={() => toggleMobileSubmenu(menu)}
              >
                {menu.toUpperCase()}
              </NavButton>
              {mobileSubmenu === menu && (
                <div className="pl-4 space-y-1 max-h-60 overflow-auto">
                  {/* replicate desktop contents as needed */}
                  {/* for brevity, only cities shown here */}
                  {menu === 'cities' &&
                    cities.map(c => (
                      <button
                        key={c.label}
                        className="block w-full text-left py-1 text-white text-sm hover:underline"
                        onClick={() => {
                          pickCity(c.label);
                          setMobileOpen(false);
                        }}
                      >
                        {c.name}, {c.abbreviation}
                      </button>
                    ))
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
