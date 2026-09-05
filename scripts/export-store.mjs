import { mkdir, writeFile } from "node:fs/promises";
import { bundledStore } from "../src/data/store.js";

const out = "public/data/store.json";
await mkdir("public/data", { recursive: true });
await writeFile(out, `${JSON.stringify(bundledStore(), null, 2)}\n`, "utf8");
console.log(`wrote ${out}`);
