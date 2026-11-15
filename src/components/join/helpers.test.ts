// Checks how the join page marks the fee and keeps the association's name whole.
import { describe, expect, it } from "vitest";
import { getSeats, keepNameWhole, splitAtFee } from "./helpers";

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

describe("getSeats", () => {
  it("tints the seats in turn from the top and marks the open one", () => {
    const seats = getSeats(
      { centreX: 100, centreY: 100, size: 50 },
      { radius: 50, size: 20, places: [0, 1, 2, 3, 4], open: 4 },
    );
    expect(seats.map((seat) => seat.tint)).toEqual(["gold", "forest", "brick", "navy", "gold"]);
    expect(seats[0]).toMatchObject({ x: 100, y: 50, isOpen: false });
    expect(seats[4]?.isOpen).toBe(true);
  });
});
