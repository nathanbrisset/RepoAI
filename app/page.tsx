import HomeClient from "./HomeClient"
import { homeMetadata } from "@/lib/seo"

export const metadata = homeMetadata

export default function HomePage() {
  return <HomeClient />
}
