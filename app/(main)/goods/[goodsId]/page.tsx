import { getGoodsById } from "@/lib/data";
import { notFound } from "next/navigation";
import GoodsDetail from "./GoodsDetail";

interface PageProps {
  params: Promise<{ goodsId: string }>;
}

export default async function GoodsPage({ params }: PageProps) {
  const { goodsId } = await params;
  const id = Number(goodsId);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const goods = await getGoodsById(id);
  if (!goods) {
    return (
      <section className="px-24 py-8 text-center bg-gray-100 min-h-[calc(100vh-200px)]">
        <h2 className="text-2xl text-gray-600">商品不存在</h2>
      </section>
    );
  }

  const imageUrlList =
    goods.imageListUrl && goods.imageListUrl.trim()
      ? goods.imageListUrl.split(",").filter((url) => url.trim())
      : [];

  return <GoodsDetail goods={goods} imageUrlList={imageUrlList} />;
}
