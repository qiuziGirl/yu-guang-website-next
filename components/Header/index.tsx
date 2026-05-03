import Link from "next/link";
import type { CategoryInfo } from "@/types/api";
import LangDropdown from "./LangDropdown";

interface HeaderProps {
  categories: CategoryInfo[];
}

export default function HeaderComponent({ categories }: HeaderProps) {
  return (
    <>
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center text-xl font-semibold text-green-500"
      >
        <img
          src="https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/logo_128x128.png"
          className="w-9 h-9 mr-2.5"
          alt="余光照明"
        />
        余光照明
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-14 text-xl font-semibold">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="text-gray-700 hover:text-green-500 transition-colors duration-300"
          >
            {category.name}
          </Link>
        ))}

        <Link
          href="/about"
          className="text-gray-700 hover:text-green-500 transition-colors duration-300"
        >
          关于余光
        </Link>

        <LangDropdown />
      </nav>
    </>
  );
}
