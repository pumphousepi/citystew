'use client';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-title">Discover Local Events Near You</h1>
        <p className="hero-subtitle">
          Music, food, sports, and more — happening in your city now.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Search feature coming soon!');
          }}
          className="hero-search-form"
        >
          <input
            type="text"
            placeholder="Search events, cities, or categories"
            className="hero-search-input"
          />
          <button type="submit" className="hero-search-button">
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
