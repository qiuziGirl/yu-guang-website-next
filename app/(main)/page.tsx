import { getCarousels, getCategoriesWithGoods } from "@/lib/data";
import HomeContent from "./HomeContent";

export default async function HomePage() {
  const [categoryList, carouselList] = await Promise.all([
    getCategoriesWithGoods(),
    getCarousels(),
  ]);

  return (
    <HomeContent categoryList={categoryList} carouselList={carouselList} />
  );
}
