import { revalidatePath, revalidateTag } from "next/cache";

import {
  CACHE_TAG_SET,
  TAG_EXTRA_PATHS,
  type CacheTag,
  isAllowedRevalidatePath,
} from "@/lib/cache-tags";
import { errorResponse, successResponse } from "@/lib/api-response";

interface RevalidateBody {
  tags?: unknown;
  paths?: unknown;
}

// POST /api/revalidate - 管理端写操作后按需刷新官网缓存
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return errorResponse("未配置 REVALIDATE_SECRET", 503);
  }

  const headerSecret = request.headers.get("x-revalidate-secret");
  if (!headerSecret || headerSecret !== secret) {
    return errorResponse("Unauthorized", 401);
  }

  let body: RevalidateBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse("无效 JSON", 400);
  }

  const rawTags = Array.isArray(body.tags) ? body.tags : [];
  const rawPaths = Array.isArray(body.paths) ? body.paths : [];

  if (rawTags.length === 0 && rawPaths.length === 0) {
    return errorResponse("tags 或 paths 至少传一项", 400);
  }

  const tags: string[] = [];
  for (const tag of rawTags) {
    if (typeof tag !== "string" || !CACHE_TAG_SET.has(tag)) {
      return errorResponse(`无效的 tag: ${String(tag)}`, 400);
    }
    tags.push(tag);
  }

  const paths: string[] = [];
  for (const path of rawPaths) {
    if (typeof path !== "string" || !isAllowedRevalidatePath(path)) {
      return errorResponse(`无效的 path: ${String(path)}`, 400);
    }
    paths.push(path);
  }

  for (const tag of tags) {
    revalidateTag(tag);
    const extraPaths = TAG_EXTRA_PATHS[tag as CacheTag];
    if (extraPaths) {
      for (const path of extraPaths) {
        revalidatePath(path);
      }
    }
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return successResponse({ tags, paths });
}
