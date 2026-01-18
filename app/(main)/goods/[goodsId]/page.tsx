"use client";

import { GoodsInfo } from "@/types/api";
import { useParams } from "next/navigation";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const EMPTY_IMAGE_URL =
  "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/empty.png";

interface GoodsWithImages extends GoodsInfo {
  imageUrlList: string[];
}

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-12 px-24 py-12 bg-white mb-8">
        <div className="w-1/3 h-[400px] bg-gray-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

function ImagePreview({ 
  images, 
  currentIndex, 
  onClose, 
  onPrev, 
  onNext 
}: { 
  images: string[]; 
  currentIndex: number; 
  onClose: () => void; 
  onPrev: () => void; 
  onNext: () => void; 
}) {
  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </button>
      
      {images.length > 1 && (
        <>
          <button 
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button 
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </>
      )}
      
      <img 
        src={images[currentIndex]} 
        alt="预览图" 
        className="max-w-[90vw] max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      
      <div className="absolute bottom-4 text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

export default function GoodsPage() {
  const params = useParams();
  const goodsId = params.goodsId as string;
  const [loading, setLoading] = useState(true);
  const [goods, setGoods] = useState<GoodsWithImages | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const res = await fetch(`/api/v1/goods/${goodsId}`);
        const data = await res.json();

        if (data.code === 0 && data.data) {
          const imageUrlList =
            data.data.imageListUrl && data.data.imageListUrl.trim()
              ? data.data.imageListUrl
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

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const handlePrev = () => {
    if (goods) {
      setPreviewIndex((prev) => (prev - 1 + goods.imageUrlList.length) % goods.imageUrlList.length);
    }
  };

  const handleNext = () => {
    if (goods) {
      setPreviewIndex((prev) => (prev + 1) % goods.imageUrlList.length);
    }
  };

  if (loading) {
    return (
      <section className="bg-gray-100 min-h-[calc(100vh-200px)]">
        <Skeleton />
      </section>
    );
  }

  if (!goods) {
    return (
      <section className="px-24 py-8 text-center bg-gray-100 min-h-[calc(100vh-200px)]">
        <h2 className="text-2xl text-gray-600">商品不存在</h2>
      </section>
    );
  }

  const mainImage = goods.imageUrlList.length === 0 ? EMPTY_IMAGE_URL : goods.imageUrlList[0];

  return (
    <section className="flex flex-col bg-gray-100 min-h-[calc(100vh-200px)]">
      {/* 商品信息头部 */}
      <div className="flex gap-12 px-24 py-12 bg-white mb-8 text-left">
        <div className="w-1/3">
          <img
            src={mainImage}
            alt={goods.name}
            className="max-h-[400px] w-full object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openPreview(0)}
          />
          {goods.imageUrlList.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {goods.imageUrlList.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${goods.name} ${index + 1}`}
                  className={`w-16 h-16 object-cover rounded cursor-pointer transition-all ${
                    index === 0 ? 'ring-2 ring-green-500' : 'hover:ring-2 hover:ring-gray-300'
                  }`}
                  onClick={() => openPreview(index)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-gray-800 mb-3 leading-tight">
            {goods.name}
          </h1>
          <h2 className="text-xl text-gray-500 font-medium mb-6">
            {goods.englishName}
          </h2>
          {goods.description && (
            <p className="text-gray-600 text-base leading-relaxed mt-5">
              {goods.description}
            </p>
          )}
          {goods.englishDescription && (
            <p className="text-gray-500 text-[15px] leading-relaxed mt-3">
              {goods.englishDescription}
            </p>
          )}
        </div>
      </div>

      {/* 商品详情介绍 */}
      {goods.introduction && (
        <div 
          dangerouslySetInnerHTML={{ __html: goods.introduction }}
          className="flex-1 px-24 pb-12 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:mx-auto"
        />
      )}

      {/* 图片预览弹窗 */}
      {previewOpen && (
        <ImagePreview
          images={goods.imageUrlList}
          currentIndex={previewIndex}
          onClose={() => setPreviewOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </section>
  );
}
