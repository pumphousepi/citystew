'use client';

import Navbar from './Navbar';

type Props = {
  selectedLocation: string;
  forceShowInputs?: boolean;
};

/** Client wrapper for Navbar so server pages can render it safely. */
export default function NavbarClient({ selectedLocation, forceShowInputs = false }: Props) {
  return (
    <Navbar
      selectedLocation={selectedLocation}
      onSelectLocation={() => {}}
      onSelectCategory={() => {}}
      onSelectGenre={() => {}}
      forceShowInputs={forceShowInputs}
    />
  );
}
