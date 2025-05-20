'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [openCities, setOpenCities] = useState(false);
  const [openSports, setOpenSports] = useState(false);
  const [openConcerts, setOpenConcerts] = useState(false);
  const [openTheater, setOpenTheater] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = `sticky top-0 z-50 transition-colors duration-500 ${
    isScrolled ? 'bg-white/40 backdrop-blur-md shadow-md' : 'bg-transparent'
  }`;

  const buttonBaseClasses = 'font-semibold transition-colors duration-300';
  const buttonColorClasses = 'text-[#999] hover:text-[#777]';

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              CityStew
            </Link>
          </div>

          {/* Nav buttons */}
          <div className="flex space-x-6">
            {/* Cities */}
            <div className="relative">
              <button
                onClick={() => setOpenCities(!openCities)}
                className={`${buttonBaseClasses} ${buttonColorClasses}`}
                aria-haspopup="true"
                aria-expanded={openCities}
                type="button"
              >
                CITIES
              </button>
              {openCities && (
                <div className="absolute mt-2 w-40 bg-white border rounded shadow-lg z-50">
                  <Link href="/cities/new-york" className="block px-4 py-2 hover:bg-indigo-100">
                    New York
                  </Link>
                  <Link href="/cities/los-angeles" className="block px-4 py-2 hover:bg-indigo-100">
                    Los Angeles
                  </Link>
                  <Link href="/cities/chicago" className="block px-4 py-2 hover:bg-indigo-100">
                    Chicago
                  </Link>
                </div>
              )}
            </div>

            {/* Sports */}
            <div className="relative">
              <button
                onClick={() => setOpenSports(!openSports)}
                className={`${buttonBaseClasses} ${buttonColorClasses}`}
                aria-haspopup="true"
                aria-expanded={openSports}
                type="button"
              >
                SPORTS
              </button>
              {openSports && (
                <div className="absolute mt-2 w-40 bg-white border rounded shadow-lg z-50">
                  <Link href="/sports/basketball" className="block px-4 py-2 hover:bg-indigo-100">
                    Basketball
                  </Link>
                  <Link href="/sports/football" className="block px-4 py-2 hover:bg-indigo-100">
                    Football
                  </Link>
                  <Link href="/sports/baseball" className="block px-4 py-2 hover:bg-indigo-100">
                    Baseball
                  </Link>
                </div>
              )}
            </div>

            {/* Concerts */}
            <div className="relative">
              <button
                onClick={() => setOpenConcerts(!openConcerts)}
                className={`${buttonBaseClasses} ${buttonColorClasses}`}
                aria-haspopup="true"
                aria-expanded={openConcerts}
                type="button"
              >
                CONCERTS
              </button>
              {openConcerts && (
                <div className="absolute mt-2 w-40 bg-white border rounded shadow-lg z-50">
                  <Link href="/concerts/rock" className="block px-4 py-2 hover:bg-indigo-100">
                    Rock
                  </Link>
                  <Link href="/concerts/pop" className="block px-4 py-2 hover:bg-indigo-100">
                    Pop
                  </Link>
                  <Link href="/concerts/jazz" className="block px-4 py-2 hover:bg-indigo-100">
                    Jazz
                  </Link>
                </div>
              )}
            </div>

            {/* Theater */}
            <div className="relative">
              <button
                onClick={() => setOpenTheater(!openTheater)}
                className={`${buttonBaseClasses} ${buttonColorClasses}`}
                aria-haspopup="true"
                aria-expanded={openTheater}
                type="button"
              >
                THEATER
              </button>
              {openTheater && (
                <div className="absolute mt-2 w-40 bg-white border rounded shadow-lg z-50">
                  <Link href="/theater/broadway" className="block px-4 py-2 hover:bg-indigo-100">
                    Broadway
                  </Link>
                  <Link href="/theater/plays" className="block px-4 py-2 hover:bg-indigo-100">
                    Plays
                  </Link>
                  <Link href="/theater/musicals" className="block px-4 py-2 hover:bg-indigo-100">
                    Musicals
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
