"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseClient, hasSupabaseEnv } from "@/lib/supabase";

export default function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Completing sign in...");

  useEffect(() => {
    async function completeSignIn() {
      if (!hasSupabaseEnv()) {
        setMessage("Missing Supabase environment variables. Update .env.local first.");
        return;
      }

      const supabase = getSupabaseClient();
      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");
      const errorDescription = searchParams.get("error_description");

      if (errorDescription) {
        setMessage(errorDescription);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setMessage(error.message);
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase.from("profiles").upsert({
            id: user.id,
            subscription_status: "free",
            plan_id: null,
          });
        }

        router.replace("/");
        return;
      }

      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase.from("profiles").upsert({
            id: user.id,
            subscription_status: "free",
            plan_id: null,
          });
        }

        router.replace("/");
        return;
      }

      router.replace("/");
    }

    completeSignIn();
  }, [router, searchParams]);

  return <p>{message}</p>;
}
