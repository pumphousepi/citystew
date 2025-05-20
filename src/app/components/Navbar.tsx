'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import NavButton from './NavButton';

interface NavItem {
  label: string;
  links: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'CITIES',
    links: [
      { label: 'New York', href: '/cities/new-york' },
      { label: 'Boston', href: '/cities/boston' },
      { label: 'Chicago', href: '/cities/chicago' },
      { label: 'Los Angeles', href: '/cities/los-angeles' },
    ],
  },
  {
    label: 'SPORTS',
    links: [
      { label: 'Atlanta Hawks', href: '/sports/atlanta-hawks' },
      { label: 'Boston Red Sox', href: '/sports/boston-red-sox' },
      { label: 'Chicago Bears', href: '/sports/chicago-bears' },
    ],
  },
  {
    label: 'CONCERTS',
    links: [
      { label: 'Rolling Stones', href: '/concerts/rolling-stones' },
      { label: 'Coldplay', href: '/concerts/coldplay' },
    ],
  },
  {
    label: 'THEATER',
    links: [
      { label: 'Hamilton', href: '/theater/hamilton' },
      { label: 'Wicked', href: '/theater/wicked' },
    ],
  },
];

function Dropdown({
  items,
  onLinkClick,
}: {
  items: { label: string; href: string }[];
  onLinkClick?: () => void;
}) {
  return (
    <div className="absolute top-full left-0 mt-1 w-48 bg-black rounded shadow-lg z-50">
      {items.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className="block px-4 py-2 text-white hover:text-gray-700 focus:outline-none transition-colors duration-300"
          onClick={onLinkClick}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const bgOpacity = scrolled ? 0.6 : 0.3;

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md transition-colors duration-500"
      style={{ backgroundColor: `rgba(0,0,0,${bgOpacity})` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white">
              CityStew
            </Link>
          </div>

          <div className="hidden md:flex space-x-6 relative">
            {navItems.map(({ label, links }) => (
              <div key={label} className="relative">
                <button
                  aria-haspopup="true"
                  aria-expanded={openDropdown === label}
                  onClick={() => toggleDropdown(label)}
                  className="text-white font-semibold focus:outline-none rounded px-2 py-1 hover:text-gray-700 transition-colors duration-300"
                >
                  {label}
                </button>

                {openDropdown === label && (
                  <Dropdown
                    items={links}
                    onLinkClick={() => setOpenDropdown(null)}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-black shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map(({ label, links }) => (
              <div key={label}>
                <NavButton ariaHasPopup={true}>{label}</NavButton>
                <div className="pl-4">
                  {links.map(({ label: linkLabel, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="block py-1 text-white hover:text-gray-700 focus:outline-none transition-colors duration-300"
                      onClick={() => setMobileOpen(false)}
                    >
                      {linkLabel}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
