"use client";

import { uiCopy } from "@/lib/i18n/ui";
import { localizedPath } from "@/lib/locale-path";
import { localizedDescription, localizedName, type SiteLang } from "@/lib/site-lang";
import { useSiteLang } from "@/lib/use-site-lang";
import { CategoryInfo, CarouselInfo } from "@/types/api";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

interface HomeContentProps {
  categoryList: CategoryInfo[];
  carouselList: CarouselInfo[];
  initialLang: SiteLang;
}

export default function HomeContent({
  categoryList,
  carouselList,
  initialLang,
}: HomeContentProps) {
  const lang = useSiteLang(initialLang);
  const copy = uiCopy(lang);
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoryInfo | null>(
    categoryList[0] ?? null
  );
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target as HTMLVideoElement;
            const src = video.getAttribute("data-src");
            if (src && !video.src) {
              video.src = src;
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, []);

  const goToCategory = (categoryId: number) => {
    router.push(localizedPath(`/category/${categoryId}`, lang));
  };

  return (
    <section className="bg-gray-100">
      {/* 轮播图区域 */}
      <div className="h-[220px] sm:h-[320px] lg:h-[490px] overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          pagination={{ clickable: true }}
          className="h-full hero-swiper"
        >
          {carouselList.map((carousel, index) => (
            <SwiperSlide key={carousel.id}>
              <div className="relative w-full h-[220px] sm:h-[320px] lg:h-[490px]">
                <Image
                  src={carousel.imageUrl}
                  alt={
                    carousel.remark?.trim() ||
                    `${copy.carouselAlt} ${index + 1}`
                  }
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 为您推荐标题 */}
      <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mt-8 mb-6 lg:mt-12 lg:mb-10 px-4 lg:px-0">
        {copy.homeRecommend}
      </h2>

      {/* 产品分类展示区域 */}
      <div className="px-4 lg:px-10 pb-10 lg:pb-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* 左侧大图展示 */}
          <div className="lg:col-span-5">
            {activeCategory && (
              <div className="bg-white h-full overflow-hidden shadow-sm rounded-2xl">
                {activeCategory.coverImageUrl && (
                  <div className="relative h-[240px] lg:h-[450px] w-full">
                    <Image
                      src={activeCategory.coverImageUrl}
                      alt={localizedName(activeCategory, lang)}
                      fill
                      sizes="(min-width: 1400px) 560px, (min-width: 1024px) 40vw, calc(100vw - 2rem)"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col items-start p-5 lg:p-8">
                  <h3 className="text-xl text-gray-800 font-semibold mb-3">
                    {localizedName(activeCategory, lang)}
                  </h3>
                  {localizedDescription(activeCategory, lang) && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                      {localizedDescription(activeCategory, lang)}
                    </p>
                  )}
                  <button
                    className="flex items-center text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
                    onClick={() => goToCategory(activeCategory.id)}
                  >
                    {copy.homeLearnMore}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 右侧分类卡片网格 - 2x2布局，只显示前4个 */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
              {categoryList.slice(0, 4).map((category) => (
                <div
                  key={category.id}
                  className="bg-white cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-sm rounded-2xl group"
                  onClick={() => {
                    // 小屏大图在卡片上方，直接进入分类；桌面仍只切换预览
                    if (window.matchMedia("(min-width: 1024px)").matches) {
                      setActiveCategory(category);
                      return;
                    }
                    goToCategory(category.id);
                  }}
                >
                  <div className="text-base font-semibold text-gray-800 py-4 px-5 text-center">
                    {localizedName(category, lang)}
                  </div>
                  <div className="overflow-hidden flex items-center justify-center bg-gray-50 p-4">
                    {category.coverImageUrl && (
                      <div className="relative w-full h-[160px] lg:h-[200px]">
                        <Image
                          src={category.coverImageUrl}
                          alt={localizedName(category, lang)}
                          fill
                          sizes="(min-width: 1400px) 380px, (min-width: 1024px) 30vw, (min-width: 640px) 50vw, calc(100vw - 4rem)"
                          className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 视频展示区域 */}
      <div className="px-4 lg:px-10 py-10 lg:py-16 max-w-[1400px] mx-auto">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          navigation={true}
          loop={carouselVideoList.length > 3}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 12 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="video-swiper"
        >
          {carouselVideoList.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[200px] sm:h-[280px] lg:h-[350px] bg-black">
                <video
                  ref={(el) => { videoRefs.current[index] = el; }}
                  controls
                  playsInline
                  className="w-full h-full"
                  data-video-index={index}
                  data-src={item.videoUrl}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
