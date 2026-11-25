#!/usr/bin/env node
import path from "node:path"
import { repoRoot, runCommand } from "./_spawn.mjs"

runCommand(["node", path.join(repoRoot, "scripts/verify-fr-hub-pages.mjs")])