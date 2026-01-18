import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// 将下划线命名转换为驼峰命名
function toCamelCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = obj[key];
  }
  return result;
}

// GET /api/v1/category - 获取所有分类（包含商品列表）
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        deleted_at: null,
        status: 1,
      },
      orderBy: {
        sort: "asc",
      },
    });

    // 获取每个分类下的商品
    const categoriesWithGoods = await Promise.all(
      categories.map(async (category) => {
        const goodsList = await prisma.goods.findMany({
          where: {
            category_id: category.id,
            deleted_at: null,
            status: 1,
          },
        });
        return {
          ...toCamelCase(category as unknown as Record<string, unknown>),
          goodsList: goodsList.map((g) => toCamelCase(g as unknown as Record<string, unknown>)),
        };
      })
    );

    return NextResponse.json({
      code: 0,
      message: "请求成功",
      data: {
        total: categoriesWithGoods.length,
        list: categoriesWithGoods,
      },
    });
  } catch (error) {
    console.error("获取分类列表失败:", error);
    return NextResponse.json(
      { code: -1, message: "获取分类列表失败" },
      { status: 500 }
    );
  }
}
