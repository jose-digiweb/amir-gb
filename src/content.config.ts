// Build-time collections for page copy that is long text kept in the repo, never in the CMS.
// EmDash's own live collection stays in src/live.config.ts.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const collections = {
  privacy: defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/privacy" }),
    schema: z.object({
      updated: z.coerce.date().optional(),
    }),
  }),
};
