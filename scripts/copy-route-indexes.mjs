import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const routes = ["summary", "patterns", "decision", "foundations", "compare", "glossary"];
const distDir = "dist";
const indexPath = join(distDir, "index.html");

for (const route of routes) {
  const routeDir = join(distDir, route);
  mkdirSync(routeDir, { recursive: true });
  copyFileSync(indexPath, join(routeDir, "index.html"));
}

writeFileSync(join(distDir, ".nojekyll"), "");
