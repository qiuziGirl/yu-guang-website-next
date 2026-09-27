/** 与 lib/data.ts 中 unstable_cache tags 保持一致 */
export const CACHE_TAGS = [
  "nav-categories",
  "home-categories",
  "carousels",
  "introduction",
  "category-goods",
  "goods",
  "sitemap",
] as const;

export type CacheTag = (typeof CACHE_TAGS)[number];

export const CACHE_TAG_SET = new Set<string>(CACHE_TAGS);

/** tag 失效时额外刷新的页面路径 */
export const TAG_EXTRA_PATHS: Partial<Record<CacheTag, string[]>> = {
  introduction: ["/about"],
  "nav-categories": ["/"],
  "home-categories": ["/"],
  carousels: ["/"],
};

/** 允许按需刷新的路径白名单 */
export function isAllowedRevalidatePath(path: string): boolean {
  if (path === "/" || path === "/about") return true;
  return /^\/(category|goods)\/\d+$/.test(path);
}
