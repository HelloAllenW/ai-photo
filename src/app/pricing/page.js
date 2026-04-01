import Link from "next/link";
import styles from "@/app/legal.module.css";
import { createMetadata, siteConfig } from "@/lib/site";

export const revalidate = 3600;

export const metadata = createMetadata({
  title: siteConfig.pricingTitle,
  description: siteConfig.pricingDescription,
  pathname: "/pricing",
});

export default function PricingPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <span className={styles.eyebrow}>Pricing</span>
        <h1 className={styles.title}>Simple pricing for AI image creation</h1>
        <p className={styles.description}>
          AI Tool Studio offers one free trial generation so visitors can test
          the workflow, then an unlimited paid plan for ongoing image creation.
        </p>

        <section className={styles.section}>
          <h2>Free</h2>
          <ul>
            <li>1 total AI image generation</li>
            <li>Prompt input, style presets, and optional reference image</li>
            <li>Generated image saved to history and available for download</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Pro Subscription</h2>
          <ul>
            <li>Unlimited image generations while subscription is active</li>
            <li>Access to the same generation styles and history tracking</li>
            <li>Hosted checkout and subscription status syncing through Creem</li>
          </ul>
          <p>
            Final pricing is managed in Creem and can be updated by replacing
            the configured product ID in the environment variables.
          </p>
        </section>

        <div className={styles.links}>
          <Link href="/">Back to home</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </main>
    </div>
  );
}
