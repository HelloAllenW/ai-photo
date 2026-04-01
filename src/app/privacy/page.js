import Link from "next/link";
import styles from "@/app/legal.module.css";
import { createMetadata, siteConfig } from "@/lib/site";

export const revalidate = 3600;

export const metadata = createMetadata({
  title: siteConfig.privacyTitle,
  description: siteConfig.privacyDescription,
  pathname: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <span className={styles.eyebrow}>Privacy Policy</span>
        <h1 className={styles.title}>How AI Tool Studio handles data</h1>
        <p className={styles.description}>
          This policy explains what data AI Tool Studio stores to provide
          authentication, billing, image generation, and generation history.
        </p>

        <section className={styles.section}>
          <h2>Data we collect</h2>
          <ul>
            <li>Authentication data provided through Supabase Auth</li>
            <li>Email address and basic account identifiers</li>
            <li>Generation prompts, selected styles, and timestamps</li>
            <li>Generated images and uploaded reference images needed for processing</li>
            <li>Subscription status and plan identifiers returned by Creem</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>How the data is used</h2>
          <ul>
            <li>To sign users in and maintain account sessions</li>
            <li>To generate AI images and save them in user history</li>
            <li>To enforce free-tier limits and subscription access</li>
            <li>To process billing events and update subscription records</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Third-party services</h2>
          <p>
            AI Tool Studio relies on Supabase for authentication, database, and
            storage, Replicate for AI image generation, and Creem for checkout
            and subscription billing. Each provider may process data necessary
            to deliver its service.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Contact and requests</h2>
          <p>
            Before launch, replace this section with your business contact email
            and any region-specific privacy disclosures required for your
            audience.
          </p>
        </section>

        <div className={styles.links}>
          <Link href="/">Back to home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </main>
    </div>
  );
}
