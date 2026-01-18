import type { Metadata } from "next";
import MainLayout from "@/components/MainLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "余光照明",
  description: "中山市余光照明科技有限公司 - 专业LED太阳能路灯、投光灯、工矿灯、花园灯生产商",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
