# Agent rules

Every agent working on this site follows these rules, whatever the tool. This file holds how we
work, the checklist and an index. Each topic has its own file under `.agents/rules/`, the
site-specific rules (stack, tokens, languages) are in `CLAUDE.md`, and every rule lives in exactly
one place.

## How we work

- **Plan first.** A session starts in planning: read, investigate, discuss, and write plans to
  `.agent-plans/`. Plans are local working notes: git-ignored, never committed, and deleted once
  implemented. `README.md` and any `docs/` folder are committed documentation, not plans.
- **No code until you are told to build.** Writing or editing code waits for an explicit go-ahead
  from jose ("build it", "implement it", "go ahead"). Naming a library, a data shape or a structure,
  or answering a question about options, settles the design. It is not that go-ahead. When code is
  the obvious next step, say what you would write and ask in one line.
- **Review before you offer a commit.** Once a build is done, review the diff with `/code-review` and
  fix what it finds before you put a commit, a push or a PR to jose. A green `pnpm verify` is not a
  review.
- **Document every meaningful change, in the same PR.** A change that adds or alters behaviour, a
  flow, a data shape, a content model or a unit other code builds on updates the doc that describes
  it: `README.md` or a `docs/` file next to the code. Say what it does, where it lives, why it works
  that way and what was verified, and start the doc when there is none. Fix every doc the change
  makes stale. A fix with no change in behaviour, a rename or a style pass needs no doc.
- **pnpm only.** Install dependencies, run scripts and manage packages with pnpm, never npm or yarn.

## Checklist

The rules agents miss most, one line each. The full rule is in its topic file.

<!-- BEGIN:checklist -->

- **Plan first, review, commit when asked:** no code until jose says build; review with `/code-review` and fix its findings before you offer a commit, push or PR; never commit unasked.
- **Document every meaningful change:** update the doc next to the code in the same PR, and fix every doc the change makes stale.
- **TypeScript:** no `any` or `unknown`; never suppress a lint or type error, fix it.
- **Dedicated units:** one unit per concern, never one reused across concerns through slots, generic props or mode flags; a shared unit has no domain knowledge and 2+ users.
- **Files:** one component or composable per file; types, utils, constants and helpers in their own files; components stay thin.
- **No hardcoded strings in logic:** `as const` objects with derived union types; copy lives with the translations.
- **Imports:** grouped as `// Dependencies`, then `// Components`, then `// Types`.
- **Comments:** one short line per step; JSDoc with `{@link}` and a one-line `@description`; never in markup.
- **Thin templates:** no logic in a `.map()` or `v-for`; `index.ts` only re-exports; no pass-through wrappers; no Tailwind class constants.
- **If over ternary:** a ternary only picks between two simple values, one level deep.
- **Copy:** no dashes as punctuation, in any language; disabled controls explain on demand.
- **Site rules:** tokens only, mobile first, light and dark, Vue never React, official first (`CLAUDE.md`).
- **pnpm only.** KISS, DRY, YAGNI.

<!-- END:checklist -->

## Rules by topic

| File                                                                     | Covers                                                                                       | Read it                                                            |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [`CLAUDE.md`](CLAUDE.md)                                                 | The stack and the site's own rules: tokens, mobile first, languages, CMS, Vue                | Always (loaded every session)                                      |
| [`.agents/rules/code-style.md`](.agents/rules/code-style.md)             | Types, units and files, control flow, templates, strings, comments, imports, with an example | Before writing or reviewing code                                   |
| [`.agents/rules/ux-and-design.md`](.agents/rules/ux-and-design.md)       | Disabled controls, one action per click, light and dark, mobile, copy punctuation            | Before building or changing UI, or writing anything a person reads |
| [`.agents/rules/sources-of-truth.md`](.agents/rules/sources-of-truth.md) | Designs against the code and the design system, growing the design system, existing flows    | Before building a design or touching a shared layer                |
| [`.agents/rules/git-and-prs.md`](.agents/rules/git-and-prs.md)           | When to commit, PR titles, PR size, descriptions, attribution                                | Before a commit, a PR or a review comment                          |

## Adding a rule

- Put it in the topic file it belongs to, as one bullet: the rule in bold, then what to do.
- Add a checklist line only when agents keep missing the rule. Nothing else repeats it: `CLAUDE.md`
  imports the topic files, and the reminder hook prints the checklist from this file.
- A new topic gets its own file under `.agents/rules/`, a row in the table above and an `@` import in
  `CLAUDE.md`.

## Development

When starting the dev server, use background mode:

```
pnpm dev --background
```

Manage the background server with `pnpm astro dev stop`, `pnpm astro dev status`, and `pnpm astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
