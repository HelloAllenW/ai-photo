import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStorageBucketName } from "@/lib/env";
import { STYLE_OPTIONS, buildImagePrompt } from "@/lib/image-generation";
import {
  buildReplicateInput,
  createReplicatePrediction,
  extractReplicateOutputUrl,
  getReplicateModelSchema,
  waitForPrediction,
} from "@/lib/replicate";
import { getSupabaseAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase-admin";
import {
  FREE_IMAGE_LIMIT,
  isSubscribedStatus,
} from "@/lib/subscription";

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

  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "Missing REPLICATE_API_TOKEN in environment variables." },
      { status: 500 },
    );
  }

  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json(
      { error: "Missing Supabase admin environment variables." },
      { status: 500 },
    );
  }

  const accessToken = getAuthToken(request);

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const prompt = body.prompt?.trim();
  const style = body.style?.trim();
  const referenceImage = body.referenceImage || null;

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  if (!STYLE_OPTIONS.some((option) => option.value === style)) {
    return NextResponse.json({ error: "Unsupported style." }, { status: 400 });
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

  const supabaseAdmin = getSupabaseAdminClient();
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("subscription_status, plan_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const { count, error: usageError } = await supabaseAdmin
    .from("image_generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (usageError) {
    return NextResponse.json({ error: usageError.message }, { status: 500 });
  }

  const generationCount = count || 0;
  const isSubscribed = isSubscribedStatus(profile?.subscription_status);
  const remaining = Math.max(FREE_IMAGE_LIMIT - generationCount, 0);

  if (!isSubscribed && remaining <= 0) {
    return NextResponse.json(
      {
        error: "Free image limit reached. Please subscribe to continue.",
        needsSubscription: true,
        remaining: 0,
      },
      { status: 403 },
    );
  }

  const finalPrompt = buildImagePrompt(prompt, style);
  let outputUrl;

  try {
    const { version, inputProperties } = await getReplicateModelSchema();
    const input = buildReplicateInput({
      prompt: finalPrompt,
      referenceImage,
      inputProperties,
    });
    const prediction = await createReplicatePrediction({ version, input });
    const completedPrediction = await waitForPrediction(prediction);

    outputUrl = extractReplicateOutputUrl(completedPrediction);
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Image generation failed.",
      },
      { status: 500 },
    );
  }

  if (!outputUrl) {
    return NextResponse.json(
      { error: "Replicate did not return an image output." },
      { status: 500 },
    );
  }

  const generationId = crypto.randomUUID();
  const bucketName = getStorageBucketName();
  const filePath = `${user.id}/${generationId}.png`;
  const outputResponse = await fetch(outputUrl, {
    headers: {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
    },
  });

  if (!outputResponse.ok) {
    return NextResponse.json(
      { error: "Failed to download generated image from Replicate." },
      { status: 500 },
    );
  }

  const imageArrayBuffer = await outputResponse.arrayBuffer();
  const imageBuffer = Buffer.from(imageArrayBuffer);

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(filePath, imageBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(bucketName).getPublicUrl(filePath);

  const { error: insertError } = await supabaseAdmin.from("image_generations").insert({
    id: generationId,
    user_id: user.id,
    generation_count: 1,
    style,
    prompt,
    image_url: publicUrl,
    storage_path: filePath,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const nextRemaining = isSubscribed
    ? null
    : Math.max(FREE_IMAGE_LIMIT - (generationCount + 1), 0);

  return NextResponse.json({
    imageUrl: publicUrl,
    generationId,
    remaining: nextRemaining,
    usageCount: generationCount + 1,
    isSubscribed,
    subscriptionStatus: profile?.subscription_status || "free",
    planId: profile?.plan_id || null,
    historyItem: {
      id: generationId,
      style,
      created_at: new Date().toISOString(),
      image_url: publicUrl,
    },
  });
}
