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
- Interface copy lives in `src/i18n/translations/`, one dictionary per language, following the Astro docs' i18n recipe. `en.ts` is the source of the keys; `nl.ts` holds the Dutch copy (informal, with "je") and `pt.ts` the European Portuguese, the written standard in Guinea-Bissau. Every new key goes into all three in the same change: the `Translations` type fails the build when one is missing. Phrases that languages build differently are whole keys, not pieces (`weekly.tuesday` is "Elke dinsdag" and "Todas as terças-feiras"). The trilingual openers (WELCOME · WELKOM · BO TXIGA and the language list's heading) stay the same in every language.
- A component reads its language with `getLocale(Astro.currentLocale)` and its copy with `getTranslations(locale)` (`src/i18n/helpers.ts`).
- Page addresses come from `ROUTE` in `src/site/constants.ts` and Astro's `getRelativeLocaleUrl`. `getPageLinks` and `getLanguageLinks` (`src/site/helpers.ts`) prepare links with the current page marked; a language link goes to the same page in that language.

## Site shell

Every page renders through `src/layouts/SiteLayout.astro`: the document shell (`BaseLayout.astro`), the header, the page and the footer.

- **Header** (`src/components/site/SiteHeader.astro`): a blurred bar on phone and tablet; on desktop a paper sheet that lifts into a floating island over the first 64px of scrolling, with a CSS scroll-driven animation. Browsers without scroll-driven animations, and visitors who ask for reduced motion, keep the sheet.
  - **Over a navy opening** (About us, Contact): a page passes `headerOverBrand` to `SiteLayout`, and on phone and tablet the bar is see-through at the top of the page, with the reverse logo and on-brand controls; it turns into the blurred bar once the page scrolls. The header renders with `data-over-brand`, and `followBrandBand` (`src/lib/header/helpers.ts`) drops it on scroll and puts it back at the top. The `over-brand` variant in `global.css` styles the logo, the language button and the menu button from that attribute, only below desktop and only while scripts run, so without scripts the bar stays solid; the menu and the language list keep their own look.
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
- **Shared primitives** (`src/components/ui/`): `Button`, `IconButton`, `Opener` (the logo's star over a label), `StarMark`, `WovenShade` (the woven corner of a section), and the scattered decorations `DecorBead` (one woven bead, plain or ringed, on a light section or on navy) and `DotPatch` (a faint patch of dots that fades out). The motto chips (`src/components/site/MottoChips.astro`) show on the home page and on About us; the motto itself is `VALUE` in `src/site/constants.ts`.
- **Icons**: Lucide (`@lucide/astro`, `@lucide/vue`). The one exception is the social networks' logos, from Simple Icons (`simple-icons`), as the design system records. Simple Icons has no LinkedIn mark, so LinkedIn is not shown yet.
- **Brand files**: the short horizontal logo (colour and reverse) and the white and gold bridge line, copied unchanged from the brand kit into `src/assets/brand/`. The logo swaps with the theme through the `theme-dark` variant in `global.css`, which follows the same rules as the tokens.

Still pending from AMIR: the social profile addresses (the links point at `#`), and the pages behind the menu links, which return the 404 page until they are built.

## CMS

EmDash holds content only: news articles, events and the like. The rest of the site is static (`output: "static"`): pages are built once and served as files. A page that shows CMS content opts into per-request rendering with `export const prerender = false`. EmDash's own admin and API routes are always on demand.

EmDash's admin is at http://localhost:4321/_emdash/admin while the dev server runs. Locally its database, media and Durable Objects live in `.wrangler/` (git-ignored). Delete `.wrangler/state` to start the local CMS from scratch.

The dev server writes `emdash-env.d.ts` (types for the content model) and `.emdash/`. Do not edit them by hand.

### Content model

The schema lives in `seed/seed.json`, which EmDash applies to an empty database on the first request. Later edits to the seed are not applied to a database that already has a schema: start from a fresh local database to try them. There are no categories, tags or pages: pages, menus and settings stay in code. (EmDash still lists Categories and Tags in its menu, which this setting cannot hide; the site reads neither.)

The editors are volunteers, so the admin is written for them: every label is plain Dutch, with its hint in brackets because EmDash 1.5 has no separate help text per field, and the dropdown choices are stored as Dutch words because EmDash shows the stored value as the choice's label (`verhaal` shows as "Verhaal"). The code's constants (`POST_TYPE`, `WEEKDAYS` in `src/lib/content/constants.ts`) hold those same values, and the site's own copy for them stays in the translations (`weekly.maandag` is "Every Monday" in English).

| Collection (slug, admin name) | Fields, in the editor's order (`*` required)                                                                                                                                                                                   | Per language                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| `events`, **Agenda**          | title\*, `type`\* (jeugd, hulp, cultuur, gemeenschap), starts\* and ends at, place name, address, online link, sign-up link (`registration_link`), `languages` (nederlands, engels, portugees, kriol), image, summary, content | title, summary, content                           |
| `posts`, **Nieuws**           | title\*, `type`\* (nieuws, aankondiging, verhaal), featured image, excerpt, content, `urgent` (the strip on the home page), `strip_text` (about 90 characters), `strip_link_label`, `urgent_until`                             | title, excerpt, content, strip sentence and label |
| `activities`, **Elke week**   | name\*, `weekday`\* (maandag … zondag), start\* and end time\*, place                                                                                                                                                          | name                                              |

Fields that are not per language are shared: an editor sets them once and every translation shows the same value. A translation written in a seed must repeat the shared values; EmDash does not copy them across when it applies a seed.

- **No markdown anywhere.** EmDash draws a `text` field as a plain box whose placeholder says "Enter markdown content...", so the short texts (`summary`, `excerpt`) are `string` fields with a 200 character limit and a counter. The long texts (`content`) are Portable Text, EmDash's word processor style editor.
- **Weekly times** accept what people type: `10:00`, `9:30` or the Dutch `10.00`. `toClockTime` (`src/lib/content/helpers.ts`) shows them as `09:30`. The tiles take the four help tints in turn through the week (`getWeeklyTint`), so editors never pick a colour.
- **The admin** (`admin` in `astro.config.mjs`) offers Dutch and Portuguese besides English and follows the browser's language, or the `emdash-locale` cookie its language switch sets. Its menu leaves out what the site does not use or keeps in code (comments, menus, redirects, widgets, sections, bylines, import); those pages stay reachable by their address. EmDash's own Dutch translation still leaves a few words in English ("Save draft", "optional").
- **What the editor can still insert** that the site does not plan for: EmDash 1.5 cannot limit the rich text toolbar per field, so code blocks, HTML, tables and embeds stay on offer. The renderer shows them with EmDash's own markup.

The seed also carries example content, all marked [EXAMPLE] or with placeholders such as [PLACE], applied only on request (`/_emdash/api/setup/dev-bypass` locally). Its photos in `seed/media/` are referenced as files. The EmDash CLI attaches them when it seeds a SQLite database; the Workers dev server cannot read local files, so on it the examples start without photos (events then show the woven panel, and stories without a photo are left out). Add photos in the admin, or upload them with `emdash media upload` and set them with `emdash content update`. The community dinner's text has a heading, a list and a link, so the rich text renderer has something to show.

**Bringing an existing database to a new seed.** A local one: stop the dev server, delete `.wrangler/state`, start it again and open `/_emdash/api/setup/dev-bypass`. The live D1 (`amir-gb`) holds no real content yet, so after a schema change lands on `main` it is emptied and the seed applies on the next request. Once AMIR writes real content, a schema change is made by hand instead, in the admin's Content types screen or with `emdash schema`.

### Rich text

`src/components/content/RichText.astro` shows Portable Text from EmDash in the site's type and colours. It hands every block to EmDash's own `<PortableText>` (links stay sanitised, images responsive, quotes grouped) and changes two things: the editor's headings move one level down, Kop 1 to an `h2` and so on to `h6` (`RichTextHeading.astro`, `getRichTextHeadingLevel`), because the page's title is its only `h1`; and the text, lists, links, quotes, dividers and captions take the design system's tokens through a scoped style. The event page and the news page will both use it; until they exist, `RichText.test.ts` covers it.

## Home page

`src/pages/index.astro`, `en/index.astro` and `pt/index.astro` read the page's content (`getHomeContent`) and render `src/components/home/HomePage.astro` with it. The page shows CMS content, so it renders per request (`export const prerender = false`) and is cached at Cloudflare's edge for ten minutes through Astro's route cache (`cacheCloudflare()` in `astro.config.mjs`, experimental). The cache hints EmDash returns tag the cached page, so publishing purges it. In development the cache is off.

The cache is set in the page routes (`cacheHomePage` in `src/lib/content/helpers.ts`), never in a component: Astro sends the response headers before it renders components, so a cache rule set inside one never reaches Cloudflare. A live response shows `cf-cache-status: MISS` on the first request and `HIT` after it.

Sections, top to bottom, each in its own folder under `src/components/home/`:

- **Announcement strip** (`AnnouncementStrip.astro`): the newest News post marked urgent whose `urgent_until` has not passed, above the header. Closing it stores the post's translation group in `localStorage`, and a small inline script hides it again before it paints on the next visit; a new announcement shows again.
- **Opening** (`opening/`): the greeting, the title, Join AMIR-GB and WhatsApp, with the woven constellation (the joined hands in a ring of beads, the six help services, three values, stitched gold threads). Each screen size has its own drawing from its board (`opening/constants.ts`). On desktop the opening fills the window and the drawing scales down to fit shorter windows, never up. When the page loads, each gold thread sews itself in once, from the ring out to its disc: a mask over the dashed thread is drawn along its length over `duration-slow`, one `stagger` after the last (`Constellation.astro`). Nothing meant to be read waits for it, and with reduced motion the threads are simply there. The photo is the phone's largest paint, so it loads eagerly with high priority (Astro's `priority`). All three drawings give it the same widths and `sizes` (`CONSTELLATION_PHOTO`), so every copy picks the same file and the page fetches the photo once, including the two copies hidden at each size; separate srcsets would make every eager copy download. `OpeningSection.test.ts` guards this.
- **How can we help?** (`help/`): six tinted tiles, each linking to its own topic on the Get help page (`/get-help/#letters`).
- **Stronger together** (`together/`): the story, the motto chips, the Join AMIR-GB button and the cloth of photo strips and two pinti strips, sewn with stitches. The strips are the board's own drawings (`ClothStripNavy.astro`, `ClothStripGold.astro`), coloured with design system tokens.
- **What's on** (`events/`): the next events from EmDash. Four or more fill the band (a sideways rail on phone and tablet, four cards on desktop). With fewer, weekly activities fill the places left: two or three event cards, one featured event across two places, or a calm message when nothing is announced. On desktop the band uses only the columns it fills, so a featured event or the message with no weekly activities beside it spans the whole band (`planWhatsOn` in `src/lib/content/helpers.ts`). An event without a photo shows the woven pinti panel.
- **Life at AMIR** (`stories/`): the newest Story posts. Four or more make a photo wall whose columns always end on one line (two columns on phone, three on tablet, four on desktop, each wall used only when there are enough stories to fill it); two or three sit side by side; one shows with its title and a few words. With none, the section is left out.
- **Support AMIR-GB** (`support/`): the donation form and the bank transfer bar. The form is the site's one Vue island (`DonateForm.vue`, loaded when it comes into view); the donation flow is described under [Donations](#donations). The bank bar's Copy button copies the account number without spaces and shows "Copied. Paste it in your banking app." with a green check for three seconds (`src/lib/donate/helpers.ts`); a browser that refuses the clipboard leaves the bar as it was. The account number is a placeholder in its real Rabobank shape (`NL00 RABO 0000 0000 00`) until AMIR sends it. Amounts follow the page's language: €25 in English, € 25 in Dutch, 25 € in Portuguese. The section overlaps the footer, which adds the overlap to its own top padding. When Life at AMIR is left out, Support keeps its own distance from the navy band.

