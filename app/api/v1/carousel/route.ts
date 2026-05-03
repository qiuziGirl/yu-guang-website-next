import { NextResponse } from "next/server";
import { getCarousels } from "@/lib/data";

// GET /api/v1/carousel - 获取轮播图列表
export async function GET() {
  try {
    const list = await getCarousels();
    return NextResponse.json({
      code: 0,
      message: "请求成功",
      data: {
        total: list.length,
        list,
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
