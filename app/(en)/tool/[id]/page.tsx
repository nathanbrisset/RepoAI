import { notFound } from "next/navigation";
import { allTools } from "@/lib/data";
import { ToolPageContent } from "@/lib/pages/tool-page-content";
import { metadataFor } from "@/lib/i18n/metadata";
import { PAGE_LOCALE_EN } from "@/lib/i18n/page-locale";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return allTools.map((tool) => ({
    id: tool.id,
  }));
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (!allTools.some((tool) => tool.id === id)) notFound();
  return metadataFor(`/tool/${id}`, PAGE_LOCALE_EN);
}

export default async function ToolPage(props: PageProps) {
  return ToolPageContent({ locale: PAGE_LOCALE_EN, params: props.params });
}
