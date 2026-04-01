import "./globals.css";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata = createMetadata({
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
});

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
