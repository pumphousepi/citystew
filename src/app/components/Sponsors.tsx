import Image from 'next/image';

const sponsors = [
  {
    img: 'yelp_ad_logo.png',
    title: 'Yelp for Business',
    desc: 'List your local business for free and connect with thousands of nearby customers.',
    url: 'https://biz.yelp.com/',
  },
  {
    img: 'google_ad_logo.png',
    title: 'Google Business Profile',
    desc: 'Get found on Google Search & Maps by adding your free business listing.',
    url: 'https://www.google.com/business/',
  },
  {
    img: 'bing_ad_logo.png',
    title: 'Bing Places',
    desc: 'Promote your business for free on Bing’s local search directory.',
    url: 'https://www.bingplaces.com/',
  },
];

export default function Sponsors() {
  return (
    <section id="sponsors" className="py-12">
      <h2 className="text-2xl font-bold text-center mb-6">Free Directory Ads</h2>
      <div className="flex justify-center space-x-4 overflow-x-auto px-4">
        {sponsors.map(({ img, title, desc, url }) => (
          <a
            key={title}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[200px] bg-white shadow rounded p-4 text-center"
          >
            <Image
              src={`/assets/images/${img}`}
              alt={title}
              width={100}
              height={100}
              className="mx-auto"
            />
            <div className="font-bold mt-2">{title}</div>
            <div className="text-sm">{desc}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
