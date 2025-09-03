'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import NavButton from './NavButton';
import MegaDropdown from './MegaDropdown';
import { sportsData } from '../../data/sportsData';
import { concertData } from './_megaData';

interface CityOption {
  name: string;
  abbreviation: string;
  label: string;
}

interface NavbarProps {
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  onSelectCategory: (cat: string) => void;
  onSelectGenre: (genre: string) => void; // kept for compatibility
  /** Force the search/location inputs to render (e.g., on /events) */
  forceShowInputs?: boolean;
}

type MenuKey = 'cities' | 'sports' | 'concerts' | 'entertainment' | null;
type NonNullMenuKey = Exclude<MenuKey, null>;

export default function Navbar({
  selectedLocation,
  onSelectLocation,
  onSelectCategory,
  forceShowInputs = false,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  // Local state
  const [cities, setCities] = useState<CityOption[]>([]);
  const [showInputs, setShowInputs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [showAllCities, setShowAllCities] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<NonNullMenuKey | null>(null);

  // Extract city/state
  const [city, state] = selectedLocation.split(',').map((s) => s.trim());

  // Base query for location-aware links
  const baseQuery = (): string =>
    city && state ? `?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}` : '';
  const queryString = baseQuery();

  // Helper to build /events links with category + optional extras (honors city/state)
  const eventsHref = (category: string, extra: Record<string, string> = {}) => {
    const p = new URLSearchParams();
    p.set('category', category);
    if (city) p.set('city', city);
    if (state) p.set('state', state);
    for (const [k, v] of Object.entries(extra)) p.set(k, v);
    return `/events?${p.toString()}`;
  };

  // Load cities once
  useEffect(() => {
    fetch('/api/locations/cities')
      .then((r) => r.json())
      .then((data: CityOption[]) => setCities(data))
      .catch(console.error);
  }, []);

  // Show search/location inputs after scrolling past hero (home)
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero-section');
      const navH = navRef.current?.offsetHeight ?? 0;
      if (hero) setShowInputs(hero.getBoundingClientRect().bottom <= navH + 5);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on outside click
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

  // Close menus on route change
  useEffect(() => {
    setOpenMenu(null);
    setShowAllCities(false);
    setMobileSubmenu(null);
    setMobileOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

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

  const toggleMobileSubmenu = (key: NonNullMenuKey) =>
    setMobileSubmenu((prev) => (prev === key ? null : key));

  // Use this for rendering the search row
  const inputVisible = forceShowInputs || showInputs;

  return (
    <nav ref={navRef} className="sticky top-0 inset-x-0 bg-black text-white z-50 relative">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => router.push('/')} className="text-2xl font-bold">
          CityStew
        </button>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-8">
          {(['cities', 'sports', 'concerts', 'entertainment'] as const).map(
            (key: NonNullMenuKey) => (
              <li key={key} onMouseEnter={() => setOpenMenu(key)}>
                <NavButton
                  active={openMenu === key}
                  hasPopup
                  expanded={openMenu === key}
                  controlsId={`menu-${key}`}
                  onClick={() => {
                    if (key === 'cities') {
                      pickCity(selectedLocation);
                    } else if (key === 'sports' || key === 'concerts') {
                      onSelectCategory(key === 'concerts' ? 'music' : 'sports');
                      setOpenMenu(key);
                    } else if (key === 'entertainment') {
                      onSelectCategory('entertainment');
                      setOpenMenu(key);
                    }
                  }}
                >
                  {key.toUpperCase()}
                </NavButton>
              </li>
            )
          )}
        </ul>

        {/* Search + Location pill (desktop) */}
        {inputVisible && (
          <div className="hidden md:flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search events…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={onSearchKey}
              className="w-72 px-3 py-2 rounded bg-white text-black"
            />
            <div className="relative" onMouseEnter={() => setOpenMenu('cities')}>
              <NavButton
                active={openMenu === 'cities'}
                onClick={() => pickCity(selectedLocation)}
                hasPopup
                expanded={openMenu === 'cities'}
                controlsId="menu-cities"
              >
                <span className="text-blue-400">{selectedLocation}</span>
                <svg
                  className="w-4 h-4 text-blue-400 ml-1 inline-block"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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

        {/* Mobile Hamburger */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen((v) => !v)}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* CITIES dropdown (desktop) */}
      {openMenu === 'cities' && (
        <div
          id="menu-cities"
          className="absolute top-full inset-x-0 bg-white text-black shadow border border-gray-200 z-[80]"
          onMouseLeave={() => setOpenMenu(null)}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-auto">
              {(showAllCities ? cities : cities.slice(0, 15)).map((c) => (
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
                  onClick={() => setShowAllCities((x) => !x)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {showAllCities ? 'Show Less' : 'View All Cities'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SPORTS / CONCERTS dropdowns (desktop) */}
      {openMenu && (openMenu === 'sports' || openMenu === 'concerts') && (
        <div
          id={`menu-${openMenu}`}
          className="absolute top-full inset-x-0 z-[80]"
          onMouseLeave={() => setOpenMenu(null)}
        >
          <div className="max-w-7xl mx-auto">
            <MegaDropdown
              category={openMenu}
              dataMap={openMenu === 'sports' ? sportsData : concertData}
              baseQuery={queryString}
            />
          </div>
        </div>
      )}

      {/* ENTERTAINMENT dropdown (desktop) */}
      {openMenu === 'entertainment' && (
        <div
          id="menu-entertainment"
          className="absolute top-full inset-x-0 bg-white text-black shadow border border-gray-200 z-[80]"
          onMouseLeave={() => setOpenMenu(null)}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <Link
                href={eventsHref('movies')}
                className="px-3 py-2 rounded-lg hover:bg-gray-50 text-blue-700 text-sm font-medium"
                onClick={() => setOpenMenu(null)}
              >
                Movies (Local)
              </Link>
              <Link
                href={eventsHref('theater')}
                className="px-3 py-2 rounded-lg hover:bg-gray-50 text-blue-700 text-sm font-medium"
                onClick={() => setOpenMenu(null)}
              >
                Theater (Local)
              </Link>
            </div>
            <div className="text-right mt-3">
              <Link
                href={eventsHref('entertainment')}
                className="inline-block px-3 py-2 rounded-lg bg-gray-100 text-gray-900 font-semibold text-sm"
                onClick={() => setOpenMenu(null)}
              >
                View All Entertainment
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[80] bg-black bg-opacity-90 overflow-y-auto">
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg">Menu</span>
              <button
                className="p-2 border rounded-xl"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Cities */}
            <NavButton onClick={() => toggleMobileSubmenu('cities')} className="w-full text-left text-white">
              CITIES
            </NavButton>
            {mobileSubmenu === 'cities' && (
              <div className="pl-4">
                {cities.map((c) => (
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

            {/* Sports */}
            <NavButton onClick={() => toggleMobileSubmenu('sports')} className="w-full text-left text-white">
              SPORTS
            </NavButton>
            {mobileSubmenu === 'sports' && (
              <div className="pl-2 py-1">
                <MegaDropdown category="sports" dataMap={sportsData} baseQuery={queryString} />
              </div>
            )}

            {/* Concerts */}
            <NavButton onClick={() => toggleMobileSubmenu('concerts')} className="w-full text-left text-white">
              CONCERTS
            </NavButton>
            {mobileSubmenu === 'concerts' && (
              <div className="pl-2 py-1">
                <MegaDropdown category="concerts" dataMap={concertData} baseQuery={queryString} />
              </div>
            )}

            {/* Entertainment */}
            <NavButton onClick={() => toggleMobileSubmenu('entertainment')} className="w-full text-left text-white">
              ENTERTAINMENT
            </NavButton>
            {mobileSubmenu === 'entertainment' && (
              <div className="pl-4 py-1 space-y-1">
                <Link
                  href={eventsHref('movies')}
                  className="block text-white py-1 underline-offset-2 hover:underline"
                  onClick={() => setMobileOpen(false)}
                >
                  Movies (Local)
                </Link>
                <Link
                  href={eventsHref('theater')}
                  className="block text-white py-1 underline-offset-2 hover:underline"
                  onClick={() => setMobileOpen(false)}
                >
                  Theater (Local)
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
