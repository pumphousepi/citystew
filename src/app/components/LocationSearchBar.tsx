'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';

interface CityOption {
  name: string;
  abbreviation: string;
  label: string;
}

interface Props {
  onSelectLocation: (location: string) => void;
}

export default function LocationSearchBar({ onSelectLocation }: Props) {
  const [options, setOptions] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CityOption | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      // simulate delay
      await new Promise((r) => setTimeout(r, 1500));
      const res = await fetch('/api/locations/cities');
      const cities: CityOption[] = await res.json();
      if (!mounted) return;

      setOptions(cities);
      setLoading(false);

      // pick default once
      const def = cities.find(
        (c) => c.name === 'New Braunfels' && c.abbreviation === 'TX'
      );
      if (def) {
        setSelected(def);
        onSelectLocation(def.label);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [onSelectLocation]);

  const onChange = (opt: CityOption | null) => {
    setSelected(opt);
    if (opt) onSelectLocation(opt.label);
  };

  return (
    <div className="w-full max-w-md mx-auto my-4">
      <Select<CityOption>
        value={selected}
        options={options}
        isLoading={loading}
        getOptionLabel={(o) => o.label}
        getOptionValue={(o) => `${o.name},${o.abbreviation}`}
        onChange={onChange}
        placeholder="Search cities (e.g. Austin, TX)"
        className="text-black"
        noOptionsMessage={() => 'No matches found'}
      />
    </div>
  );
}
