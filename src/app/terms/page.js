import Link from "next/link";
import styles from "@/app/legal.module.css";
import { createMetadata, siteConfig } from "@/lib/site";

export const revalidate = 3600;

export const metadata = createMetadata({
  title: siteConfig.termsTitle,
  description: siteConfig.termsDescription,
  pathname: "/terms",
});

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <span className={styles.eyebrow}>Terms of Service</span>
        <h1 className={styles.title}>Rules for using AI Tool Studio</h1>
        <p className={styles.description}>
          These terms describe how users may access AI Tool Studio, what is
          included in the free and paid plans, and the responsibilities attached
          to generated content.
        </p>

        <section className={styles.section}>
          <h2>Service access</h2>
          <ul>
            <li>Users must sign in to generate images or access history</li>
            <li>The free tier includes 1 total generation per user account</li>
            <li>Paid subscriptions allow unlimited generations while active</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Acceptable use</h2>
          <ul>
            <li>Do not upload unlawful, abusive, or infringing content</li>
            <li>Do not attempt to disrupt the service or bypass usage limits</li>
            <li>Use generated outputs in compliance with applicable laws and platform policies</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Billing and refunds</h2>
          <p>
            Subscription checkout and recurring billing are handled by Creem.
            Refunds, cancellations, and billing disputes should follow the
            policies configured in your Creem account and any customer-facing
            billing terms you publish.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Changes to the service</h2>
          <p>
            AI Tool Studio may change, suspend, or discontinue features, limits,
            or pricing as the product evolves. Replace this starter language
            with your final legal review before launch.
          </p>
        </section>

        <div className={styles.links}>
          <Link href="/">Back to home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
      </main>
    </div>
  );
}
