export const FREE_IMAGE_LIMIT = 1;
export const ACTIVE_SUBSCRIPTION_STATUSES = [
  "active",
  "trialing",
  "paid",
  "scheduled_cancel",
];

export function isSubscribedStatus(status) {
  return ACTIVE_SUBSCRIPTION_STATUSES.includes(status);
}
