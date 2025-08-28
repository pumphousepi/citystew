// src/app/components/NavButton.tsx
'use client';

import React, { ReactNode } from 'react';
import styles from './Navbar.module.css';

interface NavButtonProps {
  children: ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;

  // New neutral props
  hasPopup?: boolean;
  expanded?: boolean;
  controlsId?: string;

  // Legacy props (still supported)
  ariaHasPopup?: boolean;
  ariaExpanded?: boolean;
  ariaControls?: string;

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
  // legacy
  ariaHasPopup,
  ariaExpanded,
  ariaControls,
  active = false,
  className = '',
}: NavButtonProps) {
  const computedHasPopup = hasPopup ?? ariaHasPopup;
  const computedExpanded = expanded ?? ariaExpanded;
  const computedControlsId = controlsId ?? ariaControls;

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
      aria-haspopup={computedHasPopup || undefined}
      aria-expanded={computedExpanded}
      aria-controls={computedControlsId}
      className={`${active ? styles.navItemActive : styles.navItem} ${className}`}
      style={{ padding: '0.375rem 0.25rem' }}
    >
      {children}
    </button>
  );
}
