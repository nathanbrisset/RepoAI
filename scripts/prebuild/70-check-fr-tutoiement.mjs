#!/usr/bin/env node
import path from "node:path"
import { repoRoot, runCommand } from "./_spawn.mjs"

runCommand(["npx", "tsx", path.join(repoRoot, "scripts/check-fr-tutoiement.ts")])