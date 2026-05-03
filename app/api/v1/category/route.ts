import { NextResponse } from "next/server";
import { getCategoriesWithGoods } from "@/lib/data";

// GET /api/v1/category - 获取所有分类（包含商品列表）
export async function GET() {
  try {
    const list = await getCategoriesWithGoods();
    return NextResponse.json({
      code: 0,
      message: "请求成功",
      data: {
        total: list.length,
        list,
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
