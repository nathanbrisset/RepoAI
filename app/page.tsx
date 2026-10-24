import { DirectoryHome } from "@/components/directory/directory-home"
import { metadataFor } from "@/lib/i18n/metadata"

export function generateMetadata() {
  return metadataFor("/")
}

export default function Page() {
  return <DirectoryHome />
}
