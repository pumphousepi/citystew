'use client';

import { useEffect, useState, useMemo } from 'react';

interface State {
  name: string;
  abbreviation: string;
}

interface FilterBarProps {
  states: State[];
  selectedState: string;
  setSelectedState: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  loadingStates: boolean;
}

export default function FilterBar({
  states,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  timeFilter,
  setTimeFilter,
  loadingStates,
}: FilterBarProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Memoize sorted states to avoid sorting on every render
  const sortedStates = useMemo(() => {
    return states.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [states]);

  useEffect(() => {
    async function fetchCities() {
      if (!selectedState) {
        setCities([]);
        return;
      }

      setLoadingCities(true);
      try {
        const res = await fetch(`/api/locations/cities?state=${selectedState}`);
        const data = await res.json();
        if (Array.isArray(data.cities)) {
          setCities(data.cities.slice().sort((a, b) => a.localeCompare(b)));
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    }

    fetchCities();
  }, [selectedState, setSelectedCity]); // added setSelectedCity here per warning

  return (
    <section className="bg-gray-100 py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
        {/* State Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCity('');
            }}
            disabled={loadingStates}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Select a state</option>
            {sortedStates.map((state) => (
              <option key={state.abbreviation} value={state.abbreviation}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* City Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState || loadingCities}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Time Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="
