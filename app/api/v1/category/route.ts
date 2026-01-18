import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/v1/category - 获取所有分类
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

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("获取分类列表失败:", error);
    return NextResponse.json(
      { success: false, message: "获取分类列表失败" },
      { status: 500 }
    );
  }
}
