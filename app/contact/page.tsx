import { metadataFor } from "@/lib/i18n/metadata"
import ContactPage from "./contact-client"

export function generateMetadata() {
  return metadataFor("/contact")
}

export default function Page() {
  return <ContactPage />
}
