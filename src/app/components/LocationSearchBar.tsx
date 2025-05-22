'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';

interface CityOption {
  name: string;
  state: string;
  label: string; // e.g., "Austin, TX"
}

interface LocationSearchBarProps {
  onSelectLocation: (city: string, state: string) => void;
}

export default function LocationSearchBar({ onSelectLocation }: LocationSearchBarProps) {
  const [options, setOptions] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch('/api/locations/cities');
        const data = await res.json();
        setOptions(data);
      } catch (error) {
        console.error('Failed to fetch city options:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  const handleChange = (selectedOption: CityOption | null) => {
    if (selectedOption) {
      onSelectLocation(selectedOption.name, selectedOption.state);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-4">
      <Select
        isLoading={loading}
        options={options}
        onChange={handleChange}
        placeholder="Search cities (e.g. Austin, TX)"
        className="text-black"
        noOptionsMessage={() => 'No matches found'}
      />
    </div>
  );
}
