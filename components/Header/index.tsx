"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Menu, X } from "lucide-react";
import { uiCopy } from "@/lib/i18n/ui";
import { localizedPath } from "@/lib/locale-path";
import { localizedName } from "@/lib/site-lang";
import { useSiteLang } from "@/lib/use-site-lang";
import type { CategoryInfo } from "@/types/api";
import LangDropdown from "./LangDropdown";

interface HeaderProps {
  categories: CategoryInfo[];
}

const DESKTOP_QUERY = "(min-width: 1024px)";
const DRAWER_TRANSITION_MS = 300;

const subscribeDesktop = (onStoreChange: () => void) => {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
};
const getDesktopSnapshot = () => window.matchMedia(DESKTOP_QUERY).matches;
const getDesktopServerSnapshot = () => true;

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFocusable(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.tabIndex !== -1 && !el.hasAttribute("disabled")
  );
}

export default function HeaderComponent({ categories }: HeaderProps) {
  const lang = useSiteLang();
  const copy = uiCopy(lang);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const openedOnceRef = useRef(false);
  const framesRef = useRef<number[]>([]);
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot
  );

  const close = useCallback(() => {
    framesRef.current.forEach((id) => cancelAnimationFrame(id));
    framesRef.current = [];
    setOpen(false);
    setShown(false);
  }, []);

  const openMenu = useCallback(() => {
    framesRef.current.forEach((id) => cancelAnimationFrame(id));
    framesRef.current = [];
    setMounted(true);
    setOpen(true);
    const firstFrame = requestAnimationFrame(() => {
      const secondFrame = requestAnimationFrame(() => setShown(true));
      framesRef.current.push(secondFrame);
    });
    framesRef.current.push(firstFrame);
  }, []);

  // 滑出结束后卸载抽屉
  useEffect(() => {
    if (open || !mounted) return;
    const drawer = drawerRef.current;
    if (!drawer) {
      const frame = requestAnimationFrame(() => setMounted(false));
      return () => cancelAnimationFrame(frame);
    }
    let cancelled = false;
    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      setMounted(false);
    };
    const onEnd = (event: TransitionEvent) => {
      if (event.target !== drawer) return;
      if (event.propertyName !== "translate" && event.propertyName !== "transform") return;
      finish();
    };
    drawer.addEventListener("transitionend", onEnd);
    const timer = window.setTimeout(finish, DRAWER_TRANSITION_MS + 50);
    return () => {
      cancelled = true;
      drawer.removeEventListener("transitionend", onEnd);
      window.clearTimeout(timer);
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      if (mq.matches) close();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [close]);

  // 打开后焦点进入抽屉；关闭后回到汉堡按钮
  useEffect(() => {
    if (!open || !shown) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const first = getFocusable(drawer)[0];
    (first ?? drawer).focus();
  }, [open, shown]);

  useEffect(() => {
    if (open) {
      openedOnceRef.current = true;
      return;
    }
    if (!openedOnceRef.current) return;
    menuButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const drawer = drawerRef.current;
      const button = menuButtonRef.current;
      if (!drawer || !button) return;
      const cycle = [button, ...getFocusable(drawer)];
      const current = document.activeElement;
      const index = cycle.indexOf(current as HTMLElement);
      event.preventDefault();
      if (event.shiftKey) {
        const next = index <= 0 ? cycle[cycle.length - 1] : cycle[index - 1];
        next.focus();
        return;
      }
      const next = index === -1 || index >= cycle.length - 1 ? cycle[0] : cycle[index + 1];
      next.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const navLinks = (
    <>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={localizedPath(`/category/${category.id}`, lang)}
          className="text-gray-700 hover:text-green-500 transition-colors duration-300"
          onClick={close}
        >
          {localizedName(category, lang)}
        </Link>
      ))}
      <Link
        href={localizedPath("/about", lang)}
        className="text-gray-700 hover:text-green-500 transition-colors duration-300"
        onClick={close}
      >
        {copy.navAbout}
      </Link>
    </>
  );

  return (
    <>
      <Link
        href={localizedPath("/", lang)}
        className="flex items-center text-xl lg:text-2xl font-semibold text-green-500"
        onClick={close}
      >
        <Image
          src="https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/logo_128x128.png"
          width={48}
          height={48}
          className="mr-2.5 w-10 h-10 lg:w-12 lg:h-12"
          alt={copy.brandName}
          priority
        />
        {copy.brandName}
      </Link>

      <nav className="hidden lg:flex items-center gap-14 text-xl font-semibold">
        {navLinks}
        {isDesktop && <LangDropdown />}
      </nav>

      <button
        ref={menuButtonRef}
        type="button"
        className={`lg:hidden inline-flex items-center justify-center p-2 text-gray-700 hover:text-green-500${mounted ? " relative z-70" : ""}`}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={open ? copy.menuClose : copy.menuOpen}
        onClick={() => (open ? close() : openMenu())}
      >
        {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
      </button>

      {mounted && (
        <div
          className="fixed inset-0 z-60 lg:hidden"
          role="presentation"
        >
          <button
            type="button"
            tabIndex={-1}
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"}`}
            aria-label={copy.menuOverlay}
            onClick={close}
          />
          <aside
            ref={drawerRef}
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={copy.menuDialog}
            tabIndex={-1}
            className={`absolute right-0 top-0 h-full w-[min(72vw,280px)] bg-white shadow-xl flex flex-col p-6 gap-1 text-lg font-semibold transition-transform duration-300 ${shown ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex flex-col gap-1 mt-10">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={localizedPath(`/category/${category.id}`, lang)}
                  className="py-3 text-gray-700 hover:text-green-500 border-b border-gray-100"
                  onClick={close}
                >
                  {localizedName(category, lang)}
                </Link>
              ))}
              <Link
                href={localizedPath("/about", lang)}
                className="py-3 text-gray-700 hover:text-green-500 border-b border-gray-100"
                onClick={close}
              >
                {copy.navAbout}
              </Link>
            </div>
            {!isDesktop && (
              <div className="mt-6">
                <LangDropdown onSelected={close} />
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
