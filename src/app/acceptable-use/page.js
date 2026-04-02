import Link from "next/link";
import styles from "@/app/legal.module.css";
import { createMetadata, siteConfig } from "@/lib/site";

export const revalidate = 3600;

export const metadata = createMetadata({
  title: siteConfig.acceptableUseTitle,
  description: siteConfig.acceptableUseDescription,
  pathname: "/acceptable-use",
});

export default function AcceptableUsePage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <span className={styles.eyebrow}>Acceptable Use Policy</span>
        <h1 className={styles.title}>Rules for prompts, uploads, and outputs</h1>
        <p className={styles.description}>
          AI Tool Studio is designed for legitimate creative and commercial
          image-generation use. You may not use the service in ways that are
          illegal, abusive, deceptive, or harmful to others.
        </p>

        <section className={styles.section}>
          <h2>Prohibited uses</h2>
          <ul>
            <li>Illegal, abusive, hateful, or sexually exploitative content</li>
            <li>Deepfakes or impersonation intended to deceive or harm others</li>
            <li>Copyright infringement or unauthorized use of protected material</li>
            <li>Content involving minors in sexualized or exploitative contexts</li>
            <li>Violence, harassment, malware, fraud, or other harmful activity</li>
            <li>Attempts to generate content that violates payment, platform, or AI provider policies</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>User responsibility</h2>
          <ul>
            <li>Only upload images you have the right to use</li>
            <li>Review generated outputs before publishing or sharing them</li>
            <li>Comply with local laws and platform rules in your jurisdiction</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Enforcement</h2>
          <p>
            AI Tool Studio may block prompts, suspend accounts, cancel
            subscriptions, or report activity when we believe the service is
            being used in violation of this policy, our terms, or applicable
            law.
          </p>
        </section>

        <div className={styles.links}>
          <Link href="/">Back to home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/refund">Refund Policy</Link>
        </div>
      </main>
    </div>
  );
}
