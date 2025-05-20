'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/images/logo.png"
            alt="CityStew Logo"
            width={160}
            height={40}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
          <a href="#categories" className="hover:text-indigo-600 transition">Categories</a>
          <a href="#sponsors" className="hover:text-indigo-600 transition">Sponsors</a>
          <a href="#about" className="hover:text-indigo-600 transition">About</a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <span
            className={`block w-6 h-0.5 bg-black transform transition ${
              isOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transform transition ${
              isOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <a
            href="#categories"
            className="block px-6 py-4 border-t border-gray-200 text-center"
            onClick={() => setIsOpen(false)}
          >
            Categories
          </a>
          <a
            href="#sponsors"
            className="block px-6 py-4 border-t border-gray-200 text-center"
            onClick={() => setIsOpen(false)}
          >
            Sponsors
          </a>
          <a
            href="#about"
            className="block px-6 py-4 border-t border-gray-200 text-center"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
        </nav>
      )}
    </header>
  );
}
