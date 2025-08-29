import type { Metadata } from "next";
import MarketingPageShell from "../components/MarketingPageShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.citystew.com";

export const metadata: Metadata = {
  title: "Terms of Service | CityStew",
  description: "Your agreement with CityStew.",
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title: "Terms of Service | CityStew",
    description: "Your agreement with CityStew.",
    url: `${SITE_URL}/terms`,
    siteName: "CityStew",
    type: "website",
  },
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function TermsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const city = typeof sp.city === "string" ? sp.city : "";
  const state = typeof sp.state === "string" ? sp.state : "";
  const selectedLocation = city && state ? `${city}, ${state}` : "Austin, TX";

  const lastUpdated = new Date().toISOString().slice(0, 10);

  return (
    <MarketingPageShell selectedLocation={selectedLocation}>
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-gray-600 mb-6">Last updated: {lastUpdated}</p>

      <h2 className="text-xl font-semibold mt-6">Acceptance of Terms</h2>
      <p className="text-gray-700">
        By using CityStew, you agree to these Terms. If you don’t agree, please don’t use the service.
      </p>

      <h2 className="text-xl font-semibold mt-6">Use of the Service</h2>
      <p className="text-gray-700">
        You may use CityStew only as permitted by law and these Terms. We may modify or discontinue features at any time.
      </p>

      <h2 className="text-xl font-semibold mt-6">Content & Links</h2>
      <p className="text-gray-700">
        CityStew may contain links to third-party sites. We’re not responsible for their content or privacy practices.
      </p>

      <h2 className="text-xl font-semibold mt-6">Limitation of Liability</h2>
      <p className="text-gray-700">
        CityStew is provided “as is.” We disclaim warranties to the fullest extent permitted by law.
      </p>

      <h2 className="text-xl font-semibold mt-6">Contact</h2>
      <p className="text-gray-700">
        Questions about these Terms? Email <a className="text-blue-600 underline" href="mailto:hello@citystew.com">hello@citystew.com</a>.
      </p>
    </MarketingPageShell>
  );
}
