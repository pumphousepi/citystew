// src/app/category/[category]/page.tsx

interface CategoryPageProps {
    params: { category: string };
  }
  
  export default function CategoryPage({ params }: CategoryPageProps) {
    const { category } = params;
  
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Category: {category}</h1>
        {/* You can load filtered event listings here */}
      </div>
    );
  }
  