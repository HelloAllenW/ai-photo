import crypto from "node:crypto";

const CREEM_LIVE_API = "https://api.creem.io/v1";
const CREEM_TEST_API = "https://test-api.creem.io/v1";

export function getCreemApiBaseUrl() {
  return process.env.CREEM_MODE === "live" ? CREEM_LIVE_API : CREEM_TEST_API;
}

export function hasCreemEnv() {
  return Boolean(
    process.env.CREEM_API_KEY &&
      process.env.CREEM_WEBHOOK_SECRET &&
      process.env.CREEM_PRODUCT_ID,
  );
}

export function verifyCreemSignature(payload, signature) {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.CREEM_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  return signature === expectedSignature;
}

export function verifyCreemRedirectSignature(params) {
  const signature = params.signature;

  if (!signature || !process.env.CREEM_API_KEY) {
    return false;
  }

  const sortedParams = Object.entries(params)
    .filter(([key, value]) => key !== "signature" && value !== null && value !== undefined)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.CREEM_API_KEY)
    .update(sortedParams)
    .digest("hex");

  return signature === expectedSignature;
}

export function mapSubscriptionStatus(eventType, object) {
  if (object?.status) {
    return object.status;
  }

  const statusMap = {
    "checkout.completed": object?.subscription?.status || "paid",
    "subscription.active": "active",
    "subscription.trialing": "trialing",
    "subscription.paid": "paid",
    "subscription.canceled": "canceled",
    "subscription.expired": "expired",
    "subscription.paused": "paused",
    "subscription.unpaid": "unpaid",
    "subscription.incomplete": "incomplete",
    "subscription.past_due": "past_due",
    "subscription.scheduled_cancel": "scheduled_cancel",
    "subscription.update": "active",
  };

  return statusMap[eventType] || "free";
}

export function isActiveSubscriptionStatus(status) {
  return ["active", "trialing", "paid", "scheduled_cancel"].includes(status);
}
