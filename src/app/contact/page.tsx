// src/app/contact/page.tsx
import type { Metadata } from "next";
import NavbarClient from "../components/NavbarClient"; // ✅ use the client wrapper
import Footer from "../components/Footer";
import SponsoredCard from "../components/SponsoredCard";

export const metadata: Metadata = {
  title: "Contact Us | CityStew",
  description: "Get in touch with the CityStew team.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const city = typeof sp.city === "string" ? sp.city : "";
  const state = typeof sp.state === "string" ? sp.state : "";
  const selectedLocation = city && state ? `${city}, ${state}` : "Austin, TX";

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Same header/nav as home, via client wrapper */}
      <NavbarClient selectedLocation={selectedLocation} />

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: content */}
        <section className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-gray-700">
            Email us at{" "}
            <a className="text-blue-600 underline" href="mailto:hello@citystew.com">
              hello@citystew.com
            </a>
            .
          </p>

          <form className="space-y-3 max-w-xl">
            <input className="w-full border rounded p-2" placeholder="Your email" />
            <textarea
              className="w-full border rounded p-2"
              placeholder="How can we help?"
              rows={6}
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded" type="button">
              Send
            </button>
          </form>
        </section>

        {/* Right: ads / CTA */}
        <aside className="space-y-6">
          <SponsoredCard />
          <SponsoredCard />
          <div className="bg-yellow-50 border border-yellow-300 p-4 rounded text-sm text-yellow-800 shadow">
            🎯 Promote your business here!
            <br />
            <a href="/advertise" className="text-blue-600 underline font-medium">
              Advertise with CityStew
            </a>
          </div>
        </aside>
      </main>

      {/* Same footer as home */}
      <Footer />
    </div>
  );
}
