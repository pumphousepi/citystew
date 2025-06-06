// src/app/components/Sponsors.tsx
'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

const sponsors = [
  {
    img: 'yelp_ad_logo.png',
    title: 'Yelp for Business',
    desc: 'List your local business for free and connect with thousands of nearby customers.',
    url: 'https://biz.yelp.com/',
  },
  {
    img: 'google_ad_logo.png',
    title: 'Google Business Profile',
    desc: 'Get found on Google Search & Maps by adding your free business listing.',
    url: 'https://www.google.com/business/',
  },
  {
    img: 'bing_ad_logo.png',
    title: 'Bing Places',
    desc: 'Promote your business for free on Bing’s local search directory.',
    url: 'https://www.bingplaces.com/',
  },
];

export default function Sponsors() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dx: number) => {
    scrollerRef.current?.scrollBy({ left: dx, behavior: 'smooth' });
  };

  return (
    <section id="sponsors" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Left arrow */}
        <button
          onClick={() => scrollBy(-200)}
          className="flex absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10"
          aria-label="Scroll sponsors left"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Scrollable sponsor cards */}
        <div
          ref={scrollerRef}
          className="flex justify-center space-x-4 overflow-x-auto no-scrollbar py-4"
        >
          {sponsors.map(({ img, title, desc, url }) => (
            <a
              key={title}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-[180px] bg-white shadow rounded p-4 text-center flex-shrink-0"
            >
              <Image
                src={`/assets/images/${img}`}
                alt={title}
                width={100}
                height={100}
                className="mx-auto"
              />
              <div className="font-bold mt-2">{title}</div>
              <div className="text-sm text-gray-600 mt-1">{desc}</div>
            </a>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scrollBy(200)}
          className="flex absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10"
          aria-label="Scroll sponsors right"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </section>
  );
}
