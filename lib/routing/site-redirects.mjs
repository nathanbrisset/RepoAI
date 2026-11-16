/** Shared redirect rules for Next config and build-time guards. */

export async function getSiteRedirects() {
  const apexHost = {
    type: "host",
    value: "aitools.ninja",
  }
  const renamedToTools = [
    "autopilot",
    "codiumai",
    "freepik-ai-image-generator",
    "google_cloud_automl",
    "growthbar",
    "hugo-ai",
    "mindsdb",
    "mobilemonkey",
    "munch",
    "paintschainer",
    "phrasee",
    "replit-ghostwriter",
    "sendinblue",
    "vidyoai",
  ]
  const retiredCategories = {
    text: "writing",
    audio: "voice",
    "data-processing": "data",
  }
  const duplicateTools = {
    "canva-magic-design": "canva-ai",
    mailchimpoptimizer: "mailchimp",
    "claude-3": "claude",
    "gemini-1-5-pro": "gemini",
    "amazon-codewhisperer": "amazon-q-developer",
    deepcode: "snyk",
    watson_studio: "watsonx-ai",
    "jasper-art": "jasper",
  }
  const duplicateToolRedirects = [
    { from: "windsurf", to: "devin" },
    { from: "producer-ai", to: "google-flow-music" },
    { from: "google-whisk", to: "google-flow" },
  ]

  function toolRedirectPair(from, to) {
    return [
      { source: `/tool/${from}`, destination: `/tool/${to}/`, permanent: true },
      { source: `/tool/${from}/`, destination: `/tool/${to}/`, permanent: true },
      { source: `/fr/tool/${from}`, destination: `/fr/tool/${to}/`, permanent: true },
      { source: `/fr/tool/${from}/`, destination: `/fr/tool/${to}/`, permanent: true },
    ]
  }

  return [
    {
      source: "/",
      has: [apexHost],
      destination: "https://www.aitools.ninja/",
      permanent: true,
    },
    {
      source: "/:path*",
      has: [apexHost],
      destination: "https://www.aitools.ninja/:path*",
      permanent: true,
    },
    { source: "/about/about", destination: "/about", permanent: true },
    { source: "/submit/submit", destination: "/submit", permanent: true },
    { source: "/tools/tools", destination: "/tools", permanent: true },
    { source: "/tool/tool/:id", destination: "/tool/:id/", permanent: true },
    { source: "/tools/:id", destination: "/tool/:id/", permanent: true },
    { source: "/fr/about/about", destination: "/fr/about", permanent: true },
    { source: "/fr/submit/submit", destination: "/fr/submit", permanent: true },
    { source: "/fr/tools/tools", destination: "/fr/tools", permanent: true },
    { source: "/fr/tool/tool/:id", destination: "/fr/tool/:id/", permanent: true },
    { source: "/fr/tools/:id", destination: "/fr/tool/:id/", permanent: true },
    ...renamedToTools.flatMap((id) => [
      {
        source: `/tool/${id}`,
        destination: "/tools",
        permanent: true,
      },
      {
        source: `/fr/tool/${id}`,
        destination: "/fr/tools",
        permanent: true,
      },
    ]),
    ...duplicateToolRedirects.flatMap(({ from, to }) => toolRedirectPair(from, to)),
    {
      source: "/match-results",
      destination: "/recommendation",
      permanent: true,
    },
    {
      source: "/fr/match-results",
      destination: "/fr/recommendation",
      permanent: true,
    },
    ...Object.entries(duplicateTools).flatMap(([from, to]) => toolRedirectPair(from, to)),
    ...Object.entries(retiredCategories).flatMap(([from, to]) => [
      { source: `/categories/${from}`, destination: `/categories/${to}/`, permanent: true },
      { source: `/categories/${from}/`, destination: `/categories/${to}/`, permanent: true },
      { source: `/fr/categories/${from}`, destination: `/fr/categories/${to}/`, permanent: true },
      { source: `/fr/categories/${from}/`, destination: `/fr/categories/${to}/`, permanent: true },
    ]),
  ]
}