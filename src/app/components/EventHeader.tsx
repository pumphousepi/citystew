'use client';

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
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Logo and Event Info */}
        <div className="flex gap-4 items-start md:items-center">
          <Link href="/" className="flex-shrink-0">
            <img
              src="/assets/images/logo_blue.png"
              alt="CityStew Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{eventName}</h1>
            {(eventDateTime || venueName || venueLocation) && (
              <p className="text-sm text-gray-600">
                📅 {eventDateTime} &nbsp; • &nbsp; 📍 {venueName}
                {venueLocation ? ` • ${venueLocation}` : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
