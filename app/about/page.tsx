"use client"

import { Button } from "@/components/ui/button"
import LocaleLink from "@/components/locale-link"
import { useT } from "@/components/locale-provider"

export default function AboutPage() {
  const t = useT()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-6 text-black">{t("about.title")}</h1>
          <p className="text-xl text-gray-600">{t("about.subtitle")}</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">{t("about.missionTitle")}</h2>
            <p className="text-gray-700 mb-4">{t("about.mission")}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">{t("about.whatTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t("about.discoveryTitle")}</h3>
                <p className="text-gray-700">{t("about.discovery")}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t("about.recommendTitle")}</h3>
                <p className="text-gray-700">{t("about.recommend")}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t("about.reviewsTitle")}</h3>
                <p className="text-gray-700">{t("about.reviews")}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{t("about.organizeTitle")}</h3>
                <p className="text-gray-700">{t("about.organize")}</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">{t("about.processTitle")}</h2>
            <div className="space-y-6">
              {[
                ["1", "about.researchTitle", "about.research"],
                ["2", "about.evaluationTitle", "about.evaluation"],
                ["3", "about.curationTitle", "about.curation"],
              ].map(([n, title, body]) => (
                <div className="flex items-start" key={n}>
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                    {n}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{t(title)}</h3>
                    <p className="text-gray-700">{t(body)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">{t("about.ctaTitle")}</h2>
            <div className="space-x-4">
              <LocaleLink href="/tools">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  {t("about.browse")}
                </Button>
              </LocaleLink>
              <LocaleLink href="/recommendation">
                <Button size="lg" variant="outline">
                  {t("about.personalized")}
                </Button>
              </LocaleLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
