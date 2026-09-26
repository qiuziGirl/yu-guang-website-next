import { getIntroduction } from "@/lib/data";
import {
  errorResponse,
  handleApiError,
  successResponse,
} from "@/lib/api-response";

// GET /api/v1/introduction?version=0|1 - 按语言获取已开启的公司介绍
export async function GET(request: Request) {
  try {
    const versionParam = new URL(request.url).searchParams.get("version");
    if (
      versionParam !== null &&
      versionParam !== "0" &&
      versionParam !== "1"
    ) {
      return errorResponse("version 参数不合法", 400);
    }
    const version = versionParam === "0" ? 0 : 1;
    const data = await getIntroduction(version);
    return successResponse(data);
  } catch (error) {
    return handleApiError(error, "公司介绍");
  }
}
