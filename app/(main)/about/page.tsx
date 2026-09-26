import type { Metadata } from "next";
import { getIntroduction } from "@/lib/data";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { defaultDescription, defaultOgImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于余光",
  description: defaultDescription,
  openGraph: {
    title: "关于余光",
    description: defaultDescription,
    images: [{ url: defaultOgImage }],
  },
};

export default async function AboutPage() {
  const introduction = await getIntroduction();
  const richText = sanitizeHtml(introduction?.richText ?? "");

  return (
    <section className="min-h-[calc(100vh-200px)] px-4 md:px-10 lg:px-24 py-8 md:py-10 bg-white">
      <div
        dangerouslySetInnerHTML={{ __html: richText }}
        className="max-w-[1200px] mx-auto leading-relaxed text-gray-800 text-base
          [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-5
          [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-gray-900
          [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-gray-900
          [&_h3]:mt-5 [&_h3]:mb-3 [&_h3]:text-gray-900
          [&_p]:mb-4"
      />
    </section>
  );
}
