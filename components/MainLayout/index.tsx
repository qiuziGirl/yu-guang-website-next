"use client";

import { Layout } from "antd";
import HeaderComponent from "@/components/Header";
import FooterComponent from "@/components/Footer";

const { Header, Footer, Content } = Layout;

const headerStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 1000,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#333",
  height: 64,
  paddingLeft: 80,
  paddingRight: 80,
  backgroundColor: "#fff",
  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.06)",
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  textAlign: "center",
  color: "#333",
};

const footerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#316bab",
};

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Layout style={{ display: "flex", minHeight: "100vh" }}>
      <Header style={headerStyle}>
        <HeaderComponent />
      </Header>
      <Content style={contentStyle}>{children}</Content>
      <Footer style={footerStyle}>
        <FooterComponent />
      </Footer>
    </Layout>
  );
}
