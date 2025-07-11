'use client';

import { useState } from 'react';
import Link from 'next/link';

interface EventHeaderProps {
  eventName: string;
  eventDateTime?: string;
  venueName?: string;
  venueLocation?: string;
}

export default function EventHeader({
  eventName,
  eventDateTime,
  venueName,
  venueLocation,
}: EventHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Logo and Event Info */}
        <div className="flex items-start gap-4 w-full">
          <Link href="/" className="flex-shrink-0">
            <img
              src="/assets/images/logo_blue.png"
              alt="CityStew"
              className="h-12 w-auto object-contain"
            />
          </Link>
          <div className="text-left">
            <h1 className="text-xl font-bold text-gray-900">{eventName}</h1>
            {(eventDateTime || venueName || venueLocation) && (
              <p className="text-sm text-gray-600 flex flex-wrap items-center gap-2">
                {eventDateTime && (
                  <span className="flex items-center gap-1">
                    📅 {eventDateTime}
                  </span>
                )}
                {venueName && venueLocation && (
                  <span className="flex items-center gap-1">
                    📍 {venueName} • {venueLocation}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
