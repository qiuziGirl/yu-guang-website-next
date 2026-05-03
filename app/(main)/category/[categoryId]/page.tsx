import { getGoodsByCategoryId } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const EMPTY_IMAGE_URL =
  "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/empty.png";

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  const id = Number(categoryId);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const goodsList = await getGoodsByCategoryId(id);

  return (
    <section className="flex justify-center px-24 py-10 bg-gray-100 min-h-[calc(100vh-200px)]">
      <div className="grid grid-cols-3 gap-6 max-w-[1400px] w-full">
        {goodsList.map((goods) => {
          const imageUrl =
            goods.imageListUrl && goods.imageListUrl.trim()
              ? goods.imageListUrl.split(",")[0]
              : EMPTY_IMAGE_URL;
          return (
            <Link
              key={goods.id}
              href={`/goods/${goods.id}`}
              className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
            >
              <div className="relative w-full h-[280px] overflow-hidden bg-gray-50">
                <Image
                  src={imageUrl}
                  alt={goods.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6 text-left">
                <div className="text-gray-800 font-semibold text-lg mb-2 leading-snug">
                  {goods.name}
                </div>
                <div className="text-gray-500 text-sm leading-relaxed">
                  {goods.englishName}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
