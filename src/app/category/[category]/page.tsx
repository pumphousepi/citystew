// src/app/category/[category]/page.tsx

export default function CategoryPage({ params }: { params: { category: string } }) {
    const { category } = params;
  
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Category: {category}</h1>
        {/* You can render event cards or filters for this category here */}
      </div>
    );
  }
  