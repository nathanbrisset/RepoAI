import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getLocale } from "@/lib/i18n/get-locale";
import { metadataFor } from "@/lib/i18n/metadata";
import { categoryCopy, translate } from "@/lib/i18n/messages";
import { localizeHref } from "@/lib/i18n/paths";
import { localizeTool } from "@/lib/i18n/localize-tool";
import ToolCard from "@/components/tool-card";
import { mockTools } from "@/lib/data";
import type { Tool } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

export const metadata: Metadata = pageMetadata({
  title: "AI Match Results",
  description: "Tools suggested from your description. Results stay on this page and are not a separate listing for each search.",
  path: "/match-results",
})

interface MatchResult {
  tool: Tool;
  explanation: string;
}

export function generateMetadata() {
  return metadataFor("/match-results")
}

export default async function MatchResultsPage(props: any) {
  let query;
  if (props?.searchParams) {
    if (typeof props.searchParams.then === "function") {
      // It's a Promise
      const resolved = await props.searchParams;
      query = resolved.query;
    } else {
      // It's a plain object
      query = props.searchParams.query;
    }
  }
  
  if (!query) {
    notFound();
  }

  const locale = await getLocale()
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars)

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/recommend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: query, locale }),
        });

        if (!response.ok) {
          throw new Error('Failed to get recommendation');
        }

        const data = await response.json();
  const results = data?.recommendations || [];
  const intro = data?.intro || "";

  if (!results.length) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t("recommendation.noMatch")}</h1>
          <p className="text-gray-600 mb-8">{t("recommendation.noMatchBody")}</p>
          <Link href={localizeHref(locale, "/")}>
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("recommendation.backHome")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Top 3 recommended tools
  const topTools = results.filter(r => r?.tool?.id).slice(0, 3);
  const mainTool = topTools[0]?.tool;
  const mainExplanation = topTools[0]?.explanation;
  const otherTools = topTools.slice(1);

  // Find 3 more tools in the same category as the main tool, excluding the top 3
  let moreCategoryTools: Tool[] = [];
  if (mainTool) {
    moreCategoryTools = mockTools
      .filter(tool =>
        tool.id !== mainTool.id &&
        !topTools.find(t => t.tool && t.tool.id === tool.id) &&
        tool.categories.some(cat => mainTool.categories.includes(cat))
      )
      .slice(0, 3);
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <Link href={localizeHref(locale, "/")}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("recommendation.backHome")}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-4">{t("recommendation.resultsTitle")}</h1>
        <p className="text-gray-600">{intro}</p>
      </div>

      {/* Main Tool */}
      {mainTool && (
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img
                src={mainTool.image}
                alt={mainTool.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-2">{mainTool.name}</h2>
              <p className="text-gray-600 mb-4">{localizeTool(mainTool, locale).description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {mainTool.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {categoryCopy(locale, category)?.name || category}
                  </Badge>
                ))}
          </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="ml-1">{t("recommendation.popular")}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="ml-1">{t("recommendation.updated")}</span>
                </div>
              </div>
              <Link href={mainTool.url} target="_blank" rel="noopener noreferrer">
                <Button className="w-full md:w-auto">
                  {t("recommendation.visit")}
                </Button>
              </Link>
            </div>
          </div>
          {mainExplanation && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">{t("recommendation.why")}</h3>
              <p className="text-gray-600">{mainExplanation}</p>
            </div>
          )}
        </Card>
      )}

      {/* Other Recommended Tools */}
        {otherTools.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("recommendation.other")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherTools.map((result) => (
              <ToolCard key={result.tool.id} tool={result.tool} />
              ))}
            </div>
          </div>
        )}

      {/* More Tools in Same Category */}
        {moreCategoryTools.length > 0 && (
          <div>
          <h2 className="text-2xl font-bold mb-4">{t("recommendation.more")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {moreCategoryTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        )}
    </div>
  );
} 