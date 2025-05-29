// src/app/components/NavButton.tsx
'use client';

import { ReactNode } from 'react';

export default function NavButton({
  children,
  onClick,
  ariaHasPopup = false,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  ariaHasPopup?: boolean;
  className?: string;              // <— add this
}) {
  return (
    <button
      onClick={onClick}
      aria-haspopup={ariaHasPopup}
      className={`${className} w-full text-left font-semibold cursor-pointer px-2 py-2 hover:text-gray-700 focus:outline-none transition-colors duration-300`}
    >
      {children}
    </button>
  );
}
