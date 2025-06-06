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
  const [searchTerm, setSearchTerm] = useState('');
  const [showInputs, setShowInputs] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [showAllCities, setShowAllCities] = useState(false);
  const [theaterItems, setTheaterItems] = useState<string[]>([]);

  // 1) Fetch cities once
  useEffect(() => {
    fetch('/api/locations/cities')
      .then((r) => r.json())
      .then((data: CityOption[]) => setCities(data))
      .catch(console.error);
  }, []);

  // 2) Show “Search + City” after hero scroll under nav
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero-section');
      const navHeight = navRef.current?.offsetHeight || 0;
      if (hero) {
        setShowInputs(hero.getBoundingClientRect().bottom <= navHeight + 5);
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 3) Close any open dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setMobileSubmenu(null);
        setShowAllCities(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 4) Reset “showAllCities” when cities menu closes
  useEffect(() => {
    if (openMenu !== 'cities') {
      setShowAllCities(false);
    }
  }, [openMenu]);

  // 5) Fetch theater events when hovering “THEATER”
  useEffect(() => {
    if (openMenu === 'theater') {
      const [cityName, stateCode] = selectedLocation.split(', ').map((s) => s.trim());
      if (cityName && stateCode) {
        fetch(
          `/api/events?category=theater&city=${encodeURIComponent(
            cityName
          )}&state=${encodeURIComponent(stateCode)}`
        )
          .then((r) => r.json())
          .then((data: { events?: Array<{ title: string }> }) => {
            let rawArray: Array<{ title: string }> = [];
            if (Array.isArray(data)) {
              rawArray = data as Array<{ title: string }>;
            } else if (Array.isArray(data.events)) {
              rawArray = data.events;
            }
            setTheaterItems(rawArray.map((evt) => evt.title));
          })
          .catch(() => {
            setTheaterItems([]);
          });
      } else {
        setTheaterItems([]);
      }
    }
  }, [openMenu, selectedLocation]);

  // Helper to build “&city=…&state=…” query
  const baseQueryFromLocation = (): string => {
    const [cityName, stateCode] = selectedLocation.split(', ').map((s) => s.trim());
    return cityName && stateCode
      ? `?city=${encodeURIComponent(cityName)}&state=${encodeURIComponent(stateCode)}`
      : '';
  };

  // Handle Enter key in search box → /search?query=
  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      const q = encodeURIComponent(searchTerm.trim());
      router.push(`/search?query=${q}`);
      setSearchTerm('');
      setMobileOpen(false);
    }
  };

  const toggleMobile = () => {
    setMobileOpen((prev) => !prev);
    setMobileSubmenu(null);
  };
  const toggleMobileSubmenu = (menu: string) => {
    setMobileSubmenu((prev) => (prev === menu ? null : menu));
  };

  // When desktop user picks a city
  const handleCityPick = (cityLabel: string) => {
    onSelectLocation(cityLabel);
    const [cityName, stateCode] = cityLabel.split(', ').map((s) => s.trim());
    router.push(
      `/events?city=${encodeURIComponent(cityName)}&state=${encodeURIComponent(stateCode)}`
    );
    setOpenMenu(null);
    setMobileOpen(false);
    setShowAllCities(false);
  };

  return (
    <nav
      ref={navRef}
      className={`
        sticky top-0 w-full backdrop-blur-sm z-50 transition-colors duration-300
        ${showInputs ? 'bg-black bg-opacity-90 text-white' : 'bg-transparent text-white'}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        {/* ─── Logo ─── */}
        <button onClick={() => router.push('/')} className="text-2xl font-bold">
          CityStew
        </button>

        {/* ─── Desktop nav (hidden below md) ─── */}
        <ul className="hidden md:flex items-center space-x-6">
          {/* ==== CITIES ==== */}
          <li
            className="relative"
            onMouseEnter={() => setOpenMenu('cities')}
            onMouseLeave={() => setOpenMenu((prev) => (prev === 'cities' ? null : prev))}
          >
            <NavButton
              className={`px-3 py-2 font-medium ${
                openMenu === 'cities' ? 'bg-gray-800 text-white' : 'text-white'
              }`}
            >
              CITIES
            </NavButton>

            {openMenu === 'cities' && (
              <div className="absolute left-0 top-full w-full bg-white text-black shadow-lg z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                  <ul className="flex flex-col gap-1">
                    {(showAllCities ? cities : cities.slice(0, 15)).map((c) => (
                      <li key={c.label}>
                        <button
                          className="w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
                          onClick={() => handleCityPick(c.label)}
                        >
                          {c.name}, {c.abbreviation}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {cities.length > 15 && !showAllCities && (
                    <div className="border-t border-gray-200 px-4 py-2 flex justify-end">
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => setShowAllCities(true)}
                      >
                        View All Cities
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>

          {/* ==== SPORTS ==== */}
          <li
            className="relative"
            onMouseEnter={() => {
              setOpenMenu('sports');
              onSelectCategory('sports');
            }}
            onMouseLeave={() => setOpenMenu((prev) => (prev === 'sports' ? null : prev))}
          >
            <NavButton
              className={`px-3 py-2 font-medium ${
                openMenu === 'sports' ? 'bg-gray-800 text-white' : 'text-white'
              }`}
            >
              SPORTS
            </NavButton>

            {openMenu === 'sports' && (
              <MegaDropdown
                menuKey="sports"
                dataMap={sportsData}
                baseQuery={baseQueryFromLocation()}
              />
            )}
          </li>

          {/* ==== CONCERTS ==== */}
          <li
            className="relative"
            onMouseEnter={() => {
              setOpenMenu('concerts');
              onSelectCategory('music');
            }}
            onMouseLeave={() => setOpenMenu((prev) => (prev === 'concerts' ? null : prev))}
          >
            <NavButton
              className={`px-3 py-2 font-medium ${
                openMenu === 'concerts' ? 'bg-gray-800 text-white' : 'text-white'
              }`}
            >
              CONCERTS
            </NavButton>

            {openMenu === 'concerts' && (
              <MegaDropdown
                menuKey="concerts"
                dataMap={{
                  'All Genres': [
                    'Rock',
                    'Pop',
                    'Jazz',
                    'Country',
                    'Hip Hop',
                    'Electronic',
                    'Classical',
                    'R&B',
                  ],
                }}
                baseQuery={baseQueryFromLocation()}
              />
            )}
          </li>

          {/* ==== THEATER ==== */}
          <li
            className="relative"
            onMouseEnter={() => {
              setOpenMenu('theater');
              onSelectCategory('theater');
            }}
            onMouseLeave={() => setOpenMenu((prev) => (prev === 'theater' ? null : prev))}
          >
            <NavButton
              className={`px-3 py-2 font-medium ${
                openMenu === 'theater' ? 'bg-gray-800 text-white' : 'text-white'
              }`}
            >
              THEATER
            </NavButton>

            {openMenu === 'theater' && (
              <MegaDropdown
                menuKey="theater"
                dataMap={{ 'All Theater': theaterItems }}
                baseQuery={baseQueryFromLocation()}
              />
            )}
          </li>
        </ul>

        {/* ─── Desktop: Search + City Selector (only when scrolled) ─── */}
        {showInputs && (
          <div className="hidden md:flex items-center space-x-4">
            {/* Search box */}
            <input
              type="text"
              placeholder="Search by team, artist, venue…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={onSearchKey}
              className="w-72 px-3 py-2 border rounded bg-white text-black"
            />

            {/* City selector */}
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('nav-city')}
              onMouseLeave={() =>
                setOpenMenu((prev) => (prev === 'nav-city' ? null : prev))
              }
            >
              <NavButton
                ariaHasPopup
                className="flex items-center space-x-1 px-3 py-2 font-medium text-white"
              >
                <span className="text-blue-400">{selectedLocation}</span>
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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

              {openMenu === 'nav-city' && (
                <ul className="absolute right-0 top-full mt-0 w-full bg-white text-black shadow-lg z-50">
                  <div className="max-w-7xl mx-auto px-6 py-4">
                    {cities.map((c) => (
                      <li key={c.label}>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                          onClick={() => handleCityPick(c.label)}
                        >
                          {c.name}, {c.abbreviation}
                        </button>
                      </li>
                    ))}
                  </div>
                </ul>
              )}
            </div>
          </div>
        )}

        {/* ─── Mobile hamburger ─── */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={toggleMobile}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <span className="text-white text-2xl">&times;</span>
          ) : (
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </div>
          )}
        </button>
      </div>

      {/* ─── Mobile panel (below md) ─── */}
      {mobileOpen && (
        <div className="md:hidden bg-black bg-opacity-90 px-4 py-4 space-y-4">
          {/* Mobile search */}
          <input
            type="text"
            placeholder="Search by team, artist, venue…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={onSearchKey}
            className="w-full px-3 py-2 border rounded bg-white text-black"
          />

          {/* Mobile: CITIES */}
          <NavButton
            onClick={() => toggleMobileSubmenu('cities')}
            className="w-full text-left px-4 py-2 text-white"
          >
            CITIES
          </NavButton>
          {mobileSubmenu === 'cities' && (
            <div className="pl-4 space-y-1 max-h-60 overflow-auto">
              {cities.map((c) => (
                <button
                  key={c.label}
                  className="block w-full text-left py-1 text-white hover:underline text-sm"
                  onClick={() => {
                    onSelectLocation(c.label);
                    const [cn, sc] = c.label.split(', ').map((s) => s.trim());
                    router.push(
                      `/events?city=${encodeURIComponent(cn)}&state=${encodeURIComponent(sc)}`
                    );
                    setMobileOpen(false);
                    setMobileSubmenu(null);
                  }}
                >
                  {c.name}, {c.abbreviation}
                </button>
              ))}
            </div>
          )}

          {/* Mobile: SPORTS */}
          <NavButton
            onClick={() => {
              toggleMobileSubmenu('sports');
              onSelectCategory('sports');
            }}
            className="w-full text-left px-4 py-2 text-white"
          >
            SPORTS
          </NavButton>
          {mobileSubmenu === 'sports' && (
            <div className="pl-4 space-y-1">
              {Object.entries(sportsData).map(([league, teams]) => (
                <div key={league} className="mb-2">
                  <h4 className="text-gray-300 font-semibold">{league}</h4>
                  <div className="pl-2 space-y-1 max-h-40 overflow-auto">
                    {teams.map((team) => (
                      <button
                        key={team}
                        className="block w-full text-left py-1 text-white hover:underline text-sm"
                        onClick={() => {
                          onSelectGenre(team);
                          router.push(
                            `/events?category=sports&league=${encodeURIComponent(
                              league
                            )}&team=${encodeURIComponent(team)}${baseQueryFromLocation()}`
                          );
                          setMobileOpen(false);
                          setMobileSubmenu(null);
                        }}
                      >
                        {team}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile: CONCERTS */}
          <NavButton
            onClick={() => {
              toggleMobileSubmenu('concerts');
              onSelectCategory('music');
            }}
            className="w-full text-left px-4 py-2 text-white"
          >
            CONCERTS
          </NavButton>
          {mobileSubmenu === 'concerts' && (
            <div className="pl-4 space-y-1 max-h-60 overflow-auto">
              <h4 className="text-gray-300 font-semibold mb-1">All Genres</h4>
              {[
                'Rock',
                'Pop',
                'Jazz',
                'Country',
                'Hip Hop',
                'Electronic',
                'Classical',
                'R&B',
              ].map((g) => (
                <button
                  key={g}
                  className="block w-full text-left py-1 text-white hover:underline text-sm"
                  onClick={() => {
                    onSelectGenre(g);
                    router.push(
                      `/events?category=music&genre=${encodeURIComponent(
                        g
                      )}${baseQueryFromLocation()}`
                    );
                    setMobileOpen(false);
                    setMobileSubmenu(null);
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          )}

          {/* Mobile: THEATER */}
          <NavButton
            onClick={() => {
              toggleMobileSubmenu('theater');
              onSelectCategory('theater');
            }}
            className="w-full text-left px-4 py-2 text-white"
          >
            THEATER
          </NavButton>
          {mobileSubmenu === 'theater' && (
            <div className="pl-4 space-y-1 max-h-60 overflow-auto">
              <h4 className="text-gray-300 font-semibold mb-1">All Theater</h4>
              {theaterItems.map((show) => {
                const genreKey = show.toLowerCase().replace(/\s+/g, '');
                return (
                  <button
                    key={show}
                    className="block w-full text-left py-1 text-white hover:underline text-sm"
                    onClick={() => {
                      onSelectGenre(show);
                      router.push(
                        `/events?category=theater&genre=${encodeURIComponent(
                          genreKey
                        )}${baseQueryFromLocation()}`
                      );
                      setMobileOpen(false);
                      setMobileSubmenu(null);
                    }}
                  >
                    {show}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
