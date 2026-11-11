#!/usr/bin/env node
/**
 * Generate French mirrors under app/(fr)/fr from app/(en) routes.
 * Usage: node scripts/generate-fr-mirror-pages.mjs [--check]
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const APP = path.join(ROOT, "app")
const EN_ROOT = path.join(APP, "(en)")
const FR_ROOT = path.join(APP, "(fr)", "fr")

const REDIRECT_ONLY = new Set([
  "about/about/page.tsx",
  "submit/submit/page.tsx",
  "tools/tools/page.tsx",
  "tools/[id]/page.tsx",
  "match-results/page.tsx",
  "[...slug]/page.tsx",
  "not-found.tsx",
])

const LOCALIZED_EXPORTS = {
  "page.tsx": { contentImport: "@/lib/pages/home-page-content", contentExport: "HomePageContent", pathname: "/" },
  "tool/[id]/page.tsx": {
    contentImport: "@/lib/pages/tool-page-content",
    contentExport: "ToolPageContent",
    pathname: "/tool/[id]",
    staticParams: true,
    dynamicParams: true,
  },
  "categories/[category]/page.tsx": {
    contentImport: "@/lib/pages/category-page-content",
    contentExport: "CategoryPageContent",
    pathname: "/categories/[category]",
    staticParams: true,
    dynamicParams: true,
  },
  "collections/[slug]/page.tsx": {
    contentImport: "@/lib/pages/collection-page-content",
    contentExport: "CollectionPageContent",
    pathname: "/collections/[slug]",
    staticParams: true,
    dynamicParams: true,
  },
  "guides/[slug]/page.tsx": {
    contentImport: "@/lib/pages/guide-page-content",
    contentExport: "GuidePageContent",
    pathname: "/guides/[slug]",
    staticParams: true,
    dynamicParams: true,
  },
}

const checkMode = process.argv.includes("--check")

function posix(rel) {
  return rel.split(path.sep).join("/")
}

function listEnPages(dir = EN_ROOT, base = EN_ROOT) {
  const out = []
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name)
    const stat = fs.statSync(abs)
    if (stat.isDirectory()) out.push(...listEnPages(abs, base))
    else if (name === "page.tsx") out.push(posix(path.relative(base, abs)))
  }
  return out
}

function enUrlPath(enPageRel) {
  const dir = posix(path.dirname(enPageRel))
  return dir === "." ? "/" : `/${dir}`
}

function importPathFromFr(_frDir, enPageRel) {
  const enPosix = enPageRel.replace(/\.tsx$/, "")
  return `@/app/(en)/${enPosix}`
}

function expectedLocalizedContent(spec) {
  const paramName = spec.pathname.includes("[id]")
    ? "id"
    : spec.pathname.includes("[category]")
      ? "category"
      : "slug"
  const lines = [
    "// Auto-generated — run: node scripts/generate-fr-mirror-pages.mjs",
    `import { metadataFor } from "@/lib/i18n/metadata"`,
    `import { PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"`,
    `import { ${spec.contentExport} } from "${spec.contentImport}"`,
    spec.staticParams
      ? `import { generateStaticParams } from "${importPathFromFr(path.dirname(path.join(FR_ROOT, path.dirname(spec.pathname === "/" ? "page.tsx" : spec.pathname))), spec.pathname === "/" ? "page.tsx" : spec.pathname.replace(/^\//, "").replace(/\[[^\]]+\]/g, (m) => m) + "/page.tsx")}"`
      : "",
    "",
    `export const dynamic = "force-static"`,
    spec.staticParams ? `export { generateStaticParams }` : "",
    spec.dynamicParams ? `export const dynamicParams = false` : "",
  ].filter((line, i, arr) => line !== "" || arr[i + 1] !== "")

  // Fix import path generation for static params - simpler approach:
  return buildLocalizedFile(spec, enPageRelFromPathname(spec.pathname))
}

function enPageRelFromPathname(pathname) {
  if (pathname === "/") return "page.tsx"
  return `${pathname.replace(/^\//, "").replace("[id]", "[id]").replace("[category]", "[category]").replace("[slug]", "[slug]")}/page.tsx`
}

function buildLocalizedFile(spec, enRel) {
  const frDir = enRel === "page.tsx" ? FR_ROOT : path.join(FR_ROOT, path.dirname(enRel))
  const enImport = spec.staticParams ? `import { generateStaticParams } from "${importPathFromFr(frDir, enRel)}"` : ""
  const paramName = spec.pathname.includes("[id]")
    ? "id"
    : spec.pathname.includes("[category]")
      ? "category"
      : "slug"
  const parts = [
    "// Auto-generated — run: node scripts/generate-fr-mirror-pages.mjs",
    `import { metadataFor } from "@/lib/i18n/metadata"`,
    `import { PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"`,
    `import { ${spec.contentExport} } from "${spec.contentImport}"`,
    enImport,
    "",
    `export const dynamic = "force-static"`,
  ]
  if (spec.staticParams) parts.push(`export { generateStaticParams }`)
  if (spec.dynamicParams) parts.push(`export const dynamicParams = false`)
  if (spec.pathname === "/") {
    parts.push(
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
    parts.push(
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
  return parts.filter(Boolean).join("\n")
}

function buildPassthrough(enRel, routePath) {
  const frDir = path.join(FR_ROOT, path.dirname(enRel))
  return `// Auto-generated — run: node scripts/generate-fr-mirror-pages.mjs
import { metadataFor } from "@/lib/i18n/metadata"
import { PAGE_LOCALE_FR } from "@/lib/i18n/page-locale"
import EnPage from "${importPathFromFr(frDir, enRel)}"

export const dynamic = "force-static"

export function generateMetadata() {
  return metadataFor("${routePath}", PAGE_LOCALE_FR)
}

export default EnPage
`
}

function writeMirror(enRel) {
  const routePath = enUrlPath(enRel)
  const frPage = path.join(FR_ROOT, enRel)
  fs.mkdirSync(path.dirname(frPage), { recursive: true })
  const localized = LOCALIZED_EXPORTS[enRel]
  const content = localized
    ? buildLocalizedFile(localized, enRel)
    : buildPassthrough(enRel, routePath)
  fs.writeFileSync(frPage, content)
}

function main() {
  const enPages = listEnPages().filter((rel) => !REDIRECT_ONLY.has(rel))
  const missing = []
  const stale = []

  for (const enRel of enPages) {
    const frPage = path.join(FR_ROOT, enRel)
    if (!fs.existsSync(frPage)) {
      missing.push(enRel)
      if (!checkMode) writeMirror(enRel)
      continue
    }
    if (!checkMode) writeMirror(enRel)
  }

  if (checkMode) {
    if (missing.length > 0) {
      console.error("Missing FR mirrors:", missing)
      process.exit(1)
    }
    const allowedExtras = new Set(["[...slug]/page.tsx", "not-found.tsx"])
    const extras = []
    function walkFr(dir = FR_ROOT, base = FR_ROOT) {
      for (const name of fs.readdirSync(dir)) {
        const abs = path.join(dir, name)
        if (fs.statSync(abs).isDirectory()) walkFr(abs, base)
        else if (name === "page.tsx") {
          const rel = posix(path.relative(base, abs))
          if (!enPages.includes(rel) && !allowedExtras.has(rel)) extras.push(rel)
        }
      }
    }
    walkFr()
    if (extras.length) {
      console.error("Unexpected FR mirror pages:", extras)
      process.exit(1)
    }
    console.log("FR mirrors OK")
    return
  }

  console.log(`Generated/updated ${enPages.length} French mirrors`)
}

main()
