// src/types/EventDetail.ts

export interface VenueData {
  name?: string;
  city?: { name?: string };
  state?: { stateCode?: string };
  address?: {
    line1?: string;
    postalCode?: string;   // ← added
  };
  location?: {
    latitude?: number;
    longitude?: number;
  };
}

export interface ImageData {
  url: string;
  ratio?: string;      // e.g. "16_9"
  width?: number;
  height?: number;
}

export interface PriceRange {
  min?: number;
  max?: number;
  currency?: string;   // e.g. "USD"
}

export interface Classification {
  segment?: { name?: string };
  genre?: { name?: string };
}

export interface EventDetail {
  id: string;
  name: string;
  dates?: {
    start?: {
      localDate?: string;
      localTime?: string;
    };
  };
  _embedded?: {
    venues?: VenueData[];
  };
  images?: ImageData[];
  info?: string;
  pleaseNote?: string;
  priceRanges?: PriceRange[];
  classifications?: Classification[];
  seatmap?: { staticUrl?: string };
  url?: string;
}
