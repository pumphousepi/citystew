// File: src/app/advertise/page.tsx

'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const adPackages = [
  {
    title: 'Basic',
    price: '$75/month',
    features: [
      'Listed on event pages',
      'Mobile-friendly display',
      'Clickable logo',
    ],
  },
  {
    title: 'Featured',
    price: '$150/month',
    features: [
      'All Basic features',
      'Homepage carousel spot',
      'Email mention',
    ],
  },
  {
    title: 'Premium',
    price: '$300/month',
    features: [
      'All Featured features',
      'Top placement in city page',
      'Custom campaign setup',
    ],
  },
];

export default function AdvertisePage() {
  return (
    <>
      <Navbar/>
      <main className="bg-white text-gray-900 min-h-screen px-4 py-10 md:px-16">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Advertise With Us</h1>
          <p className="text-lg max-w-xl">
            Reach thousands of locals looking for things to do in your city. Promote your business next to local music, sports, and theater events.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Audience</h2>
          <ul className="list-disc list-inside text-md space-y-1">
            <li>10,000+ monthly active users</li>
            <li>Targeted by city, venue, and category</li>
            <li>Majority age 21–45, mobile-first</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Ad Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adPackages.map((pkg) => (
              <div
                key={pkg.title}
                className="border rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                <p className="text-lg font-semibold text-blue-600 mb-4">
                  {pkg.price}
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  {pkg.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <form className="max-w-xl space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Business Name"
              className="w-full p-3 border rounded"
            />
            <textarea
              placeholder="Tell us what you're looking for..."
              className="w-full p-3 border rounded min-h-[100px]"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Submit Inquiry
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
