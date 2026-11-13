# Code style

How we write TypeScript, Astro and Vue here. Oxfmt and Oxlint catch what a tool can, and a hook runs
both on every edited file. These rules cover the rest.

## Types and errors

- **Fix lint errors, never bypass them.** No suppression comments and no ignores.
- **Fix type errors, never bypass them.** No `@ts-ignore`, `@ts-expect-error` or casts to silence one.
- **No `any` and no `unknown`.** Type everything precisely.

## Units and files

- **Dedicated units (VERY IMPORTANT):** one unit per concern (an Astro component, a Vue component, a
  composable, anything), never one reused across concerns through slots, generic props or
  mode flags. If a unit branches on its inputs to serve more than one purpose, split it; "it works"
  is not the bar.
  - **Dedicated unit (the default):** owns ONE concern, takes concrete props named for that concern,
    and keeps its logic and copy in its own folder, for example `events/EventCard.astro`,
    `donate/DonateForm.vue`, `useDonationAmount.ts`. Name it for its concern, not with a generic
    prefix on a concern-specific thing (`EventCard`, not `ContentCard`).
  - **Shared primitive (the only thing allowed to be generic):** purely presentational or utility,
    with NO domain knowledge (no content types, no feature copy, no feature actions) AND actually used
    by 2+ dedicated units. A `Section` shell or a `useDisclosure` composable qualifies; a "card",
    "grid" or "menu" that one feature uses does not: that is a dedicated unit mislabelled.
  - **Split or fold the moment you see:** a generic slot or prop serving several purposes, a generic
    model prop (`item: NewsOrEvent`), or a mode flag (`variant` that changes what the unit does);
    the same unit used by two different concerns (give each its own, even look-alikes such as
    loading skeletons); a "shared" unit with a single user (fold it into that user); a fat page or
    component with inline forms, dialogs, states or unrelated logic (extract each so the parent is a
    thin composition).
  - Compose dedicated units from shared primitives and the design system. Per YAGNI, do not invent a
    primitive for one caller; per DRY, a little duplication beats a wrong shared abstraction.
- **One component or one composable per file.** Never several.
- **Types, utils, constants and helpers live in their own files:** `types.ts`, `utils.ts`,
  `constants.ts` and `helpers.ts`. When one grows too large, it becomes a folder of smaller files
  with an `index.ts` that re-exports them.
- **Thin components.** Logic lives in composables, helpers, utils and data modules, never in an Astro
  frontmatter or a Vue `<script setup>` beyond wiring. UI stays apart from business logic and data
  fetching.
- **Index files only re-export:** an `index.ts` holds `export { x } from "./x";` lines and nothing
  else. The unit lives in its own named file.
- **No pass-through wrappers:** a component or composable that only forwards to another unit gets
  deleted, and its callers use the real unit, however many files that touches.
- **No component registries:** data structures hold plain data, never components. Compose with
  explicit markup over statically imported components, not a lookup table of components by key.
- **The right primitive:** one that needs a long `class` to undo its own look is the wrong one.
- **Keep it simple.** KISS, DRY and YAGNI: the simplest code that works, no abstraction before a
  second caller needs it. Name things for what they are, keep each function to one job, and keep
  units loosely coupled.

## Control flow

- **If statements over ternaries.** Branch with plain `if` statements and early returns. A ternary
  only picks between two simple primitive values, one level deep (`isOpen ? OPEN_LABEL : CLOSED_LABEL`).
  When a branch calls a function, awaits, builds a string, object or array, or holds another
  ternary, write `if` statements instead. When the branches cannot be written as clean `if`
  statements, redesign the code until it reads plainly. In markup, where a statement cannot go, an
  Astro template keeps `{condition ? <Unit /> : null}` and a Vue template uses `v-if` / `v-else`.

## Templates

- **No logic in a loop:** an Astro `{items.map(...)}` or a Vue `v-for` reads fields, passes props and
  renders, nothing else. Derive per-item state inside the rendered component, or bake it into the
  data before the loop.
- **No Tailwind class constants:** never store class strings in constants (`CARD_CLASS`). When the
  same classes repeat, extract the component that owns them, with a `tone` or `size` prop where it
  varies.
- **Steppers only show progress:** a stepper takes the current step, and each indicator works out its
  own state from its position. Gating lives in the steps, never in the stepper.

## Strings

- **No hardcoded literal strings in logic.** A literal string goes in a constant, a set of related
  values in an `as const` object, and the types derive from them (see `EVENT_STATUS` below).
- **Copy a user reads is not a constant.** It lives where the site keeps its translations, so Dutch,
  English and Portuguese stay together.

## Comments and JSDoc

- **Every unit has JSDoc,** helpers and utils included: `The {@link name} …` first, then a one-line
  `@description` of what it does, its `@param`s and its `@returns`. An Astro or Vue component puts
  it on its `Props` type.
- **Every step has a short comment** in a function longer than one line. Prefer one comment per
  conditional branch over one per line, put an `else` branch's comment on the line above `} else {`,
  and give a `return` statement one comment for the whole of it.
- **Every comment is one line.** Reasoning, trade-offs and history belong in the plan or the PR, not
  above the code.
- **Never comment markup.** Comments go in the frontmatter or `<script>` only, never in the template.

## Imports

Group them under `// Dependencies`, then `// Components`, then `// Types`.

## Example

`events/constants.ts`:

```ts
/**
 * The {@link EVENT_STATUS} constant
 * @description The states an event can be in
 */
export const EVENT_STATUS = {
  UPCOMING: "upcoming",
  PAST: "past",
} as const;
```

`events/types.ts`:

```ts
// Types
import type { EVENT_STATUS } from "./constants";

/**
 * The {@link EventStatus} type
 * @description One of the {@link EVENT_STATUS} values
 */
export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

/**
 * The {@link EventItem} type
 * @description An event as the list shows it
 */
export type EventItem = {
  id: string;
  title: string;
  startsAt: Date;
};
```

`events/helpers.ts`:

```ts
// Dependencies
import { EVENT_STATUS } from "./constants";

// Types
import type { EventItem, EventStatus } from "./types";

/**
 * The {@link getEventStatus} helper
 * @description Whether an event is still to come
 * @param {EventItem} event - The event to read
 * @param {Date} now - The moment to compare with
 * @returns {EventStatus} Upcoming or past
 */
export function getEventStatus(event: EventItem, now: Date): EventStatus {
  // An event that has not started is upcoming
  if (event.startsAt > now) {
    return EVENT_STATUS.UPCOMING;
  }

  // Any other event is past
  return EVENT_STATUS.PAST;
}
```

`events/EventList.astro`, passing the status down so each card stays thin:

```astro
---
// Dependencies
import { getEventStatus } from "./helpers";

// Components
import EventCard from "./EventCard.astro";

// Types
import type { EventItem } from "./types";

/**
 * The {@link Props} type
 * @description The props of the EventList component, which lists events newest first
 */
type Props = {
  events: EventItem[];
};

// Read the events and the moment the page renders
const { events } = Astro.props;
const now = new Date();

// Bake each event's status into the data before the loop
const rows = events.map((event) => ({ event, status: getEventStatus(event, now) }));
---

<ul>
  {rows.map(({ event, status }) => (
    <EventCard event={event} status={status} />
  ))}
</ul>
```
