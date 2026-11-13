# AMIR-GB website

The website of AMIR-GB, the association for migrants and the Guinea-Bissau community across the Netherlands. It informs, takes donations and posts news, updates and events. Most visitors use only a phone.

Astro 7 on Cloudflare Workers, with EmDash as the CMS, Tailwind CSS v4 fed by the AMIR-GB design system, and Vue 3 for the interactive parts. React is installed only for EmDash's admin. Oxlint and Oxfmt lint and format, Vitest tests. Languages: Dutch at the root, English at `/en/`, Portuguese at `/pt/`.

## Setup

You need pnpm. `package.json` pins Node.js 26.13.1 and pnpm 12.18.0 in `devEngines`; pnpm downloads and uses both.

```bash
pnpm install
cp .dev.vars.example .dev.vars
```

Fill `.dev.vars` with test values only. It is git-ignored.

## Commands

| What                                      | Command                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| Dev server at http://localhost:4321       | `pnpm dev`                                                              |
| Dev server in the background              | `pnpm dev --background`, then `pnpm astro dev stop`, `status` or `logs` |
| Format                                    | `pnpm format` (check only: `pnpm format:check`)                         |
| Lint                                      | `pnpm lint`                                                             |
| Type-check                                | `pnpm check` (`astro check`, then `vue-tsc` for `.vue` files)           |
| Tests (Vitest)                            | `pnpm test`                                                             |
| Production build                          | `pnpm build`                                                            |
| Everything above, in order                | `pnpm verify`                                                           |
| Preview the build in Cloudflare's runtime | `pnpm preview`                                                          |
| Regenerate Cloudflare binding types       | `pnpm types` (after any change to `wrangler.jsonc`)                     |
| Deploy                                    | `pnpm run deploy` (see Deploy; plain `pnpm deploy` is a pnpm command)   |

Before you hand work over, `pnpm verify` passes.

Oxfmt formats every part of an `.astro` file and sorts Tailwind classes (`.oxfmtrc.jsonc`). Oxlint runs its default rules, including the type-aware ones through `oxlint-tsgolint` (`.oxlintrc.jsonc`); in an `.astro` file it lints the frontmatter and `<script>` blocks, not the template expressions. `astro check` reports type errors in `.astro` and `.ts` files.

In a `.vue` file, Oxfmt formats everything and Oxlint lints the `<script>` block without its type-aware rules. `astro check` skips the inside of `.vue` files, so `pnpm check` also runs `vue-tsc` on them (script and template), with `tsconfig.vue.json`. Props passed to a Vue component from an `.astro` file are checked by `astro check`.

Vitest uses the project's Astro config through Astro's `getViteConfig()` (`vitest.config.ts`), so a test can import and render an `.astro` component with the Container API; `src/layouts/BaseLayout.test.ts` is the example. Two limits:

- The Cloudflare adapter is left out of the test config, because Vitest cannot start Cloudflare's runtime. Tests run in Node, so anything that needs a Cloudflare binding (D1, R2) or live EmDash content has to be mocked.
- The Container API does not load the i18n config, so `Astro.currentLocale` is undefined in a test. Check per-language output in the browser.

## Languages and interface copy

- The languages live in `src/i18n/constants.ts` (`LOCALES`, `DEFAULT_LOCALE`, `LANGUAGES`); `astro.config.mjs` reads them for Astro's i18n routing, so they are defined once.
- Interface copy lives in `src/i18n/translations/`, one dictionary per language, following the Astro docs' i18n recipe. `en.ts` is the source of the keys; `nl.ts` and `pt.ts` repeat English until their copy is written. A test checks every language has the same keys.
- A component reads its language with `getLocale(Astro.currentLocale)` and its copy with `getTranslations(locale)` (`src/i18n/helpers.ts`).
- Page addresses come from `ROUTE` in `src/site/constants.ts` and Astro's `getRelativeLocaleUrl`. `getPageLinks` and `getLanguageLinks` (`src/site/helpers.ts`) prepare links with the current page marked; a language link goes to the same page in that language.

## Site shell

Every page renders through `src/layouts/SiteLayout.astro`: the document shell (`BaseLayout.astro`), the header, the page and the footer.

- **Header** (`src/components/site/SiteHeader.astro`): a blurred bar on phone and tablet; on desktop a paper sheet that lifts into a floating island over the first 64px of scrolling, with a CSS scroll-driven animation. Browsers without scroll-driven animations, and visitors who ask for reduced motion, keep the sheet.
- **Language list** (`LanguageList.astro`, tablet and desktop): a native popover under the language button, placed with CSS anchor positioning and at a fixed place under the header where anchors are missing.
- **Menu** (`SiteMenu.astro`, phone and tablet): a modal `<dialog>` opened and closed by invoker commands (`command`, `commandfor`) and dismissed by a tap outside (`closedby="any"`). `src/lib/dom/helpers.ts` adds both by script in browsers that lack them. Full screen on phone, a sheet from the right on tablet; motion uses the design system's durations and its 30ms stagger.
- **Appearance** (`src/components/theme/`): Automatic follows the device and is the default; Light and Dark override it and are remembered on this device in `localStorage` (no cookie). On desktop a round button before the language button opens a card (`ThemeList.astro`, a native popover like the language list); in the phone and tablet menu it is a three-way toggle (`ThemeToggle.astro`). Both are native radio groups.
  - A small inline script in `BaseLayout.astro`'s head sets `data-theme` and the `color-scheme` meta before the first paint, so a remembered choice never flashes. The tokens already switch on `data-theme`.
  - `src/lib/theme/helpers.ts` applies a pick, remembers it, checks it in both controls, follows a choice made in another tab, and catches up when a page comes back from the back and forward cache, and closes the card after a pointer pick or Enter (the arrow keys apply each row as they move).
  - Switching is instant: `data-theme-switching` on `<html>` turns transitions off for the frame it takes.
  - The button's icon and accessible name follow the choice through CSS (`choice-auto`, `choice-light` and `choice-dark` variants in `global.css`), so they are right before any script runs.
  - On phone the menu leaves out the social links (they stay in the footer), so both toggles, Donate and WhatsApp fit one screen.
