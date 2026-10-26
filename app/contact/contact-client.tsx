"use client"

import { ArrowRight } from "lucide-react"
import { useRef, useState } from "react"
import { Mail } from "lucide-react"
import LocaleLink from "@/components/locale-link"
import { useLocale } from "@/components/locale-provider"
import { useT } from "@/components/locale-provider"
import { directoryCopy } from "@/lib/i18n/directory-copy"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const t = useT()
  const locale = useLocale()
  const nav = directoryCopy(locale)
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isNotRobot, setIsNotRobot] = useState(false)
  const [consent, setConsent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) {
      setError(t("contact.missingForm"))
      return
    }
    if (!isNotRobot) {
      setError(t("contact.confirmRobot"))
      return
    }
    if (!consent) {
      setError(t("contact.confirmConsent"))
      return
    }
    setIsSubmitting(true)
    setSuccess(false)
    setError("")

    const formData = new FormData(formRef.current)
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || t("contact.sendFailed"))
      }
      setSuccess(true)
      formRef.current.reset()
      setIsNotRobot(false)
      setConsent(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("contact.sendFailed"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const asideSections = [
    { title: t("contact.readTitle"), body: t("contact.readBody") },
    { title: t("contact.partnersTitle"), body: t("contact.partnersBody") },
    { title: t("contact.otherTitle"), body: t("contact.otherBody") },
  ]

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-16">
      <LocaleLink href="/" className="font-semibold text-primary">
        ← {nav.backHome}
      </LocaleLink>
      <p className="mt-12 text-sm font-bold uppercase tracking-[0.2em] text-accent">{nav.brand}</p>
      <h1 className="mt-2 font-display text-5xl md:text-6xl">{t("contact.title")}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("contact.lead")}</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)]">
        <div className="rounded-3xl bg-card p-6 ring-1 ring-border md:p-8">
          <h2 className="font-display text-2xl">{t("contact.sendTitle")}</h2>
          <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1 block text-sm font-semibold">{t("contact.firstName")}</label>
                <Input id="firstName" name="firstName" required placeholder={t("contact.firstNamePlaceholder")} />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1 block text-sm font-semibold">{t("contact.lastName")}</label>
                <Input id="lastName" name="lastName" required placeholder={t("contact.lastNamePlaceholder")} />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-semibold">{t("contact.email")}</label>
              <Input id="email" name="email" type="email" required placeholder="your@email.com" />
            </div>
            <div>
              <label htmlFor="subject" className="mb-1 block text-sm font-semibold">{t("contact.subject")}</label>
              <Input id="subject" name="subject" required placeholder={t("contact.subjectPlaceholder")} />
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-semibold">{t("contact.message")}</label>
              <Textarea id="message" name="message" required className="min-h-[150px]" placeholder={t("contact.messagePlaceholder")} />
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={isNotRobot} onChange={(e) => setIsNotRobot(e.target.checked)} className="mt-1" />
              <span>{t("contact.notRobot")}</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
              <span>{t("contact.consent")}</span>
            </label>
            {success ? <p className="text-sm font-semibold text-primary">{t("contact.success")}</p> : null}
            {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
              {isSubmitting ? t("contact.sending") : t("contact.send")}
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          {asideSections.map((section) => (
            <section key={section.title} className="rounded-3xl bg-card p-6 ring-1 ring-border">
              <h2 className="font-display text-xl">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </section>
          ))}
          <section className="rounded-3xl bg-card p-6 ring-1 ring-border">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h2 className="font-display text-xl">{t("contact.infoTitle")}</h2>
                <a href="mailto:aitoolrequest@gmail.com" className="mt-2 inline-block font-semibold text-primary underline">
                  aitoolrequest@gmail.com
                </a>
              </div>
            </div>
          </section>
          <section className="rounded-3xl bg-card p-6 ring-1 ring-border">
            <h2 className="font-display text-xl">{t("contact.faqTitle")}</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-semibold">{t("contact.faqFixQ")}</dt>
                <dd className="text-muted-foreground">{t("contact.faqFixA")}</dd>
              </div>
              <div>
                <dt className="font-semibold">{t("contact.faqSubmitQ")}</dt>
                <dd className="text-muted-foreground">{t("contact.faqSubmitA")}</dd>
              </div>
              <div>
                <dt className="font-semibold">{t("contact.faqAdsQ")}</dt>
                <dd className="text-muted-foreground">{t("contact.faqAdsA")}</dd>
              </div>
            </dl>
            <LocaleLink href="/submit" className="mt-5 inline-flex items-center text-sm font-semibold text-primary">
              {nav.submit} <ArrowRight className="ml-1 size-4" />
            </LocaleLink>
          </section>
        </div>
      </div>
    </main>
  )
}
