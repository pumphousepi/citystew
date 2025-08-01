interface SponsoredCardProps {
    category?: string;
  }
  
  export default function SponsoredCard({ category }: SponsoredCardProps) {
    const adsByCategory: Record<string, { title: string; image: string; url: string }[]> = {
      music: [
        {
          title: '🎸 Rock Bar Downtown',
          image: '/ads/rock-bar.jpg',
          url: 'https://rockbardowntown.com',
        },
      ],
      sports: [
        {
          title: '🏈 Game Day Grill',
          image: '/ads/sports-grill.jpg',
          url: 'https://gamedaygrill.com',
        },
      ],
      theater: [
        {
          title: '🎭 Pre-Show Dining',
          image: '/ads/theater-dining.jpg',
          url: 'https://preshowdining.com',
        },
      ],
      default: [
        {
          title: '🍽️ Discover Local Eats',
          image: '/ads/food-banner.jpg',
          url: '/advertise',
        },
      ],
    };
  
    const ads = category && adsByCategory[category.toLowerCase()]
      ? adsByCategory[category.toLowerCase()]
      : adsByCategory.default;
  
    return (
      <div className="space-y-4">
        {ads.map((ad, index) => (
          <a
            key={index}
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border rounded-xl overflow-hidden shadow hover:shadow-md transition"
          >
            <img src={ad.image} alt={ad.title} className="w-full h-32 object-cover" />
            <div className="p-3 text-sm font-medium text-gray-800">{ad.title}</div>
          </a>
        ))}
      </div>
    );
  }
  