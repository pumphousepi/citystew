// src/app/components/Navbar.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavButton from './NavButton';
import MegaDropdown from './MegaDropdown';
import { sportsData, concertData, theaterData } from './_megaData';
import styles from './Navbar.module.css';

interface CityOption {
  name: string;
  abbreviation: string;
  label: string;
}

interface NavbarProps {
  selectedLocation: string;                // e.g. "Austin, TX"
  onSelectLocation: (loc: string) => void; // parent handler
}

export default function Navbar({
  selectedLocation,
  onSelectLocation,
}: NavbarProps) {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  const [cities, setCities]               = useState<CityOption[]>([]);
  const [showInputs, setShowInputs]       = useState(false);
  const [searchTerm, setSearchTerm]       = useState('');
  const [openMenu, setOpenMenu]           = useState<'cities'|'sports'|'concerts'|'theater'|null>(null);
  const [showAllCities, setShowAllCities] = useState(false);

  // 1) Load Cities
  useEffect(() => {
    fetch('/api/locations/cities')
      .then(r => r.json())
      .then((d: CityOption[]) => setCities(d))
      .catch(console.error);
  }, []);

  // 2) Sticky header
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero-section');
      const navH = navRef.current?.offsetHeight || 0;
      setShowInputs(!!hero && hero.getBoundingClientRect().bottom <= navH + 5);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 3) Close dropdowns on outside-click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setShowAllCities(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Search on Enter
  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  // Pick a city
  const pickCity = (label: string) => {
    onSelectLocation(label);
    setOpenMenu(null);
  };

  // Extract city/state
  const [city, state] = selectedLocation.split(',').map(s => s.trim());

  return (
    <nav
      ref={navRef}
      onMouseLeave={() => setOpenMenu(null)}
      className={`${styles.navbar} ${showInputs ? styles.navbarScrolled : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button onClick={() => router.push('/')} className="text-2xl font-bold text-white">
          CityStew
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center space-x-8">
          {/* Cities */}
          <li onMouseEnter={() => setOpenMenu('cities')}>
            <NavButton
              active={openMenu === 'cities'}
              onClick={() => setOpenMenu(openMenu === 'cities' ? null : 'cities')}
              ariaHasPopup
            >
              Cities
            </NavButton>
          </li>
          {/* Sports / Concerts / Theater */}
          {(['sports', 'concerts', 'theater'] as const).map(cat => (
            <li key={cat} onMouseEnter={() => setOpenMenu(cat)}>
              <NavButton
                active={openMenu === cat}
                onClick={() => setOpenMenu(openMenu === cat ? null : cat)}
                ariaHasPopup
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
              className="w-72 px-3 py-2 rounded bg-white text-black"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={onSearchKey}
            />
            <div className="relative" onMouseEnter={() => setOpenMenu('cities')}>
              <NavButton active={openMenu === 'cities'} ariaHasPopup>
                <span className="text-blue-400">{selectedLocation}</span>
              </NavButton>
            </div>
          </div>
        )}
      </div>

      {/* Cities dropdown (static) */}
      {openMenu === 'cities' && (
        <div className={styles.navCityContainer}>
          <div className={styles.navCityInner}>
            {(showAllCities ? cities : cities.slice(0, 15)).map(c => (
              <button
                key={c.label}
                onClick={() => pickCity(c.label)}
                className="text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
              >
                {c.name}, {c.abbreviation}
              </button>
            ))}
            {cities.length > 15 && (
              <div className="col-span-2 text-center pt-2">
                <button
                  onClick={() => setShowAllCities(v => !v)}
                  className="text-sm underline"
                >
                  {showAllCities ? 'Show Less' : 'Show All Cities'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MegaDropdown (static data) */}
      {openMenu === 'sports' && (
        <MegaDropdown category="sports" dataMap={sportsData} baseQuery={{city,state}} />
      )}
      {openMenu === 'concerts' && (
        <MegaDropdown category="concerts" dataMap={concertData} baseQuery={{city,state}} />
      )}
      {openMenu === 'theater' && (
        <MegaDropdown category="theater" dataMap={theaterData} baseQuery={{city,state}} />
      )}
    </nav>
  );
}
