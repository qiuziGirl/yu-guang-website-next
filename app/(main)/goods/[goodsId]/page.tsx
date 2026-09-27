import type { Metadata } from "next";
import { getGoodsById } from "@/lib/data";
import { uiCopy } from "@/lib/i18n/ui";
import { defaultOgImage } from "@/lib/site";
import {
  localizedDescription,
  localizedName,
} from "@/lib/site-lang";
import { readSiteLang } from "@/lib/site-lang-server";
import { notFound } from "next/navigation";
import GoodsDetail from "./GoodsDetail";

interface PageProps {
  params: Promise<{ goodsId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const lang = await readSiteLang();
  const copy = uiCopy(lang);
  const { goodsId } = await params;
  const id = Number(goodsId);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }
  const goods = await getGoodsById(id);
  if (!goods) {
    notFound();
  }
  const title = localizedName(goods, lang);
  const description =
    localizedDescription(goods, lang) ||
    `${title} - ${copy.goodsMetaFallback}`;
  const firstImage =
    goods.imageListUrl
      ?.split(",")
      .map((u) => u.trim())
      .find(Boolean) || defaultOgImage;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: firstImage }],
      locale: lang === "en" ? "en_US" : "zh_CN",
    },
  };
}

export default async function GoodsPage({ params }: PageProps) {
  const lang = await readSiteLang();
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

  return (
    <GoodsDetail goods={goods} imageUrlList={imageUrlList} initialLang={lang} />
  );
}
