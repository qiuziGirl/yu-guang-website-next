import { getGoodsByCategoryId } from "@/lib/data";
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
              className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="w-full h-[280px] overflow-hidden bg-gray-50 flex items-center justify-center">
                <img
                  src={imageUrl}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  alt={goods.name}
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
