// src/app/category/[category]/page.tsx

interface Props {
    params: { category: string };
  }
  
  export default async function CategoryPage({ params }: Props) {
    const { category } = params;
  
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Category: {category}</h1>
  
        {/* Optional: Fetch and display category-specific events */}
        {/* Example: <EventList category={category} /> */}
      </div>
    );
  }
  