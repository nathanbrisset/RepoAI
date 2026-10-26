import { getLocale } from "@/lib/i18n/get-locale"
import { metadataFor } from "@/lib/i18n/metadata"
import { legalNoticeDocument } from "@/lib/i18n/legal"

export function generateMetadata() {
  return metadataFor("/legal")
}

export default async function LegalNoticePage() {
  const locale = await getLocale()
  const document = legalNoticeDocument(locale)
  const date = new Date().toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-4">{document.title}</h1>
      <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mb-8"></div>
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-8">{document.updated.replace("{date}", date)}</p>
        {document.sections.map((section) => (
          <section key={section.heading} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mb-4">
                {paragraph.includes("@") ? (
                  <>
                    {paragraph.split("contact@aitools.ninja")[0]}
                    <a href="mailto:contact@aitools.ninja" className="text-primary underline">
                      contact@aitools.ninja
                    </a>
                    {paragraph.split("contact@aitools.ninja")[1] ?? ""}
                  </>
                ) : (
                  paragraph
                )}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
