import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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

    return NextResponse.json({
      success: true,
      data: goods,
    });
  } catch (error) {
    console.error("获取商品列表失败:", error);
    return NextResponse.json(
      { success: false, message: "获取商品列表失败" },
      { status: 500 }
    );
  }
}
