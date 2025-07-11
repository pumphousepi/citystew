// src/app/category/[category]/page.tsx

interface CategoryPageProps {
    params: {
      category: string;
    };
  }
  
  export default function CategoryPage({ params }: CategoryPageProps) {
    const { category } = params;
  
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold">Category: {category}</h1>
      </main>
    );
  }
  