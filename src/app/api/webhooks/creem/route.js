import { NextResponse } from "next/server";
import {
  isActiveSubscriptionStatus,
  mapSubscriptionStatus,
  verifyCreemSignature,
} from "@/lib/creem";
import {
  getSupabaseAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase-admin";

function getUserId(payloadObject, payload) {
  return (
    payloadObject?.subscription?.metadata?.userId ||
    payloadObject?.subscription?.metadata?.referenceId ||
    payloadObject?.metadata?.userId ||
    payloadObject?.metadata?.referenceId ||
    payload?.metadata?.userId ||
    payload?.metadata?.referenceId ||
    null
  );
}

function getPlanId(payloadObject, payload) {
  return (
    payloadObject?.subscription?.product?.id ||
    payloadObject?.subscription?.product ||
    payloadObject?.order?.product ||
    payloadObject?.product?.id ||
    payloadObject?.product ||
    payloadObject?.product_id ||
    payload?.product_id ||
    payloadObject?.metadata?.planId ||
    null
  );
}

export async function POST(request) {
  if (!process.env.CREEM_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing Creem webhook secret." },
      { status: 500 },
    );
  }

  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json(
      { error: "Missing Supabase admin environment variables." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("creem-signature");
  const rawPayload = await request.text();

  if (!signature || !verifyCreemSignature(rawPayload, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawPayload);
  const eventType = payload.eventType || payload.type;
  const object = payload.object || payload.data?.object || {};
  const userId = getUserId(object, payload);

  if (!userId) {
    return NextResponse.json({ received: true, skipped: true });
  }

  const nextStatus = mapSubscriptionStatus(eventType, object);
  const nextPlanId = isActiveSubscriptionStatus(nextStatus)
    ? getPlanId(object, payload)
    : null;

  const supabaseAdmin = getSupabaseAdminClient();
  const { error } = await supabaseAdmin.from("profiles").upsert({
    id: userId,
    subscription_status: nextStatus,
    plan_id: nextPlanId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
