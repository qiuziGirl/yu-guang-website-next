"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { writeSiteLang, type SiteLang } from "@/lib/site-lang";
import { notifySiteLangChange, useSiteLang } from "@/lib/use-site-lang";

const OPTIONS: { value: SiteLang; label: string }[] = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
];

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeHover(onStoreChange: () => void) {
  const media = window.matchMedia(HOVER_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getHoverSnapshot() {
  return window.matchMedia(HOVER_QUERY).matches;
}

export default function LangDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const lang = useSiteLang();
  const canHover = useSyncExternalStore(subscribeHover, getHoverSnapshot, () => true);
  const current = OPTIONS.find((item) => item.value === lang) ?? OPTIONS[0];

  const selectLang = (next: SiteLang) => {
    writeSiteLang(next);
    notifySiteLangChange();
    setOpen(false);
    router.refresh();
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        if (canHover) setOpen(true);
      }}
      onMouseLeave={() => {
        if (canHover) setOpen(false);
      }}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-gray-700 hover:text-green-500 transition-colors duration-300"
        onClick={() => {
          if (!canHover) setOpen((value) => !value);
        }}
      >
        {current.label}
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-100 py-1 min-w-[100px] z-50">
          {OPTIONS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`block w-full px-4 py-2 text-left hover:bg-gray-50 ${
                item.value === lang ? "text-green-500" : "text-gray-700"
              }`}
              onClick={() => selectLang(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
