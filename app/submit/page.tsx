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
// import ReCAPTCHA from "react-google-recaptcha"

export default function SubmitToolPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNotRobot, setIsNotRobot] = useState(false)
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState("")
  // const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) {
      setError("Form reference is missing")
      return
    }
    if (!isNotRobot) {
      setError("Please confirm you are not a robot.")
      return
    }
    if (!consent) {
      setError("Please provide your consent to submit the tool.")
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
      setError("Failed to submit tool. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit an AI Tool</h1>
          <p className="text-gray-600">
            Share an AI tool with our community. We review all submissions and publish those that meet our quality
            standards.
          </p>
        </div>

        {submitted ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your submission has been received and will be reviewed by our team. We'll notify you once it's
                published.
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false)
                  setStep(1)
                }}
              >
                Submit Another Tool
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
                    step >= 1 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span className="text-sm mt-1">Basic Info</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-2"></div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 2 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span className="text-sm mt-1">Details</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-2"></div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 3 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                <span className="text-sm mt-1">Review</span>
              </div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Tell us about the AI tool you're submitting</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tool_name">Tool Name *</Label>
                      <Input id="tool_name" name="tool_name" placeholder="e.g., ChatGPT, Midjourney, etc." required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website URL *</Label>
                      <Input id="website" name="website" type="url" placeholder="https://example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Primary Category *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Pricing Model *</Label>
                      <RadioGroup defaultValue="freemium">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="free" id="free" />
                          <Label htmlFor="free">Free</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="freemium" id="freemium" />
                          <Label htmlFor="freemium">Freemium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paid" id="paid" />
                          <Label htmlFor="paid">Paid</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="pt-4 flex justify-end">
                      <Button type="button" onClick={() => setStep(2)}>
                        Next Step
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tool Details</CardTitle>
                    <CardDescription>Provide more information about the tool</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe what the tool does and its key features..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="features">Key Features</Label>
                      <Textarea
                        id="features"
                        placeholder="List the main features, one per line..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Tool Screenshot or Logo URL</Label>
                      <Input id="logo" name="logo" type="url" placeholder="https://example.com/image.jpg" />
                      <p className="text-sm text-gray-500">Provide a URL to an image that represents the tool</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags <span className="text-gray-500">(comma separated)</span></Label>
                      <Input id="tags" name="tags" placeholder="e.g. writing, productivity, GPT" />
                    </div>
                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button type="button" onClick={() => setStep(3)}>
                        Next Step
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review & Submit</CardTitle>
                    <CardDescription>Review your submission before sending</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center text-amber-600 mb-2">
                        <Info className="h-5 w-5 mr-2" />
                        <span className="font-medium">Submission Guidelines</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        We review all submissions to ensure they meet our quality standards. Please ensure:
                      </p>
                      <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                        <li>The tool uses AI technology in a meaningful way</li>
                        <li>The tool is publicly available (not in closed beta)</li>
                        <li>Your description is accurate and free from excessive marketing language</li>
                        <li>You have provided all required information</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="submitter_name">Your Name *</Label>
                      <Input id="submitter_name" placeholder="Your full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="submitter_email">Your Email *</Label>
                      <Input id="submitter_email" type="email" placeholder="your@email.com" required />
                      <p className="text-sm text-gray-500">
                        We'll notify you when your submission is approved or if we need more information
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Your Relationship to the Tool *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">I'm a user</SelectItem>
                          <SelectItem value="creator">I created this tool</SelectItem>
                          <SelectItem value="employee">I work for the company</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isNotRobot}
                          onChange={e => { setIsNotRobot(e.target.checked); setError(""); }}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span>I am not a robot</span>
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
                        <span>I consent to my information being used to contact me.</span>
                      </label>
                    </div>
                    {error && <div className="text-red-600 text-center mb-2">{error}</div>}
                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button type="submit" className="w-full h-12 text-base font-bold" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Tool"}
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
