'use client';

import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="CityStew Logo" width={40} height={40} />
          <span className="font-bold text-xl text-gray-800">CityStew</span>
        </div>

        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li><a href="#categories" className="hover:text-blue-600">Categories</a></li>
          <li><a href="#events" className="hover:text-blue-600">Events</a></li>
          <li><a href="#about" className="hover:text-blue-600">About</a></li>
        </ul>
      </nav>
    </header>
  );
}
