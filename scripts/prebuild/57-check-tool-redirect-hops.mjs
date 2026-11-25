#!/usr/bin/env node
import path from "node:path"
import { repoRoot, runCommand } from "./_spawn.mjs"

runCommand([process.execPath, path.join(repoRoot, "scripts/check-tool-redirect-hops-static.mjs")])