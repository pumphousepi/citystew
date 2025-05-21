'use client';

import { useState } from 'react';

const locations = ['San Antonio', 'Austin', 'Dallas', 'Houston'];
const dateRanges = [
  { label: 'Any Dates', value: 'any' },
  { label: 'This Weekend', value: 'thisWeekend' },
  { label: 'Next 7 Days', value: 'next7Days' },
  { label: 'Next Weekend', value: 'nextWeekend' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'Next 30 Days', value: 'next30Days' },
  { label: 'Next 60 Days', value: 'next60Days' },
];

interface Filters {
  location: string;
  dateRange: string;
}

interface Props {
  onFilterChange: (filters: Filters) => void;
}

export default function TrendingEventsFilter({ onFilterChange }: Props) {
  const [location, setLocation] = useState('San Antonio');
  const [dateRange, setDateRange] = useState('any');

  function handleLocationChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocation = e.target.value;
    setLocation(newLocation);
    onFilterChange({ location: newLocation, dateRange });
  }

  function handleDateRangeChange(value: string) {
    setDateRange(value);
    onFilterChange({ location, dateRange: value });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center gap-6 bg-white rounded shadow mb-8">
      <div>
        <label htmlFor="location" className="block font-semibold mb-1 text-gray-700">
          Location
        </label>
        <select
          id="location"
          value={location}
          onChange={handleLocationChange}
          className="border border-gray-300 rounded px-3 py-1"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="block font-semibold mb-1 text-gray-700">Date Range</span>
        <div className="flex flex-wrap gap-2">
          {dateRanges.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleDateRangeChange(value)}
              className={`px-3 py-1 rounded border ${
                dateRange === value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
