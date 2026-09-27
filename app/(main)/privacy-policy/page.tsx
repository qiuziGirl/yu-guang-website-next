import type { Metadata } from "next";
import { privacyContent } from "@/lib/i18n/privacy-content";
import { uiCopy } from "@/lib/i18n/ui";
import { readSiteLang } from "@/lib/site-lang-server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await readSiteLang();
  const copy = uiCopy(lang);

  return {
    title: copy.privacyTitle,
    description: copy.privacyDescription,
    openGraph: {
      title: copy.privacyTitle,
      description: copy.privacyDescription,
      locale: lang === "en" ? "en_US" : "zh_CN",
    },
  };
}

export default async function PrivacyPolicyPage() {
  const lang = await readSiteLang();
  const content = privacyContent(lang);

  return (
    <section className="px-4 md:px-10 lg:px-24 py-8 md:py-12 text-left max-w-[960px] mx-auto">
      <h1 className="text-3xl md:text-4xl lg:text-5xl pb-1">{content.title}</h1>
      <hr className="border-gray-200 my-6" />
      <p className="text-gray-700 text-base md:text-lg leading-relaxed py-4">
        {content.intro}
      </p>

      {content.sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-xl md:text-2xl font-bold mt-8">{section.title}</h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed pb-8 md:pb-12">
            {section.body}
          </p>
        </div>
      ))}
    </section>
  );
}
