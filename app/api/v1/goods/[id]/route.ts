import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { toCamelCase } from "@/lib/utils";

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
      data: toCamelCase(goods),
    });
  } catch (error) {
    console.error("获取商品详情失败:", error);
    return NextResponse.json(
      { code: -1, message: "获取商品详情失败" },
      { status: 500 }
    );
  }
}
