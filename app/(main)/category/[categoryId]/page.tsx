import type { Metadata } from "next";
import { getCategoryById, getGoodsByCategoryId } from "@/lib/data";
import { uiCopy } from "@/lib/i18n/ui";
import { defaultOgImage } from "@/lib/site";
import {
  localizedDescription,
  localizedName,
} from "@/lib/site-lang";
import { readSiteLang } from "@/lib/site-lang-server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const EMPTY_IMAGE_URL =
  "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/empty.png";

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const lang = await readSiteLang();
  const copy = uiCopy(lang);
  const { categoryId } = await params;
  const id = Number(categoryId);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }
  const category = await getCategoryById(id);
  if (!category) {
    notFound();
  }
  const title = localizedName(category, lang);
  const description =
    localizedDescription(category, lang) ||
    `${title} - ${copy.categoryMetaFallback}`;
  const image = category.coverImageUrl || defaultOgImage;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
      locale: lang === "en" ? "en_US" : "zh_CN",
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const lang = await readSiteLang();
  const copy = uiCopy(lang);
  const { categoryId } = await params;
  const id = Number(categoryId);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const category = await getCategoryById(id);
  if (!category) {
    notFound();
  }

  const goodsList = await getGoodsByCategoryId(id);

  return (
    <section className="flex justify-center px-4 md:px-10 lg:px-24 py-6 md:py-10 bg-gray-100 min-h-[calc(100vh-200px)]">
      {goodsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-gray-400 text-lg mb-4">{copy.categoryEmpty}</div>
          <div className="text-gray-300 text-sm">{copy.categoryEmptyHint}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-[1400px] w-full">
          {goodsList.map((goods) => {
            const imageUrl =
              goods.imageListUrl && goods.imageListUrl.trim()
                ? goods.imageListUrl.split(",")[0]
                : EMPTY_IMAGE_URL;
            const displayName = localizedName(goods, lang);
            return (
              <Link
                key={goods.id}
                href={`/goods/${goods.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
              >
                <div className="relative w-full h-[200px] md:h-[240px] lg:h-[280px] overflow-hidden bg-gray-50">
                  <Image
                    src={imageUrl}
                    alt={displayName}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 md:p-6 text-left">
                  <div className="text-gray-800 font-semibold text-lg mb-2 leading-snug">
                    {displayName}
                  </div>
                  {localizedDescription(goods, lang) && (
                    <div className="text-gray-500 text-sm leading-relaxed">
                      {localizedDescription(goods, lang)}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
