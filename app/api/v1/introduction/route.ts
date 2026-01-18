import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// 将下划线命名转换为驼峰命名
function toCamelCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = obj[key];
  }
  return result;
}

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
      data: introduction ? toCamelCase(introduction as unknown as Record<string, unknown>) : null,
    });
  } catch (error) {
    console.error("获取公司介绍失败:", error);
    return NextResponse.json(
      { code: -1, message: "获取公司介绍失败" },
      { status: 500 }
    );
  }
}
