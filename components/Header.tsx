"use client";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <nav className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <a href="/" className="flex items-center">
            <div className="text-black font-bold flex items-center">
              <span className="text-lg mr-1">▲</span>
              <span>Vercel</span>
            </div>
          </a>

          {/* 桌面端导航菜单 */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="relative group">
              <button className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-50 flex items-center">
                Products
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute top-full left-0 w-[400px] bg-white shadow-lg rounded-lg p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase">
                    DX Platform
                  </h3>
                  <div className="grid gap-4">
                    <a
                      href="#"
                      className="flex items-start p-3 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-xl">📋</span>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Previews</p>
                        <p className="text-xs text-gray-500">
                          Helping teams ship 6x faster
                        </p>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="flex items-start p-3 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-xl">🤖</span>
                      <div className="ml-3">
                        <p className="text-sm font-medium">AI</p>
                        <p className="text-xs text-gray-500">
                          Powering breakthroughs
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 其他导航项 */}
            <button className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-50">
              Solutions
            </button>
            <button className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-50">
              Resources
            </button>
            <a
              href="#"
              className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-50"
            >
              Enterprise
            </a>
            <a
              href="#"
              className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-50"
            >
              Docs
            </a>
            <a
              href="#"
              className="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-50"
            >
              Pricing
            </a>
          </div>
        </div>

        {/* 右侧按钮组 */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-sm text-gray-600 hover:text-black">
              Log In
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black">
              Contact
            </a>
            <a
              href="#"
              className="px-4 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-800"
            >
              Sign Up
            </a>
          </div>

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* 移动端菜单面板 */}
      <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
          <a
            href="#"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-md"
          >
            Products
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-md"
          >
            Solutions
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-md"
          >
            Resources
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-md"
          >
            Enterprise
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-md"
          >
            Docs
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-md"
          >
            Pricing
          </a>
          <div className="pt-4 border-t border-gray-200">
            <a
              href="#"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-md"
            >
              Log In
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-md"
            >
              Contact
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-base font-medium text-white bg-black hover:bg-gray-800 rounded-md text-center mt-2"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
