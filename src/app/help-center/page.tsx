import type { Metadata } from "next";
import MarketingPageShell from "../components/MarketingPageShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.citystew.com";

export const metadata: Metadata = {
  title: "Help Center | CityStew",
  description: "FAQs and support resources for CityStew.",
  alternates: { canonical: `${SITE_URL}/help-center` },
  openGraph: {
    title: "Help Center | CityStew",
    description: "FAQs and support resources for CityStew.",
    url: `${SITE_URL}/help-center`,
    siteName: "CityStew",
    type: "website",
  },
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function HelpCenterPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const city = typeof sp.city === "string" ? sp.city : "";
  const state = typeof sp.state === "string" ? sp.state : "";
  const selectedLocation = city && state ? `${city}, ${state}` : "Austin, TX";

  return (
    <MarketingPageShell selectedLocation={selectedLocation}>
      <h1 className="text-3xl font-bold">Help Center</h1>

      <section className="space-y-4">
        <details className="border rounded-lg p-4">
          <summary className="font-semibold cursor-pointer">
            How do I find events in my city?
          </summary>
          <p className="text-gray-700 mt-2">
            Use the navigation to choose your city/state, then browse categories like Sports, Concerts, Movies, or Theater.
          </p>
        </details>

        <details className="border rounded-lg p-4">
          <summary className="font-semibold cursor-pointer">
            Why are some categories empty?
          </summary>
          <p className="text-gray-700 mt-2">
            Event availability varies by location and date. Try a different city/state or check back later.
          </p>
        </details>

        <details className="border rounded-lg p-4">
          <summary className="font-semibold cursor-pointer">
            How do I advertise on CityStew?
          </summary>
          <p className="text-gray-700 mt-2">
            Visit the <a className="text-blue-600 underline" href="/advertise">Advertise</a> page or contact us.
          </p>
        </details>
      </section>

      <p className="text-gray-600">
        Still need help? <a href="/contact" className="text-blue-600 underline">Contact us →</a>
      </p>
    </MarketingPageShell>
  );
}
