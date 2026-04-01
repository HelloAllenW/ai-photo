export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

export function getSupabaseHostname() {
  try {
    return new URL(getSupabaseUrl()).hostname;
  } catch {
    return "";
  }
}

export function getStorageBucketName() {
  return process.env.SUPABASE_STORAGE_BUCKET || "ai-images";
}

export function getCreemProductId() {
  return process.env.CREEM_PRODUCT_ID || "";
}

export function getReplicateModel() {
  return process.env.REPLICATE_MODEL || "black-forest-labs/flux-kontext-dev";
}
