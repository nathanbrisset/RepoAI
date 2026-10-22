import { metadataFor } from "@/lib/i18n/metadata"
import SubmitLegacyPage from "./submit-legacy-client"

export function generateMetadata() {
  return metadataFor("/submit/submit")
}

export default function Page() {
  return <SubmitLegacyPage />
}
