"use client";

import { useSyncExternalStore } from "react";

import { parseSiteLang, SITE_LANG_COOKIE, type SiteLang } from "@/lib/site-lang";

const langListeners = new Set<() => void>();

export function subscribeSiteLang(onStoreChange: () => void) {
  langListeners.add(onStoreChange);
  return () => {
    langListeners.delete(onStoreChange);
  };
}

export function readSiteLangSnapshot(): SiteLang {
  const matched = document.cookie.match(
    new RegExp(`(?:^|; )${SITE_LANG_COOKIE}=([^;]*)`)
  );
  return parseSiteLang(matched?.[1]);
}

export function notifySiteLangChange() {
  langListeners.forEach((listener) => listener());
}

export function useSiteLang(): SiteLang {
  return useSyncExternalStore(
    subscribeSiteLang,
    readSiteLangSnapshot,
    () => "zh" as SiteLang
  );
}
