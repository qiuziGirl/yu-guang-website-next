import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
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
        <AntdRegistry>
          <ConfigProvider locale={zhCN}>
            <MainLayout>{children}</MainLayout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
