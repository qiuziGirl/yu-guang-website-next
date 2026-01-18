"use client";

import { CategoryInfo, CarouselInfo } from "@/types/api";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

const carouselVideoList = [
  {
    videoUrl:
      "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/videos/WeChat_20230905222612.mp4",
  },
  {
    videoUrl:
      "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/videos/WeChat_20230905222638.mp4",
  },
  {
    videoUrl:
      "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/videos/WeChat_20230905222728.mp4",
  },
  {
    videoUrl:
      "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/videos/WeChat_20230905222716.mp4",
  },
  {
    videoUrl:
      "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/videos/WeChat_20230905222556.mp4",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [categoryList, setCategoryList] = useState<CategoryInfo[]>([]);
  const [carouselList, setCarouselList] = useState<CarouselInfo[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, carouselRes] = await Promise.all([
          fetch("/api/v1/category"),
          fetch("/api/v1/carousel"),
        ]);

        const categoryData = await categoryRes.json();
        const carouselData = await carouselRes.json();

        if (categoryData.code === 0 && categoryData.data.list.length > 0) {
          setCategoryList(categoryData.data.list);
          setActiveCategory(categoryData.data.list[0]);
        }

        if (carouselData.code === 0) {
          setCarouselList(carouselData.data.list);
        }
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    };

    fetchData();
  }, []);

  const changeActiveCategory = (category: CategoryInfo) => {
    setActiveCategory(category);
  };

  const goToCategory = (categoryId: number) => {
    router.push(`/category/${categoryId}`);
  };

  return (
    <section className="bg-gray-100">
      {/* 轮播图区域 */}
      <div className="h-[600px] overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="h-full"
        >
          {carouselList.map((carousel) => (
            <SwiperSlide key={carousel.id}>
              <img
                src={carousel.imageUrl}
                alt="轮播图"
                className="w-full h-[600px] object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 为您推荐标题 */}
      <h2 className="text-3xl font-semibold text-gray-800 mt-12 mb-10">
        为您推荐
      </h2>

      {/* 产品分类展示区域 */}
      <div className="px-20 pb-16">
        <div className="grid grid-cols-12 gap-6">
          {/* 左侧大图展示 */}
          <div className="col-span-5">
            {activeCategory && (
              <div className="bg-white h-full rounded-lg overflow-hidden shadow-sm">
                <img
                  src={activeCategory.coverImageUrl || ""}
                  alt={activeCategory.name}
                  className="h-[400px] w-full object-cover"
                />
                <div className="flex flex-col items-start p-8">
                  <h3 className="text-2xl text-gray-800 font-semibold mb-4">
                    {activeCategory.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">
                    {activeCategory.description}
                  </p>
                  <button
                    className="flex items-center text-green-500 hover:text-green-600 text-sm font-medium transition-colors"
                    onClick={() => goToCategory(activeCategory.id)}
                  >
                    了解更多
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 右侧分类卡片网格 */}
          <div className="col-span-7">
            <div className="grid grid-cols-3 gap-4">
              {categoryList.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => changeActiveCategory(category)}
                >
                  <div className="text-base font-semibold text-gray-800 py-5 px-4">
                    {category.name}
                  </div>
                  <div className="overflow-hidden">
                    <img
                      src={category.coverImageUrl || ""}
                      alt={category.name}
                      className="w-full h-[180px] object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 视频展示区域 */}
      <div className="px-20 py-16">
        <Swiper
          modules={[Navigation]}
          slidesPerView={3}
          spaceBetween={20}
          navigation={true}
          loop={true}
          className="video-swiper"
        >
          {carouselVideoList.map((item, index) => (
            <SwiperSlide key={index}>
              <video
                src={item.videoUrl}
                controls
                className="w-full h-[400px] bg-black rounded-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
