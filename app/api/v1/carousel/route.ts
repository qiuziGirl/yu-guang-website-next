import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/v1/carousel - 获取轮播图列表
export async function GET() {
  try {
    const carousels = await prisma.carousel.findMany({
      where: {
        deleted_at: null,
        status: 1,
      },
      orderBy: {
        sort: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: carousels,
    });
  } catch (error) {
    console.error("获取轮播图列表失败:", error);
    return NextResponse.json(
      { success: false, message: "获取轮播图列表失败" },
      { status: 500 }
    );
  }
}
