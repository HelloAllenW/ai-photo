import Link from "next/link";
import { FaBolt, FaCheckCircle, FaCrown, FaRocket, FaSignOutAlt } from "react-icons/fa";
import styles from "@/app/page.module.css";

export default function AccountStatusCard({
  loading,
  envReady,
  session,
  profile,
  isSubscribed,
  freeRemaining,
  checkoutLoading,
  onSubscribe,
  onSignOut,
  message,
}) {
  return (
    <section className={styles.statusCard}>
      <div className={styles.statusHeader}>
        <div>
          <p className={styles.cardLabel}>Account status</p>
          <h2>
            {loading
              ? "Loading account..."
              : session?.user
                ? `Signed in as ${session.user.email}`
                : "Not signed in"}
          </h2>
        </div>
        {session?.user ? (
          <button className={styles.ghostButton} type="button" onClick={onSignOut}>
            <FaSignOutAlt />
            Sign out
          </button>
        ) : null}
      </div>

      {!envReady ? (
        <p className={styles.cardText}>
          Add Supabase and Creem environment variables to `.env.local`
          before testing billing.
        </p>
      ) : null}

      {envReady && !session?.user && !loading ? (
        <div className={styles.subscriptionState}>
          <p className={styles.cardText}>
            Log in first to start a subscription and sync billing to your
            Supabase profile.
          </p>
          <Link className={styles.primary} href="/login">
            <FaRocket />
            Go to login
          </Link>
        </div>
      ) : null}

      {envReady && session?.user && !loading ? (
        <div className={styles.subscriptionState}>
          {isSubscribed ? (
            <>
              <div className={styles.subscriptionBadge}>
                <FaCheckCircle />
                Subscription active
              </div>
              <p className={styles.cardText}>订阅有效 + 可生成无限次</p>
              <p className={styles.metaText}>
                Current status: {profile?.subscription_status} · Plan ID:{" "}
                {profile?.plan_id || "unknown"}
              </p>
            </>
          ) : (
            <>
              <div className={styles.subscriptionBadge}>
                <FaBolt />
                Free plan
              </div>
              <p className={styles.cardText}>免费次数剩余 {freeRemaining} 次</p>
              <button
                className={styles.primary}
                type="button"
                onClick={onSubscribe}
                disabled={checkoutLoading}
              >
                <FaCrown />
                {checkoutLoading ? "Opening checkout..." : "订阅"}
              </button>
            </>
          )}
        </div>
      ) : null}

      {message ? <p className={styles.message}>{message}</p> : null}
    </section>
  );
}
