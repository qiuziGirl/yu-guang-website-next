import { siteUrl } from "@/lib/site";
import type { SiteLang } from "@/lib/site-lang";

/** middleware 注入的请求头，供服务端读取 URL 语言 */
export const SITE_LANG_HEADER = "x-site-lang";

/** 从浏览器 pathname 判断语言 */
export function detectLocaleFromPath(pathname: string): SiteLang {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return "en";
  }
  return "zh";
}

/** 去掉 /en 前缀得到内部路由路径 */
export function stripEnPrefix(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) {
    const rest = pathname.slice(3);
    return rest.length === 0 ? "/" : rest;
  }
  return pathname;
}

/** 按语言生成站内路径（内部路径或带 /en 的 pathname 均可） */
export function localizedPath(pathname: string, lang: SiteLang): string {
  const internal = stripEnPrefix(
    pathname.startsWith("/") ? pathname : `/${pathname}`
  );

  if (lang === "en") {
    return internal === "/" ? "/en" : `/en${internal}`;
  }
  return internal;
}

/** 按语言生成绝对 URL，供 metadata / sitemap 使用 */
export function pageUrl(internalPath: string, lang: SiteLang): string {
  const normalized = internalPath.startsWith("/")
    ? internalPath
    : `/${internalPath}`;
  return `${siteUrl}${localizedPath(normalized, lang)}`;
}
