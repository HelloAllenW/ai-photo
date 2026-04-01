import "dotenv/config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const remotePatterns = [];

if (supabaseUrl) {
  try {
    const parsedSupabaseUrl = new URL(supabaseUrl);
    remotePatterns.push({
      protocol: parsedSupabaseUrl.protocol.replace(":", ""),
      hostname: parsedSupabaseUrl.hostname,
      pathname: "/storage/v1/object/public/**",
    });
  } catch {}
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
