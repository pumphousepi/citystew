export default function HeroSection() {
  return (
    <section className="hero-section relative text-white text-center py-20">
      <div className="overlay absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">Discover Local Events</h1>
        <p className="mb-4">Find music, food, sports, and more in your city.</p>
        <a
          href="#categories"
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Explore Now
        </a>
      </div>
    </section>
  );
}
