// Dependencies
import { describe, expect, it } from "vitest";
import { getCheckoutParams } from "./checkout";
import { DONATE_ERROR, FREQUENCY, GIFT_STATE } from "./constants";
import {
  checkAmount,
  fillAmount,
  formatAmount,
  getChoiceLabel,
  getChosenAmount,
  getReturnUrls,
  getSessionState,
  getWhatsAppShareHref,
  parseAmount,
  readGiftReturn,
} from "./helpers";
import { DONATE_INPUT } from "./schema";

const PAGE = "https://amir.example/en/";

describe("parseAmount", () => {
  it("reads whole euros, with or without a euro sign and spaces", () => {
    expect(parseAmount("25")).toBe(2500);
    expect(parseAmount("€ 40")).toBe(4000);
  });

  it("reads cents after a comma or a dot", () => {
    expect(parseAmount("12,50")).toBe(1250);
    expect(parseAmount("12.5")).toBe(1250);
    expect(parseAmount("0,50")).toBe(50);
  });

  it("reads thousands grouped with a dot or a comma", () => {
    expect(parseAmount("1.000")).toBe(100000);
    expect(parseAmount("1,000")).toBe(100000);
    expect(parseAmount("1.000,25")).toBe(100025);
  });

  it("returns null for text that is not an amount", () => {
    expect(parseAmount("")).toBeNull();
    expect(parseAmount("abc")).toBeNull();
    expect(parseAmount("12,")).toBeNull();
    expect(parseAmount("12.5000")).toBeNull();
    expect(parseAmount("-5")).toBeNull();
  });
});

describe("checkAmount", () => {
  it("accepts gifts from €1 to €10,000", () => {
    expect(checkAmount(100)).toBeUndefined();
    expect(checkAmount(1_000_000)).toBeUndefined();
  });

  it("refuses no amount and amounts under €1", () => {
    expect(checkAmount(null)).toBe(DONATE_ERROR.TOO_SMALL);
    expect(checkAmount(99)).toBe(DONATE_ERROR.TOO_SMALL);
  });

  it("refuses amounts over €10,000", () => {
    expect(checkAmount(1_000_001)).toBe(DONATE_ERROR.TOO_LARGE);
  });
});

describe("getChosenAmount", () => {
  it("takes the typed amount over the preset", () => {
    expect(getChosenAmount("25", "40")).toBe(4000);
  });

  it("takes the preset when nothing is typed", () => {
    expect(getChosenAmount("25", "  ")).toBe(2500);
    expect(getChosenAmount("25", null)).toBe(2500);
  });

  it("returns null when neither is given", () => {
    expect(getChosenAmount(null, "")).toBeNull();
  });
});

describe("formatAmount", () => {
  // Intl separates the euro sign with a no-break space in Dutch and Portuguese
  it("writes whole euros without cents in each language", () => {
    expect(formatAmount("en", 2500)).toBe("€25");
    expect(formatAmount("nl", 2500)).toBe("€\u00a025");
    expect(formatAmount("pt", 2500)).toBe("25\u00a0€");
  });

  it("writes other amounts with two decimals", () => {
    expect(formatAmount("nl", 1250)).toBe("€\u00a012,50");
  });
});

describe("fillAmount", () => {
  it("puts the amount where the copy marks it", () => {
    expect(fillAmount("Donate {amount} a month", "€25")).toBe("Donate €25 a month");
  });
});

describe("getChoiceLabel", () => {
  it("repeats the amount, with a month for a monthly gift", () => {
    const once = { frequency: FREQUENCY.ONCE, amountCents: 1250 };
    const monthly = { frequency: FREQUENCY.MONTHLY, amountCents: 2500 };
    expect(getChoiceLabel("en", once, "Donate {amount}", "Donate {amount} a month")).toBe(
      "Donate €12.50",
    );
    expect(getChoiceLabel("en", monthly, "Donate {amount}", "Donate {amount} a month")).toBe(
      "Donate €25 a month",
    );
  });
});

describe("readGiftReturn", () => {
  it("reads a Checkout Session id", () => {
    expect(readGiftReturn(new URL(`${PAGE}?gift=cs_test_123`))).toEqual({
      sessionId: "cs_test_123",
    });
  });

  it("reads a stopped return with a valid choice", () => {
    const url = new URL(`${PAGE}?gift=stopped&frequency=monthly&amount=2500`);
    expect(readGiftReturn(url)).toEqual({
      stopped: { frequency: FREQUENCY.MONTHLY, amountCents: 2500 },
    });
  });

  it("ignores a stopped return whose choice is not valid", () => {
    expect(readGiftReturn(new URL(`${PAGE}?gift=stopped&frequency=yearly&amount=2500`))).toBe(
      undefined,
    );
    expect(readGiftReturn(new URL(`${PAGE}?gift=stopped&frequency=once&amount=5`))).toBe(undefined);
    expect(readGiftReturn(new URL(`${PAGE}?gift=stopped&frequency=once&amount=12.5`))).toBe(
      undefined,
    );
  });

  it("ignores pages that are not a return", () => {
    expect(readGiftReturn(new URL(PAGE))).toBeUndefined();
    expect(readGiftReturn(new URL(`${PAGE}?gift=hello`))).toBeUndefined();
  });
});

