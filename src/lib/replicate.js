import { getReplicateModel } from "./env";

const REPLICATE_API_BASE = "https://api.replicate.com/v1";
const IMAGE_INPUT_KEYS = ["image", "input_image", "init_image", "image_url"];

function getReplicateHeaders(extraHeaders = {}) {
  return {
    Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
    ...extraHeaders,
  };
}

function parseModelRef(modelRef) {
  const [ownerAndName, version] = modelRef.split(":");
  const [owner, name] = ownerAndName.split("/");

  if (!owner || !name) {
    throw new Error(
      "Invalid REPLICATE_MODEL value. Use owner/model or owner/model:version.",
    );
  }

  return { owner, name, version };
}

export async function getReplicateModelSchema() {
  const modelRef = getReplicateModel();
  const { owner, name, version } = parseModelRef(modelRef);

  const modelResponse = await fetch(`${REPLICATE_API_BASE}/models/${owner}/${name}`, {
    headers: getReplicateHeaders(),
  });
  const modelPayload = await modelResponse.json();

  if (!modelResponse.ok) {
    throw new Error(modelPayload.detail || modelPayload.error || "Failed to load Replicate model.");
  }

  const latestVersionId = version || modelPayload.latest_version?.id;

  if (!latestVersionId) {
    throw new Error(
      "Replicate model version is missing. Set REPLICATE_MODEL to owner/model:version or use a model with latest_version.",
    );
  }

  const inputProperties =
    modelPayload.latest_version?.openapi_schema?.components?.schemas?.Input?.properties || {};

  return {
    version: `${owner}/${name}:${latestVersionId}`,
    inputProperties,
  };
}

function pickImageInputKey(inputProperties) {
  return IMAGE_INPUT_KEYS.find((key) => key in inputProperties) || null;
}

export function buildReplicateInput({
  prompt,
  referenceImage,
  inputProperties,
}) {
  const input = {};

  if ("prompt" in inputProperties || Object.keys(inputProperties).length === 0) {
    input.prompt = prompt;
  } else if ("text" in inputProperties) {
    input.text = prompt;
  } else {
    input.prompt = prompt;
  }

  if ("num_outputs" in inputProperties) {
    input.num_outputs = 1;
  }

  if ("output_format" in inputProperties) {
    input.output_format = "png";
  }

  if ("aspect_ratio" in inputProperties) {
    input.aspect_ratio = "1:1";
  }

  if ("width" in inputProperties) {
    input.width = 1024;
  }

  if ("height" in inputProperties) {
    input.height = 1024;
  }

  if (referenceImage) {
    const imageInputKey = pickImageInputKey(inputProperties);

    if (!imageInputKey) {
      throw new Error(
        "The configured Replicate model does not accept a reference image. Choose a compatible model or generate without upload.",
      );
    }

    input[imageInputKey] = referenceImage;

    if ("prompt_strength" in inputProperties) {
      input.prompt_strength = 0.8;
    }

    if ("strength" in inputProperties) {
      input.strength = 0.8;
    }
  }

  return input;
}

export async function createReplicatePrediction({ version, input }) {
  const response = await fetch(`${REPLICATE_API_BASE}/predictions`, {
    method: "POST",
    headers: getReplicateHeaders({
      Prefer: "wait=60",
    }),
    body: JSON.stringify({
      version,
      input,
    }),
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.detail || payload.error || "Failed to create Replicate prediction.");
  }

  return payload;
}

export async function waitForPrediction(prediction) {
  let currentPrediction = prediction;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (currentPrediction.status === "succeeded") {
      return currentPrediction;
    }

    if (currentPrediction.status === "failed" || currentPrediction.status === "canceled") {
      throw new Error(
        currentPrediction.error || `Replicate prediction ${currentPrediction.status}.`,
      );
    }

    const predictionUrl = currentPrediction.urls?.get;

    if (!predictionUrl) {
      throw new Error("Replicate prediction did not return a polling URL.");
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    const response = await fetch(predictionUrl, {
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      },
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.detail || payload.error || "Failed to poll Replicate prediction.");
    }

    currentPrediction = payload;
  }

  throw new Error("Replicate prediction timed out.");
}

export function extractReplicateOutputUrl(prediction) {
  const { output } = prediction;

  if (Array.isArray(output)) {
    return output[0] || null;
  }

  if (typeof output === "string") {
    return output;
  }

  return null;
}
