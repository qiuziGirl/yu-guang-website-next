export type SiteLang = "zh" | "en";

export const SITE_LANG_COOKIE = "site-lang";

export function parseSiteLang(value: string | undefined): SiteLang {
  return value === "en" ? "en" : "zh";
}

export function introductionVersion(lang: SiteLang): number {
  return lang === "en" ? 0 : 1;
}

export function writeSiteLang(lang: SiteLang) {
  document.cookie = `${SITE_LANG_COOKIE}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
