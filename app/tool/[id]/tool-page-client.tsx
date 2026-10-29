"use client";

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ExternalLink, ThumbsUp, LogIn, FilePlus, User, ImageIcon, Upload, Globe, Zap, Eye, Download, HelpCircle } from "lucide-react"
import ToolCard from "@/components/tool-card"
import { Tool } from '@/lib/types'
import LocaleLink from "@/components/locale-link"
import { useLocale, useT } from "@/components/locale-provider"
import { categoryName } from "@/lib/category-meta"
import { categoryCopy, pricingLabel, statusLabel } from "@/lib/i18n/messages"
import { formatCatalogDate, localizeTool } from "@/lib/i18n/localize-tool"
import HqCountryFlag from "@/components/hq-country-flag"
import { hqCountryDisplayName, isValidHqCountry } from "@/lib/hq-country"

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

interface ToolPageClientProps {
  tool: Tool;
  relatedTools: any[]; // Replace with your Tool[] type
  successorName?: string;
}

function successorLabel(toolName: string, successorId?: string, successorName?: string) {
  if (!successorId) return ""
  if (successorName && successorName !== toolName) return successorName
  if (successorName) return `${successorName} (${successorId})`
  return successorId
}

// Icon mapping for steps
const stepIcons = [
  <LogIn key="login" className="w-8 h-8" />, // 1
  <FilePlus key="project" className="w-8 h-8" />, // 2
  <User key="avatar" className="w-8 h-8" />, // 3
  <ImageIcon key="background" className="w-8 h-8" />, // 4
  <Upload key="script" className="w-8 h-8" />, // 5
  <Globe key="voice" className="w-8 h-8" />, // 6
  <Zap key="media" className="w-8 h-8" />, // 7
  <Eye key="preview" className="w-8 h-8" />, // 8
  <Download key="export" className="w-8 h-8" />, // 9
  <HelpCircle key="faq" className="w-8 h-8" /> // FAQ
];

// Gradient color mapping for steps
const gradients = [
  "from-secondary to-muted",
  "from-card to-secondary",
  "from-muted to-background",
  "from-secondary to-card",
  "from-background to-secondary",
  "from-card to-muted",
  "from-muted to-secondary",
  "from-secondary to-background",
  "from-card to-background",
  "from-muted to-card",
]

