"use client";

import { GoodsInfo } from "@/types/api";
import { useParams } from "next/navigation";
import { Col, Image, Row, Skeleton } from "antd";
import { useEffect, useState } from "react";

const EMPTY_IMAGE_URL =
  "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/empty.png";

interface GoodsWithImages extends GoodsInfo {
  imageUrlList: string[];
}

export default function GoodsPage() {
  const params = useParams();
  const goodsId = params.goodsId as string;
  const [loading, setLoading] = useState(true);
  const [goods, setGoods] = useState<GoodsWithImages | null>(null);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const res = await fetch(`/api/v1/goods/${goodsId}`);
        const data = await res.json();

        if (data.success && data.data) {
          const imageUrlList =
            data.data.image_list_url && data.data.image_list_url.trim()
              ? data.data.image_list_url
                  .split(",")
                  .filter((url: string) => url.trim())
              : [];
          setGoods({ ...data.data, imageUrlList });
        }
      } catch (error) {
        console.error("获取商品详情失败:", error);
      } finally {
        setLoading(false);
      }
    };

    if (goodsId) {
      fetchGoods();
    }
  }, [goodsId]);

  if (loading) {
    return (
      <section style={{ padding: "30px 100px" }}>
        <Skeleton active />
      </section>
    );
  }

  if (!goods) {
    return (
      <section style={{ padding: "30px 100px", textAlign: "center" }}>
        <h2>商品不存在</h2>
      </section>
    );
  }

  return (
    <section className="goods-container">
      <Row justify="center" className="goods-header">
        <Col span={8}>
          <Image.PreviewGroup items={goods.imageUrlList}>
            <Image
              src={
                goods.imageUrlList.length === 0
                  ? EMPTY_IMAGE_URL
                  : goods.imageUrlList[0]
              }
              alt={goods.name}
              style={{ 
                maxHeight: "400px", 
                objectFit: "contain",
                borderRadius: "8px"
              }}
            />
          </Image.PreviewGroup>
        </Col>
        <Col span={12}>
          <div className="goods-name">{goods.name}</div>
          <div className="goods-english-name">{goods.english_name}</div>
          <div className="goods-description">{goods.description}</div>
          {goods.english_description && (
            <div className="goods-english-description">{goods.english_description}</div>
          )}
        </Col>
      </Row>

      {goods.introduction && (
        <div
          dangerouslySetInnerHTML={{ __html: goods.introduction }}
          className="goods-body"
        />
      )}

      <style jsx>{`
        .goods-container {
          display: flex;
          flex-direction: column;
          background-color: #f6f6f6;
          min-height: calc(100vh - 200px);
        }
        .goods-header {
          padding: 50px 100px;
          text-align: left;
          background-color: #fff;
          margin-bottom: 30px;
        }
        .goods-name {
          color: #333;
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .goods-english-name {
          color: #666;
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 24px;
        }
        .goods-description {
          margin-top: 20px;
          color: #555;
          font-size: 16px;
          line-height: 1.8;
        }
        .goods-english-description {
          margin-top: 12px;
          color: #777;
          font-size: 15px;
          line-height: 1.8;
        }
        .goods-body {
          display: flex;
          justify-content: center;
          flex: 1;
          padding: 0 100px 50px;
        }
        .goods-body :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
      `}</style>
    </section>
  );
}
