// Guards the styling foundations: the stylesheet order the design system requires,
// the generated token files, and the "tokens only" rule for colours.
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../..", import.meta.url));
const src = join(root, "src");
const read = (path: string) => readFileSync(join(root, path), "utf8");

describe("global.css", () => {
  it("imports Tailwind, then the tokens, then the Tailwind theme", () => {
    const imports = [...read("src/styles/global.css").matchAll(/@import\s+"([^"]+)"/g)].map(
      (match) => match[1],
    );
    expect(imports).toEqual([
      "tailwindcss",
      "./design-system/amir-tokens.css",
      "./design-system/amir-tailwind.css",
    ]);
  });
});

describe("design system files", () => {
  it.each(["amir-tokens.css", "amir-tailwind.css"])("%s is marked as generated", (file) => {
    const firstLine = read(`src/styles/design-system/${file}`).split("\n")[0];
    expect(firstLine).toContain("GENERATED");
    expect(firstLine).toContain(`project/build/${file}`);
  });
});

describe("tokens only", () => {
  const rawColour = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/i;
  const files = readdirSync(src, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(astro|css|ts|tsx|mdx?)$/.test(file))
    .filter((file) => !file.startsWith("styles/design-system/") && !file.endsWith(".test.ts"));

  it.each(files)("src/%s uses no raw colour values", (file) => {
    const offending = read(relative(root, join(src, file)))
      .split("\n")
      .map((line, index) => ({ line: index + 1, text: line.trim() }))
      .filter(({ text }) => rawColour.test(text));
    expect(offending).toEqual([]);
  });
});
