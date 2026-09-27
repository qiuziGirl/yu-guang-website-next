import type { Metadata } from "next";

import { pageUrl } from "@/lib/locale-path";
import type { SiteLang } from "@/lib/site-lang";

/** 生成页面的 canonical 与 hreflang alternates */
export function buildPageAlternates(
  internalPath: string,
  lang: SiteLang
): NonNullable<Metadata["alternates"]> {
  const normalized = internalPath.startsWith("/")
    ? internalPath
    : `/${internalPath}`;

  return {
    canonical: pageUrl(normalized, lang),
    languages: {
      "zh-CN": pageUrl(normalized, "zh"),
      en: pageUrl(normalized, "en"),
      "x-default": pageUrl(normalized, "zh"),
    },
  };
}
