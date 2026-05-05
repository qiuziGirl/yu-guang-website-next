import { getIntroduction } from "@/lib/data";
import { successResponse, handleApiError } from "@/lib/api-response";

// GET /api/v1/introduction - 获取公司介绍
export async function GET() {
  try {
    const data = await getIntroduction();
    return successResponse(data);
  } catch (error) {
    return handleApiError(error, "公司介绍");
  }
}
