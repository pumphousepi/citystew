import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CityStew',
  description: 'Discover local events in your city!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}</body>
    </html>
  );
}
