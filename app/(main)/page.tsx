import type { Metadata } from "next";
import { Suspense } from "react";
import { getCarousels, getCategoriesForHome } from "@/lib/data";
import { defaultDescription, defaultTitle } from "@/lib/site";
import HomeContent from "./HomeContent";
import HomeLoading from "./HomeLoading";

export const metadata: Metadata = {
  title: { absolute: defaultTitle },
  description: defaultDescription,
};

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
