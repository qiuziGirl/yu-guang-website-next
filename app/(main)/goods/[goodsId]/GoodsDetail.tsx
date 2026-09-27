"use client";

import { uiCopy } from "@/lib/i18n/ui";
import {
  localizedDescription,
  localizedGoodsIntroduction,
  localizedName,
  type SiteLang,
} from "@/lib/site-lang";
import { useSiteLang } from "@/lib/use-site-lang";
import { GoodsInfo } from "@/types/api";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import DOMPurify from "dompurify";

const EMPTY_IMAGE_URL =
  "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/empty.png";

interface GoodsDetailProps {
  goods: GoodsInfo;
  imageUrlList: string[];
  initialLang: SiteLang;
}

function ImagePreview({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  previewAlt,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  previewAlt: string;
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
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </>
      )}

      <div
        className="relative w-[90vw] h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex]}
          alt={previewAlt}
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
      </div>

      <div className="absolute bottom-4 text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

export default function GoodsDetail({
  goods,
  imageUrlList,
  initialLang,
}: GoodsDetailProps) {
  const clientLang = useSiteLang();
  const lang = clientLang || initialLang;
  const copy = uiCopy(lang);
  const displayName = localizedName(goods, lang);
  const displayDescription = localizedDescription(goods, lang);
  const displayIntroduction = localizedGoodsIntroduction(goods, lang);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const sanitizedIntroduction = useMemo(() => {
    if (typeof window !== "undefined" && displayIntroduction) {
      return DOMPurify.sanitize(displayIntroduction, {
        ALLOWED_TAGS: [
          "img",
          "p",
          "br",
          "strong",
          "em",
          "u",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "ul",
          "ol",
          "li",
          "a",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
        ],
        ALLOWED_ATTR: ["src", "alt", "title", "href", "target", "class"],
      });
    }
    return displayIntroduction || "";
  }, [displayIntroduction]);

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const handlePrev = () => {
    setPreviewIndex(
      (prev) => (prev - 1 + imageUrlList.length) % imageUrlList.length
    );
  };

  const handleNext = () => {
    setPreviewIndex((prev) => (prev + 1) % imageUrlList.length);
  };

  const mainImage =
    imageUrlList.length === 0 ? EMPTY_IMAGE_URL : imageUrlList[0];

  return (
    <section className="flex flex-col bg-gray-100 min-h-[calc(100vh-200px)]">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 px-4 md:px-10 lg:px-24 py-8 lg:py-12 bg-white mb-6 lg:mb-8 text-left">
        <div className="w-full lg:w-1/3">
          <div
            className="relative w-full h-[280px] lg:h-[400px] cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openPreview(0)}
          >
            <Image
              src={mainImage}
              alt={displayName}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-contain rounded-lg"
              priority
            />
          </div>
          {imageUrlList.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {imageUrlList.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => openPreview(index)}
                  className={`relative w-16 h-16 shrink-0 rounded overflow-hidden cursor-pointer transition-all ${
                    index === 0
                      ? "ring-2 ring-green-500"
                      : "hover:ring-2 hover:ring-gray-300"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`${displayName} ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-3 leading-tight">
            {displayName}
          </h1>
          {displayDescription && (
            <p className="text-gray-600 text-base leading-relaxed mt-5">
              {displayDescription}
            </p>
          )}
        </div>
      </div>

      {sanitizedIntroduction ? (
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedIntroduction }}
          className="flex-1 px-4 md:px-10 lg:px-24 pb-8 lg:pb-12 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:mx-auto"
        />
      ) : (
        lang === "en" &&
        goods.introduction?.trim() && (
          <p className="px-4 md:px-10 lg:px-24 pb-8 lg:pb-12 text-gray-500 text-sm">
            {copy.goodsIntroMissing}
          </p>
        )
      )}

      {previewOpen && (
        <ImagePreview
          images={imageUrlList}
          currentIndex={previewIndex}
          onClose={() => setPreviewOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
          previewAlt={copy.goodsPreviewAlt}
        />
      )}
    </section>
  );
}
