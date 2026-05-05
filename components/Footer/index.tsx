"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

interface TooltipIconProps {
  icon: React.ReactNode;
  imageUrl: string;
  alt: string;
}

interface AnchorPosition {
  centerX: number;
  iconTop: number;
}

function TooltipIcon({ icon, imageUrl, alt }: TooltipIconProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<AnchorPosition>({ centerX: 0, iconTop: 0 });

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== undefined) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = undefined;
    }, 200);
  }, [clearCloseTimer]);

  const updateAnchor = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setAnchor({
      centerX: r.left + r.width / 2,
      iconTop: r.top,
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  useLayoutEffect(() => {
    if (!open) return;
    updateAnchor();
    const sync = () => {
      updateAnchor();
    };
    window.addEventListener("scroll", sync, true);
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
    };
  }, [open, updateAnchor]);

  const handleTriggerEnter = () => {
    clearCloseTimer();
    const el = wrapRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setAnchor({
        centerX: r.left + r.width / 2,
        iconTop: r.top,
      });
    }
    setOpen(true);
  };

  const handleTriggerLeave = (e: React.MouseEvent) => {
    const next = e.relatedTarget;
    if (next instanceof Node && panelRef.current !== null && panelRef.current.contains(next)) {
      return;
    }
    scheduleClose();
  };

  const handlePanelEnter = () => {
    clearCloseTimer();
  };

  const handlePanelLeave = () => {
    scheduleClose();
  };

  const panel =
    mounted &&
    open &&
    createPortal(
      <div
        ref={panelRef}
        className="fixed z-100 w-max rounded-lg border border-[#b5c5d3] bg-white p-2 shadow-lg"
        style={{
          left: anchor.centerX,
          top: anchor.iconTop,
          transform: "translate(-50%, calc(-100% - 8px))",
        }}
        onMouseEnter={handlePanelEnter}
        onMouseLeave={handlePanelLeave}
      >
        <Image
          src={imageUrl}
          alt={alt}
          width={200}
          height={200}
          loading="eager"
          className="rounded"
        />
      </div>,
      document.body
    );

  return (
    <>
      <div
        ref={wrapRef}
        className="relative inline-block cursor-pointer transition-opacity hover:opacity-80"
        onMouseEnter={handleTriggerEnter}
        onMouseLeave={handleTriggerLeave}
      >
        {icon}
      </div>
      {panel}
    </>
  );
}

export default function FooterComponent() {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-center gap-6 mb-4">
        <span className="text-base">Contact US</span>

        <TooltipIcon
          icon={
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="5" />
              <path d="M16.5 7.5h.01" />
            </svg>
          }
          imageUrl="https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/yuGuang_instagram.jpg"
          alt="Instagram"
        />

        <TooltipIcon
          icon={
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          }
          imageUrl="https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/yuGuang_Facebook.jpg"
          alt="Facebook"
        />

        <TooltipIcon
          icon={
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          }
          imageUrl="https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/yuGuang_whatsapp.jpg"
          alt="WhatsApp"
        />

        <TooltipIcon
          icon={
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .55-.012.822-.034-.17-.545-.264-1.116-.264-1.71 0-3.583 3.478-6.48 7.772-6.48.161 0 .322.004.48.012-.652-3.532-4.106-6.27-8.309-6.27zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-3.555 0-6.438 2.427-6.438 5.42 0 1.718.951 3.25 2.438 4.253a.579.579 0 0 1 .209.65l-.309 1.165c-.019.071-.046.141-.046.212 0 .161.127.29.286.29a.325.325 0 0 0 .165-.054l1.582-.916a.72.72 0 0 1 .595-.081 7.17 7.17 0 0 0 2.358.365c3.555 0 6.439-2.426 6.439-5.42 0-2.993-2.884-5.422-6.439-5.422h-.84zm-2.508 3.15c.48 0 .87.396.87.883a.874.874 0 0 1-.87.884.874.874 0 0 1-.87-.884c0-.487.39-.883.87-.883zm5.16 0c.48 0 .87.396.87.883a.874.874 0 0 1-.87.884.874.874 0 0 1-.87-.884c0-.487.39-.883.87-.883z" />
            </svg>
          }
          imageUrl="https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/AAA_wechat.jpg"
          alt="WeChat"
        />
      </div>

      <div className="text-lg">
        Copyright {dayjs().format("YYYY")}© Yuguang Enterprises.
        <span
          className="pl-1 cursor-pointer hover:underline"
          onClick={() => router.push("/privacy-policy")}
        >
          Privacy Policy
        </span>
      </div>
    </div>
  );
}


