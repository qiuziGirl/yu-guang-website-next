"use client";

import { CategoryInfo, CarouselInfo } from "@/types/api";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Button, Carousel, Col, Image, Row } from "antd";
import { useEffect, useState } from "react";

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

const contentStyle: React.CSSProperties = {
  margin: 0,
  width: "100%",
  height: "600px",
  objectFit: "cover",
};

const settings = {
  className: "center",
  infinite: true,
  dots: false,
  arrow: true,
  speed: 500,
  slidesToShow: 3,
  centerMode: true,
  centerPadding: "0px",
};

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

        if (categoryData.success && categoryData.data.length > 0) {
          setCategoryList(categoryData.data);
          setActiveCategory(categoryData.data[0]);
        }

        if (carouselData.success) {
          setCarouselList(carouselData.data);
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
    <section style={{ backgroundColor: "#f6f6f6" }}>
      {/* 轮播图区域 */}
      <div style={{ height: "600px", overflow: "hidden" }}>
        <Carousel autoplay effect="fade" autoplaySpeed={5000}>
          {carouselList.map((carousel) => (
            <div key={carousel.id}>
              <div style={{ height: "600px", position: "relative" }}>
                <Image
                  src={carousel.image_url}
                  preview={false}
                  height={600}
                  width="100%"
                  style={contentStyle}
                  alt="轮播图"
                />
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* 为您推荐标题 */}
      <div
        style={{
          fontSize: "32px",
          fontWeight: 600,
          color: "#333",
          marginTop: "50px",
          marginBottom: "40px",
          lineHeight: "1.2",
        }}
      >
        为您推荐
      </div>

      {/* 产品分类展示区域 */}
      <div style={{ padding: "0 80px 60px" }}>
        <Row gutter={[24, 24]}>
          {/* 左侧大图展示 */}
          <Col span={10}>
            {activeCategory && (
              <div style={{ backgroundColor: "#fff", height: "100%" }}>
                <img
                  src={activeCategory.cover_image_url || ""}
                  alt={activeCategory.name}
                  style={{
                    height: "400px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "30px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "24px",
                      color: "#222",
                      margin: "0 0 15px 0",
                      fontWeight: 600,
                    }}
                  >
                    {activeCategory.name}
                  </h3>
                  <div
                    style={{
                      color: "#666",
                      margin: "0 0 20px 0",
                      fontSize: "14px",
                      lineHeight: "1.6",
                    }}
                  >
                    {activeCategory.description}
                  </div>
                  <Button
                    type="link"
                    style={{ padding: 0, fontSize: "14px" }}
                    onClick={() => goToCategory(activeCategory.id)}
                  >
                    了解更多
                    <RightOutlined style={{ fontSize: "12px" }} />
                  </Button>
                </div>
              </div>
            )}
          </Col>

          {/* 右侧分类卡片网格 */}
          <Col span={14}>
            <Row gutter={[16, 16]}>
              {categoryList.map((category) => (
                <Col span={8} key={category.id}>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      cursor: "pointer",
                      textAlign: "center",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    className="category-card"
                    onClick={() => changeActiveCategory(category)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        fontSize: "16px",
                        lineHeight: "1.4",
                        padding: "20px 15px",
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      {category.name}
                    </div>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <img
                        src={category.cover_image_url || ""}
                        alt={category.name}
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>

      {/* 视频展示区域 */}
      <div style={{ padding: "60px 80px 80px" }}>
        <Carousel
          {...settings}
          prevArrow={<LeftCircleOutlined />}
          nextArrow={<RightCircleOutlined style={{ color: "#ccc" }} />}
          arrows={true}
        >
          {carouselVideoList.map((item, index) => (
            <div key={index}>
              <div className="block-item">
                <video
                  src={item.videoUrl}
                  controls
                  width="100%"
                  height={500}
                  style={{ backgroundColor: "#000" }}
                />
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
