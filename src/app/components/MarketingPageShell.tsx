import NavbarClient from "./NavbarClient";
import Footer from "./Footer";
import SponsoredCard from "./SponsoredCard";

export default function MarketingPageShell({
  selectedLocation,
  children,
}: {
  selectedLocation: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white text-black min-h-screen">
      <NavbarClient selectedLocation={selectedLocation} />
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">{children}</section>
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
      <Footer />
    </div>
  );
}
