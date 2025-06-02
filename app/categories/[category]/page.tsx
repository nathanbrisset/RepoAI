import { mockTools } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

type Props = {
  params: {
    category: string;
  };
};

export default function Page({ params }: Props) {
  // Convert URL category back to display format
  const displayCategory = params.category
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Filter tools for this category
  const categoryTools = mockTools.filter(tool =>
    tool.categories.includes(displayCategory)
  );

  return (
    <div className="container max-w-6xl py-6 lg:py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-left">{displayCategory}</h1>
          <p className="text-xl text-gray-600 mb-0 text-left">
            {categoryTools.length} tools available
          </p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-8 flex-shrink-0 w-full md:w-auto flex justify-start md:justify-end">
          <Link href="/categories" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium shadow hover:bg-purple-700 transition w-full md:w-auto text-center">
            Back to Categories
          </Link>
        </div>
      </div>
      <hr className="my-8" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categoryTools.map((tool) => (
          <Link key={tool.id} href={`/tools/${tool.id}`}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>{tool.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}