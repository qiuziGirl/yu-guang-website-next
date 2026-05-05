import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import { getGoodsByCategoryId } from "@/lib/data";
import { paginatedResponse, errorResponse, handleApiError } from "@/lib/api-response";
import type { GoodsInfo } from "@/types/api";

// GET /api/v1/goods - 获取商品列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryIdRaw = searchParams.get("categoryId");

    let goodsList: GoodsInfo[];
    if (categoryIdRaw) {
      const id = Number(categoryIdRaw);
      if (!Number.isInteger(id) || id <= 0) {
        return errorResponse("categoryId 参数无效", 400);
      }
      goodsList = await getGoodsByCategoryId(id);
    } else {
      const goods = await prisma.goods.findMany({
        where: { deleted_at: null, status: 1 },
        orderBy: { created_at: "desc" },
      });
      goodsList = goods.map((g) => ({
        ...(toCamelCase(g) as unknown as GoodsInfo),
        price: g.price ? g.price.toString() : null,
      }));
    }

    return paginatedResponse({ total: goodsList.length, list: goodsList });
  } catch (error) {
    return handleApiError(error, "商品列表");
  }
}
