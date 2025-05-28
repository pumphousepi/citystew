// src/app/components/EventCard.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
  id: string;
  title: string;
  image?: string;
  date?: string;
  venue?: string;
  description?: string;
  href?: string;
  layout?: 'vertical' | 'horizontal';
}

// Track used placeholder URLs across all cards
const usedPlaceholders = new Set<string>();

export default function EventCard({
  id,
  title,
  image,
  date,
  venue,
  description,
  href,
  layout = 'vertical',
}: EventCardProps) {
  const isHorizontal = layout === 'horizontal';

  // Generate a unique seed per card, increment if needed
  const [seed, setSeed] = useState(id);
  const [fallbackSrc, setFallbackSrc] = useState(
    `https://source.unsplash.com/400x300/?event&sig=${encodeURIComponent(seed)}`
  );
  const attemptsRef = useRef(0);

  // Reset fallbackSrc whenever the seed changes
  useEffect(() => {
    setFallbackSrc(
      `https://source.unsplash.com/400x300/?event&sig=${encodeURIComponent(seed)}`
    );
  }, [seed]);

  // Handle <img> load to detect duplicates
  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const finalUrl = e.currentTarget.currentSrc;
    if (usedPlaceholders.has(finalUrl)) {
      // Duplicate found: bump seed and retry
      attemptsRef.current += 1;
      setSeed(`${id}-${attemptsRef.current}`);
    } else {
      usedPlaceholders.add(finalUrl);
    }
  };

  // Choose src: real image or fallback
  const imgSrc = image || fallbackSrc;

  const content = isHorizontal ? (
    <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-100 transition cursor-pointer">
      <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <img
            src={fallbackSrc}
            alt="Event placeholder"
            className="w-full h-full object-cover"
            onLoad={handleImgLoad}
          />
        )}
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
  ) : (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-60 flex-shrink-0 flex flex-col h-[250px]">
      <div className="relative w-full h-40 flex-shrink-0">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 240px"
          />
        ) : (
          <img
            src={fallbackSrc}
            alt="Event placeholder"
            className="w-full h-full object-cover"
            onLoad={handleImgLoad}
          />
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow justify-between min-h-[140px]">
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          {date && <p className="text-sm text-gray-600">{date}</p>}
          {venue && <p className="text-sm text-gray-600">{venue}</p>}
        </div>
        {description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
