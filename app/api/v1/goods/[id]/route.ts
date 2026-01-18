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

// GET /api/v1/goods/:id - 获取单个商品详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const goodsId = parseInt(id);

    const goods = await prisma.goods.findFirst({
      where: {
        id: goodsId,
        deleted_at: null,
      },
    });

    if (!goods) {
      return NextResponse.json(
        { code: -1, message: "商品不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 0,
      message: "请求成功",
      data: toCamelCase(goods as unknown as Record<string, unknown>),
    });
  } catch (error) {
    console.error("获取商品详情失败:", error);
    return NextResponse.json(
      { code: -1, message: "获取商品详情失败" },
      { status: 500 }
    );
  }
}
