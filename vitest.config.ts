/// <reference types="vitest/config" />
// Vitest with the project's Astro settings, through Astro's getViteConfig(), so tests can
// import and render .astro components (Container API).
//
// The site config is passed inline without the Cloudflare adapter. With the adapter, Vitest
// starts Cloudflare's Worker runtime without pre-bundled dependencies and fails at startup
// ("module is not defined"). Tests run in Node and do not need that runtime.
import { getViteConfig } from "astro/config";
import siteConfig from "./astro.config.mjs";

const { adapter: _adapter, ...testConfig } = siteConfig;

export default getViteConfig(
  { test: { include: ["src/**/*.test.ts"] } },
  // logLevel "error" hides EmDash's warning that no session driver exists without the adapter;
  // the admin is not used in tests.
  { configFile: false, logLevel: "error", ...testConfig },
);
