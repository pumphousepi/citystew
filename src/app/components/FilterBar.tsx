'use client';

import { useEffect, useState } from 'react';

interface State {
  name: string;
  abbreviation: string;
}

interface City {
  name: string;
}

interface FilterBarProps {
  states: State[];
  selectedState: string;
  setSelectedState: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  timeFilter: string;
  setTimeFilter: (value: string) => void;
}

export default function FilterBar({
  states,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  timeFilter,
  setTimeFilter,
}: FilterBarProps) {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    if (!selectedState) return;

    fetch(`/api/locations/cities?state=${selectedState}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCities(data);
          setSelectedCity(data[0]?.name || '');
        } else {
          setCities([]);
          setSelectedCity('');
        }
      })
      .catch((err) => {
        console.error('Error fetching cities:', err);
        setCities([]);
        setSelectedCity('');
      });
  }, [selectedState]);

  return (
    <div className="bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center md:space-x-4">
        <select
          className="mb-2 md:mb-0 px-4 py-2 border rounded"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">Select a state</option>
          {states.map((state) => (
            <option key={state.abbreviation} value={state.abbreviation}>
              {state.name}
            </option>
          ))}
        </select>

        <select
          className="mb-2 md:mb-0 px-4 py-2 border rounded"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!cities.length}
        >
          <option value="">Select a city</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>

        <div className="flex space-x-2 mt-2 md:mt-0">
          {['Today', 'Tomorrow', 'This Week'].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded border ${
                timeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600'
              }`}
              onClick={() => setTimeFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
