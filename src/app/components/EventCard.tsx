// src/app/components/EventCard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
  const placeholder = '/assets/images/placeholder.jpg';
  const [aiSrc, setAiSrc] = useState<string | null>(null);

  // AI fallback only if TM image is missing
  useEffect(() => {
    if (image) return;

    (async () => {
      try {
        const res = await fetch(
          `/api/generate-image?prompt=${encodeURIComponent(
            `A vibrant photo of a live ${title} event`
          )}`
        );
        const data = await res.json();
        if (data.url) setAiSrc(data.url);
      } catch (err) {
        console.error('AI image generation failed:', err);
      }
    })();
  }, [image, title]);

  const finalSrc = image || aiSrc || placeholder;

  console.log('EventCard using image →', finalSrc);

  const Img = (
    <Image
      src={finalSrc}
      alt={title}
      fill
      className="object-cover"
      sizes={isHorizontal ? '96px' : '(max-width:768px) 100vw,240px'}
      onError={(e) => {
        const imgEl = e.currentTarget as HTMLImageElement;
        imgEl.src = placeholder;
      }}
    />
  );

  const content = isHorizontal ? (
    <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-100 transition cursor-pointer">
      <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
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
  ) : (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-60 flex-shrink-0 flex flex-col h-[250px]">
      <div className="relative w-full h-40 flex-shrink-0">{Img}</div>
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

  return href ? <Link href={href}>{content}</Link> : content;
}
