import { getSiteUrl } from "./env";

export const siteConfig = {
  name: "AI Tool Studio",
  defaultTitle: "AI Tool Studio | AI Image Generator",
  description:
    "Generate AI images with style presets, track history, and unlock unlimited generations with subscription access.",
  pricingTitle: "Pricing | AI Tool Studio",
  pricingDescription:
    "View the free trial and subscription plan for AI Tool Studio AI image generation.",
  privacyTitle: "Privacy Policy | AI Tool Studio",
  privacyDescription:
    "Learn how AI Tool Studio stores authentication, generation, and billing data.",
  termsTitle: "Terms of Service | AI Tool Studio",
  termsDescription:
    "Review the terms for using AI Tool Studio, including free-tier limits and subscriptions.",
  refundTitle: "Refund Policy | AI Tool Studio",
  refundDescription:
    "Review the refund and cancellation policy for AI Tool Studio subscriptions.",
  acceptableUseTitle: "Acceptable Use Policy | AI Tool Studio",
  acceptableUseDescription:
    "Read the rules for acceptable prompts, uploads, and generated content in AI Tool Studio.",
  loginTitle: "Login | AI Tool Studio",
  loginDescription:
    "Sign in with Google, GitHub, or Magic Link to generate and manage AI images.",
  billingTitle: "Payment Success | AI Tool Studio",
  billingDescription:
    "Subscription checkout completed for AI Tool Studio. Return to your workspace to continue generating images.",
};

export function createMetadata({
  title,
  description,
  pathname = "/",
}) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${pathname}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "zh_CN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
