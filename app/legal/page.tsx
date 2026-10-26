import { getLocale } from "@/lib/i18n/get-locale"
import { metadataFor } from "@/lib/i18n/metadata"
import { legalNoticeDocument } from "@/lib/i18n/legal"

const CONTACT_EMAIL = "aitoolrequest@gmail.com"

function renderParagraph(paragraph: string) {
  if (paragraph.includes(CONTACT_EMAIL)) {
    const [before, after = ""] = paragraph.split(CONTACT_EMAIL)
    return (
      <>
        {before}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">
          {CONTACT_EMAIL}
        </a>
        {after}
      </>
    )
  }
  if (paragraph === "https://vercel.com") {
    return (
      <a href="https://vercel.com" className="text-primary underline" rel="noopener noreferrer" target="_blank">
        vercel.com
      </a>
    )
  }
  return paragraph
}

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
                {renderParagraph(paragraph)}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
