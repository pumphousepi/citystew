'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useId } from 'react';

interface CityOption {
  name: string;         // e.g. "New Braunfels"
  abbreviation: string; // e.g. "TX"
  label: string;        // e.g. "New Braunfels, TX"
}

interface LocationSearchBarProps {
  onSelectLocation: (location: string) => void;  // single string "City, ST"
}

export default function LocationSearchBar({
  onSelectLocation,
}: LocationSearchBarProps) {
  const [options, setOptions] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<CityOption | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/locations/cities')
      .then((r) => r.json())
      .then((rawData: CityOption[]) => {
        if (!isMounted) return;
        setOptions(rawData);
        const defaultOpt = rawData.find(
          (o) => o.name === 'New Braunfels' && o.abbreviation === 'TX'
        );
        if (defaultOpt) {
          setSelectedOption(defaultOpt);
          onSelectLocation(defaultOpt.label);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [onSelectLocation]);

  function handleChange(opt: CityOption | null) {
    setSelectedOption(opt);
    if (opt) {
      onSelectLocation(`${opt.name}, ${opt.abbreviation}`);
    }
  }

  return (
    <Select<CityOption>
       instanceId="location-select"
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
  );
}
