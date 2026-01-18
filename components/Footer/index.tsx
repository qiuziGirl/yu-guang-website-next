"use client";

import {
  InstagramOutlined,
  WechatOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Image, Tooltip } from "antd";
import dayjs from "dayjs";

export default function FooterComponent() {
  const router = useRouter();

  return (
    <footer className="page-footer">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ paddingRight: "18px" }}>Contact US</span>

        <Tooltip
          placement="topLeft"
          color="#b5c5d3"
          title={
            <Image
              width={200}
              src="https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/yuGuang_instagram.jpg"
              alt="Instagram"
            />
          }
        >
          <InstagramOutlined
            style={{ marginRight: "22px", fontSize: "20px", cursor: "pointer" }}
          />
        </Tooltip>
        <Tooltip
          placement="topLeft"
          color="#b5c5d3"
          title={
            <Image
              width={200}
              src="https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/yuGuang_Facebook.jpg"
              alt="Facebook"
            />
          }
        >
          <span style={{ marginRight: "22px", fontSize: "20px", cursor: "pointer" }}>
            📘
          </span>
        </Tooltip>
        <Tooltip
          placement="topLeft"
          color="#b5c5d3"
          title={
            <Image
              width={200}
              src="https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/yuGuang_whatsapp.jpg"
              alt="WhatsApp"
            />
          }
        >
          <WhatsAppOutlined
            style={{ marginRight: "22px", fontSize: "20px", cursor: "pointer" }}
          />
        </Tooltip>
        <Tooltip
          placement="topLeft"
          color="#b5c5d3"
          title={
            <Image
              width={200}
              src="https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/AAA_wechat.jpg"
              alt="WeChat"
            />
          }
        >
          <WechatOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
        </Tooltip>
      </div>

      <div style={{ paddingTop: "12px" }}>
        Copyright {dayjs().format("YYYY")}© Yuguang Enterprises.
        <span
          className="link-text"
          onClick={() => router.push("/privacy-policy")}
          style={{ paddingLeft: "3px", cursor: "pointer" }}
        >
          Privacy Policy
        </span>
      </div>
    </footer>
  );
}
