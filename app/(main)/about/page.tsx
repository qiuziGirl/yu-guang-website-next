"use client";

import { useEffect, useState } from "react";

function Skeleton() {
  return (
    <div className="max-w-[1200px] mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
      <div className="h-4 bg-gray-200 rounded w-full mb-3" />
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-4/5 mb-6" />
      <div className="h-64 bg-gray-200 rounded mb-6" />
      <div className="h-4 bg-gray-200 rounded w-full mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  );
}

export default function AboutPage() {
  const [richText, setRichText] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntroduction = async () => {
      try {
        const res = await fetch("/api/v1/introduction");
        const data = await res.json();

        if (data.success && data.data) {
          setRichText(data.data.rich_text || "");
        }
      } catch (error) {
        console.error("获取公司介绍失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntroduction();
  }, []);

  if (loading) {
    return (
      <section className="px-24 py-10 bg-gray-100 min-h-[calc(100vh-200px)]">
        <Skeleton />
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-200px)] px-24 py-10 bg-white">
      <div
        dangerouslySetInnerHTML={{ __html: richText }}
        className="max-w-[1200px] mx-auto leading-relaxed text-gray-800 text-base
          [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-5
          [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-gray-900
          [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-gray-900
          [&_h3]:mt-5 [&_h3]:mb-3 [&_h3]:text-gray-900
          [&_p]:mb-4"
      />
    </section>
  );
}
