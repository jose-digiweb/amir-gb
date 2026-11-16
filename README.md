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
- Page addresses come from `ROUTE` in `src/site/constants.ts` and Astro's `getRelativeLocaleUrl`. `getPageLinks` and `getLanguageLinks` (`src/site/helpers.ts`) prepare links with the current page marked (a page link is also current on the pages under it, so Events stays marked on the calendar, the archive and each event); a language link goes to the same page in that language.

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
- **Prefetch**: Astro's prefetch is on for every link to another page of the site (`prefetch` in `astro.config.mjs`, the hover strategy). A page starts loading once its link has been hovered or focused for 80ms, so on desktop it is usually there before the click. Each prefetch also warms the edge cache, so in Safari, which does not reuse a prefetched page that sends no browser cache header (the CMS pages send none), the click still answers from the edge. A phone has no hover, so there pages do not load early; the edge cache is what keeps them quick. On data saver or a slow connection a page only starts loading when its link is pressed.
- **Footer** (`SiteFooter.astro`): talk to us, the bridge line, the page links, social links, the legal line and the language links.
- **Error pages**: `src/pages/404.astro` (prerendered) and `src/pages/500.astro` (rendered per request, so Try again reloads the failed address). Both show the members lattice (`ErrorLattice.astro`), drawn by `src/lib/woven/helpers.ts` from the pano di pinti cell grid the design uses.
- **Shared primitives** (`src/components/ui/`): `Button`, `IconButton`, `Opener` (the logo's star over a label), `StarMark`, `WovenShade` (the woven corner of a section), and the scattered decorations `DecorBead` (one woven bead, plain or ringed, on a light section or on navy) and `DotPatch` (a faint patch of dots that fades out). The motto (`src/components/site/MottoChips.astro`) shows on the home page and on About us as sewn labels: a dashed stitch edge (`stitch`, `border-width-stitch`), no fill, the `sewn-label` type, never a control. A label never wraps inside its stitch, and a pair never sits beside lone labels: on phone and tablet English shows two pairs, while Dutch and Portuguese, whose pairs are wider than the column, list one label per row (`MOTTO_STACKED_LOCALES` in `src/site/constants.ts`); from desktop every language sits in two aligned columns; the motto itself is `VALUE` in `src/site/constants.ts`.
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

| Collection (slug, admin name) | Fields, in the editor's order (`*` required)                                                                                                                                                                                                                                                                                                                                                                                   | Per language                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| `events`, **Agenda**          | title\*, `type`\* (jeugd, hulp, cultuur, gemeenschap), `event_status`\* (gaat door, verplaatst, afgelast), `general_meeting` (the tick for the general meeting), starts\* and ends at, `original_starts_at` (the old date of a moved event), place name, address, online link, sign-up link (`registration_link`), `languages` (nederlands, engels, portugees, kriol), `for_whom`\* (iedereen, leden), image, summary, content | title, summary, content                           |
| `posts`, **Nieuws**           | title\*, `type`\* (nieuws, aankondiging, verhaal), featured image, excerpt, content, `gallery` (photos from the day), `board_names` (the board's first names under an announcement), `event` (the event an announcement is about, or the event a story has photos of), `urgent` (the strip on the home page), `strip_text` (about 90 characters), `strip_link_label`, `urgent_until`                                           | title, excerpt, content, strip sentence and label |
| `activities`, **Elke week**   | name\*, `weekday`\* (maandag … zondag), start\* and end time\*, place                                                                                                                                                                                                                                                                                                                                                          | name                                              |

Fields that are not per language are shared: an editor sets them once and every translation shows the same value. A translation written in a seed must repeat the shared values; EmDash does not copy them across when it applies a seed.

- **No markdown anywhere.** EmDash draws a `text` field as a plain box whose placeholder says "Enter markdown content...", so the short texts (`summary`, `excerpt`) are `string` fields with a 200 character limit and a counter. The long texts (`content`) are Portable Text, EmDash's word processor style editor.
- **Weekly times** accept what people type: `10:00`, `9:30` or the Dutch `10.00`. `toClockTime` (`src/lib/content/helpers.ts`) shows them as `09:30`. The tiles take the four help tints in turn through the week (`getWeeklyTint`), so editors never pick a colour.
- **The admin** (`admin` in `astro.config.mjs`) offers Dutch and Portuguese besides English and follows the browser's language, or the `emdash-locale` cookie its language switch sets. Its menu leaves out what the site does not use or keeps in code (comments, menus, redirects, widgets, sections, bylines, import); those pages stay reachable by their address. EmDash's own Dutch translation still leaves a few words in English ("Save draft", "optional").
- **News posts** feed the News list and the post page. `gallery` is a list of photos, one per row (`post.data.gallery[].image`); on the Workers dev server the seed's rows arrive without their photo, so a page skips rows without one. `board_names` is only the names: "The board of AMIR-GB" above them is site copy. `event` is a reference, read through `getEmDashEntry("posts", slug, { references: { event: true } })` as `post.references.event.entries[0]`; EmDash links each translation of a post to the same language's translation of the event.
- **What the editor can still insert** that the site does not plan for: EmDash 1.5 cannot limit the rich text toolbar per field, so code blocks, HTML, tables and embeds stay on offer. The renderer shows them with EmDash's own markup.

The seed also carries example content, all marked [EXAMPLE] or with placeholders such as [PLACE], applied only on request (`/_emdash/api/setup/dev-bypass` locally). Its photos in `seed/media/` are referenced as files. The EmDash CLI attaches them when it seeds a SQLite database; the Workers dev server cannot read local files, so on it the examples start without photos (events then show the woven panel, and stories without a photo are left out). Add photos in the admin, or upload them with `emdash media upload` and set them with `emdash content update`. The community dinner's text has a heading, a list and a link, so the rich text renderer has something to show.

**Bringing an existing database to a new seed.** A local one: stop the dev server, delete `.wrangler/state`, start it again and open `/_emdash/api/setup/dev-bypass`. The live D1 (`amir-gb`) holds no real content yet, so after a schema change lands on `main` it is emptied and the seed applies on the next request. Once AMIR writes real content, a schema change is made by hand instead, in the admin's Content types screen or with `emdash schema`.

### Rich text

`src/components/content/RichText.astro` shows Portable Text from EmDash in the site's type and colours. It hands every block to EmDash's own `<PortableText>` (links stay sanitised, images responsive, quotes grouped) and changes two things: the editor's headings move one level down, Kop 1 to an `h2` and so on to `h6` (`RichTextHeading.astro`, `getRichTextHeadingLevel`), because the page's title is its only `h1`; and the text, lists, links, quotes, dividers and captions take the design system's tokens through a scoped style. The News post page uses it (see [News](#news)), so does the event page's About this event (see [Events pages](#events-pages)), and `RichText.test.ts` covers it.

## Page openings

Every page except Get help, Privacy, a news post and an event page opens on sand under the solid header, in the home page's direction: the opener, a big title, one line and the page's action, beside a drawing of its own. The drawings share their parts, in `src/components/opening/`, presentational and with no content of their own:

- `OpeningDrawing.astro`: the svg, cropped to the part a screen shows, with the round fading dot field behind its slot.
- `StitchedThread.astro`: a dashed gold thread that sews itself in when the page loads. A mask over it is drawn along its length over `duration-slow`, one `stagger` after the thread before it. Nothing meant to be read waits for it, and with reduced motion the threads are simply there.
- `BeadRing.astro`: the thin gold circle and the woven beads round a centre (`getBeadRing`, with optional gaps). Its slot draws between the two, which keeps the home page's stacking.
- `CentreDisc.astro`: the white disc with its gold halo. It holds `CentreLogo.astro` (the colour logo, the reverse logo in dark) or `JoinedHands.astro`.
- `Sparkles.astro`: woven beads placed one by one. `StarChip.astro` is a value sewn onto the ground: a dashed label in the design system's `stitch` with the star, flat on the sand with a sand halo so threads and beads stop cleanly behind it, never a control, in two sizes (small where the boards draw it smaller: Support's Solidarity on tablet and phone, Join in's Your place on phone), and `TintDisc.astro` a small tinted disc holding a pictogram.

Each page keeps its drawing, its data per screen size (from its boards) and its copy in its own folder:

- **Contact** (`ContactDrawing.astro`): welcome bubbles.
- **Join in** (`JoinDrawing.astro`): a circle of seats with one open.
- **About us** (`AboutDrawing.astro`): the motto on the logo's arcs.
- **Donate** (`DonateDrawing.astro`): threads to what gifts pay for.
- **News** (`NewsDrawing.astro`): notices on a stitched line.
- **What's on** (`EventsDrawing.astro`): dates on an orbit.
- **Past events** (`archive/ArchiveDrawing.astro`): a timeline of knots.

The home page's constellation (`home/opening/Constellation.astro`) is built from the same parts with its own data. Each size places its drawing differently:

- **Phone:** the drawing comes first, full width, and the words follow under it.
- **Tablet:** the drawing follows the words in flow, at most 834 wide. Its top band (the part beside the words) is cropped out of the viewBox and still shows through the svg's visible overflow, so longer copy pushes the drawing down instead of running into it. On News and What's on the filter sits under the drawing. On Donate the widget sits beside the words and the drawing below.
- **Desktop:** the words sit on the left of a section about 860 tall. The `opening-words` and `opening-aside` utilities in `global.css` share one width (`--opening-words`). The drawing sits on the right, centred on the opening's height, at most 880 wide (the board's centre lands at x 1040 to 1050 at 1440). It narrows rather than reach under the words, which matters between 1180 and 1440.

Two drawings carry content:

- **What's on** carries the next 6 upcoming events of every kind (3 on phone), whatever filter is picked (`orbit` in `getEventsShared`). Without a filter the list's own read of upcoming events serves the orbit too, so it is read once. They sit on the orbit's fixed places in date order. With fewer events the later places stay empty, and with none the orbit and the logo stay.
- **Past events** carries the 4 latest months up to the current one (3 on phone), never before August 2026, the first month after AMIR-GB was founded (`buildTimeline`, `ARCHIVE_TIMELINE`). Each month's past events hang from it as knots in their kind's tint (`EVENT_TYPE_TINT`), fanned evenly, at most 5 a month (3 on phone; `getTimelineDrawing`). Older months leave the timeline but stay in the archive's list.

Join in and Donate draw the joined hands at all three sizes. Each page gives its three copies one srcset and one `sizes` value (`JOINED_HANDS_WIDTHS`, `JOIN_PHOTO_SIZES`, `DONATE_PHOTO_SIZES`), so the photo is fetched once, eagerly and first. `opening/JoinedHands.test.ts` guards this, as `OpeningSection.test.ts` does for the home page.

## Home page

`src/pages/index.astro`, `en/index.astro` and `pt/index.astro` read the page's content (`getHomeContent`) and render `src/components/home/HomePage.astro` with it. The page shows CMS content, so it renders per request (`export const prerender = false`) and is cached at Cloudflare's edge through Astro's route cache (`cacheCloudflare()` in `astro.config.mjs`, experimental): fresh for an hour, then served stale for up to a day while a fresh copy renders in the background (`CONTENT_CACHE` in `src/lib/content/constants.ts`). So after the first visit a page answers from the edge instead of starting EmDash and reading D1, which takes about a second. The cache hints EmDash returns tag the cached page, so publishing purges it at once, everywhere. What changes with the clock alone (an event that has started, a strip whose end date has passed) can show for up to an hour, or for the one visit that wakes a page nobody opened that day. In development the cache is off.

The cache is set in the page routes (`cacheContentPage` in `src/lib/content/helpers.ts`, used by the home page, the join page, the News pages and the Events pages), never in a component: Astro sends the response headers before it renders components, so a cache rule set inside one never reaches Cloudflare. A live response shows `cf-cache-status: MISS` on the first request and `HIT` after it.

Every section opener, the opening's included, has a soft dot patch above it (`OpenerDots.astro`, on the shared `DotPatch`): 260 by 180 and 64 above the opener on tablet and desktop, 140 by 100 and 36 above it on phone, starting 40 past the section's edge (20 on phone), and in the on-brand tone on the navy band. The patch takes its offset from the section margin token, as every opener sits on its section's margin. How can we help? and What's on clip their overflow, so a patch never widens the page.

Sections, top to bottom, each in its own folder under `src/components/home/`:

- **Announcement strip** (`AnnouncementStrip.astro`): the newest News post marked urgent whose `urgent_until` has not passed, above the header. Closing it stores the post's translation group in `localStorage`, and a small inline script hides it again before it paints on the next visit; a new announcement shows again.
- **Opening** (`opening/`): the greeting, the title, Join AMIR-GB and WhatsApp, with the woven constellation (the joined hands in a ring of beads, the six help services, three values, stitched gold threads). Each screen size has its own drawing from its board (`opening/constants.ts`). On desktop the opening fills the window and the drawing scales down to fit shorter windows, never up. When the page loads, each gold thread sews itself in once, from the ring out to its disc: a mask over the dashed thread is drawn along its length over `duration-slow`, one `stagger` after the last (`StitchedThread.astro`, see [Page openings](#page-openings)). Nothing meant to be read waits for it, and with reduced motion the threads are simply there. The photo is the phone's largest paint, so it loads eagerly with high priority (Astro's `priority`). All three drawings give it the same widths and `sizes` (`JOINED_HANDS_WIDTHS`, `CONSTELLATION_PHOTO_SIZES`), so every copy picks the same file and the page fetches the photo once, including the two copies hidden at each size; separate srcsets would make every eager copy download. `OpeningSection.test.ts` guards this.
- **How can we help?** (`help/`): six tinted tiles, each linking to its own topic on the Get help page (`/get-help/#letters`).
- **Stronger together** (`together/`): the story, the motto chips, the Join AMIR-GB button and the cloth of photo strips and two pinti strips, sewn with stitches. The strips are the board's own drawings (`ClothStripNavy.astro`, `ClothStripGold.astro`), coloured with design system tokens.
- **What's on** (`events/`): the next events from EmDash. Four or more fill the band (a sideways rail on phone and tablet, four cards on desktop). With fewer, weekly activities fill the places left: two or three event cards, one featured event across two places, or a calm message when nothing is announced. On desktop the band uses only the columns it fills, so a featured event or the message with no weekly activities beside it spans the whole band (`planWhatsOn` in `src/lib/content/helpers.ts`). An event without a photo shows the woven pinti panel.
- **Life at AMIR** (`stories/`): the newest Story posts. Four or more make a photo wall whose columns always end on one line (two columns on phone, three on tablet, four on desktop, each wall used only when there are enough stories to fill it); two or three sit side by side; one shows with its title and a few words. With none, the section is left out.
- **Support AMIR-GB** (`support/`): the words and the joined hands in their bead ring as one group, beside the donation widget, which the Donate page shares (see [Donations](#donations)). A stitched gold thread runs from the ring into the widget's left edge, Solidarity sits on the ring as a starred chip, and one round fading dot field lies under the group. The drawing is built from the shared opening parts (`SupportHands.astro`, with its data per screen size in `support/constants.ts`). On desktop the group is at most 1296 wide and centred in the sand card, so on a wide screen the card stretches and the group stays together. The drawing sits in the row under the words, so longer copy pushes it down instead of running into it, and it hangs from the widget's left edge across the column gap, so the thread always meets the widget; below 1440 it narrows with the group (container query units). Tablet keeps the same idea in a group of at most 786, the words and the widget sharing the row as 330 to 360, with the drawing scaled to the words column and the gap. Phone has no photo: the bead ring rises over the widget card as an arc with the chip on it (`SupportCrown.astro`), drawn in the widget's own units so it follows the widget however long the words run. The tablet and desktop photos share widths and `sizes` (`SUPPORT_PHOTO`), so the page fetches one file. The bank bar's Copy button copies the account number without spaces and shows "Copied. Paste it in your banking app." with a green check for three seconds (`src/lib/donate/helpers.ts`); a browser that refuses the clipboard leaves the bar as it was. Below desktop the button is round, with its word from desktop up. When the bar itself is narrower than 320px (the home page at tablet width), the account number steps down to the small body size, so it never runs under the button. The account number is a placeholder in its real Rabobank shape (`NL00 RABO 0000 0000 00`) until AMIR sends it. Amounts follow the page's language: €25 in English, € 25 in Dutch, 25 € in Portuguese. The section overlaps the footer, which adds the overlap to its own top padding. When Life at AMIR is left out, Support keeps its own distance from the navy band.

Languages: lists in English and Portuguese also show items that exist only in Dutch, one per translation group, each with a small NL mark (`DutchOnlyMark.astro`, read out as "Only in Dutch"). The queries are in `src/lib/content/queries.ts`; dates show in Dutch time, in British English and European Portuguese formats.

Placeholders in the page until AMIR sends them: the account number, the weekly activities and their places, every event except the General meeting, and the photos (example photos from the design canvas, with their credits in the design's notes).

## Events pages

What's on, its calendar, each event and the archive, all from EmDash's `events` and `activities`. Each route exists under `/`, `/en/` and `/pt/` (`src/pages/events/`), renders per request and is cached at the edge like the home page (`cacheContentPage`), so publishing purges it. The data layer is `src/lib/events/` (`queries.ts`, `helpers/`, `constants.ts`, `types.ts`); the components are in `src/components/events/`.

- **List** (`/events/`, `list/`): the opening (see [Page openings](#page-openings)) with the List and Calendar switch, a light switch on sand (a sunken track with the picked side raised), and the type chips, then the paper sheet with NEXT UP (the next event, large, with Add to calendar and Share on WhatsApp) and the rest by month ("Later in November" for the rest of the next event's month). Phone shows rows, tablet photo cards in two columns, desktop the month on the left and wide cards in two columns. The sand card under it holds Every week (the weekly activities) and Looking back (the three latest past events, See the archive); with no past events Looking back and the archive link are left out, and with neither the card is left out.
- **No upcoming events** (`empty/`): with no event planned and no filter, the list turns into its own page. The opening's orbit becomes the week (`EventsWeekDrawing.astro`): seven stops from Monday, each day that holds a weekly activity drawn as a disc in its tile colour with its name (and, from tablet up, the day it comes back on), the others as quiet white stops with the day's first three letters; on desktop a New dates soon sewn label sits under it, and on phone the orbit runs off the right edge. The week comes from the weekly activities in EmDash, so a day with none stays quiet and a day with several shows the first. The calendar view's opening shows the same week while nothing is planned. Then the sheet (`NoUpcomingSection.astro`): No new dates yet with Follow on Facebook and Follow on Instagram, beside Have an idea for an event?, which leads to the Contact page's message form; then Carrying on as usual, the weekly activities as wide rows with their day, times and next date (`getNextWeeklyDay` in `src/lib/events/helpers/weekly.ts`: today while today's session has not ended, in Dutch time, tested). Then Looking back on sand (`LookingBackSection.astro`) with the latest past events and See the archive, left out when there are none. The next date is worked out when the page renders, so like the rest of a cached page it can be up to an hour behind the clock.
- **Calendar** (`/events/calendar/`, `calendar/`): a month grid, Monday first. Past days are faded, today is ringed, the picked day is gold. Phone and tablet show dots (a muted dot for a weekly activity) and a legend; desktop writes the events' names in the days and the weekly activities as quiet lines. The picked day's events show as cards beside the month on desktop and under it on phone and tablet. A month without events says so and points at the next event after it.
- **The switch and the filters are plain links**, so the pages work without scripts and every view has its own address: `?type=` (jeugd, hulp, cultuur, gemeenschap) on both views, `?month=YYYY-MM` and `?day=YYYY-MM-DD` on the calendar. Calendar links end in `#calendar`, so the page lands on the month. Anything the address carries that is not a real kind, month or day is ignored.
- **Event page** (`/events/<slug>/`, `event/`): the way back, the kind, the title, the photo or woven panel with its date, the facts card (When; Where with Open in maps; Online; Languages, with a visible `[LANGUAGES]` placeholder when the editor chose none) and About this event from the rich text, or the summary when there is none. For whom follows Languages. Desktop puts the facts card in a column on the right, tablet beside the text, phone under the photo. Other events (the next three) follow on sand. Sign-up and online links are used only when their scheme is safe in a link (EmDash's `isSafeHref`). An address without an event answers 404 with the not found page.
- **Status and audience** (`event_status`, `original_starts_at`, `for_whom`, chosen by the editor): a cancelled event (afgelast) shows a red note, its title and date struck and only See what's on next, and leaves every list, the calendar, the archive, What's on on the home page and the Join page's general meeting. A moved event (verplaatst) shows an amber note with the new date, and the old date struck in When when the editor filled in the old date. For whom says everyone is welcome, or Members of AMIR-GB with Not a member yet? Join in; an online event for members says members get the link from AMIR-GB instead of showing it. The field is `event_status` because `status` is EmDash's own publish state.
- **States** (from the event's fields and the date): with a sign-up link, Sign up to come leads and Add to calendar steps back; with an online link and no place, an Online only chip and no Where row; the online link itself shows from an hour before the start (`OnlineLink.astro` renders it in place when the page is made, and `src/lib/events/reveal.ts` shows it on time on a page the edge cached earlier); once an event has ended, a note says so and the actions become See the photos (when a story points at it) and See what's on next.
- **Add to calendar** is a calendar file next to the page, `/events/<slug>.ics` (`[slug].ics.ts`, `buildCalendarFile`): phones open it in their calendar app. **Share on WhatsApp** opens `wa.me` with the event's name, day and address.
- **Archive** (`/events/archive/`, `archive/`): past events of one year, newest first, with a chip per year (`?year=`; the newest by default) and the timeline in the opening (see [Page openings](#page-openings)). An event shows Photos when a Story post points at it through its `event` field (the field's label tells editors a story may point at its event too) (`getStories` reads each story's reference with `getEmDashReferences`). With no past events the archive answers 404, and nothing links to it.
- **Languages**: as on the home page, English and Portuguese lists also show Dutch-only events with the NL mark; their page shows the Dutch original with an "only in Dutch" note (`DutchOnlyNote.astro`).

Placeholders until AMIR sends them: the languages of each event, and every example event, place and photo in the seed.

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

- **Opening** (`AboutOpening.astro`): We are AMIR-GB on sand and the story of the name, beside the logo under its arcs with the motto as chips and the founding date (see [Page openings](#page-openings)). On phone the drawing has no chips, so the motto stays under the words, two by two (`MottoChips.astro`).
- **Grounds** alternate from the opening down: sand, paper, sand, paper, sand.
- **What we are for** (`PurposeSection.astro`): the mission and the vision on two white cards, then the seven aims numbered 01 to 07, in two columns on desktop.
- **Our values** (`ValuesSection.astro`): four tinted tiles with a Lucide pictogram, two by two on phone and tablet, four across on desktop. Solidarity carries its Kriolu word, Djumbai, marked `lang="pov"`.
- **The board** (`BoardSection.astro`): the three board members with their role (in Dutch, followed by the page's language on English and Portuguese pages), name and tasks. Until their photos come, each has a pinti disc with their initials and "Photo to come" (`PortraitPlaceholder.astro`), which looks the same in light and dark, as a photo does.
- **How we handle money** (`MoneySection.astro`): the four rules, each pictogram in a white disc, the documents and the legal and tax status. The documents link to PDFs; until AMIR sends them they point at `#` and show a visible [PDF TO COME] placeholder. The yearly report and accounts rest, greyed, with "After our first year". The status card says AMIR-GB is a vereniging and an SBBI, not an ANBI, with its KvK and RSIN numbers from `LEGAL` in `src/site/constants.ts`.

Placeholders until AMIR sends them: the three PDFs and the board photos.

## Join in

`src/pages/join.astro`, `en/join.astro` and `pt/join.astro` render `src/components/join/JoinPage.astro`. The page renders per request because it shows the next general meeting from EmDash, and is cached at the edge like the home page (`cacheContentPage`).

- **Opening** (`JoinOpening.astro`): Join in on sand, Become a member and Volunteer with us, beside the joined hands in a circle of twelve seats, one of them open with Your place (see [Page openings](#page-openings)).
- **How you can take part** (`WaysSection.astro`, `WayCard.astro`): member, volunteer, work with us (email) and give (the donate page), one column on phone, two on tablet, four on desktop. The membership fee is a visible placeholder, `[FEE]` in `warning` on `warning-bg` (`joinPage.fee`), until AMIR sets it.
- **General meeting** (`MeetingStrip.astro`): a navy strip that opens the event page. It shows the soonest upcoming `gemeenschap` event with `general_meeting` ticked (`getGeneralMeeting` in `src/lib/content/queries.ts`), with its photo or the woven pinti panel, and is left out when none is planned. EmDash's collection filter takes no booleans, so the query reads the next 50 community events and keeps the ticked one.
- **Sign up** (`SignUpSection.astro`): Join AMIR-GB, a member card drawn as an object (`MemberCard.astro`, navy in both themes, this year's date), and the island `JoinSignUp.vue`, loaded once the page is idle so a mode link in the address is picked before the visitor reaches the form. The island renders two grid items, the form on its white card and What happens next, which follows the mode (and, once sent, the mode that was sent): three steps for a member, two for a volunteer.

**The form** (`JoinSignUp.vue`, state in `useJoinForm.ts`, rules in `src/lib/join/`): Member or Volunteer, full name, email, phone or WhatsApp (optional), where you live, the language to talk in (starting on the page's language), what a volunteer can help with (at least one; hidden and never sent for a member), an optional message and the consent tick that links the privacy page. The page's Become a member and Volunteer links point at the two mode radios (`#join-as-member`, `#join-as-volunteer`): the browser scrolls to the form, and the island picks that mode from the address on arrival and on every click (`useJoinModeLinks.ts`). Errors show after Send, under each field, with a summary that counts and names them. Sending rests the fields; Sent takes the form's place, a welcome by first name with how the fee comes by email for a member, or a thanks naming the skills for a volunteer, with See what's on and Tell a friend on WhatsApp (a `wa.me` message with the join page's address). Did not send keeps everything typed and offers Try again and WhatsApp.

**Where sign-ups go.** The `join` action (`src/actions/join.ts`) checks the sign-up again with the same rules (`src/lib/join/schema.ts`; an empty field arrives as null and reads as empty, so the server names the same errors the form does), refuses posts from other sites and robots that fill the hidden field, and emails AMIR's inbox in Dutch with the visitor as the reply-to address (`src/lib/join/mail.ts`). A member's email ends with the next step for AMIR: send how to pay the fee. Nothing is stored on the site.

**Shared form parts.** Contact and Join share what has no domain knowledge: `src/lib/forms/` (`sendToInbox` with the `FORM_INBOX` binding and `CONTACT_FROM_ADDRESS`, the hidden trap field's name, `toOneLine` for header-safe values, the email pattern, list formatting) and `src/components/forms/` (`TextField`, `TextArea`, `ChoiceChip`, `ConsentField`, `TrapField`, `FieldError`, `FormSummary`, `FormFailed`, focus and server-error helpers). The answer languages (Nederlands, English, Kriolu, Português) live in `src/site/constants.ts` with the `answerLanguage.*` copy. Each form keeps its own fields, rules, copy and email body.

Verified locally: every state on a phone (errors, Sending, Sent as a member and as a volunteer, Did not send), the emails in `.wrangler/tmp/email/`, the action's refusals (another origin, the trap field, server-side errors), the not set up path for both forms, and the page at 360, 390, 834, 1180 and 1440 in light and dark, in NL, EN and PT.

Placeholders until AMIR sends them: the fee (`[FEE]`, `[CONTRIBUTIE]`, `[QUOTA]`).

## News

`src/pages/news/index.astro` and `news/[slug].astro`, with the same under `en/` and `pt/`, render the list (`src/components/news/NewsPage.astro`) and a post (`NewsPostPage.astro`). Both show CMS content, so they render per request and are cached at the edge with the hints they read, like the home page (`cacheContentPage`). The queries and the logic that decides what each page shows are in `src/lib/news/` (`queries.ts`, `helpers.ts`, tested in `helpers.test.ts`).

**Reading posts.** Every published post is read once per request, a hundred at a time along EmDash's cursor, in the page's language and, on English and Portuguese pages, the Dutch posts with no translation (`mergeWithDutch`, marked NL as on the home page). They are ordered by `publishedAt` together. AMIR publishes a handful of posts a month, so one read serves the list, the filter, the prints and More from News, and the edge cache keeps it cheap. A failed read fails the page (the 500 page), so an empty list is never shown or cached by mistake.

**The list** (`/news/`):

- **Opening** (`NewsOpening.astro`): FROM AMIR-GB, News, one line and the filter, beside the logo holding a stitched line with the kinds of post pinned to it (see [Page openings](#page-openings)). On tablet the filter sits under the line.
- **Filter** (`NewsFilter.astro`): All, Announcements, News, Stories, each a plain link (`?type=aankondiging`, `nieuws` or `verhaal`, the values EmDash stores). The current chip is `selected` with the strong border, as the contact form's chips. On phone the chips stay on one line that scrolls sideways; from tablet up they wrap and carry the type's colour dot.
- **List** (`NewsListSection.astro`), a paper sheet over the opening: the newest post as a big card (`FeaturedPostCard.astro`), then six more (`PostListItem.astro`): rows with a small photo in one white card on phone, cards with a few words in two columns on tablet and three on desktop. A post without a photo shows the woven pinti panel with its type's pictogram in a white disc: a megaphone for an announcement (`PostPhoto.astro`). Every post wears its type as a tag with a dot: Announcement in brick (`danger`), News in navy (`info`), Story in forest (`success`).
- **Show older posts** (`OlderPosts.astro`) links to `?page=2`, which shows six more, and so on. Any other query string (a page past the last, an unknown type, `?page=1`) moves with a 301 to the one for what the page shows, so each list is cached once. Without JavaScript the link opens that page. With it, `enableOlderPosts` fetches the page, adds the posts the list does not have yet, swaps the footer and the opening's prints, moves focus to the first new post and keeps the address, so a reload shows the same list. While it loads the button rests as Loading older posts with a spinner. After the last older page the footer says That is everything for now.
- **Nothing to show**: a type with no posts shows its own message with Show all posts (`NoPostsOfTypeCard.astro`); before the first post the page shows Our first news is on its way with What's on and Instagram, and no filter (`NoPostsYetCard.astro`).

**A post** (`/news/<slug>/`): back to News, the type and date, the title and the lead, the photo, the text at reading width (`RichText.astro`), then for an announcement the event it is about (`PostEventLink.astro`, from the `event` reference) and the board's signature with the first names from `board_names` (`BoardSignature.astro`). Then the photos from the day (`PostGallery.astro`: two columns that end on one line on phone, rows of two on tablet, one large and four small on desktop; rows without a photo and the post's own photo are skipped), Share (WhatsApp with the title and the address, and Copy link, which says Link copied for three seconds), and More from News on sand: the three newest other posts, two on tablet. A post that exists only in Dutch, read in English or Portuguese, shows in Dutch under a note that says so (`DutchOnlyNote.astro`), marked `lang="nl"` so it reads and hyphenates as Dutch. An address from another language (the language switch keeps the slug) moves with a 301 to the translation in the page's language when there is one. An unknown slug answers 404 with the site's 404 page.

**Where the build follows the design system rather than the boards**: the current filter chip is `selected`, not a gold fill (gold never fills a control), and the chips are 48px high, the tap minimum. The type is the design system's scale: News is `type-hero`, a post title `type-h1` on phone and `type-display` from tablet, card titles `type-h2` to `type-h4`, the text `type-body`. The post's column is the boards' 640 and 720, with its running text kept within `measure`. Cards and photos have `radius-lg`, and the featured card a hairline instead of a shadow.

The `getWhatsAppShareHref` helper moved to `src/lib/share/`, since Support and News both share on WhatsApp.

## Contact page

`src/pages/contact.astro`, `en/contact.astro` and `pt/contact.astro` render `src/components/contact/ContactPage.astro`. The page is built once like any static page; only the message form talks to the server.

- **Opening** (`ContactOpening.astro`): Contact on sand with WhatsApp us and Or write a message, which goes down to the form (`#message`), beside the logo and four welcome bubbles in the order Dutch, English, Kriolu, Portuguese; on phone they stack down the left as smaller bubbles (see [Page openings](#page-openings)). The lead names the languages on its own line.
- **Reach us your way** (`ReachSection.astro`): WhatsApp first and largest (`WhatsAppCard.astro`), ending on Open WhatsApp. From tablet up it carries a QR code for people on a computer, drawn from the real `wa.me` link when the page is built (`src/lib/contact/qr.ts`, the `qrcode` package), navy on white in both themes, so no script or image service is involved. Then Call us and Email (cards from tablet up, tappable rows on phone) and the opening hours (`OpeningHoursCard.astro`). Once the page knows the time, a small script shows Open now or Closed now with when that changes and makes today's row bold, in the Netherlands' time whatever the visitor's clock (`getOpeningStatus` in `src/lib/contact/helpers.ts`, tested).
- **Send us a message** (`MessageSection.astro`, `ContactForm.vue`, loaded when it comes into view, state in `useContactForm.ts`): name, email or phone, the language to answer in (starting on the page's language), an optional topic, the message and a consent tick that links the privacy page. Errors show only after Send, under each field, with a summary at the top that names them (`Intl.ListFormat` joins the names in the page's language). Sending rests the fields; Sent takes the form's place with the name, language and address the visitor gave; Did not send keeps everything typed and offers Try again and WhatsApp. A hidden field catches robots, which are told it worked and nothing is sent. The form posts with `method="post"`, so nothing typed ever lands in an address; it needs JavaScript to send.
- **Our address** (`AddressSection.astro`): the Breda address with Open in maps, a woven card with a gold pin in place of an embedded map (no map service, no tracking cookies), the social profiles as named pills and the registration numbers.

**Where messages go.** The `contact` Astro Action (`src/actions/contact.ts`) checks the message again with the same rules (`src/lib/contact/schema.ts`), refuses posts from other sites, and emails it to AMIR's inbox through Cloudflare Email Service (`src/lib/contact/mail.ts` writes the email, the shared `sendToInbox` in `src/lib/forms/mail.ts` sends it): the `FORM_INBOX` send binding in `wrangler.jsonc` can only send to `amirgbnederland@gmail.com`. The email is in Dutch for AMIR's volunteers, with the visitor as the reply-to address when they gave an email. Nothing is stored on the site. Sending needs AMIR's own domain onboarded to Email Service and `CONTACT_FROM_ADDRESS` set to an address on it; until then the action logs why and the form shows Did not send with WhatsApp. Locally, `astro dev` simulates the binding and writes each email to `.wrangler/tmp/email/`.

The footer leaves out its own Questions? Talk to us on this page (`data-hides-footer-talk`) and overlaps the last section (`data-footer-overlaps`). The footer's small print now links the privacy page on every page.

## Privacy page

`src/pages/privacy.astro`, `en/privacy.astro` and `pt/privacy.astro` render `src/components/privacy/PrivacyPage.astro`, a static page. The footer's small print and the Contact form's consent tick link it.

**The text is a draft.** It was written from what the site really does (the forms email AMIR's Gmail inbox and store nothing, gifts go through Stripe Checkout with iDEAL and SEPA or by bank transfer, no cookies for visitors, only the theme choice and a closed announcement in `localStorage`, hosting at Cloudflare with the database and media in the EU). AMIR-GB's board checks it before launch. When it approves, set `updated:` in the front matter of each file (for example `updated: 2027-01-15`); until then the page shows a visible [DATE].

**Where the text lives.** Page copy stays in code, never in the CMS, so the seven sections are one Markdown file per language in `src/content/privacy/` (`nl.md`, `en.md`, `pt.md`), a build-time content collection (`src/content.config.ts`, glob loader; EmDash's live collection stays in `src/live.config.ts`). Each `##` heading starts a section: Astro gives it an id in its own language (`#jouw-rechten`, `#your-rights`) and `render()` returns the headings that On this page lists (`getContentsLinks`), so adding, renaming or removing a section needs only the Markdown. The files repeat the KvK number, the address, the email and the phone number from `LEGAL` and `CONTACT` in `src/site/constants.ts`: change both together. The short interface copy (opener, title, summary, the three promises, On this page) is in the dictionaries as `privacy.*`.

- **Opening** (`PrivacyOpening.astro`): YOUR DATA, Privacy and the summary on sand, Last updated (`PrivacyUpdated.astro`, the date written out in the page's language), then three white cards (`PromiseCard.astro`): Only to help you, Never sold, never shared, No tracking.
- **The text** (`PrivacyTextSection.astro`): a paper sheet over the opening that the footer overlaps. On desktop, On this page is a list of anchors in a left column (`PrivacyContents.astro`); on phone and tablet it is a closed `<details>` fold-out above the text (`PrivacyContentsFold.astro`). `PrivacyText.astro` sets the Markdown in the design system's type: `type-h2` headings with a hairline between sections, `type-body` paragraphs within `max-w-measure` in a 720 column. Each heading has `scroll-mt-6` on top of the page's `scroll-padding-top`, so an anchor lands 24px below the sticky header at every width.

## Donations

One-off and monthly gifts go through Stripe Checkout, Stripe's own payment page. The site keeps no record of gifts: Stripe's Dashboard is the record, and Stripe's own emails send receipts and tell donors about failed monthly payments. There is no webhook.

**The widget.** Two pages take gifts, the home page (Support AMIR-GB) and the [Donate page](#donate-page), and both render the same widget from `src/components/support/`: `DonationWidget.astro` shows the form or, on a return, the card that takes its place, with the bank transfer bar under it. `JoinedHandsRing.astro` is the joined hands photo in its thin gold ring of woven beads that sits beside it on both pages; each page sizes and places it. The form is the site's one Vue island (`DonateForm.vue`, loaded when it comes into view).

**The flow.**

1. The form (`src/components/support/DonateForm.vue`, its state in `useDonateForm.ts`) posts how often, the preset or typed amount and the page's language to the `donate` Astro Action (`src/actions/donate.ts`), on the page it is on. It works without JavaScript too: the page route reads the action's result and redirects to Stripe.
2. The action checks the input (`src/lib/donate/schema.ts`): a typed amount may use a comma or a dot for cents and dots or commas between thousands; a gift is €1 to €10,000. An amount outside that comes back as an error under the field ("The smallest gift is €1.", or the bank transfer for more than €10,000). With JavaScript the form checks the same rule before it posts.
3. It creates a Checkout Session (`src/lib/donate/checkout.ts`, `stripe.ts`) with the official `stripe` SDK on fetch: a payment for a one-off gift (Stripe's button says Donate), a subscription for a monthly one. The line item is the amount on one product, `amir_gb_gift` ("Gift aan AMIR-GB"), which exists once in each Stripe account. Checkout shows the payment methods the Stripe Dashboard turns on; the code names none. It opens in the page's language.
4. Stripe sends the donor back to the page the gift was started from, in the form's language: the Donate page for a gift from `/donate/`, `/en/donate/` or `/pt/donate/`, the home page for any other (`getGiftPageRoute` in `src/lib/donate/pages.ts`, server side only). The address is `?gift=<session id>#support` after paying, `?gift=stopped&frequency=…&amount=…#support` when they stop. `#support` is the Support section on the home page and the widget itself on the Donate page.

**What the widget shows on the way back** (`src/lib/donate/support.ts`). The page route reads the session from Stripe and the card takes the form's place, with the bank transfer bar under it. The card's links (Give again, Try again, Change the amount) go back to the form on the same page, and Share on WhatsApp shares that page's address:

| Return                                                                          | Shows                                                                   |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Session complete and paid, one-off                                              | Thank you, the amount, Share on WhatsApp, Give again (back to the form) |
| Session complete and paid, monthly (also while its first SEPA debit is pending) | The same, plus Stop or change your monthly gift                         |
| Session complete but unpaid (SEPA Direct Debit takes a few days)                | Thank you, the gift is on its way, Share on WhatsApp, Give again        |
| Stopped                                                                         | Payment stopped, a button that repeats the choice, Change the amount    |
| A session that did not complete, or one Stripe does not know                    | The payment did not go through, Try again                               |

On the three thank you cards the round check mark grows in once from 90% while it fades in (`ReturnCard.astro`, a one-shot CSS animation over `duration-slow` with `ease-enter`, so it plays on the first paint after Stripe's redirect). The words never wait for it, and with reduced motion it is simply there.

A bank's refusal shows on Stripe's own page, which lets the donor try again, so the failed card is rare. A page that shows a return or a failed try is sent with `Cache-Control: private, no-store` and never reaches the edge cache, so no donor sees another's gift. When Stripe does not answer, the form says the payment could not start and points at the bank transfer; the Worker's logs say why.

**Stopping or changing a monthly gift.** Stripe's customer portal, through its login page (`STRIPE_PORTAL_URL`): the donor types their email and gets a link. It is linked from the monthly thank you, from the Donate page's Giving monthly? card and from the footer's small print. The portal stops a gift and changes the payment method; it cannot change an amount, so a new amount means stopping and starting again.

**Stripe setup, once per account** (sandbox done 2026-11-14 in "AMIR-GB · sandbox"; repeat in AMIR's live account):

- the product: `stripe products create --id amir_gb_gift --name "Gift aan AMIR-GB"`;
- a customer portal configuration with cancel, payment method update, invoice history and the login page on; its login page address goes in `STRIPE_PORTAL_URL`;
- in the Dashboard, email receipts for successful payments, so "A confirmation is on its way to your email" is true;
- a restricted key with Checkout Sessions write and read for `STRIPE_SECRET_KEY`.

To try it locally, use the sandbox key in `.dev.vars`, pay with iDEAL's test bank, and stop at Checkout with its back link.

## Donate page

`src/pages/donate/index.astro`, `en/donate/index.astro` and `pt/donate/index.astro` render `src/components/donate/DonatePage.astro`, where the header's Donate button leads. The header marks no page as current here. The page reads the donate action's result and Stripe's session, so it renders per request, like the home page: a posted gift without JavaScript is redirected to Stripe, a page with a return or a failed try is sent `private, no-store`, and the plain form is cached at the edge like the home page, fresh for an hour and stale for a day (`cacheDonatePage` in `src/lib/donate/support.ts`; nothing to purge, as the page reads nothing from EmDash).

Sections, each in `src/components/donate/`:

- **Opening** (`DonateOpening.astro`), on sand: GIVE WHAT YOU CAN, Support our community, one line and the [donation widget](#donations) unchanged, with the returns from Stripe in its place, beside the joined hands and the threads to what gifts pay for (see [Page openings](#page-openings)). The widget sits under the words on desktop and phone, and beside them on tablet. The title is `type-display` up to tablet, where its column is narrow, and `type-hero` on desktop, broken by hand after its first part (`donatePage.titleStart` and `titleEnd`).
- **What your gift does** (`GiftUsesSection.astro`, `GiftUseTile.astro`): four tinted tiles from AMIR-GB's own plan (`GIFT_USES` in `constants.ts`), and a line that results follow after the first year. No numbers until there are real ones.
- **Other ways and questions** (`OtherWaysSection.astro`), on sand, three white cards (`WayCard.astro`): By bank transfer (`BankTransferCard.astro`, the account number with a Copy button that behaves as the bar's does, through the same `enableCopyAccount`, which sets up each number once), Giving monthly? (`MonthlyGiftCard.astro`, the `STRIPE_PORTAL_URL` link the footer uses, left out when it is not set; the copy says a new amount means stopping and starting again, as the portal cannot change one) and About tax (`TaxCard.astro`: AMIR-GB is an SBBI, not an ANBI, so gifts are not tax-deductible for now, with a link to About us). The footer slides over this last section (`data-footer-overlaps`, the rule in `SiteFooter.astro` that Get help uses).

Its copy is under `donatePage.` in the three dictionaries. Verified: the Stripe sandbox from `/donate/` in each language (iDEAL once and monthly, stopped, a session that did not complete), the home page still returning to itself, and the page at 360, 390, 700, 834, 1180 and 1440 in light and dark.

## SEO

Everything a search engine or a link preview reads lives in `src/lib/seo/` and `src/components/seo/SeoHead.astro`, which `BaseLayout` puts in every page's head.

- **The site's address.** `site` in `astro.config.mjs` comes from `SITE_URL` at build time, and falls back to the preview address `amir-gb.josefurtado-digital.workers.dev`. Every canonical, language link, share image and sitemap entry is built from it, so moving to AMIR's own domain means setting `SITE_URL` as a Workers Builds variable (as well as the runtime variable) and deploying.
- **Kept out of search on the preview address.** While the site's address is a `workers.dev` one, every page says `noindex` (`isStagingSite`). On AMIR's own domain that stops by itself. The 404 and error pages always say `noindex`, and the Donate page's thank-you and failed states send `X-Robots-Tag: noindex` with their private cache header (`keepPagePrivate`).
- **Each page's head** (`buildHeadSeo`):
  - the canonical address, which is the page's own path, so filters and calendar months (`?type=`, `?month=`, `?year=`) point at the clean page;
  - `hreflang` alternates for Dutch, English and Portuguese, plus `x-default` (Dutch);
  - Open Graph and Twitter tags: title, description, address, type, language and its alternates, and the share image.
- **The share image** is `public/og/amir-gb.jpg` (1200×630): the logo on sand beside the joined hands in a stitched ring, an interim card until the design session draws one.
- **Posts and events** carry their own language versions, read from EmDash's translations (`getEntryAlternates`, with slashed addresses), so a Dutch-only post lists only Dutch. Shown at another language's address, it points its canonical at the Dutch page. Their photo is their share image, and their titles end in "· AMIR-GB".
- **The editors' SEO panel.** Posts and events have EmDash's SEO support switched on in `seed/seed.json`, with a URL pattern (`/news/{slug}`, `/events/{slug}`). Each one gets an SEO panel in the admin: a search title, description, share image, canonical and "hide from search". What an editor fills in wins over the defaults (`getEntryPageSeo`).
- **Sitemaps.** The site serves its own, so EmDash does not add its own (it skips `/sitemap.xml` and `/robots.txt` when a site defines them):
  - `/sitemap.xml`, the index;
  - `/sitemap-pages.xml`, every page in every language, built once (`SITEMAP_PAGES`; the archive is left out until there are past events);
  - `/sitemap-news.xml` and `/sitemap-events.xml`, every published post and event in its languages, joined to its translations, rendered per request and cached like the CMS pages. Entries an editor hid from search are left out.
- **robots.txt** lets everyone read the site except `/_emdash/`, and names the sitemap.
- **Structured data** (`src/lib/seo/structured-data.ts`), one JSON-LD graph in every page's head:
  - every page describes AMIR-GB as an `NGO`: legal name, logo, the Breda address, phone, email, the KvK number as its identifier, its founding date, the Netherlands as the area it serves, and its social profiles once AMIR sends them. Plus the `WebSite` in the page's language.
  - event pages add an `Event`: name, start and end, state (scheduled, rescheduled with its old date, cancelled), how to attend, the place, image, description, and AMIR-GB as organiser. An online event's location is its own page, since the link to join stays hidden until shortly before the start.
  - post pages add a `NewsArticle` published by AMIR-GB.
  - both add a `BreadcrumbList`: AMIR-GB, then News or What's on, then the page.
  - A fact the editor left empty is left out, never filled in.
- The trailing slash stays Astro's default. `trailingSlash: "always"` would make every address uniform, but EmDash's admin calls its API without slashes and would break.

## Design system files

`src/styles/design-system/amir-tokens.css` and `amir-tailwind.css` are generated by the AMIR-GB design system ([Design System artifact](https://claude.ai/artifact/CMiqDHzbFGF8XPvEU17SEK)), from its `project/tokens.json`. They are copied here unchanged, with one header line naming their source. Never edit them here: a change goes into the design system first.

To refresh them after the design system changes:

1. Open the design system artifact and take the current `project/build/amir-tokens.css` and `project/build/amir-tailwind.css`. A Claude session can read them with the Artifact tool's read action.
2. In each file under `src/styles/design-system/`, keep line 1 (the header) and replace everything below it with the new file's content.
3. Run `pnpm verify` (the tests check the headers and the stylesheet order) and look at the site in light and dark.

`src/styles/global.css` imports Tailwind, then the tokens, then the Tailwind theme, in that order.

## Environment

Variables are typed in `astro.config.mjs` (`env.schema`) and read through `astro:env`. Locally they come from `.dev.vars`. On Cloudflare, secrets are set with `pnpm exec wrangler secret put <NAME>` and public values go in `vars` in `wrangler.jsonc`. No real key is ever committed.

| Variable                | Kind    | Purpose                                                                                                                                                      |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SITE_URL`              | public  | The site's public origin. EmDash uses it for passkeys and redirects. Set it as a build variable too: the build reads it as Astro's `site` (see [SEO](#seo)). |
| `STRIPE_SECRET_KEY`     | secret  | Creates and reads Stripe Checkout Sessions for donations. A restricted key (`rk_`) with Checkout Sessions write and read.                                    |
| `STRIPE_PORTAL_URL`     | runtime | The login page of Stripe's customer portal, where monthly donors stop or change a gift. Not a secret; read at runtime so each Stripe account has its own.    |
| `EMDASH_ENCRYPTION_KEY` | secret  | Encrypts plugin settings saved as secrets. Generate with `pnpm exec emdash secrets generate`; back the production key up.                                    |
| `CONTACT_FROM_ADDRESS`  | runtime | The address the contact form sends from, on AMIR's own domain onboarded to Cloudflare Email Service. Without it the form says the message did not send.      |

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
