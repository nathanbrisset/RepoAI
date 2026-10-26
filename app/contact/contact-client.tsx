"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { Mail } from "lucide-react"
import { useT } from "@/components/locale-provider"

export default function ContactPage() {
  const t = useT()
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isNotRobot, setIsNotRobot] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) {
      setError(t("contact.missingForm"));
      return;
    }
    if (!isNotRobot) {
      setError(t("contact.confirmRobot"));
      return;
    }
    if (!consent) {
      setError(t("contact.confirmConsent"));
      return;
    }
    setIsSubmitting(true);
    setSuccess(false);
    setError("");
    
    const formData = new FormData(formRef.current);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || t("contact.sendFailed"));
      }

      setSuccess(true);
      formRef.current.reset();
      setIsNotRobot(false);
      setConsent(false);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : t("contact.sendFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-6 text-black">{t("contact.title")}</h1>
          <p className="text-xl text-gray-600">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{t("contact.sendTitle")}</h2>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contact.firstName")}
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full"
                  placeholder={t("contact.firstNamePlaceholder")}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contact.lastName")}
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="w-full"
                  placeholder={t("contact.lastNamePlaceholder")}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contact.email")}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contact.subject")}
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  className="w-full"
                  placeholder={t("contact.subjectPlaceholder")}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contact.message")}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  className="w-full min-h-[150px]"
                  placeholder={t("contact.messagePlaceholder")}
                />
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isNotRobot}
                    onChange={e => setIsNotRobot(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span>{t("contact.notRobot")}</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span>{t("contact.consent")}</span>
                </label>
              </div>
              {success && <div className="text-green-600 text-center">{t("contact.success")}</div>}
              {error && <div className="text-red-600 text-center">{error}</div>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? t("contact.sending") : t("contact.send")}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <div className="flex justify-center mb-6">
                <img
                  src="/ccare.png"
                  alt={t("contact.careAlt")}
                  width={200}
                  height={200}
                  className="rounded-lg"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">{t("contact.infoTitle")}</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-blue-600 mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{t("contact.emailLabel")}</h3>
                    <a href="mailto:contact@aitools.ninja" className="text-gray-600 hover:text-primary underline">
                      contact@aitools.ninja
                    </a>
                    <p className="text-sm text-gray-500 mt-1">{t("contact.replyTime")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">{t("contact.faqTitle")}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{t("contact.faqSubmitQ")}</h3>
                  <p className="text-gray-600">{t("contact.faqSubmitA")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t("contact.faqReviewQ")}</h3>
                  <p className="text-gray-600">{t("contact.faqReviewA")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t("contact.faqAdsQ")}</h3>
                  <p className="text-gray-600">{t("contact.faqAdsA")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 