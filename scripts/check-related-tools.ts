import assert from "node:assert/strict"
import { catalogTools } from "../content/tools/index.ts"
import { listedTools, toRuntimeTool } from "../lib/catalog.ts"
import { relatedToolsFor } from "../lib/related-tools.ts"

const replikaTool = toRuntimeTool(catalogTools.find((entry) => entry.id === "replika")!)
const replikaRelated = relatedToolsFor(replikaTool, listedTools).map((entry) => entry.id)
assert.ok(replikaRelated.includes("nomi-ai"), `expected nomi-ai in ${replikaRelated.join(",")}`)
assert.ok(replikaRelated.includes("character-ai"), `expected character-ai in ${replikaRelated.join(",")}`)
assert.equal(replikaRelated.includes("librechat"), false)
assert.equal(replikaRelated.includes("anythingllm"), false)

console.log("related-tools checks passed:", replikaRelated.join(", "))