export default function ToolPageClient({ tool: sourceTool, relatedTools, successorName }: ToolPageClientProps) {
  const [tab, setTab] = useState<'overview' | 'features'>('overview');
  const [activeStep, setActiveStep] = useState(0);
  const [howToOpen, setHowToOpen] = useState(false);
  const locale = useLocale();
  const t = useT();
  const tool = localizeTool(sourceTool, locale);
  const dateLabel = sourceTool.dateAdded ? formatCatalogDate(sourceTool.dateAdded, locale) : "";
  const checkedLabel = sourceTool.lastVerified ? formatCatalogDate(sourceTool.lastVerified, locale) : "";
  const priceLabel = pricingLabel(locale, sourceTool.isPremium);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <button onClick={() => window.history.back()} className="text-xs text-gray-500 hover:text-gray-700 mb-4 inline-block">← {t("tool.back")}</button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold">{tool.name}</h1>
              <HqCountryFlag
                iso2={sourceTool.hqCountry}
                ariaLabel={
                  isValidHqCountry(sourceTool.hqCountry)
                    ? t("tool.hqCountryLabel", {
                        country: hqCountryDisplayName(sourceTool.hqCountry, locale),
                      })
                    : ""
                }
              />
            </div>
            {tool.url ? (
            <div className="flex gap-2">
              <Link href={tool.url} target="_blank" rel="noopener noreferrer" className="px-4 py-1 rounded bg-primary text-white font-semibold hover:bg-primary/90 flex items-center gap-1 text-sm">
                {t("tool.visit")} <ExternalLink className="w-4 h-4 ml-1" />
              </Link>
            </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {tool.categories.map((cat: string) => (
              <LocaleLink key={cat} href={`/categories/${cat}`}>
                <Badge variant="secondary" className="text-xs">{categoryCopy(locale, cat)?.name || categoryName(cat)}</Badge>
              </LocaleLink>
            ))}
          </div>
          {((tool.status && tool.status !== "active") || tool.statusNote) && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {tool.status && tool.status !== "active" && (
                <span className="font-semibold">{statusLabel(locale, tool.status) || tool.status}. </span>
              )}
              {tool.statusNote}
              {tool.successorId && (
                <> {t("tool.see")} <LocaleLink href={`/tool/${tool.successorId}`} className="underline">{successorLabel(tool.name, tool.successorId, successorName)}</LocaleLink>.</>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm mb-6 flex-wrap">
            <span className="text-gray-400">{dateLabel ? t("tool.added", { date: dateLabel }) : t("tool.addedUnknown")}</span>
            {sourceTool.pricing?.uncertain || !sourceTool.isPremium ? null : (
              <span className="text-gray-400">{t("tool.pricing")} <span className="font-semibold text-gray-700">{priceLabel || t("tool.unknown")}</span>{sourceTool.pricing?.verified ? "" : ` ${t("tool.notRechecked")}`}</span>
            )}
            <span className="text-gray-400">{checkedLabel ? t("tool.lastChecked", { date: checkedLabel }) : `${t("tool.lastCheckedLabel")} ${t("tool.notChecked")}`}</span>
          </div>
          {(tool.image || tool.logo) && (
          <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden" style={{ minHeight: 340 }}>
            <img src={tool.image || tool.logo || ""} alt={tool.name} className="max-h-full max-w-full object-contain" loading="lazy" decoding="async" />
          </div>
          )}
          {/* Tabs */}
          <div className="border-b border-border mb-6 flex gap-2">
            <button onClick={() => setTab('overview')} className={`px-4 py-2 font-semibold ${tab === 'overview' ? 'border-b-2 border-primary text-primary bg-card' : 'text-gray-500'}`}>{t("tool.overview")}</button>
            <button onClick={() => setTab('features')} className={`px-4 py-2 font-semibold ${tab === 'features' ? 'border-b-2 border-primary text-primary bg-card' : 'text-gray-500'}`}>{t("tool.features")}</button>
          </div>
          {/* Tab Content */}
          {tab === 'overview' && (
            <div className="mb-8 space-y-4">
              <h2 className="text-xl font-bold mb-4">{t("tool.about", { name: tool.name })}</h2>
              <p className="text-gray-700 mb-4 whitespace-pre-line">{tool.longDescription || tool.description}</p>
              {tool.pricing?.details && !tool.pricing?.uncertain && (
                <p className="text-gray-700 mb-4"><b>{t("tool.priceNote")}</b> {tool.pricing.details}</p>
              )}
              {tool.dateAddedNote && (
                <p className="text-gray-600 mb-4 text-sm">{tool.dateAddedNote}</p>
              )}
              <p className="text-gray-700 mb-4">
                <b>{t("tool.categories")}</b> {tool.categories.map((cat) => categoryCopy(locale, cat)?.name || categoryName(cat)).join(", ")}
              </p>
              {tool.tags && tool.tags.length > 0 && (
                <p className="text-gray-700 mb-4">
                  <b>{t("tool.tags")}</b> {tool.tags.join(", ")}
                </p>
              )}
            </div>
          )}
          {tab === 'features' && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">{t("tool.keyFeatures")}</h2>
              {tool.features && tool.features.length > 0 ? (
                <ul className="space-y-4">
                  {tool.features.map((feature: string, idx: number) => {
                    const [title, ...descriptionParts] = feature.split(':');
                    const description = descriptionParts.join(':').trim();
                    return (
                      <li key={idx} className="flex items-start gap-3">
                        <ThumbsUp className="mt-1 text-primary" />
                        <div>
                          <div className="font-bold text-base text-gray-900">{title}</div>
                          <div className="text-gray-600 text-sm mt-1">{description}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500">{t("tool.noFeatures")}</p>
              )}
            </div>
          )}
          {/* How To Use Section (aligned with main content, collapsible) */}
          {tool.howToUse && Array.isArray(tool.howToUse) && tool.howToUse.length > 0 && (
            <div className="pt-10 pb-12">
              <div className="text-left mb-8 flex flex-col gap-2">
                <h2 className="text-3xl font-extrabold text-gray-900">{t("tool.howTo", { name: tool.name })}</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-gray-500 text-lg m-0">{t("tool.howToIntro")}</p>
                  <button
                    className={`ml-2 flex items-center gap-1 px-2 py-1 rounded-lg border border-border bg-card shadow-sm transition-all duration-200 focus:outline-none cursor-pointer hover:bg-secondary ${howToOpen ? 'rotate-180' : ''}`}
                    aria-label={howToOpen ? t("tool.collapseAria") : t("tool.expandAria")}
                    onClick={() => setHowToOpen(v => !v)}
                  >
                    <svg className="w-7 h-7 text-primary transition-colors duration-200 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="text-xs text-gray-600 font-medium select-none hidden sm:inline">{howToOpen ? t("tool.collapse") : t("tool.expand")}</span>
                  </button>
                </div>
              </div>
              {howToOpen && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {tool.howToUse.map((step, idx) => {
                      const isActive = idx === activeStep;
                      const isFAQ = step.title.toLowerCase().includes('faq');
                      return (
                        <button
                          key={idx}
                          className={`relative group text-left rounded-2xl p-4 transition-all duration-200 border outline-none focus:ring-2 focus:ring-primary bg-gradient-to-br ${gradients[idx % gradients.length]} ${isActive ? 'border-border scale-105 shadow-lg z-10' : 'border-transparent shadow-sm hover:scale-105 hover:shadow-md'} ${isFAQ ? 'ring-2 ring-blue-100' : ''}`}
                          style={{ minHeight: 160 }}
                          onClick={() => setActiveStep(idx)}
                          tabIndex={0}
                        >
                          {/* Blended step number */}
                          <span className="absolute top-3 right-4 text-4xl font-extrabold text-gray-300/40 select-none pointer-events-none z-0">
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          {/* Icon */}
                          <span className="relative z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-card/90 mb-3 shadow-sm border border-white/50">
                            {stepIcons[idx % stepIcons.length]}
                          </span>
                          {/* Title */}
                          <div className="relative z-10 font-bold text-base mb-1 text-gray-900">{step.title}</div>
                          {/* Description */}
                          <div className="relative z-10 text-gray-600 text-sm mb-1">
                            {step.description}
                          </div>
                          {/* FAQ button if present */}
                          {isFAQ && step.links && step.links.length > 0 && (
                            <a href={step.links[0].url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 mt-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold shadow-sm hover:from-primary hover:to-accent transition ring-1 ring-blue-100 animate-glow text-sm">
                              {t("tool.visitFaq")} <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {/* Navigation and Progress Dots */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                      onClick={() => setActiveStep(prev => (prev > 0 ? prev - 1 : tool.howToUse.length - 1))}
                      className="p-2 rounded-full bg-card shadow-sm border border-border hover:bg-secondary transition-colors"
                      aria-label={t("tool.previous")}
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="flex gap-2">
                      {tool.howToUse.map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${activeStep === idx ? 'bg-primary scale-125 shadow-sm' : 'bg-muted hover:bg-secondary'}`}
                          onClick={() => setActiveStep(idx)}
                          aria-label={t("tool.goToStep", { n: idx + 1 })}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setActiveStep(prev => (prev < tool.howToUse.length - 1 ? prev + 1 : 0))}
                      className="p-2 rounded-full bg-card shadow-sm border border-border hover:bg-secondary transition-colors"
                      aria-label={t("tool.next")}
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  {/* Fade-in animation keyframes */}
                  <style jsx>{`
                    .animate-glow { animation: glow 2s infinite alternate; }
                    @keyframes glow {
                      0% { box-shadow: 0 0 8px 2px #a5b4fc; }
                      50% { box-shadow: 0 0 24px 6px #818cf8; }
                      100% { box-shadow: 0 0 8px 2px #a5b4fc; }
                    }
                  `}</style>
                </>
              )}
            </div>
          )}
        </div>
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-card border border-gray-100 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">{t("tool.quickInfo")}</h3>
            <div className="flex flex-col gap-3 text-sm mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t("tool.category")}</span>
                <span className="font-medium">{tool.categories.map((cat) => categoryCopy(locale, cat)?.name || categoryName(cat)).join(", ")}</span>
              </div>
              {tool.pricing?.uncertain || !tool.isPremium ? null : (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t("tool.pricingLabel")}</span>
                <span className="font-medium">{priceLabel || t("tool.unknown")}{sourceTool.pricing?.verified ? "" : ` · ${t("tool.notRecheckedShort")}`}</span>
              </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t("tool.addedLabel")}</span>
                <span>{dateLabel || t("tool.notRecorded")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t("tool.lastCheckedLabel")}</span>
                <span>{checkedLabel || t("tool.notCheckedLabel")}</span>
              </div>
              {tool.tags && tool.tags.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-gray-500">{t("tool.keyFeaturesSide")}</span>
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {tool.url ? (
            <Link href={tool.url} target="_blank" className="block w-full bg-primary text-white text-center py-2 rounded-lg font-semibold hover:bg-primary/90 transition">
              {t("tool.visit")} <ExternalLink className="inline w-4 h-4 ml-1" />
            </Link>
            ) : null}
          </div>
          <div className="bg-card border border-gray-100 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t("tool.related")}</h3>
            <div className="flex flex-col gap-4">
              {relatedTools.length === 0 && <div className="text-gray-500 text-sm">{t("tool.noRelated")}</div>}
              {relatedTools.map((rel) => (
                <ToolCard key={rel.id} tool={rel} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
} 