import { NextResponse } from "next/server";
import { getIntroduction } from "@/lib/data";

// GET /api/v1/introduction - 获取公司介绍
export async function GET() {
  try {
    const data = await getIntroduction();
    return NextResponse.json({
      code: 0,
      message: "请求成功",
      data,
    });
  } catch (error) {
    console.error("获取公司介绍失败:", error);
    return NextResponse.json(
      { code: -1, message: "获取公司介绍失败" },
      { status: 500 }
    );
  }
}
