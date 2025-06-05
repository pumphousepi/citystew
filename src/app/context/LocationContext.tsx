// src/app/context/LocationContext.tsx
'use client';  // ← This file IS a client component

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LocationContextType {
  city: string;
  stateCode: string;
  setLocation: (city: string, stateCode: string) => void;
}

const LocationContext = createContext<LocationContextType>({
  city: '',
  stateCode: '',
  setLocation: () => {},
});

export function LocationProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('');

  function setLocation(city: string, stateCode: string) {
    setCity(city);
    setStateCode(stateCode);
  }

  return (
    <LocationContext.Provider value={{ city, stateCode, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
