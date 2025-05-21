import Image from 'next/image';
import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  image: string;
  href?: string;
}

export default function CategoryCard({ title, image, href }: CategoryCardProps) {
  const content = (
    <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-md flex-shrink-0">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
      />
      {/* Banner overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/70 text-black text-center py-2 font-bold text-lg">
        {title}
        </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
