// src/app/providers.tsx
'use client';  // ← This entire file is a client component

import React, { ReactNode } from 'react';
import { LocationProvider } from './context/LocationContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocationProvider>
      {children}
    </LocationProvider>
  );
}
