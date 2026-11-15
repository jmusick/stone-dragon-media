// Worker regressions share port 4331, so run each in a separate process in order.
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const scripts = readdirSync(new URL("scripts/", root))
  .filter((name) => /^test-.*\.mjs$/.test(name) && name !== "test-runtime.mjs")
  .sort();

if (scripts.length === 0) throw new Error("No regression scripts found");

for (const name of scripts) {
  console.log(`\nRunning scripts/${name}`);
  const result = spawnSync(process.execPath, [fileURLToPath(new URL(`scripts/${name}`, root))], {
    cwd: fileURLToPath(root), stdio: "inherit",
  });
  if (result.error || result.status !== 0) {
    console.error(`FAILED: scripts/${name}`, result.error ?? result.signal ?? `exit ${result.status}`);
    process.exit(result.status || 1);
  }
}

console.log(`\nPassed all ${scripts.length} regression scripts`);