Languages: lists in English and Portuguese also show items that exist only in Dutch, one per translation group, each with a small NL mark (`DutchOnlyMark.astro`, read out as "Only in Dutch"). The queries are in `src/lib/content/queries.ts`; dates show in Dutch time, in British English and European Portuguese formats.

Placeholders in the page until AMIR sends them: the account number, the weekly activities and their places, every event except the General meeting, and the photos (example photos from the design canvas, with their credits in the design's notes).

## Get help page

`src/pages/get-help.astro`, `en/get-help.astro` and `pt/get-help.astro` render `src/components/get-help/GetHelpPage.astro`. Nothing on it comes from the CMS, so it is built once like any static page. Sections, top to bottom:

- **Opening** (`HelpOpening.astro`): How can we help?, WhatsApp us and Call us with the opening hours, beside the volunteer photo in an organic shape and, from tablet up, the homework photo in a circle. The photos scale with the window on tablet and desktop, so they never run under the words at 700 or 1180. The first photo is in view at every size, so it loads with Astro's `priority`.
- **How it works** (`HowItWorksSection.astro`, `HowStep.astro`): three numbered steps joined by a gold stitched thread, down the side on phone and across from tablet up.
- **What we help with** (`HelpAreasSection.astro`): seven areas from AMIR's fact sheet (`HELP_AREAS` in `constants.ts`), as tinted cards from tablet up, ending on the navy Not sure? Ask us card, and as an accordion on phone (`HelpAreaItem.astro`, built-in `<details>` sharing one `name`, so one topic is open at a time). Each area's Ask about this opens WhatsApp with a sentence naming the topic already typed. The first topic is open when the page opens from the menu. A home tile links to `#<topic>`: from tablet up the browser scrolls to that card, and on phone a small script opens that topic's row and scrolls to it (`openHelpAreaFromHash` in `helpers.ts`). The emergency card under the areas calls AMIR-GB.

The footer overlaps the page's last section: a section marked `data-footer-overlaps` pulls the footer up by the sections' own overlap (`SiteFooter.astro`).

The help services (`HELP_SERVICE` in `src/lib/help/`, with Youth and sport added) and their pictograms (`src/components/help/HelpServiceIcon.astro`) are shared by the home page and this page. Its scattered beads and dot patches are the shared `DecorBead` and `DotPatch` in `src/components/ui/`, which About us uses too. Work and CV is called Work and housing on this page, as AMIR's own area joins work, housing and starting a business; the home tile keeps its label until jose decides. The photos are examples from the design canvas.

## About us

`src/pages/about.astro`, `en/about.astro` and `pt/about.astro` render `src/components/about/AboutPage.astro`. The page has no CMS content, so it is prerendered. Everything on it comes from AMIR's fact sheet; the copy is under `about.*` in the three dictionaries, and the facts that are the same in every language (board names, document names, dates) are in `src/components/about/constants.ts`.

Sections, top to bottom, each in `src/components/about/`:

- **Opening** (`AboutOpening.astro`): We are AMIR-GB on navy, the story of the name and the motto chips, beside the wax print dancers in an organic shape and, from tablet up, the festival in a circle. The header sits see-through over it on phone and tablet (see [Site shell](#site-shell)).
- **What we are for** (`PurposeSection.astro`): the mission and the vision on two white cards, then the seven aims numbered 01 to 07, in two columns on desktop.
- **Our values** (`ValuesSection.astro`): four tinted tiles with a Lucide pictogram, two by two on phone and tablet, four across on desktop. Solidarity carries its Kriol word, Djumbai, marked `lang="pov"`.
- **Our first months** (`TimelineSection.astro`): the dates joined by the gold stitched thread, down the side on phone and tablet and across on desktop. A date that has happened is a filled gold dot; one still coming is a gold ring marked "coming up". The page is built once, so the build day sets each state (`getMilestoneViews`), and a small script re-checks against today in Dutch time when the page loads (`refreshMilestones` in `src/lib/timeline/helpers.ts`): the general meeting of 21 November turns done on the 22nd without a rebuild. A date known only by its month (the end of the founding phase, March 2027) is done once that month has ended.
- **The board** (`BoardSection.astro`): the three board members with their role (in Dutch, and in the page's language before it on English and Portuguese pages), name and tasks. Until their photos come, each has a pinti disc with their initials and "Photo to come" (`PortraitPlaceholder.astro`), which looks the same in light and dark, as a photo does.
- **How we handle money** (`MoneySection.astro`): the four rules, the documents and the legal and tax status. The documents link to PDFs; until AMIR sends them they point at `#` and show a visible [PDF TO COME] placeholder. The yearly report and accounts rest, greyed, with "After our first year". The status card says AMIR-GB is a vereniging and an SBBI, not an ANBI, with its KvK and RSIN numbers from `LEGAL` in `src/site/constants.ts`.

Placeholders until AMIR sends them: the three PDFs, the board photos, and the two opening photos (example photos from the design canvas; the festival is Keti Koti 2023 in Rotterdam from Wikimedia Commons, CC BY-SA 4.0, which needs a visible credit if it stays).

## Contact page

`src/pages/contact.astro`, `en/contact.astro` and `pt/contact.astro` render `src/components/contact/ContactPage.astro`. The page is built once like any static page; only the message form talks to the server.

- **Opening** (`ContactOpening.astro`): Contact on navy, beside a laughing woman in an organic shape.
- **Reach us your way** (`ReachSection.astro`): WhatsApp first and largest (`WhatsAppCard.astro`). From tablet up it carries a QR code for people on a computer, drawn from the real `wa.me` link when the page is built (`src/lib/contact/qr.ts`, the `qrcode` package), navy on white in both themes, so no script or image service is involved. Then Call us and Email (cards from tablet up, tappable rows with Telegram on phone) and the opening hours (`OpeningHoursCard.astro`). Once the page knows the time, a small script shows Open now or Closed now with when that changes and makes today's row bold, in the Netherlands' time whatever the visitor's clock (`getOpeningStatus` in `src/lib/contact/helpers.ts`, tested). Telegram opens `t.me` with AMIR's number.
- **Send us a message** (`MessageSection.astro`, `ContactForm.vue`, loaded when it comes into view, state in `useContactForm.ts`): name, email or phone, the language to answer in (starting on the page's language), an optional topic, the message and a consent tick that links the privacy page. Errors show only after Send, under each field, with a summary at the top that names them (`Intl.ListFormat` joins the names in the page's language). Sending rests the fields; Sent takes the form's place with the name, language and address the visitor gave; Did not send keeps everything typed and offers Try again and WhatsApp. A hidden field catches robots, which are told it worked and nothing is sent. The form posts with `method="post"`, so nothing typed ever lands in an address; it needs JavaScript to send.
- **Our address** (`AddressSection.astro`): the Breda address with Open in maps, a woven card with a gold pin in place of an embedded map (no map service, no tracking cookies), the social profiles as named pills and the registration numbers.

**Where messages go.** The `contact` Astro Action (`src/actions/contact.ts`) checks the message again with the same rules (`src/lib/contact/schema.ts`), refuses posts from other sites, and emails it to AMIR's inbox through Cloudflare Email Service (`src/lib/contact/mail.ts`): the `FORM_INBOX` send binding in `wrangler.jsonc` can only send to `amirgbnederland@gmail.com`. The email is in Dutch for AMIR's volunteers, with the visitor as the reply-to address when they gave an email. Nothing is stored on the site. Sending needs AMIR's own domain onboarded to Email Service and `CONTACT_FROM_ADDRESS` set to an address on it; until then the action logs why and the form shows Did not send with WhatsApp. Locally, `astro dev` simulates the binding and writes each email to `.wrangler/tmp/email/`.

The footer leaves out its own Questions? Talk to us on this page (`data-hides-footer-talk`) and overlaps the last section (`data-footer-overlaps`). The footer's small print now links the privacy page on every page.

## Donations

One-off and monthly gifts go through Stripe Checkout, Stripe's own payment page. The site keeps no record of gifts: Stripe's Dashboard is the record, and Stripe's own emails send receipts and tell donors about failed monthly payments. There is no webhook.

**The flow.**

1. The form in Support AMIR-GB (`src/components/home/support/DonateForm.vue`, its state in `useDonateForm.ts`) posts how often, the preset or typed amount and the page's language to the `donate` Astro Action (`src/actions/donate.ts`). It works without JavaScript too: the home page route reads the action's result and redirects to Stripe.
2. The action checks the input (`src/lib/donate/schema.ts`): a typed amount may use a comma or a dot for cents and dots or commas between thousands; a gift is €1 to €10,000. An amount outside that comes back as an error under the field ("The smallest gift is €1.", or the bank transfer for more than €10,000). With JavaScript the form checks the same rule before it posts.
3. It creates a Checkout Session (`src/lib/donate/checkout.ts`, `stripe.ts`) with the official `stripe` SDK on fetch: a payment for a one-off gift (Stripe's button says Donate), a subscription for a monthly one. The line item is the amount on one product, `amir_gb_gift` ("Gift aan AMIR-GB"), which exists once in each Stripe account. Checkout shows the payment methods the Stripe Dashboard turns on; the code names none. It opens in the page's language.
4. Stripe sends the donor back to the same page's Support section: `?gift=<session id>#support` after paying, `?gift=stopped&frequency=…&amount=…#support` when they stop.

**What Support shows on the way back** (`src/lib/donate/support.ts`). The home route reads the session from Stripe and the card takes the form's place, with the bank transfer bar under it:

| Return                                                                          | Shows                                                                   |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Session complete and paid, one-off                                              | Thank you, the amount, Share on WhatsApp, Give again (back to the form) |
| Session complete and paid, monthly (also while its first SEPA debit is pending) | The same, plus Stop or change your monthly gift                         |
| Session complete but unpaid (SEPA Direct Debit takes a few days)                | Thank you, the gift is on its way, Share on WhatsApp, Give again        |
| Stopped                                                                         | Payment stopped, a button that repeats the choice, Change the amount    |
| A session that did not complete, or one Stripe does not know                    | The payment did not go through, Try again                               |

On the three thank you cards the round check mark grows in once from 90% while it fades in (`ReturnCard.astro`, a one-shot CSS animation over `duration-slow` with `ease-enter`, so it plays on the first paint after Stripe's redirect). The words never wait for it, and with reduced motion it is simply there.

A bank's refusal shows on Stripe's own page, which lets the donor try again, so the failed card is rare. A page that shows a return or a failed try is sent with `Cache-Control: private, no-store` and never reaches the edge cache, so no donor sees another's gift. When Stripe does not answer, the form says the payment could not start and points at the bank transfer; the Worker's logs say why.

**Stopping or changing a monthly gift.** Stripe's customer portal, through its login page (`STRIPE_PORTAL_URL`): the donor types their email and gets a link. It is linked from the monthly thank you and from the footer's small print. The portal stops a gift and changes the payment method; it cannot change an amount, so a new amount means stopping and starting again.

**Stripe setup, once per account** (sandbox done 2026-11-14 in "AMIR-GB · sandbox"; repeat in AMIR's live account):

- the product: `stripe products create --id amir_gb_gift --name "Gift aan AMIR-GB"`;
- a customer portal configuration with cancel, payment method update, invoice history and the login page on; its login page address goes in `STRIPE_PORTAL_URL`;
- in the Dashboard, email receipts for successful payments, so "A confirmation is on its way to your email" is true;
- a restricted key with Checkout Sessions write and read for `STRIPE_SECRET_KEY`.

To try it locally, use the sandbox key in `.dev.vars`, pay with iDEAL's test bank, and stop at Checkout with its back link.

## Design system files

`src/styles/design-system/amir-tokens.css` and `amir-tailwind.css` are generated by the AMIR-GB design system ([Design System artifact](https://claude.ai/artifact/CMiqDHzbFGF8XPvEU17SEK)), from its `project/tokens.json`. They are copied here unchanged, with one header line naming their source. Never edit them here: a change goes into the design system first.

To refresh them after the design system changes:

1. Open the design system artifact and take the current `project/build/amir-tokens.css` and `project/build/amir-tailwind.css`. A Claude session can read them with the Artifact tool's read action.
2. In each file under `src/styles/design-system/`, keep line 1 (the header) and replace everything below it with the new file's content.
3. Run `pnpm verify` (the tests check the headers and the stylesheet order) and look at the site in light and dark.

`src/styles/global.css` imports Tailwind, then the tokens, then the Tailwind theme, in that order.

## Environment

Variables are typed in `astro.config.mjs` (`env.schema`) and read through `astro:env`. Locally they come from `.dev.vars`. On Cloudflare, secrets are set with `pnpm exec wrangler secret put <NAME>` and public values go in `vars` in `wrangler.jsonc`. No real key is ever committed.

| Variable                | Kind    | Purpose                                                                                                                                                   |
| ----------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL`              | public  | The site's public origin. EmDash uses it for passkeys, redirects and the sitemap.                                                                         |
| `STRIPE_SECRET_KEY`     | secret  | Creates and reads Stripe Checkout Sessions for donations. A restricted key (`rk_`) with Checkout Sessions write and read.                                 |
| `STRIPE_PORTAL_URL`     | runtime | The login page of Stripe's customer portal, where monthly donors stop or change a gift. Not a secret; read at runtime so each Stripe account has its own. |
| `EMDASH_ENCRYPTION_KEY` | secret  | Encrypts plugin settings saved as secrets. Generate with `pnpm exec emdash secrets generate`; back the production key up.                                 |
| `CONTACT_FROM_ADDRESS`  | runtime | The address the contact form sends from, on AMIR's own domain onboarded to Cloudflare Email Service. Without it the form says the message did not send.   |

## Deploy

The site deploys to the **Jose Digiweb** Cloudflare account, pinned by `account_id` in `wrangler.jsonc`, so a deploy can never land in another account the same login reaches. The Worker is `amir-gb`, on the account's workers.dev subdomain (`josefurtado-digital`) until the site has its own domain.

| Resource            | Name            | State                                                                    |
| ------------------- | --------------- | ------------------------------------------------------------------------ |
| D1 database (`DB`)  | `amir-gb`       | Created 2026-11-14 in the EU jurisdiction; its id is in `wrangler.jsonc` |
| R2 bucket (`MEDIA`) | `amir-gb-media` | Created 2026-11-14 in the EU jurisdiction                                |

Both are in the EU jurisdiction, so the content and media stay inside the EU. A jurisdiction is set when a resource is created and cannot change afterwards.

### Continuous integration and deploys

- **Checks:** GitHub Actions runs `pnpm verify` on every pull request and on every push to `main` (`.github/workflows/verify.yml`). `pnpm/setup` installs the pnpm and Node.js versions pinned in `devEngines`, so CI uses the same versions as everyone's machine.
- **Deploys:** Cloudflare Workers Builds is connected to the GitHub repository and deploys `main` on every push. Nobody deploys by hand. Its settings, under the Worker's **Settings** > **Builds**:

  | Setting        | Value                                                                                                               |
  | -------------- | ------------------------------------------------------------------------------------------------------------------- |
  | Git repository | `jose-digiweb/amir-gb`, production branch `main`                                                                    |
  | Build command  | `pnpm run build`                                                                                                    |
  | Deploy command | `pnpm exec wrangler deploy`                                                                                         |
  | Build variable | `NODE_VERSION` = the Node.js version in `devEngines` (Workers Builds reads pnpm's version from `devEngines` itself) |
  | Preview builds | Off: the Worker uses Durable Objects, which Worker Previews do not cover yet                                        |

- **Variables and secrets:** `SITE_URL` (the site's public address) is a variable on the Worker in the dashboard, and `keep_vars` in `wrangler.jsonc` keeps it through every deploy. Secrets (`EMDASH_ENCRYPTION_KEY`, `STRIPE_SECRET_KEY`) are set once with `pnpm exec wrangler secret put <NAME>` and are never part of a deploy. `STRIPE_PORTAL_URL` is a plain variable on the Worker, like `SITE_URL`.

A manual deploy (`pnpm run deploy`, after `pnpm exec wrangler login`) is only for an emergency when Workers Builds is down.

EmDash runs its migrations on the first request after a deploy. See EmDash's [Cloudflare guide](https://docs.emdashcms.com/deployment/cloudflare/).
