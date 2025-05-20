'use client';

export default function HeroSection() {
  return (
    <section
      className="hero-section relative h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

      {/* Hero content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-lg">
          Discover Local Events Near You
        </h1>
        <p className="text-lg sm:text-xl mb-6 drop-shadow-md">
          Music, food, sports, and more — happening in your city now.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Search feature coming soon!');
          }}
          className="flex flex-col sm:flex-row max-w-2xl mx-auto rounded-full overflow-hidden shadow-lg bg-white"
        >
          <input
            type="text"
            placeholder="Search events, cities, or categories"
            className="flex-grow px-6 py-4 text-gray-900 text-lg focus:outline-none"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 font-semibold transition"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
