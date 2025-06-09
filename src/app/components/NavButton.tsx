// src/app/components/NavButton.tsx
'use client';

import React, { ReactNode } from 'react';
import styles from './Navbar.module.css';

interface NavButtonProps {
  children: ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  ariaHasPopup?: boolean;
  /**
   * If true, apply the “active” variant (blue text, dark bg).
   * Otherwise apply the default white‐on‐dark link style.
   */
  active?: boolean;
  /** Extra classes you might want to pass on top of the defaults */
  className?: string;
}

export default function NavButton({
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ariaHasPopup = false,
  active = false,
  className = '',
}: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-haspopup={ariaHasPopup}
      className={`
        ${active ? styles.navItemActive : styles.navItem}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
