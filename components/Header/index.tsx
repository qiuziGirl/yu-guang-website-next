"use client";

import { CategoryInfo, GoodsInfo } from "@/types/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useEffect, useState } from "react";

const languageMenu: MenuProps["items"] = [
  {
    key: "1",
    label: "中文",
  },
  {
    key: "2",
    label: "English",
    disabled: true,
  },
];

interface CategoryWithGoods extends CategoryInfo {
  goodsList?: GoodsInfo[];
}

export default function HeaderComponent() {
  const router = useRouter();
  const [categoryList, setCategoryList] = useState<CategoryWithGoods[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/category");
        const data = await res.json();
        if (data.success) {
          setCategoryList(data.data);
        }
      } catch (error) {
        console.error("获取分类失败:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <div
        style={{
          fontSize: "20px",
          fontWeight: 600,
          color: "#52c41a",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
        onClick={() => router.push("/")}
      >
        <img
          src="https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/logo_128x128.png"
          style={{ width: "36px", height: "36px", marginRight: "10px" }}
          alt="余光照明"
        />
        余光照明
      </div>
      <div style={{ display: "flex", fontSize: "15px", fontWeight: 400, alignItems: "center", gap: "40px" }}>
        {categoryList.map((category) => {
          const menuItemList: MenuProps["items"] = category.goodsList?.map(
            (goods) => ({
              key: goods.id,
              label: (
                <Link href={`/goods/${goods.id}`}>
                  {goods.name}
                </Link>
              ),
            })
          ) || [];

          if (menuItemList.length === 0) {
            return (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                style={{ 
                  cursor: "pointer", 
                  color: "#333",
                  textDecoration: "none"
                }}
                className="header-link"
              >
                {category.name}
              </Link>
            );
          }

          return (
            <Dropdown key={category.id} menu={{ items: menuItemList }}>
              <Link
                href={`/category/${category.id}`}
                style={{ 
                  cursor: "pointer", 
                  color: "#333",
                  textDecoration: "none"
                }}
                className="header-link"
              >
                {category.name}
              </Link>
            </Dropdown>
          );
        })}
        <Link 
          href="/about" 
          style={{ 
            color: "#333",
            textDecoration: "none"
          }}
          className="header-link"
        >
          关于余光
        </Link>
        <Dropdown menu={{ items: languageMenu }} arrow>
          <div 
            style={{ 
              cursor: "pointer",
              color: "#333"
            }}
            className="header-link"
          >
            中文
          </div>
        </Dropdown>
      </div>
    </>
  );
}
