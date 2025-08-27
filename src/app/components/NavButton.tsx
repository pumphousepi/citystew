'use client';

import React, { ReactNode } from 'react';
import styles from './Navbar.module.css';

interface NavButtonProps {
  children: ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;

  /** Use these neutral prop names on the custom component */
  hasPopup?: boolean;          // maps to aria-haspopup
  expanded?: boolean;          // maps to aria-expanded
  controlsId?: string;         // maps to aria-controls

  /** Visual state */
  active?: boolean;
  className?: string;
}

export default function NavButton({
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  hasPopup,
  expanded,
  controlsId,
  active = false,
  className = '',
}: NavButtonProps) {
  const onKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      aria-haspopup={hasPopup || undefined}
      aria-expanded={expanded}
      aria-controls={controlsId}
      className={`${active ? styles.navItemActive : styles.navItem} ${className}`}
      style={{ padding: '0.375rem 0.25rem' }}
    >
      {children}
    </button>
  );
}
