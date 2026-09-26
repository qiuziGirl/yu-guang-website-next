import type { Metadata } from "next";
import { getCarousels, getCategoriesForHome } from "@/lib/data";
import { defaultDescription, defaultTitle } from "@/lib/site";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: { absolute: defaultTitle },
  description: defaultDescription,
};

export default async function HomePage() {
  const [categoryList, carouselList] = await Promise.all([
    getCategoriesForHome(),
    getCarousels(),
  ]);

  return (
    <HomeContent categoryList={categoryList} carouselList={carouselList} />
  );
}
