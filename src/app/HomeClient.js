"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AccountStatusCard from "@/components/home/AccountStatusCard";
import GeneratorSection from "@/components/home/GeneratorSection";
import HistorySection from "@/components/home/HistorySection";
import { STYLE_OPTIONS } from "@/lib/image-generation";
import { getSupabaseClient, hasSupabaseEnv } from "@/lib/supabase";
import { FREE_IMAGE_LIMIT, isSubscribedStatus } from "@/lib/subscription";
import styles from "./page.module.css";

export default function HomeClient() {
  const envReady = hasSupabaseEnv();
  const supabase = useMemo(
    () => (envReady ? getSupabaseClient() : null),
    [envReady],
  );
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(envReady);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [usageCount, setUsageCount] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(STYLE_OPTIONS[0].value);
  const [referenceImage, setReferenceImage] = useState(null);
  const [referenceImageName, setReferenceImageName] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(
    async (userId) => {
      if (!supabase || !userId) {
        setHistory([]);
        return;
      }

      const { data, error } = await supabase
        .from("image_generations")
        .select("id, style, created_at, image_url")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
        return;
      }

      setHistory(data || []);
    },
    [supabase],
  );

  const syncProfile = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    setSession(currentSession);

    if (!currentSession?.user) {
      setProfile(null);
      setUsageCount(0);
      setHistory([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("subscription_status, plan_id")
      .eq("id", currentSession.user.id)
      .maybeSingle();

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data) {
      const { data: insertedProfile, error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: currentSession.user.id,
          subscription_status: "free",
          plan_id: null,
        })
        .select("subscription_status, plan_id")
        .single();

      if (upsertError) {
        setMessage(upsertError.message);
        setLoading(false);
        return;
      }

      setProfile(insertedProfile);
    } else {
      setProfile(data);
    }

    const { count, error: usageError } = await supabase
      .from("image_generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", currentSession.user.id);

    if (usageError) {
      setMessage(usageError.message);
      setLoading(false);
      return;
    }

    setUsageCount(count || 0);
    await loadHistory(currentSession.user.id);
    setLoading(false);
  }, [loadHistory, supabase]);

  useEffect(() => {
    syncProfile();
  }, [syncProfile]);

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      syncProfile();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, syncProfile]);

  useEffect(() => {
    function handleBillingMessage(event) {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === "creem-checkout-success") {
        setMessage("Payment completed. Syncing subscription status...");
        syncProfile();

        const intervalId = window.setInterval(() => {
          syncProfile();
        }, 2000);

        window.setTimeout(() => {
          window.clearInterval(intervalId);
        }, 15000);
      }
    }

    window.addEventListener("message", handleBillingMessage);
    return () => window.removeEventListener("message", handleBillingMessage);
  }, [syncProfile]);

  async function handleSubscribe() {
    if (!supabase || !session?.access_token) {
      setMessage("Please sign in before starting a subscription.");
      return;
    }

    setCheckoutLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/creem/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to create checkout session.");
      }

      const popup = window.open(
        payload.checkoutUrl,
        "creem-checkout",
        "popup=yes,width=540,height=760",
      );

      if (!popup) {
        window.location.href = payload.checkoutUrl;
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setMessage("");
  }

  async function handleReferenceImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setReferenceImage(null);
      setReferenceImageName("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReferenceImage(reader.result);
      setReferenceImageName(file.name);
    };
    reader.readAsDataURL(file);
  }

  async function handleGenerate() {
    if (!supabase || !session?.access_token) {
      setMessage("Please sign in before generating images.");
      return;
    }

    if (!prompt.trim()) {
      setMessage("Please enter a prompt before generating.");
      return;
    }

    setGenerating(true);
    setMessage("");

    try {
      const response = await fetch("/api/images/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prompt,
          style,
          referenceImage,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to generate image.");
      }

      setGeneratedImageUrl(payload.imageUrl);
      setUsageCount(payload.usageCount);
      setProfile((currentProfile) => ({
        subscription_status:
          payload.subscriptionStatus || currentProfile?.subscription_status || "free",
        plan_id: payload.planId || currentProfile?.plan_id || null,
      }));
      setHistory((currentHistory) =>
        payload.historyItem
          ? [
              payload.historyItem,
              ...currentHistory.filter((item) => item.id !== payload.historyItem.id),
            ]
          : currentHistory,
      );

      if (payload.isSubscribed) {
        setMessage(
          "Image generated successfully. Your subscription includes unlimited generations.",
        );
      } else {
        setMessage(
          `Image generated successfully. Free generations remaining: ${payload.remaining}.`,
        );
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setGenerating(false);
    }
  }

  function formatDateTime(value) {
    if (!value) {
      return "";
    }

    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  const isSubscribed = isSubscribedStatus(profile?.subscription_status);
  const freeRemaining = Math.max(FREE_IMAGE_LIMIT - usageCount, 0);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Supabase Auth + Creem Billing</span>
          <h1>AI Tool Studio</h1>
          <p className={styles.description}>
            Create styled AI images from prompts and optional reference photos,
            keep a downloadable history, and unlock unlimited generations with
            a subscription.
          </p>
          <div className={styles.heroMeta}>
            <span>Free trial: 1 image</span>
            <span>Paid plan: unlimited generations</span>
            <span>Auth, billing, storage, and history included</span>
          </div>
          <div className={styles.quickLinks}>
            <Link href="/pricing">Pricing</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </section>

        <AccountStatusCard
          loading={loading}
          envReady={envReady}
          session={session}
          profile={profile}
          isSubscribed={isSubscribed}
          freeRemaining={freeRemaining}
          checkoutLoading={checkoutLoading}
          onSubscribe={handleSubscribe}
          onSignOut={handleSignOut}
          message={message}
        />

        <GeneratorSection
          isSubscribed={isSubscribed}
          freeRemaining={freeRemaining}
          prompt={prompt}
          setPrompt={setPrompt}
          style={style}
          setStyle={setStyle}
          onReferenceImageChange={handleReferenceImageChange}
          referenceImageName={referenceImageName}
          generating={generating}
          onGenerate={handleGenerate}
          checkoutLoading={checkoutLoading}
          onSubscribe={handleSubscribe}
          generatedImageUrl={generatedImageUrl}
        />

        <HistorySection
          session={session}
          history={history}
          formatDateTime={formatDateTime}
        />

        <section className={styles.grid}>
          <article className={styles.panel}>
            <h3>What customers get</h3>
            <ul>
              <li>Sign in with Google, GitHub, or Magic Link</li>
              <li>Generate styled AI images with prompt plus optional reference image</li>
              <li>Download final outputs and revisit them in generation history</li>
              <li>Upgrade to unlimited generations through subscription checkout</li>
            </ul>
          </article>
          <article className={styles.panel}>
            <h3>Plan summary</h3>
            <ul>
              <li>Free plan includes 1 total image generation</li>
              <li>Paid plan removes generation limits while subscription stays active</li>
              <li>Policy and billing pages are published for merchant-review readiness</li>
            </ul>
          </article>
          <article className={styles.panel}>
            <h3>Billing setup</h3>
            <ul>
              <li>
                <code>/api/creem/checkout</code> creates a Creem subscription
                checkout session
              </li>
              <li>
                <code>/api/webhooks/creem</code> verifies Creem signatures and
                updates Supabase
              </li>
              <li>
                <code>profiles.subscription_status</code> and{" "}
                <code>profiles.plan_id</code> drive access in the UI
              </li>
            </ul>
          </article>
          <article className={styles.panel}>
            <h3>Generation tracking</h3>
            <ul>
              <li>
                <code>image_generations</code> stores each request with user ID,
                style, prompt, image URL, and timestamp
              </li>
              <li>
                Generated images are uploaded to Supabase Storage using
                <code> user_id/generation_id.png </code>
              </li>
              <li>Free tier starts with 1 total image generation</li>
              <li>Subscribed users can generate without limit</li>
            </ul>
          </article>
        </section>

        <div className={styles.links}>
          <Link href="/pricing">Pricing</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            Supabase Dashboard
          </a>
          <a
            href="https://docs.creem.io/features/subscriptions/introduction"
            target="_blank"
            rel="noopener noreferrer"
          >
            Creem Subscriptions Docs
          </a>
        </div>
      </main>
    </div>
  );
}
