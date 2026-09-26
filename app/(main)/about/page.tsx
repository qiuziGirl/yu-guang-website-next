import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getIntroduction } from "@/lib/data";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { defaultDescription, defaultOgImage } from "@/lib/site";
import {
  introductionVersion,
  parseSiteLang,
  SITE_LANG_COOKIE,
} from "@/lib/site-lang";

const ABOUT_COPY = {
  zh: { title: "关于余光", empty: "暂无介绍" },
  en: { title: "About", empty: "No introduction yet" },
} as const;

async function readAboutLang() {
  const store = await cookies();
  return parseSiteLang(store.get(SITE_LANG_COOKIE)?.value);
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await readAboutLang();
  const title = ABOUT_COPY[lang].title;

  return {
    title,
    description: defaultDescription,
    openGraph: {
      title,
      description: defaultDescription,
      images: [{ url: defaultOgImage }],
    },
  };
}

export default async function AboutPage() {
  const lang = await readAboutLang();
  const introduction = await getIntroduction(introductionVersion(lang));
  const richText = sanitizeHtml(introduction?.richText ?? "");
  const copy = ABOUT_COPY[lang];

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
        <p className="max-w-[1200px] mx-auto text-gray-500">{copy.empty}</p>
      )}
    </section>
  );
}
