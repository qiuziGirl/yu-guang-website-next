import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
        { success: false, message: "商品不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: goods,
    });
  } catch (error) {
    console.error("获取商品详情失败:", error);
    return NextResponse.json(
      { success: false, message: "获取商品详情失败" },
      { status: 500 }
    );
  }
}
