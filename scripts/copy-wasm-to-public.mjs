import { cpSync, existsSync, globSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");

const copyTargets = [
  { src: "src/lib/jq/jq.wasm", dest: "jq.wasm" },
  { src: "node_modules/sql.js/dist/*.wasm", dest: "." },
  { src: "node_modules/@duckdb/duckdb-wasm/dist/*.wasm", dest: "." },
];

mkdirSync(publicDir, { recursive: true });

for (const target of copyTargets) {
  const relativePaths = target.src.includes("*")
    ? globSync(target.src, { cwd: projectRoot })
    : [target.src];

  for (const relativePath of relativePaths) {
    const from = path.join(projectRoot, relativePath);
    const to = path.join(
      publicDir,
      target.dest === "." ? path.basename(relativePath) : target.dest,
    );

    if (!existsSync(from)) {
      console.warn(`Skipping missing WASM asset: ${path.relative(projectRoot, from)}`);
      continue;
    }

    cpSync(from, to);
    console.log(
      `Copied ${path.relative(projectRoot, from)} -> ${path.relative(projectRoot, to)}`,
    );
  }
}
