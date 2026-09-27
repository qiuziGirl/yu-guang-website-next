import type { Metadata } from "next";
import MainLayout from "@/components/MainLayout";
import {
  defaultDescription,
  defaultOgImage,
  defaultTitle,
  siteUrl,
} from "@/lib/site";
import { htmlLangAttr } from "@/lib/site-lang";
import { readSiteLang } from "@/lib/site-lang-server";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${defaultTitle}`,
  },
  description: defaultDescription,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: defaultTitle,
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: defaultOgImage }],
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await readSiteLang();

  return (
    <html lang={htmlLangAttr(lang)}>
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
