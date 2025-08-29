import type { Metadata } from "next";
import Link from "next/link";
import MarketingPageShell from "../components/MarketingPageShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.citystew.com";

export const metadata: Metadata = {
  title: "Family Events | CityStew",
  description: "Family-friendly movies and theater near you.",
  alternates: { canonical: `${SITE_URL}/family-events` },
  openGraph: {
    title: "Family Events | CityStew",
    description: "Family-friendly movies and theater near you.",
    url: `${SITE_URL}/family-events`,
    siteName: "CityStew",
    type: "website",
  },
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function FamilyEventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const city = typeof sp.city === "string" ? sp.city : "";
  const state = typeof sp.state === "string" ? sp.state : "";
  const selectedLocation = city && state ? `${city}, ${state}` : "Austin, TX";

  const locSuffix =
    `${city ? `&city=${encodeURIComponent(city)}` : ""}` +
    `${state ? `&state=${encodeURIComponent(state)}` : ""}`;

  return (
    <MarketingPageShell selectedLocation={selectedLocation}>
      <h1 className="text-3xl font-bold">Family Events</h1>
      <p className="text-gray-700">
        Find kid-friendly movies, touring shows, and local productions.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={`/events?category=movies${locSuffix}`}
          className="border rounded-lg p-4 hover:shadow transition text-blue-600 hover:underline"
        >
          🍿 Family Movies Near You
        </Link>
        <Link
          href={`/events?category=theater${locSuffix}`}
          className="border rounded-lg p-4 hover:shadow transition text-blue-600 hover:underline"
        >
          🎭 Family & Kids Theater
        </Link>
      </div>

      <p className="text-gray-600">
        Or <Link className="text-blue-600 underline" href={`/events${locSuffix ? `?${locSuffix.slice(1)}` : ""}`}>see all upcoming events →</Link>
      </p>
    </MarketingPageShell>
  );
}
