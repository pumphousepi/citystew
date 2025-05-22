'use client';

import React, { useEffect, useState } from 'react';

interface LocationSelectorProps {
  onLocationChange: (state: string, city: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationChange }) => {
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch('/api/locations/states');
        const data = await res.json();
        setStates(data.states || []);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const fetchCities = async () => {
        try {
          const res = await fetch(`/api/locations/cities?state=${selectedState}`);
          const data = await res.json();
          setCities(data.cities || []);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      };
      fetchCities();
    }
  }, [selectedState]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
    onLocationChange(e.target.value, ''); // Reset city
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    onLocationChange(selectedState, e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <select
        value={selectedState}
        onChange={handleStateChange}
        className="p-2 border rounded-md w-full md:w-1/2"
      >
        <option value="">Select a state</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      <select
        value={selectedCity}
        onChange={handleCityChange}
        disabled={!selectedState}
        className="p-2 border rounded-md w-full md:w-1/2"
      >
        <option value="">Select a city</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;
