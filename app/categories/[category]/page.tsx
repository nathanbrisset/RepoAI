import { categories, mockTools } from "@/lib/data"
import BackButton from "./BackButton"
import { notFound } from "next/navigation"
import PricingToolsGrid from "./PricingToolsGrid"
import { getLocale } from "@/lib/i18n/get-locale"
import { categoryCopy } from "@/lib/i18n/messages"
import { metadataFor } from "@/lib/i18n/metadata"

// Generate static paths for all categories
export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }))
}

type PageProps = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: PageProps) {
  const { category } = await props.params
  if (!categories.some((item) => item.id === category)) notFound()
  return metadataFor(`/categories/${category}`)
}

export default async function CategoryPage(props: PageProps) {
  const [{ category }, searchParams] = await Promise.all([
    props.params,
    props.searchParams
  ]);
  
  const categoryObj = categories.find((c) => c.id === category);
  
  if (!categoryObj) {
    notFound();
  }

  const locale = await getLocale()
  const copy = categoryCopy(locale, categoryObj.id) || categoryObj

  // Get tools in this category
  const tools = mockTools.filter(tool => tool.categories.includes(categoryObj.id));

  return (
    <div className="container py-8 space-y-8">
      <BackButton />
      <h1 className="text-4xl font-extrabold mb-4 text-purple-700 drop-shadow-sm">{copy.name}</h1>
      <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-200 rounded-xl p-6 mb-8 shadow-md border border-gray-200">
        <p className="text-lg text-gray-800 leading-relaxed">
          <span className="font-semibold text-purple-700">{copy.description}</span>
          {copy.about && (
            <span> <span className="font-semibold text-gray-700">{copy.about}</span></span>
          )}
        </p>
      </div>
      <PricingToolsGrid tools={tools} />
    </div>
  );
}