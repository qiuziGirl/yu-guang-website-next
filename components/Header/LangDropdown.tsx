"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { localizedPath } from "@/lib/locale-path";
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

interface LangDropdownProps {
  /** 选中语言后的回调，用于移动端关闭抽屉 */
  onSelected?: () => void;
}

export default function LangDropdown({ onSelected }: LangDropdownProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const lang = useSiteLang();
  const canHover = useSyncExternalStore(subscribeHover, getHoverSnapshot, () => true);
  const current = OPTIONS.find((item) => item.value === lang) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const selectLang = (next: SiteLang) => {
    setOpen(false);
    if (next === lang) {
      return;
    }
    writeSiteLang(next);
    notifySiteLangChange();
    onSelected?.();
    router.push(localizedPath(window.location.pathname, next));
  };

  return (
    <div
      ref={rootRef}
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
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1 text-gray-700 hover:text-green-500 transition-colors duration-300"
        onClick={() => setOpen((value) => !value)}
      >
        {current.label}
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute top-full right-0 pt-1 z-50">
          <div
            role="listbox"
            className="bg-white rounded-md shadow-lg border border-gray-100 py-1 min-w-[100px]"
          >
            {OPTIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                role="option"
                aria-selected={item.value === lang}
                className={`block w-full px-4 py-2 text-left hover:bg-gray-50 ${
                  item.value === lang ? "text-green-500" : "text-gray-700"
                }`}
                onClick={() => selectLang(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
