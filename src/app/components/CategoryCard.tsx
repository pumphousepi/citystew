import Image from 'next/image';

interface CategoryCardProps {
  title: string;
  image: string;
}

export default function CategoryCard({ title, image }: CategoryCardProps) {
  return (
    <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-md flex-shrink-0 cursor-default hover:brightness-90 transition">
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
}

