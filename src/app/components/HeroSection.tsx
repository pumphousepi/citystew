'use client';

export default function HeroSection() {
  return (
    <section className="relative bg-hero-banner bg-cover bg-center text-white text-center h-[80vh] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

      {/* Content */}
      <div className="relative z-10 px-4 max-w-3xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Find Tickets for Concerts, Sports & More
        </h1>
        <p className="text-lg sm:text-xl mb-6">
          Search thousands of events happening near you
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Search coming soon!');
          }}
          className="flex flex-col sm:flex-row max-w-2xl mx-auto rounded-full overflow-hidden shadow-lg bg-white"
        >
          <input
            type="text"
            placeholder="Search artists, teams, or venues"
            className="flex-grow px-6 py-3 text-gray-900 text-base focus:outline-none"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-semibold transition"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
