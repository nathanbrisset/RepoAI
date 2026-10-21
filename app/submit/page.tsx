import { metadataFor } from "@/lib/i18n/metadata"
import SubmitPage from "./submit-client"

export function generateMetadata() {
  return metadataFor("/submit")
}

export default function Page() {
  return <SubmitPage />
}
