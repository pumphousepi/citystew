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
  const [searchTerm, setSearchTerm]       = useState('');
  const [showInputs, setShowInputs]       = useState(false);
  const [openDropdown, setOpenDropdown]   = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);

  const categoryList = ['Food', 'Sports'];
  const genreList    = ['Rock','Pop','Jazz','Country','Hip Hop','Electronic','Classical','R&B'];
  const theaterList  = ['Movies','Live Performances'];

  // 1️⃣ Fetch cities
  useEffect(() => {
    fetch('/api/locations/cities')
      .then(r => r.json())
      .then((data: CityOption[]) => setCities(data))
      .catch(console.error);
  }, []);

  // 2️⃣ On-scroll: when hero scrolls behind nav, show search+city
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

  // 3️⃣ Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setMobileSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
        sticky top-0 w-full backdrop-blur-sm z-50 transition-colors duration-300
        ${showInputs ? 'bg-black bg-opacity-90 text-white' : 'bg-transparent text-white'}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          CityStew
        </Link>

        {/* Desktop nav (hidden under md) */}
        <ul className="hidden md:flex items-center space-x-6">
          {['cities','categories','concerts','theater'].map(menu => {
            const label = menu.toUpperCase();
            const list = menu === 'cities'
              ? cities.map(c => c.label)
              : menu === 'categories'
                ? categoryList
                : menu === 'concerts'
                  ? genreList
                  : theaterList;
            return (
              <li key={menu} className="relative">
                <NavButton
                  onClick={() => toggleDropdown(menu)}
                  className={openDropdown===menu ? styles.navButtonActive : styles.navButton}
                >
                  {label}
                </NavButton>
                {openDropdown===menu && (
                  <ul className="absolute mt-2 w-48 bg-white text-black rounded shadow-lg overflow-auto max-h-64">
                    {list.map(item => (
                      <li key={item}>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            if (menu==='cities')       onSelectLocation(item);
                            if (menu==='categories')   onSelectCategory(item.toLowerCase());
                            if (menu==='concerts')     { onSelectCategory('music'); onSelectGenre(item); }
                            if (menu==='theater')      { onSelectCategory('theater'); onSelectGenre(item.toLowerCase().replace(/\s+/g,'')); }
                            setOpenDropdown(null);
                          }}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        {/* Desktop search + city picker (only when scrolled into view) */}
        {showInputs && (
          <div className="hidden md:flex items-center space-x-4">
            {/* Search box */}
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
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 
                       0 111.06 1.06l-4.24 4.24a.75.75 0 
                       01-1.06 0L5.21 8.27a.75.75 0 
                       01.02-1.06z"/>
                </svg>
              </NavButton>
              {openDropdown==='nav-city' && (
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

        {/* Mobile hamburger (white bars, no bg) */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={toggleMobile}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <span className="text-white text-2xl leading-none">&times;</span>
          ) : (
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </div>
          )}
        </button>
      </div>

      {/* Mobile panel: search + all submenus */}
      {mobileOpen && (
        <div className="md:hidden bg-black bg-opacity-90 px-4 py-4 space-y-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search events…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={onSearchKey}
            className="w-full px-3 py-2 border rounded bg-white text-black"
          />

          {/* City submenu */}
          <NavButton onClick={() => toggleMobileSubmenu('cities')}>
            {selectedLocation}
          </NavButton>
          {mobileSubmenu==='cities' && (
            <div className="pl-4 space-y-1">
              {cities.map(c => (
                <button
                  key={c.label}
                  className="block w-full text-left py-1 text-white"
                  onClick={() => { onSelectLocation(c.label); setMobileOpen(false); }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {/* Categories submenu */}
          <NavButton onClick={() => toggleMobileSubmenu('categories')}>
            CATEGORIES
          </NavButton>
          {mobileSubmenu==='categories' && (
            <div className="pl-4 space-y-1">
              {categoryList.map(cat => (
                <button
                  key={cat}
                  className="block w-full text-left py-1 text-white"
                  onClick={() => { onSelectCategory(cat.toLowerCase()); setMobileOpen(false); }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Concerts submenu */}
          <NavButton onClick={() => toggleMobileSubmenu('concerts')}>
            CONCERTS
          </NavButton>
          {mobileSubmenu==='concerts' && (
            <div className="pl-4 space-y-1 text-white">
              {genreList.map(g => (
                <button
                  key={g}
                  className="block w-full text-left py-1"
                  onClick={() => { onSelectCategory('music'); onSelectGenre(g); setMobileOpen(false); }}
                >
                  {g}
                </button>
              ))}
            </div>
          )}

          {/* Theater submenu */}
          <NavButton onClick={() => toggleMobileSubmenu('theater')}>
            THEATER
          </NavButton>
          {mobileSubmenu==='theater' && (
            <div className="pl-4 space-y-1 text-white">
              {theaterList.map(t => (
                <button
                  key={t}
                  className="block w-full text-left py-1"
                  onClick={() => { onSelectCategory('theater'); onSelectGenre(t.toLowerCase().replace(/\s+/g,'')); setMobileOpen(false); }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
