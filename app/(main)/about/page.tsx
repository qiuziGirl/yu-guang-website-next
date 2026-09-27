import type { Metadata } from "next";
import { getIntroduction } from "@/lib/data";
import { uiCopy } from "@/lib/i18n/ui";
import { sanitizeHtml } from "@/lib/sanitize-html";
import {
  defaultDescription,
  defaultDescriptionEn,
  defaultOgImage,
} from "@/lib/site";
import { introductionVersion } from "@/lib/site-lang";
import { readSiteLang } from "@/lib/site-lang-server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await readSiteLang();
  const copy = uiCopy(lang);
  const description = lang === "en" ? defaultDescriptionEn : defaultDescription;

  return {
    title: copy.aboutTitle,
    description,
    openGraph: {
      title: copy.aboutTitle,
      description,
      images: [{ url: defaultOgImage }],
      locale: lang === "en" ? "en_US" : "zh_CN",
    },
  };
}

export default async function AboutPage() {
  const lang = await readSiteLang();
  const copy = uiCopy(lang);
  const introduction = await getIntroduction(introductionVersion(lang));
  const richText = sanitizeHtml(introduction?.richText ?? "");

  return (
    <section className="min-h-[calc(100vh-200px)] px-4 md:px-10 lg:px-24 py-8 md:py-10 bg-white">
      {richText ? (
        <div
          dangerouslySetInnerHTML={{ __html: richText }}
          className="max-w-[1200px] mx-auto leading-relaxed text-gray-800 text-base
            [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-5
            [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-gray-900
            [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-gray-900
            [&_h3]:mt-5 [&_h3]:mb-3 [&_h3]:text-gray-900
            [&_p]:mb-4"
        />
      ) : (
        <p className="max-w-[1200px] mx-auto text-gray-500">{copy.aboutEmpty}</p>
      )}
    </section>
  );
}
