import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const carouselData = [
  {
    image: "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/carousel/pexels-valeria-boltneva-1123262.jpg",
    title: "智能路灯照明系统",
    description: "节能环保，智能控制",
    alt: "路灯照明"
  },
  {
    image: "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/carousel/pexels-mehmet-kaya-517985.jpg",
    title: "一体化照明解决方案",
    description: "为城市提供全方位照明服务",
    alt: "一体化照明"
  },
  {
    image: "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/carousel/pexels-lisa-fotios-1090638.jpg",
    title: "庭院灯系列产品",
    description: "美观实用，品质保证",
    alt: "庭院灯系列"
  }
];

export default function Carousel() {
  return (
    <div className="w-full h-[600px] relative">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full"
      >
        {carouselData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full relative bg-gray-900">
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-4">{item.title}</h2>
                  <p className="text-xl">{item.description}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}