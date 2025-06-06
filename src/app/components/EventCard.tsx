// src/app/components/EventCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface EventCardProps {
  title: string;
  image?: string;
  date?: string;
  venue?: string;
  description?: string;
  href?: string;
  layout?: 'vertical' | 'horizontal';
}

export default function EventCard({
  title,
  image,
  date,
  venue,
  description,
  href,
  layout = 'vertical',
}: EventCardProps) {
  const isHorizontal = layout === 'horizontal';
  // If no image provided, fall back to this placeholder
  const placeholder = '/assets/images/placeholder.jpg';
  const finalSrc = image || placeholder;

  // Shared <img> element
  const Img = (
    <img
      src={finalSrc}
      alt={title}
      className="object-cover w-full h-full"
      onError={(e) => {
        e.currentTarget.src = '/assets/images/placeholder.jpg';
      }}
    />
  );

  // ─── Horizontal layout (unchanged) ───────────────────────────────────────────
  if (isHorizontal) {
    return href ? (
      <Link href={href} className="block">
        <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-100 transition">
          <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
            {Img}
          </div>
          <div className="flex flex-col justify-between flex-grow min-h-[96px]">
            <h3 className="text-md font-semibold text-gray-900">{title}</h3>
            {date && <p className="text-sm text-gray-600">{date}</p>}
            {venue && <p className="text-sm text-gray-600">{venue}</p>}
            {description && (
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            )}
          </div>
        </div>
      </Link>
    ) : (
      <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-100 transition">
        <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
          {Img}
        </div>
        <div className="flex flex-col justify-between flex-grow min-h-[96px]">
          <h3 className="text-md font-semibold text-gray-900">{title}</h3>
          {date && <p className="text-sm text-gray-600">{date}</p>}
          {venue && <p className="text-sm text-gray-600">{venue}</p>}
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    );
  }

  // ─── Vertical layout (responsive) ────────────────────────────────────────────
  const cardContent = (
    <div className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden h-full">
      {/* 
        Image wrapper with responsive aspect ratio. 
        Requires @tailwindcss/aspect-ratio plugin. 
        - aspect-[1/1]: square on mobile (< 640px)
        - sm:aspect-[4/3]: 4:3 on ≥ 640px
        - lg:aspect-[16/9]: 16:9 on ≥ 1024px
      */}
      <div className="relative w-full aspect-[1/1] sm:aspect-[4/3] lg:aspect-[16/9] bg-gray-200">
        {Img}
      </div>

      {/* Content area: responsive padding, flex-grow so cards line up */}
      <div className="p-3 sm:p-4 lg:p-6 flex flex-col flex-1">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 line-clamp-2">
          {title}
        </h3>
        {date && <p className="text-sm sm:text-base text-gray-600">{date}</p>}
        {venue && <p className="text-sm sm:text-base text-gray-600">{venue}</p>}
        {description && (
          <p className="text-sm sm:text-base text-gray-600 mt-2 line-clamp-3">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
}
