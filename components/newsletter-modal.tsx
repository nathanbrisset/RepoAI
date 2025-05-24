"use client"
import { useState } from "react"

export default function NewsletterModal() {
  const [open, setOpen] = useState(true)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<null | "success" | "error">(null)
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-2 text-center">Subscribe to our Newsletter</h2>
        <p className="text-gray-600 mb-4 text-center">Get the latest AI tools and updates in your inbox.</p>
        {status === "success" ? (
          <div className="p-4 bg-green-100 text-green-800 rounded text-center">Thank you for subscribing!</div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault()
              setSubmitting(true)
              setStatus(null)
              try {
                const res = await fetch("/api/send-email", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    subject: "New Newsletter Subscriber",
                    message: `Newsletter signup: ${email}`,
                    email: "aitoolsrequest@gmail.com"
                  })
                })
                if (res.ok) setStatus("success")
                else setStatus("error")
              } catch {
                setStatus("error")
              } finally {
                setSubmitting(false)
              }
            }}
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded w-full"
              disabled={submitting}
            >
              {submitting ? "Subscribing..." : "Subscribe"}
            </button>
            {status === "error" && <div className="text-red-600 mt-2 text-center">There was an error. Please try again.</div>}
          </form>
        )}
      </div>
    </div>
  )
} 