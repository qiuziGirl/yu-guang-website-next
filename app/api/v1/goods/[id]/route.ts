import { NextRequest, NextResponse } from "next/server";
import { getGoodsById } from "@/lib/data";

// GET /api/v1/goods/:id - 获取单个商品详情
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const goodsId = Number(id);

    if (!Number.isInteger(goodsId) || goodsId <= 0) {
      return NextResponse.json(
        { code: -1, message: "id 参数无效" },
        { status: 400 }
      );
    }

    const goods = await getGoodsById(goodsId);

    if (!goods) {
      return NextResponse.json(
        { code: -1, message: "商品不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 0,
      message: "请求成功",
      data: goods,
    });
  } catch (error) {
    console.error("获取商品详情失败:", error);
    return NextResponse.json(
      { code: -1, message: "获取商品详情失败" },
      { status: 500 }
    );
  }
}
