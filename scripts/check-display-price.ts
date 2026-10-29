import assert from "node:assert/strict"
import { formatDisplayPrice } from "../lib/format-display-price.ts"

assert.equal(formatDisplayPrice("$39/mo (Starter)"), "€39/mo (Starter)")
assert.equal(formatDisplayPrice("50 $/mois"), "50 €/mois")
assert.equal(formatDisplayPrice("Free USD 0 + paid plans"), "Free EUR 0 + paid plans")
assert.equal(formatDisplayPrice("€29/mo"), "€29/mo")
assert.equal(formatDisplayPrice("already formatted"), "already formatted")

console.log("check-display-price: ok")
