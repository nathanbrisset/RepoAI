"use client"

import { useLocale } from "@/components/locale-provider"
import { termsDocument, privacyDocument, legalNoticeDocument } from "@/lib/i18n/legal"
import { LegalUpdatedLine } from "./legal-updated-line"

type DocKind = "terms" | "privacy" | "legal"

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

export function LegalDocumentPage({ kind }: { kind: DocKind }) {
  const locale = useLocale()
  const document =
    kind === "terms"
      ? termsDocument(locale)
      : kind === "privacy"
        ? privacyDocument(locale)
        : legalNoticeDocument(locale)
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-4">{document.title}</h1>
      <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mb-8"></div>
      <div className="prose prose-lg max-w-none">
        <LegalUpdatedLine template={document.updated} locale={locale} />
        {document.sections.map((section) => (
          <section key={section.heading} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mb-4">
                {kind === "legal" ? renderParagraph(paragraph) : paragraph}
              </p>
            ))}
            {section.list ? (
              <ul className="list-disc pl-6 mb-4">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  )
}
