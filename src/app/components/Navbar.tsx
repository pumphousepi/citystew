'use client'; // React client component for hooks

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Sticky navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 left-0 z-30 transition-shadow bg-white ${
        isSticky ? 'shadow-md' : ''
      }`}
    >
      <nav className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-indigo-600">
          CityStew
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-8 font-semibold text-gray-700">
          <li>
            <a href="#categories" className="hover:text-indigo-600">
              Categories
            </a>
          </li>
          <li>
            <a href="#sponsors" className="hover:text-indigo-600">
              Sponsors
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-indigo-600">
              About
            </a>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span
            className={`block w-6 h-0.5 bg-gray-800 transform transition duration-300 ease-in-out ${
              isOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-800 transition duration-300 ease-in-out ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-800 transform transition duration-300 ease-in-out ${
              isOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col items-center py-4 space-y-4 font-semibold text-gray-700">
            <li>
              <a
                href="#categories"
                onClick={() => setIsOpen(false)}
                className="hover:text-indigo-600"
              >
                Categories
              </a>
            </li>
            <li>
              <a
                href="#sponsors"
                onClick={() => setIsOpen(false)}
                className="hover:text-indigo-600"
              >
                Sponsors
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={() => setIsOpen(false)}
                className="hover:text-indigo-600"
              >
                About
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
