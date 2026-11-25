"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowRight, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { categories } from "@/lib/data"
import { useLocale, useT } from "@/components/locale-provider"
import { categoryCopy } from "@/lib/i18n/messages"
// import ReCAPTCHA from "react-google-recaptcha"

type FieldErrors = Record<string, string>

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function fieldErrorProps(id: string, errors: FieldErrors) {
  const message = errors[id]
  if (!message) return {}
  return {
    "aria-invalid": true as const,
    "aria-describedby": `${id}-error`,
  }
}

export default function SubmitToolPage() {
  const t = useT()
  const locale = useLocale()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNotRobot, setIsNotRobot] = useState(false)
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [category, setCategory] = useState("")
  const [pricing, setPricing] = useState("freemium")
  const [relationship, setRelationship] = useState("")
  // const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  function clearFieldError(id: string) {
    setFieldErrors((prev) => {
      if (!prev[id]) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  function validateStep(target: number): boolean {
    const form = formRef.current
    if (!form) return false
    const nextErrors: FieldErrors = {}
    const toolName = (form.elements.namedItem("tool_name") as HTMLInputElement | null)?.value.trim() ?? ""
    const website = (form.elements.namedItem("website") as HTMLInputElement | null)?.value.trim() ?? ""
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement | null)?.value.trim() ?? ""
    const submitterName = (form.elements.namedItem("submitter_name") as HTMLInputElement | null)?.value.trim() ?? ""
    const submitterEmail = (form.elements.namedItem("submitter_email") as HTMLInputElement | null)?.value.trim() ?? ""

    if (target >= 2) {
      if (!toolName) nextErrors.tool_name = t("submit.errorRequired")
      if (!website) nextErrors.website = t("submit.errorRequired")
      else if (!isValidUrl(website)) nextErrors.website = t("submit.errorUrl")
      if (!category) nextErrors.category = t("submit.errorCategory")
    }
    if (target >= 3) {
      if (!description) nextErrors.description = t("submit.errorRequired")
    }
    if (target >= 4) {
      if (!submitterName) nextErrors.submitter_name = t("submit.errorRequired")
      if (!submitterEmail) nextErrors.submitter_email = t("submit.errorRequired")
      else if (!isValidEmail(submitterEmail)) nextErrors.submitter_email = t("submit.errorEmail")
      if (!relationship) nextErrors.relationship = t("submit.errorRelationship")
    }

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function goToStep(next: number) {
    if (!validateStep(next)) return
    setStep(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(4)) return
    if (!formRef.current) {
      setError(t("submit.missingForm"))
      return
    }
    if (!isNotRobot) {
      setError(t("submit.confirmRobot"))
      return
    }
    if (!consent) {
      setError(t("submit.confirmConsent"))
      return
    }
    setIsSubmitting(true)
    setError("")
    const formData = new FormData(formRef.current)
    const data = {
      toolName: formData.get("tool_name"),
      description: formData.get("description"),
      website: formData.get("website"),
      category: formData.get("category"),
      tags: formData.get("tags"),
      logo: formData.get("logo"),
    }
    try {
      const response = await fetch("/api/submit-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to submit tool")
      setSubmitted(true)
      formRef.current.reset()
      setIsNotRobot(false)
      setConsent(false)
      setError("")
    } catch (error) {
      setError(t("submit.failed"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("submit.title")}</h1>
          <p className="text-gray-600">
            {t("submit.subtitle")}
          </p>
        </div>

        {submitted ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t("submit.thanks")}</h2>
              <p className="text-gray-600 mb-6">
                {t("submit.thanksBody")}
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false)
                  setStep(1)
                }}
              >
                {t("submit.another")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span className="text-sm mt-1">{t("submit.stepBasic")}</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-2"></div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span className="text-sm mt-1">{t("submit.stepDetails")}</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-2"></div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 3 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                <span className="text-sm mt-1">{t("submit.stepReview")}</span>
              </div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("submit.basicTitle")}</CardTitle>
                    <CardDescription>{t("submit.basicHint")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tool_name">{t("submit.toolName")}</Label>
                      <Input
                        id="tool_name"
                        name="tool_name"
                        placeholder={t("submit.toolNamePlaceholder")}
                        required
                        {...fieldErrorProps("tool_name", fieldErrors)}
                        onChange={() => clearFieldError("tool_name")}
                      />
                      {fieldErrors.tool_name ? (
                        <p id="tool_name-error" className="text-sm text-red-600" role="alert">{fieldErrors.tool_name}</p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">{t("submit.website")}</Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://example.com"
                        required
                        {...fieldErrorProps("website", fieldErrors)}
                        onChange={() => clearFieldError("website")}
                      />
                      {fieldErrors.website ? (
                        <p id="website-error" className="text-sm text-red-600" role="alert">{fieldErrors.website}</p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">{t("submit.category")}</Label>
                      <input type="hidden" name="category" value={category} />
                      <Select
                        value={category}
                        onValueChange={(value) => {
                          setCategory(value)
                          clearFieldError("category")
                        }}
                      >
                        <SelectTrigger id="category" {...fieldErrorProps("category", fieldErrors)}>
                          <SelectValue placeholder={t("submit.categoryPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {categoryCopy(locale, item.id)?.name || item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldErrors.category ? (
                        <p id="category-error" className="text-sm text-red-600" role="alert">{fieldErrors.category}</p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Label>{t("submit.pricing")}</Label>
                      <RadioGroup value={pricing} onValueChange={setPricing}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="free" id="free" />
                          <Label htmlFor="free">{t("submit.free")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="freemium" id="freemium" />
                          <Label htmlFor="freemium">{t("submit.freemium")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paid" id="paid" />
                          <Label htmlFor="paid">{t("submit.paid")}</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="pt-4 flex justify-end">
                      <Button type="button" onClick={() => goToStep(2)}>
                        {t("submit.next")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("submit.detailsTitle")}</CardTitle>
                    <CardDescription>{t("submit.detailsHint")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">{t("submit.description")}</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder={t("submit.descriptionPlaceholder")}
                        className="min-h-[120px]"
                        required
                        {...fieldErrorProps("description", fieldErrors)}
                        onChange={() => clearFieldError("description")}
                      />
                      {fieldErrors.description ? (
                        <p id="description-error" className="text-sm text-red-600" role="alert">{fieldErrors.description}</p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="features">{t("submit.features")}</Label>
                      <Textarea
                        id="features"
                        placeholder={t("submit.featuresPlaceholder")}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">{t("submit.image")}</Label>
                      <Input id="logo" name="logo" type="url" placeholder="https://example.com/image.jpg" />
                      <p className="text-sm text-gray-500">{t("submit.imageHint")}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">{t("submit.tags")} <span className="text-gray-500">{t("submit.tagsHint")}</span></Label>
                      <Input id="tags" name="tags" placeholder={t("submit.tagsPlaceholder")} />
                    </div>
                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        {t("submit.back")}
                      </Button>
                      <Button type="button" onClick={() => goToStep(3)}>
                        {t("submit.next")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("submit.reviewTitle")}</CardTitle>
                    <CardDescription>{t("submit.reviewHint")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center text-amber-600 mb-2">
                        <Info className="h-5 w-5 mr-2" />
                        <span className="font-medium">{t("submit.guidelines")}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {t("submit.guidelinesIntro")}
                      </p>
                      <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                        <li>{t("submit.ruleAi")}</li>
                        <li>{t("submit.rulePublic")}</li>
                        <li>{t("submit.ruleAccurate")}</li>
                        <li>{t("submit.ruleComplete")}</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="submitter_name">{t("submit.yourName")}</Label>
                      <Input
                        id="submitter_name"
                        name="submitter_name"
                        placeholder={t("submit.yourNamePlaceholder")}
                        required
                        {...fieldErrorProps("submitter_name", fieldErrors)}
                        onChange={() => clearFieldError("submitter_name")}
                      />
                      {fieldErrors.submitter_name ? (
                        <p id="submitter_name-error" className="text-sm text-red-600" role="alert">{fieldErrors.submitter_name}</p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="submitter_email">{t("submit.yourEmail")}</Label>
                      <Input
                        id="submitter_email"
                        name="submitter_email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        {...fieldErrorProps("submitter_email", fieldErrors)}
                        onChange={() => clearFieldError("submitter_email")}
                      />
                      {fieldErrors.submitter_email ? (
                        <p id="submitter_email-error" className="text-sm text-red-600" role="alert">{fieldErrors.submitter_email}</p>
                      ) : null}
                      <p className="text-sm text-gray-500">
                        {t("submit.emailNote")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">{t("submit.relationship")}</Label>
                      <input type="hidden" name="relationship" value={relationship} />
                      <Select
                        value={relationship}
                        onValueChange={(value) => {
                          setRelationship(value)
                          clearFieldError("relationship")
                        }}
                      >
                        <SelectTrigger id="relationship" {...fieldErrorProps("relationship", fieldErrors)}>
                          <SelectValue placeholder={t("submit.relationshipPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">{t("submit.relUser")}</SelectItem>
                          <SelectItem value="creator">{t("submit.relCreator")}</SelectItem>
                          <SelectItem value="employee">{t("submit.relEmployee")}</SelectItem>
                          <SelectItem value="other">{t("submit.relOther")}</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldErrors.relationship ? (
                        <p id="relationship-error" className="text-sm text-red-600" role="alert">{fieldErrors.relationship}</p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isNotRobot}
                          onChange={e => { setIsNotRobot(e.target.checked); setError(""); }}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span>{t("submit.notRobot")}</span>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={e => { setConsent(e.target.checked); setError(""); }}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span>{t("submit.consent")}</span>
                      </label>
                    </div>
                    {error && <div className="text-red-600 text-center mb-2">{error}</div>}
                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>
                        {t("submit.back")}
                      </Button>
                      <Button type="submit" className="w-full h-12 text-base font-bold" disabled={isSubmitting}>
                        {isSubmitting ? t("submit.submitting") : t("submit.submit")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  )
}
