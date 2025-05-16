"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Please complete the CAPTCHA.");
      return;
    }
    setIsSubmitting(true);

    if (!formRef.current) {
      alert("Form reference is missing");
      return;
    }

    const formData = new FormData(formRef.current);
    const data = {
      firstName: formData.get('first_name'),
      lastName: formData.get('last_name'),
      email: formData.get('email'),
      message: formData.get('message'),
      captchaToken,
    };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      alert('Message sent successfully!');
      formRef.current.reset();
      setCaptchaToken(null);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-muted/50 py-8">
      <div className="w-full max-w-4xl bg-card rounded-2xl shadow-xl border flex flex-col md:flex-row overflow-hidden">
        {/* Left: Image and welcome */}
        <div className="md:w-1/2 flex flex-col items-center justify-center bg-muted p-8 md:p-10">
          <Image
            src="/my-photo.jpg"
            alt="Contact us"
            width={180}
            height={180}
            className="rounded-full object-cover border-4 border-white shadow mb-6"
            priority
          />
          <h2 className="text-xl font-semibold text-foreground mb-2 text-center">We're here to help!</h2>
          <p className="text-muted-foreground text-center text-base">Fill out the form and our team will get back to you as soon as possible.</p>
        </div>
        {/* Right: Form */}
        <div className="md:w-1/2 flex items-center justify-center p-6 md:p-10 bg-card">
          <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground text-center">Contact Us</h1>
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label className="block text-foreground font-medium mb-1">First Name <span className="text-red-500">*</span></label>
                <Input type="text" required placeholder="First" name="first_name" />
              </div>
              <div className="flex-1">
                <label className="block text-foreground font-medium mb-1">Last Name <span className="text-red-500">*</span></label>
                <Input type="text" required placeholder="Last" name="last_name" />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-foreground font-medium mb-1">Email <span className="text-red-500">*</span></label>
              <Input type="email" required placeholder="you@email.com" name="email" />
            </div>
            <div className="mb-4">
              <label className="block text-foreground font-medium mb-1">Leave us a few words <span className="text-red-500">*</span></label>
              <Textarea required placeholder="Your message..." className="min-h-[60px] md:min-h-[80px]" name="message" />
            </div>
            <div className="mb-4 flex justify-center">
              <ReCAPTCHA
                sitekey="6LdxOD0rAAAAAPhEsAGkQ54yQhLijLgMWg73TGv2"
                onChange={setCaptchaToken}
              />
            </div>
            <Button type="submit" className="w-full h-10 md:h-12 text-base font-bold mt-2" disabled={isSubmitting}>SUBMIT</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function TestContactForm() {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    console.log("Contact form submitted!", formRef.current);
    e.preventDefault();
    setIsSubmitting(true);
    alert("Handler ran!");
    setIsSubmitting(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Minimal Contact Form Test</h2>
      <form ref={formRef} onSubmit={handleSubmit}>
        <input name="first_name" placeholder="First Name" required style={{ display: 'block', marginBottom: 8, width: '100%' }} />
        <input name="last_name" placeholder="Last Name" required style={{ display: 'block', marginBottom: 8, width: '100%' }} />
        <input name="email" type="email" placeholder="Email" required style={{ display: 'block', marginBottom: 8, width: '100%' }} />
        <textarea name="message" placeholder="Message" required style={{ display: 'block', marginBottom: 8, width: '100%' }} />
        <button type="submit" disabled={isSubmitting} style={{ width: '100%' }}>Send</button>
      </form>
    </div>
  );
} 