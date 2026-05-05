import { NextRequest } from "next/server";
import { getGoodsById } from "@/lib/data";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";

// GET /api/v1/goods/:id - 获取单个商品详情
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const goodsId = Number(id);

    if (!Number.isInteger(goodsId) || goodsId <= 0) {
      return errorResponse("id 参数无效", 400);
    }

    const goods = await getGoodsById(goodsId);

    if (!goods) {
      return errorResponse("商品不存在", 404);
    }

    return successResponse(goods);
  } catch (error) {
    return handleApiError(error, "商品详情");
  }
}
