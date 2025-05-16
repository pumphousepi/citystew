const categories = [
  { img: 'fork_icon.jpg', title: 'Food', desc: 'Find local food events and more!' },
  { img: 'music-note_icon.jpg', title: 'Music', desc: 'Explore music events in your area!' },
  { img: 'soccer-ball_icon.jpg', title: 'Sports', desc: 'Catch the latest sports events!' },
];

export default function Categories() {
  return (
    <section id="categories" className="py-12 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-6">Popular Categories</h2>
      <div className="flex justify-center space-x-6 overflow-x-auto px-4">
        {categories.map(({ img, title, desc }) => (
          <div
            key={title}
            className="min-w-[200px] bg-white shadow rounded p-4 flex flex-col items-center"
          >
            <div
              className="w-24 h-24 bg-center bg-no-repeat bg-contain mb-3"
              style={{ backgroundImage: `url('/assets/images/${img}')` }}
              aria-label={title}
              role="img"
            />
            <div className="font-bold mt-2 text-center">{title}</div>
            <div className="text-sm text-center">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
