import { metadataFor } from "@/lib/i18n/metadata"
import AboutPage from "./about-client"

export function generateMetadata() {
  return metadataFor("/about")
}

export default function Page() {
  return <AboutPage />
}
