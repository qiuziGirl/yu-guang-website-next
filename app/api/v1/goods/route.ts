import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// 将下划线命名转换为驼峰命名
function toCamelCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = obj[key];
  }
  return result;
}

// GET /api/v1/goods - 获取商品列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const where: { deleted_at: null; status: number; category_id?: number } = {
      deleted_at: null,
      status: 1,
    };

    if (categoryId) {
      where.category_id = parseInt(categoryId);
    }

    const goods = await prisma.goods.findMany({
      where,
      orderBy: {
        created_at: "desc",
      },
    });

    const goodsList = goods.map((g) => toCamelCase(g as unknown as Record<string, unknown>));

    return NextResponse.json({
      code: 0,
      message: "请求成功",
      data: {
        total: goodsList.length,
        list: goodsList,
      },
    });
  } catch (error) {
    console.error("获取商品列表失败:", error);
    return NextResponse.json(
      { code: -1, message: "获取商品列表失败" },
      { status: 500 }
    );
  }
}
