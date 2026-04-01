import LoginClient from "@/components/auth/LoginClient";
import { createMetadata, siteConfig } from "@/lib/site";

export const revalidate = 3600;

export const metadata = createMetadata({
  title: siteConfig.loginTitle,
  description: siteConfig.loginDescription,
  pathname: "/login",
});

export default function LoginPage() {
  return <LoginClient />;
}
