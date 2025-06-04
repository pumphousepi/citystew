// src/app/components/NavButton.tsx
'use client';

import React, { ReactNode } from 'react';

interface NavButtonProps {
  children: ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  ariaHasPopup?: boolean;
  className?: string;
}

export default function NavButton({
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ariaHasPopup = false,
  className = '',
}: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-haspopup={ariaHasPopup}
      className={`
        ${className}
        w-full
        text-left
        font-semibold
        cursor-pointer
        px-2
        py-2
        hover:text-[#999]
        focus:outline-none
        transition-colors
        duration-300
      `}
    >
      {children}
    </button>
  );
}
