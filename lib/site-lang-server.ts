import "server-only";

import { cookies } from "next/headers";

import { parseSiteLang, SITE_LANG_COOKIE, type SiteLang } from "@/lib/site-lang";

/** 服务端读取当前站点语言 */
export async function readSiteLang(): Promise<SiteLang> {
  const store = await cookies();
  return parseSiteLang(store.get(SITE_LANG_COOKIE)?.value);
}
