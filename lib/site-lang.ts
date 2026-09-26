export type SiteLang = "zh" | "en";

/** 顶栏语言偏好 cookie 名 */
export const SITE_LANG_COOKIE = "site-lang";

/** 解析 cookie 值为站点语言，缺省中文 */
export function parseSiteLang(value: string | undefined): SiteLang {
  return value === "en" ? "en" : "zh";
}

/** 站点语言对应简介表 version：英文 0，中文 1 */
export function introductionVersion(lang: SiteLang): number {
  return lang === "en" ? 0 : 1;
}

/** 写入语言 cookie 并供关于页刷新读取 */
export function writeSiteLang(lang: SiteLang) {
  document.cookie = `${SITE_LANG_COOKIE}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
