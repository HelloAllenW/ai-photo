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
          These Terms of Service govern your access to AI Tool Studio and apply
          when you browse the website, create an account, generate images, or
          purchase a subscription.
        </p>

        <section className={styles.section}>
          <h2>Accounts and access</h2>
          <ul>
            <li>You must provide accurate information and keep your login credentials secure</li>
            <li>You are responsible for activity that occurs under your account</li>
            <li>We may suspend or terminate access where we detect abuse, fraud, or policy violations</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Plans and subscriptions</h2>
          <ul>
            <li>The free plan includes one total image generation per account</li>
            <li>Paid subscriptions provide unlimited generations while the subscription remains active</li>
            <li>Subscription billing, renewals, cancellations, and payment processing are handled by Creem</li>
            <li>Prices may change in the future, but changes will not retroactively alter completed billing periods</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Acceptable use</h2>
          <ul>
            <li>Do not upload unlawful, abusive, infringing, or deceptive content</li>
            <li>Do not use the service to create harmful deepfakes, impersonation, or exploitative material</li>
            <li>Do not attempt to bypass limits, reverse engineer the service, or interfere with platform security</li>
            <li>You are responsible for ensuring your prompts, uploads, and outputs comply with applicable law</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Billing and refunds</h2>
          <p>
            Subscription checkout is processed by Creem as merchant of record.
            Refund requests are reviewed under our Refund Policy and may also be
            subject to Creem&apos;s payment and compliance requirements.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Generated content</h2>
          <p>
            You retain responsibility for how you use generated outputs. AI Tool
            Studio does not guarantee that generated content is accurate,
            non-infringing, fit for a particular purpose, or suitable for
            commercial use in every jurisdiction.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Service changes and disclaimers</h2>
          <p>
            AI Tool Studio may update, suspend, or discontinue features at any
            time. The service is provided on an &quot;as is&quot; and &quot;as available&quot;
            basis to the maximum extent permitted by law.
          </p>
        </section>

        <div className={styles.links}>
          <Link href="/">Back to home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/refund">Refund Policy</Link>
        </div>
      </main>
    </div>
  );
}
