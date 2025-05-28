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
  const [selectedOption, setSelectedOption] = useState<CityOption | null>(null);

  useEffect(() => {
    const fetchCitiesWithDelay = async () => {
      try {
        // simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const res = await fetch('/api/locations/cities');
        if (!res.ok) throw new Error('Failed to fetch cities');

        const rawData: CityOption[] = await res.json();
        setOptions(rawData);

        // find and select default location
        const defaultOpt = rawData.find(
          (opt) =>
            opt.name === 'New Braunfels' && opt.abbreviation === 'TX'
        );
        if (defaultOpt) {
          setSelectedOption(defaultOpt);
          onSelectLocation(defaultOpt.label);
        }
      } catch (error) {
        console.error('Error fetching city options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitiesWithDelay();
  }, [onSelectLocation]);

  const handleChange = (opt: CityOption | null) => {
    setSelectedOption(opt);
    if (opt) {
      onSelectLocation(`${opt.name}, ${opt.abbreviation}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-4">
      <Select<CityOption>
        value={selectedOption}
        isLoading={loading}
        options={options}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) =>
          `${option.name},${option.abbreviation}`
        }
        onChange={handleChange}
        placeholder="Search cities (e.g. Austin, TX)"
        className="text-black"
        noOptionsMessage={() => 'No matches found'}
      />
    </div>
  );
}
