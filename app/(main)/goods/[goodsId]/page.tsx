import type { Metadata } from "next";
import { getGoodsById } from "@/lib/data";
import { defaultOgImage } from "@/lib/site";
import { notFound } from "next/navigation";
import GoodsDetail from "./GoodsDetail";

interface PageProps {
  params: Promise<{ goodsId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { goodsId } = await params;
  const id = Number(goodsId);
  if (!Number.isInteger(id) || id <= 0) {
    return { title: "商品不存在" };
  }
  const goods = await getGoodsById(id);
  if (!goods) {
    return { title: "商品不存在" };
  }
  const description =
    goods.description?.trim() || `${goods.name} - 余光照明`;
  const firstImage =
    goods.imageListUrl
      ?.split(",")
      .map((u) => u.trim())
      .find(Boolean) || defaultOgImage;
  return {
    title: goods.name,
    description,
    openGraph: {
      title: goods.name,
      description,
      images: [{ url: firstImage }],
    },
  };
}

export default async function GoodsPage({ params }: PageProps) {
  const { goodsId } = await params;
  const id = Number(goodsId);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const goods = await getGoodsById(id);
  if (!goods) {
    notFound();
  }

  const imageUrlList =
    goods.imageListUrl && goods.imageListUrl.trim()
      ? goods.imageListUrl.split(",").filter((url) => url.trim())
      : [];

  return <GoodsDetail goods={goods} imageUrlList={imageUrlList} />;
}
