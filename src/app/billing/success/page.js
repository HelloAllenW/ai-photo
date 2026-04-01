import SuccessClient from "./SuccessClient";
import { verifyCreemRedirectSignature } from "@/lib/creem";
import { createMetadata, siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: siteConfig.billingTitle,
  description: siteConfig.billingDescription,
  pathname: "/billing/success",
});

export default function BillingSuccessPage({ searchParams }) {
  const params = {
    checkout_id: searchParams.checkout_id || null,
    order_id: searchParams.order_id || null,
    customer_id: searchParams.customer_id || null,
    subscription_id: searchParams.subscription_id || null,
    product_id: searchParams.product_id || null,
    request_id: searchParams.request_id || null,
    signature: searchParams.signature || null,
  };
  const verified =
    Boolean(params.checkout_id && params.product_id) &&
    verifyCreemRedirectSignature(params);

  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <SuccessClient verified={verified} />
    </main>
  );
}
