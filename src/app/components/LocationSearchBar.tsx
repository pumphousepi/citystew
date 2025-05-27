import React, { useEffect, useState } from 'react';
import Select from 'react-select';

interface CityOption {
  name: string;
  abbreviation: string;
  label: string;
}

interface LocationSearchBarProps {
  onSelectLocation: (city: string, state: string) => void;
}

export default function LocationSearchBar({ onSelectLocation }: LocationSearchBarProps) {
  const [options, setOptions] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCitiesWithDelay = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Optional UX delay
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
      onSelectLocation(selectedOption.name, selectedOption.abbreviation);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-4">
      <Select
        isLoading={loading}
        options={options}
        onChange={handleChange}
        placeholder="Search cities (e.g. Austin, TX)"
        isClearable
        className="text-black"
        styles={{
          control: (provided) => ({
            ...provided,
            borderRadius: '0.5rem',
            borderColor: '#ccc',
            padding: '2px'
          })
        }}
      />
    </div>
  );
}
