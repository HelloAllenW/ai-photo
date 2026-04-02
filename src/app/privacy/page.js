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
          This Privacy Policy explains how AI Tool Studio collects, uses,
          stores, and shares information when you access the website, create an
          account, purchase a subscription, upload reference images, or
          generate AI images.
        </p>

        <section className={styles.section}>
          <h2>Data we collect</h2>
          <ul>
            <li>Account information such as your email address and authentication identifiers</li>
            <li>Billing-related information such as subscription status, plan ID, and transaction metadata</li>
            <li>Generation inputs including prompts, selected styles, and uploaded reference images</li>
            <li>Generation outputs, download history, timestamps, and usage records</li>
            <li>Technical information such as IP address, browser type, device details, and log data</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>How we use information</h2>
          <ul>
            <li>To authenticate users and maintain account access</li>
            <li>To process prompts and generate images requested by users</li>
            <li>To store generation history and make previous outputs available for download</li>
            <li>To enforce free-tier limits, subscription entitlements, and account security</li>
            <li>To operate support, fraud prevention, abuse detection, and legal compliance workflows</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Third-party processors</h2>
          <p>
            AI Tool Studio uses third-party providers to operate core features.
            Supabase is used for authentication, database, and file storage.
            Replicate is used to process AI image generation requests. Creem is
            used as the merchant of record for subscription checkout and billing
            operations. These providers may process the information necessary to
            deliver their parts of the service.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Data retention</h2>
          <p>
            We retain account, billing, and generation data for as long as it is
            reasonably needed to operate the service, comply with legal
            obligations, resolve disputes, and enforce our agreements. We may
            delete or anonymize information when it is no longer required.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Contact</h2>
          <p>
            If you have questions about this Privacy Policy or want to request
            account-related support, contact{" "}
            <a href="mailto:allenwhl0815@gmail.com">allenwhl0815@gmail.com</a>.
          </p>
        </section>

        <div className={styles.links}>
          <Link href="/">Back to home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/refund">Refund Policy</Link>
        </div>
      </main>
    </div>
  );
}
