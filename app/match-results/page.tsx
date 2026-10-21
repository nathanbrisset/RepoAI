import { redirect } from "next/navigation"

export default async function MatchResultsPage(props: { searchParams?: Promise<{ query?: string; q?: string }> | { query?: string; q?: string } }) {
  const params = props.searchParams ? await props.searchParams : {}
  const query = params.query || params.q || ""
  if (!query) redirect("/recommendation/")
  redirect(`/recommendation/?query=${encodeURIComponent(query)}`)
}
