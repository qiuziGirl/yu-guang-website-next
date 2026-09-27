import type { Metadata } from "next";
import { Suspense } from "react";
import { getCarousels, getCategoriesForHome } from "@/lib/data";
import { uiCopy } from "@/lib/i18n/ui";
import {
  defaultDescription,
  defaultDescriptionEn,
  defaultOgImage,
  defaultTitle,
} from "@/lib/site";
import { readSiteLang } from "@/lib/site-lang-server";
import HomeContent from "./HomeContent";
import HomeLoading from "./HomeLoading";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await readSiteLang();
  const copy = uiCopy(lang);
  const description = lang === "en" ? defaultDescriptionEn : defaultDescription;

  return {
    title: { absolute: copy.brandName },
    description,
    openGraph: {
      title: copy.brandName,
      description,
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
