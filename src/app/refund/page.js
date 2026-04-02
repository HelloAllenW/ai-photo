import Link from "next/link";
import styles from "@/app/legal.module.css";
import { createMetadata, siteConfig } from "@/lib/site";

export const revalidate = 3600;

export const metadata = createMetadata({
  title: siteConfig.refundTitle,
  description: siteConfig.refundDescription,
  pathname: "/refund",
});

export default function RefundPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <span className={styles.eyebrow}>Refund Policy</span>
        <h1 className={styles.title}>Subscription refunds and cancellations</h1>
        <p className={styles.description}>
          This Refund Policy explains how AI Tool Studio handles subscription
          cancellations, billing issues, and refund requests for digital
          services purchased through Creem.
        </p>

        <section className={styles.section}>
          <h2>Cancellations</h2>
          <p>
            Users may cancel their subscription to prevent future renewals.
            Access remains active until the end of the current billing period
            unless otherwise required by law.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Refund requests</h2>
          <p>
            Because AI Tool Studio provides immediate access to digital features
            and generated outputs, refunds are generally handled on a
            case-by-case basis. Duplicate charges, technical billing errors, and
            accidental renewals reported promptly are the strongest candidates
            for review.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Non-refundable situations</h2>
          <ul>
            <li>Failure to cancel before the next billing date</li>
            <li>Change of mind after successful use of the paid service</li>
            <li>Refund requests made without sufficient billing details</li>
            <li>Policy violations, abuse, or account restrictions caused by misuse</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>How to request help</h2>
          <p>
            Contact <a href="mailto:allenwhl0815@gmail.com">allenwhl0815@gmail.com</a>{" "}
            with the email used for your subscription, the charge date, and a
            short explanation of the issue.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Merchant of record</h2>
          <p>
            Subscription checkout is processed by Creem as the merchant of
            record. Refund outcomes may also depend on Creem&apos;s payment,
            chargeback, and compliance rules.
          </p>
        </section>

        <div className={styles.links}>
          <Link href="/">Back to home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/acceptable-use">Acceptable Use Policy</Link>
        </div>
      </main>
    </div>
  );
}
