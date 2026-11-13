// @ts-check
import cloudflare from "@astrojs/cloudflare";
import { cacheCloudflare } from "@astrojs/cloudflare/cache";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField, fontProviders } from "astro/config";
import emdash from "emdash/astro";

import { DEFAULT_LOCALE, LOCALES } from "./src/i18n/constants.ts";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  // The site is static: pages are built once and served as files. Only the pages that show
  // CMS content (news, events) render per request, each with `export const prerender = false`.
  // EmDash marks its own admin and API routes as on-demand itself.
  output: "static",
  adapter: cloudflare(),

  // Pages that show CMS content are cached at Cloudflare's edge (experimental provider) and
  // purged by the cache hints EmDash's queries return, so publishing shows at once.
  cache: {
    provider: cacheCloudflare(),
  },

  // NL is the default language at the root; EN and PT get a prefix (src/i18n/constants.ts).
  // EmDash reads this same block. Keep the default locale unprefixed: EmDash's admin
  // returns 404 with prefixDefaultLocale or "prefix-always".
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: [...LOCALES],
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    // The site's own interactive parts are Vue components (.vue), used only where built-in
    // HTML is not enough.
    vue(),
    // React is here for EmDash only: its admin is a React app and needs this integration.
    // The public site does not use React.
    react(),
    emdash({
      database: d1({ binding: "DB" }),
      storage: r2({ binding: "MEDIA" }),
    }),
  ],

  // Fonts as the design system README specifies. Files are downloaded at build time and served
  // with the site; Astro generates metric-matched fallbacks.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Montserrat",
      cssVariable: "--font-montserrat",
      weights: [600, 700, 800],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Arial", "sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [400, 600],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Arial", "sans-serif"],
    },
  ],

  // Typed environment variables. Values live in .dev.vars locally (see .dev.vars.example)
  // and in Cloudflare (wrangler secret put / vars) when deployed. Never in this file.
  env: {
    schema: {
      // Public origin of the site, e.g. https://www.example.nl. EmDash reads SITE_URL too
      // (passkeys, CSRF, redirects, sitemap). Optional on localhost.
      SITE_URL: envField.string({ context: "server", access: "public", url: true, optional: true }),
      // Stripe Checkout (iDEAL, one-off and monthly). Optional until donations are built.
      STRIPE_SECRET_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      STRIPE_WEBHOOK_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      // EmDash: encrypts plugin settings stored as secrets. Generate with `pnpm exec emdash secrets generate`.
      EMDASH_ENCRYPTION_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