- **Footer** (`SiteFooter.astro`): talk to us, the bridge line, the page links, social links, the legal line and the language links.
- **Error pages**: `src/pages/404.astro` (prerendered) and `src/pages/500.astro` (rendered per request, so Try again reloads the failed address). Both show the members lattice (`ErrorLattice.astro`), drawn by `src/lib/woven/helpers.ts` from the pano di pinti cell grid the design uses.
- **Shared primitives** (`src/components/ui/`): `Button`, `IconButton`, `Opener` (the logo's star over a label) and `StarMark`.
- **Icons**: Lucide (`@lucide/astro`, `@lucide/vue`). The one exception is the social networks' logos, from Simple Icons (`simple-icons`), as the design system records. Simple Icons has no LinkedIn mark, so LinkedIn is not shown yet.
- **Brand files**: the short horizontal logo (colour and reverse) and the white and gold bridge line, copied unchanged from the brand kit into `src/assets/brand/`. The logo swaps with the theme through the `theme-dark` variant in `global.css`, which follows the same rules as the tokens.

Still pending from AMIR: the social profile addresses (the links point at `#`), and the pages behind the menu links, which return the 404 page until they are built.

## CMS

EmDash holds content only: news articles, events and the like. The rest of the site is static (`output: "static"`): pages are built once and served as files. A page that shows CMS content opts into per-request rendering with `export const prerender = false`. EmDash's own admin and API routes are always on demand.

EmDash's admin is at http://localhost:4321/_emdash/admin while the dev server runs. Locally its database, media and Durable Objects live in `.wrangler/` (git-ignored). Delete `.wrangler/state` to start the local CMS from scratch.

The dev server writes `emdash-env.d.ts` (types for the content model) and `.emdash/`. Do not edit them by hand.

## Design system files

`src/styles/design-system/amir-tokens.css` and `amir-tailwind.css` are generated by the AMIR-GB design system ([Design System artifact](https://claude.ai/artifact/CMiqDHzbFGF8XPvEU17SEK)), from its `project/tokens.json`. They are copied here unchanged, with one header line naming their source. Never edit them here: a change goes into the design system first.

To refresh them after the design system changes:

1. Open the design system artifact and take the current `project/build/amir-tokens.css` and `project/build/amir-tailwind.css`. A Claude session can read them with the Artifact tool's read action.
2. In each file under `src/styles/design-system/`, keep line 1 (the header) and replace everything below it with the new file's content.
3. Run `pnpm verify` (the tests check the headers and the stylesheet order) and look at the site in light and dark.

`src/styles/global.css` imports Tailwind, then the tokens, then the Tailwind theme, in that order.

## Environment

Variables are typed in `astro.config.mjs` (`env.schema`) and read through `astro:env`. Locally they come from `.dev.vars`. On Cloudflare, secrets are set with `pnpm exec wrangler secret put <NAME>` and public values go in `vars` in `wrangler.jsonc`. No real key is ever committed.

| Variable                | Kind   | Purpose                                                                                                                   |
| ----------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL`              | public | The site's public origin. EmDash uses it for passkeys, redirects and the sitemap.                                         |
| `STRIPE_SECRET_KEY`     | secret | Stripe Checkout. Needed once donations are built.                                                                         |
| `STRIPE_WEBHOOK_SECRET` | secret | Verifies Stripe webhooks. Needed once donations are built.                                                                |
| `EMDASH_ENCRYPTION_KEY` | secret | Encrypts plugin settings saved as secrets. Generate with `pnpm exec emdash secrets generate`; back the production key up. |

## Deploy

The site deploys to the **Jose Digiweb** Cloudflare account, pinned by `account_id` in `wrangler.jsonc`, so a deploy can never land in another account the same login reaches. The Worker is `amir-gb`, on the account's workers.dev subdomain (`josefurtado-digital`) until the site has its own domain.

| Resource            | Name            | State                                                                    |
| ------------------- | --------------- | ------------------------------------------------------------------------ |
| D1 database (`DB`)  | `amir-gb`       | Created 2026-11-14 in the EU jurisdiction; its id is in `wrangler.jsonc` |
| R2 bucket (`MEDIA`) | `amir-gb-media` | Created 2026-11-14 in the EU jurisdiction                                |

Both are in the EU jurisdiction, so the content and media stay inside the EU. A jurisdiction is set when a resource is created and cannot change afterwards.

To deploy:

```bash
pnpm exec wrangler login
pnpm exec wrangler secret put EMDASH_ENCRYPTION_KEY
pnpm run deploy
```

EmDash runs its migrations on the first request. See EmDash's [Cloudflare guide](https://docs.emdashcms.com/deployment/cloudflare/).
