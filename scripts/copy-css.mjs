import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });
for (const f of ["styles.css", "fonts.css", "tailwind.css"]) copyFileSync(`src/styles/${f}`, `dist/${f}`);
