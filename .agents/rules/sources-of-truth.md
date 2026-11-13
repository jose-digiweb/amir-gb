# Sources of truth

- **Designs answer to the code and the design system, strictly.** Before building a design, one an
  agent drew included, check it against the code and the design system's README and list the gaps.
  Behaviour follows what the site really does: where a design shows something the code cannot do
  truthfully, the design adapts. Visuals come from the design system (its fonts, tokens and rules),
  which overrides the design and never the other way round: say where the build follows the design
  system instead of the design.
- **The design system grows by agreement.** When a design really needs something the design system
  lacks (a token, a variant, a component), propose it to jose: what it is, why it belongs in the
  design system rather than the feature, and what the build does without it. He decides. Once
  agreed, it lands in the design system artifact with its doc, and is copied here, before any
  feature uses it. Never add one on your own, and never write one into a plan as settled.
- **Read the design system's docs first.** Before touching colour, surfaces, elevation, type,
  motion or accessibility, read the part of the design system's README that owns it. The README
  holds the rules, and the token files hold the values.
- **Use the flows we have.** Where a design mocks something the site or its stack already does
  (Stripe Checkout, EmDash content, the language switch), compose the real one in. Build only the
  design's own UI.
