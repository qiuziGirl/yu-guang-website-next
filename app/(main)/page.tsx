import type { Metadata } from "next";
import { Suspense } from "react";
import { getCarousels, getCategoriesForHome } from "@/lib/data";
import { uiCopy } from "@/lib/i18n/ui";
import { pageUrl } from "@/lib/locale-path";
import {
  defaultDescription,
  defaultDescriptionEn,
  defaultOgImage,
} from "@/lib/site";
import { readSiteLang } from "@/lib/site-lang-server";
import { buildPageAlternates } from "@/lib/seo/alternates";
import HomeContent from "./HomeContent";
import HomeLoading from "./HomeLoading";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await readSiteLang();
  const copy = uiCopy(lang);
  const description = lang === "en" ? defaultDescriptionEn : defaultDescription;

  return {
    title: { absolute: copy.brandName },
    description,
    alternates: buildPageAlternates("/", lang),
    openGraph: {
      title: copy.brandName,
      description,
      url: pageUrl("/", lang),
      images: [{ url: defaultOgImage }],
      locale: lang === "en" ? "en_US" : "zh_CN",
    },
  };
}

async function HomePageContent() {
  const [categoryList, carouselList] = await Promise.all([
    getCategoriesForHome(),
    getCarousels(),
  ]);

  return (
    <HomeContent categoryList={categoryList} carouselList={carouselList} />
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomePageContent />
    </Suspense>
  );
}
