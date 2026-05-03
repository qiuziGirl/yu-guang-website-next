import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { toCamelCase } from "@/lib/utils";

// GET /api/v1/introduction - 获取公司介绍
export async function GET() {
  try {
    const introduction = await prisma.introduction.findFirst({
      where: {
        deleted_at: null,
        status: 1,
      },
      orderBy: {
        version: "desc",
      },
    });

    return NextResponse.json({
      code: 0,
      message: "请求成功",
      data: introduction ? toCamelCase(introduction) : null,
    });
  } catch (error) {
    console.error("获取公司介绍失败:", error);
    return NextResponse.json(
      { code: -1, message: "获取公司介绍失败" },
      { status: 500 }
    );
  }
}
