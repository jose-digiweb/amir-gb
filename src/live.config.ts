// EmDash content, served through Astro's live collections. Boilerplate from EmDash; do not add
// collections here. The content model lives in EmDash's database and seed, not in code.
import { defineLiveCollection } from "astro:content";
import { emdashLoader } from "emdash/runtime";

export const collections = {
  _emdash: defineLiveCollection({ loader: emdashLoader() }),
};
