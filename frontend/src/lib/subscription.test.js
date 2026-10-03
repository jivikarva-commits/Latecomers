import { hasUsableSubscription } from "./subscription";

const paid = {
  status: "active",
  provider: "razorpay",
  razorpayPaymentId: "pay_test",
};

test("only treats verified, unexpired Razorpay subscriptions as usable", () => {
  const now = Date.parse("2026-10-03T00:00:00Z");
  expect(hasUsableSubscription(paid, now)).toBe(true);
  expect(hasUsableSubscription({ ...paid, razorpayPaymentId: "" }, now)).toBe(false);
  expect(hasUsableSubscription({ ...paid, expiresAt: "2026-10-02T23:59:59Z" }, now)).toBe(false);
  expect(hasUsableSubscription({ ...paid, expiresAt: "2026-10-04T00:00:00Z" }, now)).toBe(true);
});