describe("getSessionState", () => {
  const session = {
    mode: "payment",
    status: "complete",
    paymentStatus: "paid",
    amountTotal: 2500,
  };

  it("shows a paid one-off gift", () => {
    expect(getSessionState(session)).toEqual({ state: GIFT_STATE.PAID, amountCents: 2500 });
  });

  it("shows a paid monthly gift", () => {
    expect(getSessionState({ ...session, mode: "subscription" })).toEqual({
      state: GIFT_STATE.PAID_MONTHLY,
      amountCents: 2500,
    });
  });

  it("shows a monthly gift as started while its first SEPA debit waits", () => {
    expect(getSessionState({ ...session, mode: "subscription", paymentStatus: "unpaid" })).toEqual({
      state: GIFT_STATE.PAID_MONTHLY,
      amountCents: 2500,
    });
  });

  it("shows a gift the bank still has to confirm", () => {
    expect(getSessionState({ ...session, paymentStatus: "unpaid" })).toEqual({
      state: GIFT_STATE.PROCESSING,
      amountCents: 2500,
    });
  });

  it("shows a session that did not complete as failed", () => {
    expect(getSessionState({ ...session, status: "open" })).toEqual({ state: GIFT_STATE.FAILED });
    expect(getSessionState({ ...session, status: "expired" })).toEqual({
      state: GIFT_STATE.FAILED,
    });
    expect(getSessionState({ ...session, amountTotal: null })).toEqual({
      state: GIFT_STATE.FAILED,
    });
  });
});

describe("getReturnUrls", () => {
  it("sends the donor back to Support with the session, or with their choice when they stop", () => {
    expect(getReturnUrls(PAGE, { frequency: FREQUENCY.ONCE, amountCents: 4000 })).toEqual({
      success: `${PAGE}?gift={CHECKOUT_SESSION_ID}#support`,
      cancel: `${PAGE}?gift=stopped&frequency=once&amount=4000#support`,
    });
  });
});

describe("getWhatsAppShareHref", () => {
  it("opens WhatsApp with the message and the address", () => {
    const href = new URL(getWhatsAppShareHref("Give too:", PAGE));
    expect(href.origin).toBe("https://wa.me");
    expect(href.searchParams.get("text")).toBe(`Give too: ${PAGE}`);
  });
});

describe("getCheckoutParams", () => {
  it("makes a one-off gift a payment that says Donate, in the page's language", () => {
    const params = getCheckoutParams({ frequency: FREQUENCY.ONCE, amountCents: 2500 }, "nl", PAGE);
    expect(params.mode).toBe("payment");
    expect(params.submit_type).toBe("donate");
    expect(params.locale).toBe("nl");
    expect(params.line_items).toEqual([
      { quantity: 1, price_data: { currency: "eur", product: "amir_gb_gift", unit_amount: 2500 } },
    ]);
  });

  it("makes a monthly gift a subscription that repeats every month", () => {
    const params = getCheckoutParams(
      { frequency: FREQUENCY.MONTHLY, amountCents: 1000 },
      "pt",
      PAGE,
    );
    expect(params.mode).toBe("subscription");
    expect(params.submit_type).toBeUndefined();
    expect(params.locale).toBe("pt");
    expect(params.line_items?.[0]?.price_data?.recurring).toEqual({ interval: "month" });
  });

  it("leaves the payment methods to the Stripe Dashboard", () => {
    const params = getCheckoutParams({ frequency: FREQUENCY.ONCE, amountCents: 2500 }, "en", PAGE);
    expect(params).not.toHaveProperty("payment_method_types");
  });
});

describe("DONATE_INPUT", () => {
  it("turns a posted form into a choice and a language", () => {
    const result = DONATE_INPUT.safeParse({
      frequency: "monthly",
      amount: "25",
      other: null,
      locale: "en",
    });
    expect(result.success && result.data).toEqual({
      choice: { frequency: FREQUENCY.MONTHLY, amountCents: 2500 },
      locale: "en",
    });
  });

  it("reports an amount that cannot be given on the typed field", () => {
    const small = DONATE_INPUT.safeParse({ frequency: "once", other: "0,50", locale: "nl" });
    const large = DONATE_INPUT.safeParse({ frequency: "once", other: "20.000", locale: "nl" });
    expect(small.error?.issues[0]).toMatchObject({ path: ["other"], message: "too-small" });
    expect(large.error?.issues[0]).toMatchObject({ path: ["other"], message: "too-large" });
  });

  it("refuses a frequency or language the site does not have", () => {
    expect(
      DONATE_INPUT.safeParse({ frequency: "yearly", amount: "25", locale: "nl" }).success,
    ).toBe(false);
    expect(DONATE_INPUT.safeParse({ frequency: "once", amount: "25", locale: "fr" }).success).toBe(
      false,
    );
  });
});
