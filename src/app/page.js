import HomeClient from "./HomeClient";
import { createMetadata, siteConfig } from "@/lib/site";

export const revalidate = 3600;

export const metadata = createMetadata({
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
  pathname: "/",
});

export default function Home() {
  return <HomeClient />;
}
