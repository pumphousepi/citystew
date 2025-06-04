import Image from 'next/image';
import React from 'react';

export default function HighlightsSection() {
  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Upcoming Local Events */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Upcoming Local Events</h3>
          <ul className="space-y-4">
            <li>
              <p className="font-bold">Jazz Fest Downtown</p>
              <p className="text-sm text-gray-600">June 12, 2025 • Empire Theatre, San Antonio</p>
            </li>
            <li>
              <p className="font-bold">Art & Wine Stroll</p>
              <p className="text-sm text-gray-600">June 18, 2025 • Pearl District, San Antonio</p>
            </li>
            <li>
              <p className="font-bold">Foodie Night Market</p>
              <p className="text-sm text-gray-600">June 22, 2025 • Main Plaza, San Antonio</p>
            </li>
          </ul>
        </div>

        {/* Column 2: Top Selling Events */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Top Selling Events</h3>
          <ul className="space-y-4">
            <li className="flex space-x-4 items-center">
              <Image
                src="/concert1.jpg"
                alt="Performer"
                width={80}
                height={80}
                className="rounded object-cover"
              />
              <div>
                <p className="font-bold">Taylor Swift</p>
                <a href="#" className="text-blue-600 text-sm underline">View Tickets</a>
              </div>
            </li>
            <li className="flex space-x-4 items-center">
              <Image
                src="/comedy1.jpg"
                alt="Performer"
                width={80}
                height={80}
                className="rounded object-cover"
              />
              <div>
                <p className="font-bold">Kevin Hart</p>
                <a href="#" className="text-blue-600 text-sm underline">View Tickets</a>
              </div>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Satisfaction */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Customer Satisfaction</h3>
          <ul className="space-y-4">
            <li className="bg-gray-100 p-4 rounded">
              <p className="italic">Easy to use and tickets were legit!</p>
              <p className="text-sm text-gray-500 mt-1">– Ashley M.</p>
            </li>
            <li className="bg-gray-100 p-4 rounded">
              <p className="italic">Found last-minute tickets and had the best night.</p>
              <p className="text-sm text-gray-500 mt-1">– Daniel R.</p>
            </li>
            <li className="bg-gray-100 p-4 rounded">
              <p className="italic">CityStew made planning my weekend so simple.</p>
              <p className="text-sm text-gray-500 mt-1">– Maria S.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
