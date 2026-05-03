import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { toCamelCase } from "@/lib/utils";

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

    const carouselList = carousels.map(toCamelCase);

    return NextResponse.json({
      code: 0,
      message: "请求成功",
      data: {
        total: carouselList.length,
        list: carouselList,
      },
    });
  } catch (error) {
    console.error("获取轮播图列表失败:", error);
    return NextResponse.json(
      { code: -1, message: "获取轮播图列表失败" },
      { status: 500 }
    );
  }
}
