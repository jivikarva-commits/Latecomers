export function hasUsableSubscription(subscription, now = Date.now()) {
  if (!subscription || subscription.status !== "active") return false;
  if (subscription.provider !== "razorpay" || !subscription.razorpayPaymentId) return false;

  const expiresAt = subscription.expiresAt ? Date.parse(subscription.expiresAt) : null;
  return !Number.isFinite(expiresAt) || expiresAt > now;
}
