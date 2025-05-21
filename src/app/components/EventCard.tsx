import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
  id?: string;
  title: string;
  image?: string;  // optional to avoid errors if missing
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-60 flex-shrink-0 flex flex-col h-[250px]">
      {/* Image container */}
      <div className="relative w-full h-40 flex-shrink-0">
        {image ? (
          <Image
            src={image}
            alt={title || 'Event image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 240px"
            priority={false}
          />
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Text content */}
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
