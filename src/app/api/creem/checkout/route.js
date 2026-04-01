import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSiteUrl } from "@/lib/env";
import { getCreemApiBaseUrl, hasCreemEnv } from "@/lib/creem";

function getAuthToken(request) {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length);
}

export async function POST(request) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.json(
      { error: "Missing Supabase environment variables." },
      { status: 500 },
    );
  }

  if (!hasCreemEnv()) {
    return NextResponse.json(
      { error: "Missing Creem environment variables." },
      { status: 500 },
    );
  }

  const accessToken = getAuthToken(request);

  if (!accessToken) {
    return NextResponse.json(
      { error: "Missing Supabase access token." },
      { status: 401 },
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(accessToken);

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const checkoutResponse = await fetch(`${getCreemApiBaseUrl()}/checkouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.CREEM_API_KEY,
    },
    body: JSON.stringify({
      product_id: process.env.CREEM_PRODUCT_ID,
      request_id: `creem_${user.id}_${Date.now()}`,
      success_url: `${getSiteUrl()}/billing/success`,
      customer: {
        email: user.email,
      },
      metadata: {
        userId: user.id,
        referenceId: user.id,
        planId: process.env.CREEM_PRODUCT_ID,
      },
    }),
  });

  const checkoutPayload = await checkoutResponse.json();

  if (!checkoutResponse.ok) {
    return NextResponse.json(
      {
        error:
          checkoutPayload.message ||
          checkoutPayload.error ||
          "Failed to create Creem checkout.",
      },
      { status: checkoutResponse.status },
    );
  }

  return NextResponse.json({
    checkoutUrl: checkoutPayload.checkout_url,
    checkoutId: checkoutPayload.id,
  });
}
