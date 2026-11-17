// Dependencies
import { describe, expect, it } from "vitest";
import { keepStandingErrors } from "./helpers";

const FIELDS = ["name", "reach"] as const;

describe("keepStandingErrors", () => {
  it("keeps an error shown at Send while its field is still wrong", () => {
    expect(keepStandingErrors(FIELDS, { name: "missing" }, { name: "missing" }, {})).toEqual({
      name: "missing",
    });
  });

  it("clears an error once its field is fixed", () => {
    expect(keepStandingErrors(FIELDS, { name: "missing" }, {}, {})).toEqual({});
  });

  it("keeps the error as shown even when the kind of mistake changes while typing", () => {
    expect(keepStandingErrors(FIELDS, { reach: "missing" }, { reach: "invalid" }, {})).toEqual({
      reach: "missing",
    });
  });

  it("never adds an error for a field that was fine at Send", () => {
    expect(keepStandingErrors(FIELDS, {}, { name: "missing" }, {})).toEqual({});
  });

  it("keeps an error the server found until the next Send", () => {
    expect(keepStandingErrors(FIELDS, { reach: "invalid" }, {}, { reach: "invalid" })).toEqual({
      reach: "invalid",
    });
  });
});
