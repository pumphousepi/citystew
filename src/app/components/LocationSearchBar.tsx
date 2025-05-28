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

export default function LocationSearchBar({
  onSelectLocation,
}: LocationSearchBarProps) {
  const [options, setOptions] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<CityOption | null>(
    null
  );

  useEffect(() => {
    let isMounted = true;
    const fetchCities = async () => {
      try {
        // simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const res = await fetch('/api/locations/cities');
        if (!res.ok) throw new Error('Failed to fetch cities');
        const rawData: CityOption[] = await res.json();

        if (!isMounted) return;
        setOptions(rawData);

        // pick the default only once
        const defaultOpt = rawData.find(
          (opt) => opt.name === 'New Braunfels' && opt.abbreviation === 'TX'
        );
        if (defaultOpt) {
          setSelectedOption(defaultOpt);
          onSelectLocation(defaultOpt.label);
        }
      } catch (err) {
        console.error('Error fetching city options:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCities();
    return () => {
      isMounted = false;
    };
  }, []); // <-- empty deps so this runs only once

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
        getOptionLabel={(o) => o.label}
        getOptionValue={(o) => `${o.name},${o.abbreviation}`}
        onChange={handleChange}
        placeholder="Search cities (e.g. Austin, TX)"
        className="text-black"
        noOptionsMessage={() => 'No matches found'}
      />
    </div>
  );
}
