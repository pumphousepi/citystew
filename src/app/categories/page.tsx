import type { Metadata } from "next";
import Link from "next/link";
import MarketingPageShell from "../components/MarketingPageShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.citystew.com";

export const metadata: Metadata = {
  title: "Categories | CityStew",
  description: "Browse events by category: Sports, Concerts, Movies, Theater.",
  alternates: { canonical: `${SITE_URL}/categories` },
  openGraph: {
    title: "Categories | CityStew",
    description: "Browse events by category: Sports, Concerts, Movies, Theater.",
    url: `${SITE_URL}/categories`,
    siteName: "CityStew",
    type: "website",
  },
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const city = typeof sp.city === "string" ? sp.city : "";
  const state = typeof sp.state === "string" ? sp.state : "";
  const selectedLocation = city && state ? `${city}, ${state}` : "Austin, TX";

  const CATEGORIES = [
    { key: "sports", label: "Sports" },
    { key: "concerts", label: "Concerts" },
    { key: "movies", label: "Movies" },
    { key: "theater", label: "Theater" },
  ];

  return (
    <MarketingPageShell selectedLocation={selectedLocation}>
      <h1 className="text-3xl font-bold">Categories</h1>
      <p className="text-gray-700">
        Jump straight into what you love. Pick a category to see upcoming events near you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.key}
            href={`/events?category=${c.key}${city ? `&city=${encodeURIComponent(city)}` : ""}${state ? `&state=${encodeURIComponent(state)}` : ""}`}
            className="border rounded-lg p-4 hover:shadow transition text-blue-600 hover:underline"
          >
            {c.label}
          </Link>
        ))}
      </div>
    </MarketingPageShell>
  );
}
