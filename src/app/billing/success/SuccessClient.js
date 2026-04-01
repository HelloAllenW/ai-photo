"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function SuccessClient({ verified }) {
  useEffect(() => {
    if (verified && window.opener) {
      window.opener.postMessage(
        { type: "creem-checkout-success" },
        window.location.origin,
      );
    }
  }, [verified]);

  return (
    <div
      style={{
        maxWidth: "480px",
        textAlign: "center",
        display: "grid",
        gap: "16px",
      }}
    >
      <h1>{verified ? "Payment completed" : "Payment received"}</h1>
      <p>
        {verified
          ? "Your Creem redirect signature was verified. If this window was opened as a popup, you can close it now."
          : "The redirect arrived without a verifiable signature. Check your Creem API key and success URL settings if the homepage does not refresh."}
      </p>
      <Link href="/">Return to homepage</Link>
    </div>
  );
}
