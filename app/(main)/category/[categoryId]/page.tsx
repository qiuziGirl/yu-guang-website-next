"use client";

import { GoodsInfo } from "@/types/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EMPTY_IMAGE_URL =
  "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/empty.png";

interface GoodsWithImage extends GoodsInfo {
  imageUrl: string;
}

function Skeleton() {
  return (
    <div className="grid grid-cols-3 gap-6 max-w-[1400px] w-full">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
          <div className="h-[280px] bg-gray-200" />
          <div className="p-6">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;
  const [loading, setLoading] = useState(true);
  const [goodsList, setGoodsList] = useState<GoodsWithImage[]>([]);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const res = await fetch(`/api/v1/goods?categoryId=${categoryId}`);
        const data = await res.json();

        if (data.code === 0) {
          const list = data.data.list.map((item: GoodsInfo) => {
            const imageUrl =
              item.imageListUrl && item.imageListUrl.trim()
                ? item.imageListUrl.split(",")[0]
                : EMPTY_IMAGE_URL;
            return { ...item, imageUrl };
          });
          setGoodsList(list);
        }
      } catch (error) {
        console.error("获取商品列表失败:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchGoods();
    }
  }, [categoryId]);

  const goToGoods = (goodsId: number) => {
    router.push(`/goods/${goodsId}`);
  };

  if (loading) {
    return (
      <section className="flex justify-center px-24 py-10 bg-gray-100 min-h-[calc(100vh-200px)]">
        <Skeleton />
      </section>
    );
  }

  return (
    <section className="flex justify-center px-24 py-10 bg-gray-100 min-h-[calc(100vh-200px)]">
      <div className="grid grid-cols-3 gap-6 max-w-[1400px] w-full">
        {goodsList.map((goods) => (
          <div
            key={goods.id}
            className="bg-white rounded-lg cursor-pointer overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            onClick={() => goToGoods(goods.id)}
          >
            <div className="w-full h-[280px] overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                src={goods.imageUrl}
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
          </div>
        ))}
      </div>
    </section>
  );
}
