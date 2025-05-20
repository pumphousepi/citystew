'use client';

import { ReactNode } from 'react';

export default function NavButton({
  children,
  onClick,
  ariaHasPopup = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  ariaHasPopup?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-haspopup={ariaHasPopup}
      className="w-full text-left text-white font-semibold cursor-pointer px-2 py-2 hover:text-gray-700 focus:outline-none transition-colors duration-300"
    >
      {children}
    </button>
  );
}

