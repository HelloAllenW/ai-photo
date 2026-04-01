import { Suspense } from "react";
import AuthCallbackHandler from "./AuthCallbackHandler";

export default function AuthCallbackPage() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <Suspense fallback={<p>Completing sign in...</p>}>
        <AuthCallbackHandler />
      </Suspense>
    </main>
  );
}
