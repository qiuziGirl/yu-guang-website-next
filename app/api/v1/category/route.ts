import { getCategoriesWithGoods } from "@/lib/data";
import { paginatedResponse, handleApiError } from "@/lib/api-response";

// GET /api/v1/category - 获取所有分类（包含商品列表）
export async function GET() {
  try {
    const list = await getCategoriesWithGoods();
    return paginatedResponse({ total: list.length, list });
  } catch (error) {
    return handleApiError(error, "分类列表");
  }
}
