import { getCarousels } from "@/lib/data";
import { paginatedResponse, handleApiError } from "@/lib/api-response";

// GET /api/v1/carousel - 获取轮播图列表
export async function GET() {
  try {
    const list = await getCarousels();
    return paginatedResponse({ total: list.length, list });
  } catch (error) {
    return handleApiError(error, "轮播图列表");
  }
}
