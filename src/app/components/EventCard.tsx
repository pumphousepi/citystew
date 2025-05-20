import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
  id?: string;
  title: string;
  image: string;
  date?: string;
  venue?: string;
  description?: string;
  href?: string;
}

export default function EventCard({
  id,
  title,
  image,
  date,
  venue,
  description,
  href,
}: EventCardProps) {
  const content = (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-60 flex-shrink-0 flex flex-col h-[360px]">
      {/* Fixed height image container */}
      <div className="relative w-full h-40 flex-shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Text content area */}
      <div className="p-4 flex flex-col flex-grow justify-between min-h-[140px]">
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          {date && <p className="text-sm text-gray-600">{date}</p>}
          {venue && <p className="text-sm text-gray-600">{venue}</p>}
        </div>
        {description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">{description}</p>
        )}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
