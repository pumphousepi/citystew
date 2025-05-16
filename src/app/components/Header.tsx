'use client'; // because we'll use React state here

import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header flex justify-between items-center p-4 shadow bg-white relative">
      <div className="logo text-xl font-bold text-blue-600">CityStew</div>

      {/* Desktop nav */}
      <nav className="hidden md:flex space-x-6 text-sm font-medium">
        <a href="#categories">Categories</a>
        <a href="#sponsors">Sponsors</a>
        <a href="#about">About</a>
      </nav>

      {/* Mobile menu toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        <span
          className={`block w-6 h-0.5 bg-black transform transition duration-300 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-1.5' : ''
          }`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-black transition duration-300 ease-in-out ${
            isOpen ? 'opacity-0' : ''
          }`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-black transform transition duration-300 ease-in-out ${
            isOpen ? '-rotate-45 -translate-y-1.5' : ''
          }`}
        ></span>
      </button>

      {/* Mobile nav menu */}
      {isOpen && (
        <nav className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center md:hidden z-10">
          <a
            href="#categories"
            className="py-3 w-full text-center border-b border-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Categories
          </a>
          <a
            href="#sponsors"
            className="py-3 w-full text-center border-b border-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Sponsors
          </a>
          <a
            href="#about"
            className="py-3 w-full text-center"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
        </nav>
      )}
    </header>
  );
}
