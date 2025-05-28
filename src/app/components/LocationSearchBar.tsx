'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';

interface CityOption {
  name: string;           // e.g. "New Braunfels"
  abbreviation: string;   // e.g. "TX"
  label: string;          // e.g. "New Braunfels, TX"
}

interface LocationSearchBarProps {
  onSelectLocation: (location: string) => void;  // single string "City, ST"
}

export default function LocationSearchBar({ onSelectLocation }: LocationSearchBarProps) {
  const [options, setOptions] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCitiesWithDelay = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate delay
        const res = await fetch('/api/locations/cities');
        if (!res.ok) throw new Error('Failed to fetch cities');
        const rawData: CityOption[] = await res.json();
        setOptions(rawData);
      } catch (error) {
        console.error('Error fetching city options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitiesWithDelay();
  }, []);

  const handleChange = (selectedOption: CityOption | null) => {
    if (selectedOption) {
      // Combine city and state into a single string "City, ST"
      const location = `${selectedOption.name}, ${selectedOption.abbreviation}`;
      onSelectLocation(location);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-4">
      <Select
        isLoading={loading}
        options={options}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => `${option.name},${option.abbreviation}`}
        onChange={handleChange}
        placeholder="Search cities (e.g. Austin, TX)"
        className="text-black"
        noOptionsMessage={() => 'No matches found'}
      />
    </div>
  );
}
