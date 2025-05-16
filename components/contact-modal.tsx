import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useRef, useState } from "react";

export function ContactModal() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Contact form submitted!", formRef.current);
    console.log("Prevented default, starting fetch...");
    e.preventDefault();
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
      message: formData.get('message')
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
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Contact Us</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0">
        <div className="flex flex-col md:flex-row w-full">
          {/* Left: Image and welcome */}
          <div className="hidden md:flex flex-col items-center justify-center bg-muted p-8 md:p-10 rounded-l-lg">
            <Image
              src="/my-photo.jpg"
              alt="Contact us"
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-white shadow mb-4"
              priority
            />
            <h2 className="text-lg font-semibold text-foreground mb-1 text-center">We're here to help!</h2>
            <p className="text-muted-foreground text-center text-sm">Fill out the form and our team will get back to you as soon as possible.</p>
          </div>
          {/* Right: Form */}
          <div className="flex-1 flex items-center justify-center p-6 bg-card rounded-r-lg">
            <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-2 text-foreground text-center">Contact Us</DialogTitle>
                <DialogDescription className="mb-4 text-center">We usually respond within 24 hours.</DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="block text-foreground font-medium mb-1">First Name <span className="text-red-500">*</span></label>
                  <Input name="first_name" type="text" required placeholder="First" />
                </div>
                <div className="flex-1">
                  <label className="block text-foreground font-medium mb-1">Last Name <span className="text-red-500">*</span></label>
                  <Input name="last_name" type="text" required placeholder="Last" />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-foreground font-medium mb-1">Email <span className="text-red-500">*</span></label>
                <Input name="email" type="email" required placeholder="you@email.com" />
              </div>
              <div className="mb-4">
                <label className="block text-foreground font-medium mb-1">Leave us a few words <span className="text-red-500">*</span></label>
                <Textarea name="message" required placeholder="Your message..." className="min-h-[60px] md:min-h-[80px]" />
              </div>
              <Button 
                type="submit" 
                className="w-full h-10 md:h-12 text-base font-bold mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'SUBMIT'}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 