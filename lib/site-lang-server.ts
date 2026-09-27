import "server-only";

import { cookies, headers } from "next/headers";

import { SITE_LANG_HEADER } from "@/lib/locale-path";
import { parseSiteLang, SITE_LANG_COOKIE, type SiteLang } from "@/lib/site-lang";

/** 服务端读取当前站点语言：URL 优先，其次 cookie */
export async function readSiteLang(): Promise<SiteLang> {
  const headerStore = await headers();
  const fromUrl = headerStore.get(SITE_LANG_HEADER);
  if (fromUrl === "en" || fromUrl === "zh") {
    return fromUrl;
  }

  const store = await cookies();
  return parseSiteLang(store.get(SITE_LANG_COOKIE)?.value);
}
