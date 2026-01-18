"use client";

import { GoodsInfo } from "@/types/api";
import { useParams, useRouter } from "next/navigation";
import { Col, Row, Skeleton } from "antd";
import { useEffect, useState } from "react";

const EMPTY_IMAGE_URL =
  "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/empty.png";

interface GoodsWithImage extends GoodsInfo {
  imageUrl: string;
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

        if (data.success) {
          const list = data.data.map((item: GoodsInfo) => {
            const imageUrl =
              item.image_list_url && item.image_list_url.trim()
                ? item.image_list_url.split(",")[0]
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
      <section style={{ padding: "20px 150px 50px 150px" }}>
        <Skeleton active />
      </section>
    );
  }

  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px 100px 60px",
        backgroundColor: "#f6f6f6",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <Row gutter={[24, 24]} style={{ width: "100%", maxWidth: "1400px" }}>
        {goodsList.map((goods, index) => (
          <Col span={8} key={index}>
            <div
              style={{
                height: "100%",
                backgroundColor: "#fff",
                borderRadius: "8px",
                padding: "0",
                cursor: "pointer",
                overflow: "hidden",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              }}
              onClick={() => goToGoods(goods.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
              }}
            >
              <div style={{ 
                width: "100%", 
                height: "280px", 
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fafafa"
              }}>
                <img
                  src={goods.imageUrl}
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    transition: "transform 0.3s ease"
                  }}
                  alt={goods.name}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </div>
              <div
                style={{
                  padding: "24px 20px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    color: "#333",
                    fontWeight: "600",
                    fontSize: "18px",
                    marginBottom: "8px",
                    lineHeight: "1.4",
                  }}
                >
                  {goods.name}
                </div>
                <div style={{ 
                  color: "#666", 
                  fontSize: "14px",
                  lineHeight: "1.5"
                }}>
                  {goods.english_name}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </section>
  );
}
