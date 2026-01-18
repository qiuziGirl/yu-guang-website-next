"use client";

import { CategoryInfo, GoodsInfo } from "@/types/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface CategoryWithGoods extends CategoryInfo {
  goodsList?: GoodsInfo[];
}

export default function HeaderComponent() {
  const router = useRouter();
  const [categoryList, setCategoryList] = useState<CategoryWithGoods[]>([]);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/category");
        const data = await res.json();
        if (data.code === 0) {
          const filteredCategories = data.data.list.filter(
            (category: CategoryWithGoods) => 
              category.goodsList && category.goodsList.length > 0
          );
          setCategoryList(filteredCategories);
        }
      } catch (error) {
        console.error("获取分类失败:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      {/* Logo */}
      <div
        className="flex items-center text-xl font-semibold text-green-500 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <img
          src="https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/logo_128x128.png"
          className="w-9 h-9 mr-2.5"
          alt="余光照明"
        />
        余光照明
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-10 text-[15px]">
        {categoryList.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="text-gray-700 hover:text-green-500 transition-colors duration-300"
          >
            {category.name}
          </Link>
        ))}
        
        <Link
          href="/about"
          className="text-gray-700 hover:text-green-500 transition-colors duration-300"
        >
          关于余光
        </Link>

        {/* Language Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => setLangOpen(true)}
          onMouseLeave={() => setLangOpen(false)}
        >
          <button className="flex items-center gap-1 text-gray-700 hover:text-green-500 transition-colors duration-300">
            中文
            <ChevronDown className="w-4 h-4" />
          </button>
          {langOpen && (
            <div className="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-100 py-1 min-w-[100px] z-50">
              <div className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">
                中文
              </div>
              <div className="px-4 py-2 text-gray-400 cursor-not-allowed">
                English
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
