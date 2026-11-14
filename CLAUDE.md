# AMIR-GB website: rules for every session

@AGENTS.md
@.agents/rules/code-style.md
@.agents/rules/ux-and-design.md
@.agents/rules/sources-of-truth.md
@.agents/rules/git-and-prs.md

> Two hooks back them up. Before the first edit of a session, `.claude/hooks/standards-reminder.sh`
> prints the checklist from `AGENTS.md`. After every edit, `.claude/hooks/lint-check.sh` runs Oxfmt
> and Oxlint on the file and blocks until both pass.

AMIR-GB is a Dutch association (vereniging) for migrants and the Guinea-Bissau community across the whole of the Netherlands. Breda is only its postal address. The site informs, takes donations and posts news, updates and events. jose builds it as a gift. How to run, check and deploy: `README.md`.

## Stack (decided; ask jose before changing any of it)

- Astro 7 with `output: "static"`, on Cloudflare Workers (free plan) through `@astrojs/cloudflare`. The site is static: pages are built once and served as files.
- EmDash CMS (Astro-native) on D1 and R2, for content only: news articles, events and the like. Navigation, page copy, layout and everything else live in the code, not in the CMS.
- Vue 3 (`@astrojs/vue`) is the site's UI framework, for the parts that need client-side state. React is installed only because EmDash's admin is a React app and requires it; it cannot be removed while EmDash is the CMS.
- Stripe Checkout with iDEAL, one-off and monthly.
- Tailwind CSS v4 through `@tailwindcss/vite`, fed by the design system. No component kit.
- Interactive parts use built-in HTML first (`<dialog>`, popover, `<details>`, native validation). When a part needs more, it is a Vue component (`.vue`, `<script setup lang="ts">`) loaded as an island with the least eager `client:*` directive that works. A small unstyled library only where one piece truly needs it.
- Fonts through Astro's Fonts API (Fontsource): Montserrat 600/700/800 as `--font-montserrat`, Inter 400/600 as `--font-inter`, Latin subset. Never an `@font-face` rule or a Google Fonts link.
- Tooling: pnpm (Node 26.13.1 and pnpm 12.18.0 pinned in `devEngines`), Oxlint with its type-aware rules through `oxlint-tsgolint` (`.oxlintrc.jsonc`), Oxfmt (`.oxfmtrc.jsonc`, formats `.astro` too), Vitest with the Astro config and the Container API for component tests (`vitest.config.ts`), Astro's own `astro check` for type errors in `.astro` and `.ts` files, and `vue-tsc` for `.vue` files (`tsconfig.vue.json`); `pnpm check` runs both. No Vite+ (`vp`): it was tried and dropped on 2026-11-12, because its dev and build commands do not apply to Astro and it replaced Astro's Vite with its own.

## Rules

- **Official first.** When Astro, Tailwind, EmDash, Cloudflare or pnpm already provides something, use it. Write custom code only where AMIR has its own opinion. Check the official docs for version-sensitive APIs instead of relying on memory.
- **Ask before adding a dependency** that is not an official part of the stack above.
- **Mobile first, always.** Much of the community uses only a phone. Design and build for 390px first; tablet (`tablet:`, 700px) and desktop (`desktop:`, 1180px) get their own layouts, not a stretched phone.
- **Tokens only.** Never write a raw colour, pixel size or font name in a page or component. Use the design system's Tailwind classes (`bg-bg`, `text-text-heading`, `type-h1`, `p-4`, `rounded-pill`...). Spacing steps: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32. Never the `dark:` variant for colour: the tokens switch light and dark. `pnpm test` fails on raw colours in `src/`.
- **The design system files are generated.** Never edit `src/styles/design-system/*`. Changes go to the design system artifact first, then are copied here (README, "Design system files").
- **Light and dark** follow the system setting; `data-theme="light"` or `"dark"` on `<html>` overrides either way. Check both.
- **Languages.** Dutch is the default at the root, then English at `/en/`, then Portuguese at `/pt/`, through Astro's built-in i18n. Keep the default locale unprefixed: EmDash's admin breaks with `prefixDefaultLocale`.
- **Copy in three languages.** Every piece of interface copy is written in Dutch, English and Portuguese (`src/i18n/translations/`); Dutch is the launch language. Add a new key to all three in the same change.
- **Missing facts** get visible placeholders such as [NUMBER], never invented facts.
- **SBBI, not ANBI.** The association is SBBI. Nothing may present it as ANBI.
- **Static by default.** A page renders per request only when it shows CMS content, with `export const prerender = false` in that page. Never switch the whole site to `output: "server"`, and never put navigation, page copy or settings in the CMS.
- **Vue, never React.** Do not write React components, `.jsx` or `.tsx` in this site. Static markup stays in `.astro` files; do not make a Vue component for something that has no client-side state.
- **AMIR is its own world.** Nothing from jose's other companies, clients or products may be used, not even as an example, and that includes their skills and tooling.
- **No secrets in the repo.** Real keys never go in code, config or `.dev.vars.example`.

## Before handing work over

`pnpm verify` passes (format check, lint, `astro check`, tests, build). Anything visible is opened in a browser at 390 and 1440, light and dark.

## Skills

`astro-dev` for Astro 7, `emdash:building-emdash-site` and `emdash:emdash-cli` for EmDash, `modern-web-guidance` for HTML and CSS, `frontend-design` and `emil-design-eng` for frontend work. The `astro-docs` MCP searches the official Astro docs.
