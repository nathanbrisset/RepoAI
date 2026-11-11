#!/usr/bin/env node
/**
 * French URL mirrors under app/fr/** (no rewrite). Server locale comes from PAGE_LOCALE_FR wrappers.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const APP = path.join(ROOT, "app")
const FR = path.join(APP, "fr")

/** @type {{ contentImport: string, contentExport: string, pathname: string, enRel?: string, staticParams?: boolean, dynamicParams?: boolean }[]} */
const LOCALIZED = [
  { contentImport: "@/lib/pages/home-page-content", contentExport: "HomePageContent", pathname: "/", enRel: "page.tsx" },
  {
    contentImport: "@/lib/pages/tool-page-content",
    contentExport: "ToolPageContent",
    pathname: "/tool/[id]",
    enRel: path.join("tool", "[id]", "page.tsx"),
    staticParams: true,
    dynamicParams: true,
  },
  {
    contentImport: "@/lib/pages/category-page-content",
    contentExport: "CategoryPageContent",
    pathname: "/categories/[category]",
    enRel: path.join("categories", "[category]", "page.tsx"),
    staticParams: true,
    dynamicParams: true,
  },
  {
    contentImport: "@/lib/pages/collection-page-content",
    contentExport: "CollectionPageContent",
    pathname: "/collections/[slug]",
    enRel: path.join("collections", "[slug]", "page.tsx"),
    staticParams: true,
  },
  {
    contentImport: "@/lib/pages/guide-page-content",
    contentExport: "GuidePageContent",
    pathname: "/guides/[slug]",
    enRel: path.join("guides", "[slug]", "page.tsx"),
    staticParams: true,
  },
]

const PASSTHROUGH = [
  ["about/page.tsx", "/about"],
  ["contact/page.tsx", "/contact"],
  ["privacy/page.tsx", "/privacy"],
  ["terms/page.tsx", "/terms"],
  ["legal/page.tsx", "/legal"],
  ["submit/page.tsx", "/submit"],
  ["compare/page.tsx", "/compare"],
  ["recommendation/page.tsx", "/recommendation"],
  ["automations/page.tsx", "/automations"],
  ["catalogue/page.tsx", "/catalogue"],
  ["tools/page.tsx", "/tools"],
  ["categories/page.tsx", "/categories"],
  ["collections/page.tsx", "/collections"],
  ["guides/page.tsx", "/guides"],
  ["category/new/page.tsx", "/category/new"],
  ["category/popular/page.tsx", "/category/popular"],
  ["category/top-rated/page.tsx", "/category/top-rated"],
]

function posix(rel) {
  return rel.split(path.sep).join("/")
}

function importPath(fromDir, enRel) {
  const enPosix = posix(enRel).replace(/\.tsx$/, "")
  const relFromApp = posix(path.relative(APP, fromDir))
  const ups = relFromApp ? relFromApp.split("/").length : 0
  const up = "../".repeat(ups)
  return `${up}${enPosix}`
}

function writeLocalized(spec) {
  const frDir = spec.enRel === "page.tsx" ? FR : path.join(FR, path.dirname(spec.enRel))
  fs.mkdirSync(frDir, { recursive: true })
  const enImport = spec.staticParams
    ? `import { generateStaticParams } from "${importPath(frDir, spec.enRel)}"`
    : ""
  const lines = [
    "// Auto-generated — run: node scripts/generate-fr-mirror-pages.mjs",
    `import { metadataFor } from "@/lib/i18n/metadata"`,
    `import { PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"`,
    `import { ${spec.contentExport} } from "${spec.contentImport}"`,
    enImport,
    "",
    `export const dynamic = "force-static"`,
    `export const revalidate = 86400`,
  ]
  if (spec.staticParams) lines.push(`export { generateStaticParams }`)
  if (spec.dynamicParams) lines.push(`export const dynamicParams = false`)

  const paramName = spec.pathname.includes("[id]")
    ? "id"
    : spec.pathname.includes("[category]")
      ? "category"
      : spec.pathname.includes("[slug]")
        ? "slug"
        : null

  if (spec.pathname === "/") {
    lines.push(
      "",
      "export function generateMetadata() {",
      `  return metadataFor("/", PAGE_LOCALE_FR)`,
      "}",
      "",
      "export default function Page() {",
      `  return ${spec.contentExport}({ locale: PAGE_LOCALE_FR })`,
      "}",
      "",
    )
  } else {
    lines.push(
      "",
      "type PageProps = {",
      `  params: Promise<{ ${paramName}: string }>`,
      "}",
      "",
      "export async function generateMetadata(props: PageProps) {",
      `  const { ${paramName} } = await props.params`,
      `  return metadataFor(\`${spec.pathname.replace(`[${paramName}]`, "${" + paramName + "}")}\`, PAGE_LOCALE_FR)`,
      "}",
      "",
      "export default async function Page(props: PageProps) {",
      `  return ${spec.contentExport}({ locale: PAGE_LOCALE_FR, params: props.params })`,
      "}",
      "",
    )
  }
  fs.writeFileSync(path.join(frDir, "page.tsx"), lines.filter(Boolean).join("\n"))
}

function writePassthrough(enRel, routePath) {
  const frDir = path.join(FR, path.dirname(enRel))
  fs.mkdirSync(frDir, { recursive: true })
  const importFrom = importPath(frDir, enRel)
  const content = `// Auto-generated — run: node scripts/generate-fr-mirror-pages.mjs
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"
import EnPage from "${importFrom}"

export const dynamic = "force-static"
export const revalidate = 86400

export function generateMetadata() {
  return metadataFor("${routePath}", PAGE_LOCALE_FR)
}

export default EnPage
`
  fs.writeFileSync(path.join(frDir, "page.tsx"), content)
}

function main() {
  for (const spec of LOCALIZED) writeLocalized(spec)
  for (const [rel, routePath] of PASSTHROUGH) writePassthrough(rel, routePath)
  console.log(`Generated ${LOCALIZED.length + PASSTHROUGH.length} French routes`)
}

main()
