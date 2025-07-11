// src/app/category/[category]/page.tsx

interface Props {
    params: {
      category: string;
    };
  }
  
  export default async function CategoryPage({ params }: Props) {
    const { category } = params;
  
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold">Category: {category}</h1>
      </main>
    );
  }
  