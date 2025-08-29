import type { Metadata } from "next";
import MarketingPageShell from "../components/MarketingPageShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.citystew.com";

export const metadata: Metadata = {
  title: "Privacy Policy | CityStew",
  description: "How CityStew handles your data.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title: "Privacy Policy | CityStew",
    description: "How CityStew handles your data.",
    url: `${SITE_URL}/privacy`,
    siteName: "CityStew",
    type: "website",
  },
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function PrivacyPage({
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
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-gray-600 mb-6">Last updated: {lastUpdated}</p>

      <h2 className="text-xl font-semibold mt-6">Information We Collect</h2>
      <p className="text-gray-700">
        We collect information you provide directly, such as contact details, as well as data about how you use CityStew to improve our services.
      </p>

      <h2 className="text-xl font-semibold mt-6">How We Use Information</h2>
      <p className="text-gray-700">
        To operate and improve CityStew, personalize content, communicate with you, and comply with legal obligations.
      </p>

      <h2 className="text-xl font-semibold mt-6">Sharing</h2>
      <p className="text-gray-700">
        We don’t sell personal data. We may share with service providers that help us run CityStew, or when required by law.
      </p>

      <h2 className="text-xl font-semibold mt-6">Your Choices</h2>
      <p className="text-gray-700">
        You can contact us to access, update, or delete your information, subject to applicable law.
      </p>

      <h2 className="text-xl font-semibold mt-6">Contact</h2>
      <p className="text-gray-700">
        Questions? Email <a className="text-blue-600 underline" href="mailto:hello@citystew.com">hello@citystew.com</a>.
      </p>
    </MarketingPageShell>
  );
}
