"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function LangDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 text-gray-700 hover:text-green-500 transition-colors duration-300">
        中文
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-100 py-1 min-w-[100px] z-50">
          <div className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">
            中文
          </div>
          <div className="px-4 py-2 text-gray-400 cursor-not-allowed">
            English
          </div>
        </div>
      )}
    </div>
  );
}
