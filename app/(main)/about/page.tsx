"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "antd";

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
      <section style={{ padding: "40px 100px", backgroundColor: "#f6f6f6", minHeight: "calc(100vh - 200px)" }}>
        <Skeleton active />
      </section>
    );
  }

  return (
    <section
      style={{ 
        minHeight: "calc(100vh - 200px)", 
        padding: "40px 100px",
        backgroundColor: "#fff"
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: richText }}
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          lineHeight: "1.8",
          color: "#333",
          fontSize: "16px"
        }}
      />
      <style jsx global>{`
        section img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 20px 0;
        }
        section h1, section h2, section h3 {
          margin-top: 30px;
          margin-bottom: 15px;
          color: #222;
        }
        section p {
          margin-bottom: 15px;
        }
      `}</style>
    </section>
  );
}
