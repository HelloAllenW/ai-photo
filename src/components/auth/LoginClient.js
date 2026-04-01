"use client";

import { useState } from "react";
import { FaEnvelope, FaGithub, FaGoogle } from "react-icons/fa";
import { getSiteUrl } from "@/lib/env";
import { getSupabaseClient, hasSupabaseEnv } from "@/lib/supabase";
import styles from "@/app/login/page.module.css";

function getRedirectTo() {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`;
  }

  return `${getSiteUrl()}/auth/callback`;
}

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isConfigured = hasSupabaseEnv();

  async function handleOAuthLogin(provider) {
    if (!isConfigured) {
      setMessage("Missing Supabase environment variables. Update .env.local first.");
      return;
    }

    const supabase = getSupabaseClient();
    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getRedirectTo(),
      },
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    }
  }

  async function handleMagicLinkLogin(event) {
    event.preventDefault();

    if (!isConfigured) {
      setMessage("Missing Supabase environment variables. Update .env.local first.");
      return;
    }

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    const supabase = getSupabaseClient();
    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getRedirectTo(),
      },
    });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Magic Link sent. Check your inbox and open the link to finish signing in.");
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1>Login</h1>
        <p className={styles.subtitle}>
          Sign in with Google, GitHub, or email Magic Link.
        </p>

        {!isConfigured ? (
          <p className={styles.message}>
            Supabase is not configured yet. Add the required values to
            `.env.local` before testing login.
          </p>
        ) : null}

        <div className={styles.actions}>
          <button
            className={styles.button}
            type="button"
            onClick={() => handleOAuthLogin("google")}
            disabled={isLoading}
          >
            <FaGoogle />
            Continue with Google
          </button>

          <button
            className={styles.button}
            type="button"
            onClick={() => handleOAuthLogin("github")}
            disabled={isLoading}
          >
            <FaGithub />
            Continue with GitHub
          </button>

          <form className={styles.magicLinkForm} onSubmit={handleMagicLinkLogin}>
            <input
              className={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
            <button className={styles.button} type="submit" disabled={isLoading}>
              <FaEnvelope />
              Send Magic Link
            </button>
          </form>
        </div>

        {message ? <p className={styles.message}>{message}</p> : null}
      </section>
    </main>
  );
}
