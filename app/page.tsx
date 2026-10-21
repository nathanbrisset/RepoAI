import { metadataFor } from "@/lib/i18n/metadata"
import HomePage from "./home-client"

export function generateMetadata() {
  return metadataFor("/")
}

export default function Page() {
  return <HomePage />
}
