// src/app/components/Sponsors.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

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
  return (
    <section id="sponsors" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* ─── Header ─── */}
        <h2 className="text-2xl font-bold mb-6 text-center">Our Sponsors</h2>

        {/* ─── Responsive Grid of Sponsor Cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sponsors.map(({ img, title, desc, url }) => (
            <a
              key={title}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white shadow rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition h-full"
            >
              {/* Replace the <Image> src as needed */}
              <Image
                src={`/assets/images/${img}`}
                alt={title}
                width={100}
                height={100}
                className="mb-4"
              />
              <h3 className="font-semibold text-lg text-center">{title}</h3>
              <p className="text-sm text-gray-600 mt-2 text-center line-clamp-3">{desc}</p>
            </a>
          ))}
        </div>

        {/* ─── Optional “View All Sponsors” Button (uncomment if you have a page) ─── */}
        {/*
        <div className="mt-6 flex justify-center">
          <Link
            href="/sponsors"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View All Sponsors
          </Link>
        </div>
        */}
      </div>
    </section>
  );
}
