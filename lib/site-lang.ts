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

export function htmlLangAttr(lang: SiteLang): string {
  return lang === "en" ? "en" : "zh-CN";
}

export interface LocalizableFields {
  name: string;
  englishName: string;
  description?: string | null;
  englishDescription?: string | null;
}

/** 按语言取展示名称，英文缺失时回退中文名 */
export function localizedName(
  entity: LocalizableFields,
  lang: SiteLang
): string {
  if (lang === "en") {
    const en = entity.englishName?.trim();
    if (en) return en;
  }
  return entity.name;
}

/** 按语言取描述，英文缺失时不回退中文 */
export function localizedDescription(
  entity: LocalizableFields,
  lang: SiteLang
): string | null {
  if (lang === "en") {
    return entity.englishDescription?.trim() || null;
  }
  return entity.description?.trim() || null;
}

export interface GoodsIntroFields {
  introduction?: string | null;
  englishIntroduction?: string | null;
}

/** 按语言取商品详情富文本 */
export function localizedGoodsIntroduction(
  entity: GoodsIntroFields,
  lang: SiteLang
): string | null {
  if (lang === "en") {
    return entity.englishIntroduction?.trim() || null;
  }
  return entity.introduction?.trim() || null;
}
