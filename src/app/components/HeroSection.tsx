<section className="hero-section relative text-white text-center py-28">
  <div className="absolute inset-0 bg-black bg-opacity-60"></div>
  <div className="relative z-10 max-w-4xl mx-auto px-4">
    <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 drop-shadow-lg">
      Discover Local Events Near You
    </h1>
    <p className="text-lg sm:text-xl mb-8 drop-shadow-md">
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
