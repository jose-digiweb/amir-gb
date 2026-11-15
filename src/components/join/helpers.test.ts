// Checks how the join page marks the fee and keeps the association's name whole.
import { describe, expect, it } from "vitest";
import { keepNameWhole, splitAtFee } from "./helpers";

describe("splitAtFee", () => {
  it("cuts a sentence around the fee", () => {
    expect(splitAtFee("Membership is {fee} a year.", "[FEE]")).toEqual({
      before: "Membership is ",
      fee: "[FEE]",
      after: " a year.",
    });
  });

  it("leaves a sentence without the fee whole", () => {
    expect(splitAtFee("We answer by email.", "[FEE]")).toEqual({
      before: "We answer by email.",
      after: "",
    });
  });
});

describe("keepNameWhole", () => {
  it("joins AMIR-GB across its hyphen and leaves the rest alone", () => {
    expect(keepNameWhole("Welcome to AMIR-GB, {name}", "AMIR-GB")).toBe(
      "Welcome to AMIR-⁠GB, {name}",
    );
  });
});
