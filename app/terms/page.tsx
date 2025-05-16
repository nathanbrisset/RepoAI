import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | AI Tools Directory",
  description: "Terms of service for AI Tools Directory",
}

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-8"></div>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p className="mb-4">
            By accessing and using AI Tools Directory, you agree to be bound by these Terms of Service and all applicable 
            laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily access the materials (information or software) on AI Tools Directory's website 
            for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and 
            under this license you may not:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Content</h2>
          <p className="mb-4">
            By submitting content to our website, you grant us the right to use, modify, publicly perform, publicly display, 
            reproduce, and distribute such content on and through our website. You retain any and all of your rights to any 
            content you submit, post or display on or through the website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Disclaimer</h2>
          <p className="mb-4">
            The materials on AI Tools Directory's website are provided on an 'as is' basis. AI Tools Directory makes no 
            warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without 
            limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or 
            non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Limitations</h2>
          <p className="mb-4">
            In no event shall AI Tools Directory or its suppliers be liable for any damages (including, without limitation, 
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use 
            the materials on AI Tools Directory's website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Accuracy of Materials</h2>
          <p className="mb-4">
            The materials appearing on AI Tools Directory's website could include technical, typographical, or photographic 
            errors. AI Tools Directory does not warrant that any of the materials on its website are accurate, complete, 
            or current. AI Tools Directory may make changes to the materials contained on its website at any time without 
            notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Links</h2>
          <p className="mb-4">
            AI Tools Directory has not reviewed all of the sites linked to its website and is not responsible for the 
            contents of any such linked site. The inclusion of any link does not imply endorsement by AI Tools Directory 
            of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Modifications</h2>
          <p className="mb-4">
            AI Tools Directory may revise these terms of service for its website at any time without notice. By using this 
            website you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="mb-4">
            Email: aitoolsrequest@gmail.com
          </p>
        </section>
      </div>
    </div>
  )
} 