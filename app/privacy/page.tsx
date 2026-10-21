import { getLocale } from "@/lib/i18n/get-locale"
import { privacyDocument } from "@/lib/i18n/legal"

export default async function PrivacyPolicyPage() {
  const locale = await getLocale()
  const document = privacyDocument(locale)
  const date = new Date().toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-4">{document.title}</h1>
      <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-8"></div>
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-8">{document.updated.replace("{date}", date)}</p>
        {document.sections.map((section) => (
          <section key={section.heading} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mb-4">
                {paragraph}
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
