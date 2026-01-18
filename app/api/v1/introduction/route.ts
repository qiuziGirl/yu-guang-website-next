import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

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
      success: true,
      data: introduction,
    });
  } catch (error) {
    console.error("获取公司介绍失败:", error);
    return NextResponse.json(
      { success: false, message: "获取公司介绍失败" },
      { status: 500 }
    );
  }
}
