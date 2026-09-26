# 全面响应式（移动端）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让余光照明官网在手机 / 平板 / 桌面均可正常浏览与导航：`lg` 以下右侧抽屉导航，并全面收紧各页边距与网格。

**Architecture:** 以 Tailwind `sm/md/lg` 断点改造现有组件；导航交互集中在 Client 的 Header（汉堡 + 右侧抽屉）；首页推荐区小屏单列、桌面保持 5/7 分栏；视频 Swiper 使用 `breakpoints`；Footer Tooltip 增加点击切换。不引入新 UI 库。

**Tech Stack:** Next.js 16 App Router、React 19、Tailwind CSS 4、lucide-react、Swiper 11

**Spec:** `docs/superpowers/specs/2026-09-26-mobile-responsive-design.md`

## Global Constraints

- 导航切换点：`lg`（1024px）；`< lg` 汉堡+抽屉，`≥ lg` 横排导航
- 抽屉：右侧滑入、遮罩、Esc、点链接关闭、打开时锁定 `body` 滚动；汉堡切换为 X
- 无新 UI 依赖；不改 SEO/缓存/`notFound`；不恢复 `(main)/loading.tsx`
- 注释简体中文、不编号；禁止 TypeScript `any`
- 直接在 `master` 分支改动（用户偏好）；Git 提交仅在用户明确要求时执行
- 验证：`pnpm lint` / `pnpm build`；375 / 768 / 1280 目视

---

## File Map

| 文件 | 职责 |
|------|------|
| `components/MainLayout/index.tsx` | header 响应式 padding / 高度 |
| `components/Header/index.tsx` | Client：Logo + 桌面 nav + 汉堡 + 抽屉 |
| `components/Footer/index.tsx` | 换行边距 + Tooltip 点击 |
| `app/(main)/HomeContent.tsx` | 轮播/推荐/视频响应式 |
| `app/(main)/category/[categoryId]/page.tsx` | 网格与边距 |
| `app/(main)/goods/[goodsId]/GoodsDetail.tsx` | 堆叠布局 |
| `app/(main)/about/page.tsx` | 边距 |
| `app/(main)/privacy-policy/page.tsx` | 边距与字号 |
| `app/globals.css` | 可选：小屏视频 nav 微调 |
| `README.md` | 一句响应式说明 |

---

### Task 1: MainLayout + Header 右侧抽屉

**Files:**
- Modify: `components/MainLayout/index.tsx`
- Modify: `components/Header/index.tsx`（改为 `"use client"`）
- Keep: `components/Header/LangDropdown.tsx`（复用）

**Interfaces:**
- Consumes: `CategoryInfo[]` props（不变）
- Produces: 响应式 Header（抽屉行为见 Global Constraints）

- [ ] **Step 1: 更新 `MainLayout` header 类名**

将 header 的：

```tsx
<header className="sticky top-0 z-50 flex justify-between items-center h-20 px-16 bg-white shadow-sm">
```

改为：

```tsx
<header className="sticky top-0 z-50 flex justify-between items-center h-16 lg:h-20 px-4 sm:px-6 lg:px-16 bg-white shadow-sm">
```

- [ ] **Step 2: 重写 `components/Header/index.tsx` 为 Client 组件**

完整替换为（可按项目格式微调，但行为必须满足 spec）：

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { CategoryInfo } from "@/types/api";
import LangDropdown from "./LangDropdown";

interface HeaderProps {
  categories: CategoryInfo[];
}

export default function HeaderComponent({ categories }: HeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const navLinks = (
    <>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.id}`}
          className="text-gray-700 hover:text-green-500 transition-colors duration-300"
          onClick={close}
        >
          {category.name}
        </Link>
      ))}
      <Link
        href="/about"
        className="text-gray-700 hover:text-green-500 transition-colors duration-300"
        onClick={close}
      >
        关于余光
      </Link>
    </>
  );

  return (
    <>
      <Link
        href="/"
        className="flex items-center text-lg lg:text-xl font-semibold text-green-500"
        onClick={close}
      >
        <Image
          src="https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/logo_128x128.png"
          width={36}
          height={36}
          className="mr-2.5"
          alt="余光照明"
          priority
        />
        余光照明
      </Link>

      <nav className="hidden lg:flex items-center gap-14 text-xl font-semibold">
        {navLinks}
        <LangDropdown />
      </nav>

      <button
        type="button"
        className="lg:hidden inline-flex items-center justify-center p-2 text-gray-700 hover:text-green-500"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={open ? "关闭菜单" : "打开菜单"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="关闭菜单遮罩"
            onClick={close}
          />
          <aside
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="菜单"
            className="absolute right-0 top-0 h-full w-[min(80vw,320px)] bg-white shadow-xl flex flex-col p-6 gap-1 text-lg font-semibold"
          >
            <div className="flex flex-col gap-1 mt-10">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="py-3 text-gray-700 hover:text-green-500 border-b border-gray-100"
                  onClick={close}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/about"
                className="py-3 text-gray-700 hover:text-green-500 border-b border-gray-100"
                onClick={close}
              >
                关于余光
              </Link>
            </div>
            <div className="mt-6">
              <LangDropdown />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
```

注意：桌面 `navLinks` 里的 `onClick={close}` 无害（`open` 已为 false）。抽屉层用 `z-[60]` 盖过 sticky header（`z-50`）。

- [ ] **Step 3: 本地目视**

DevTools 宽度 375：可见汉堡，点开右侧抽屉，遮罩/Esc/链接可关，背景不可滚。  
宽度 1280：横排导航，无汉堡。

- [ ] **Step 4: Commit（仅用户要求时）**

```text
feat: 移动端右侧抽屉导航与 Header 响应式边距
```

---

### Task 2: 首页 HomeContent 响应式

**Files:**
- Modify: `app/(main)/HomeContent.tsx`
- Modify (optional): `app/globals.css`

**Interfaces:**
- Consumes: 现有 `categoryList` / `carouselList`
- Produces: 小屏可用的轮播、推荐、视频区

- [ ] **Step 1: 轮播高度响应式**

将固定 `h-[490px]` 的容器与 slide 改为：

```tsx
<div className="h-[220px] sm:h-[320px] lg:h-[490px] overflow-hidden">
  ...
  <div className="relative w-full h-[220px] sm:h-[320px] lg:h-[490px]">
```

- [ ] **Step 2: 推荐标题与分区**

标题：

```tsx
<h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mt-8 mb-6 lg:mt-12 lg:mb-10 px-4 lg:px-0">
  为您推荐
</h2>
```

外层：

```tsx
<div className="px-4 lg:px-10 pb-10 lg:pb-16 max-w-[1400px] mx-auto">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
    <div className="lg:col-span-5">
      {/* 大图区：封面高度 h-[240px] lg:h-[450px]；内边距 p-5 lg:p-8 */}
    </div>
    <div className="lg:col-span-7">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
        {/* 卡片；图高 h-[160px] lg:h-[200px] */}
      </div>
    </div>
  </div>
</div>
```

保留现有点击切换 `activeCategory` 与「了解更多」逻辑。

- [ ] **Step 3: 视频 Swiper breakpoints**

```tsx
<div className="px-4 lg:px-10 py-10 lg:py-16 max-w-[1400px] mx-auto">
  <Swiper
    modules={[Navigation]}
    spaceBetween={16}
    navigation={true}
    loop={carouselVideoList.length > 3}
    breakpoints={{
      0: { slidesPerView: 1, spaceBetween: 12 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 30 },
    }}
    className="video-swiper"
  >
    {carouselVideoList.map((item, index) => (
      <SwiperSlide key={index}>
        <div className="relative w-full h-[200px] sm:h-[280px] lg:h-[350px] bg-black">
          <video
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            controls
            playsInline
            className="w-full h-full"
            data-video-index={index}
            data-src={item.videoUrl}
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>
```

若小屏导航按钮过大，在 `globals.css` 增加：

```css
@media (max-width: 1023px) {
  .video-swiper .swiper-button-next,
  .video-swiper .swiper-button-prev {
    width: 32px;
    height: 32px;
  }
  .video-swiper .swiper-button-next:after,
  .video-swiper .swiper-button-prev:after {
    font-size: 14px;
  }
}
```

- [ ] **Step 4: 目视 375 / 1280 首页**

- [ ] **Step 5: Commit（仅用户要求时）**

```text
feat: 首页轮播、推荐区与视频 Swiper 响应式布局
```

---

### Task 3: 分类页 + 商品详情响应式

**Files:**
- Modify: `app/(main)/category/[categoryId]/page.tsx`
- Modify: `app/(main)/goods/[goodsId]/GoodsDetail.tsx`

- [ ] **Step 1: 分类页 section / grid**

```tsx
<section className="flex justify-center px-4 md:px-10 lg:px-24 py-6 md:py-10 bg-gray-100 min-h-[calc(100vh-200px)]">
  ...
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-[1400px] w-full">
    ...
    <div className="relative w-full h-[200px] md:h-[240px] lg:h-[280px] overflow-hidden bg-gray-50">
```

卡片内边距可 `p-4 md:p-6`。保留 `generateMetadata` / `notFound` 不变。

- [ ] **Step 2: 商品详情头部堆叠**

将商品信息头部大致改为：

```tsx
<div className="flex flex-col lg:flex-row gap-6 lg:gap-12 px-4 md:px-10 lg:px-24 py-8 lg:py-12 bg-white mb-6 lg:mb-8 text-left">
  <div className="w-full lg:w-1/3">
    <div className="relative w-full h-[280px] lg:h-[400px] cursor-pointer ...">
      ...
    </div>
    ...
  </div>
  <div className="flex-1">
    <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-3 leading-tight">
      {goods.name}
    </h1>
    <h2 className="text-lg lg:text-xl text-gray-500 font-medium mb-4 lg:mb-6">
      {goods.englishName}
    </h2>
    ...
  </div>
</div>
```

介绍区：

```tsx
className="flex-1 px-4 md:px-10 lg:px-24 pb-8 lg:pb-12 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:mx-auto"
```

预览弹窗逻辑保持不变。

- [ ] **Step 3: 目视分类与商品 375 / 1280**

- [ ] **Step 4: Commit（仅用户要求时）**

```text
feat: 分类列表与商品详情响应式布局
```

---

### Task 4: 关于页 + 隐私页响应式

**Files:**
- Modify: `app/(main)/about/page.tsx`
- Modify: `app/(main)/privacy-policy/page.tsx`

- [ ] **Step 1: 关于页**

```tsx
<section className="min-h-[calc(100vh-200px)] px-4 md:px-10 lg:px-24 py-8 md:py-10 bg-white">
```

- [ ] **Step 2: 隐私页**

去掉 `px-[15vh]` / `py-[3vw]` / `pb-[5vh]` / 固定 `text-[56px]`。示例：

```tsx
<section className="px-4 md:px-10 lg:px-24 py-8 md:py-12 text-left max-w-[960px] mx-auto">
  <h1 className="text-3xl md:text-4xl lg:text-5xl pb-1">Cookies Policy</h1>
  ...
  <p className="text-gray-700 text-base md:text-lg leading-relaxed py-4">
  ...
  <h2 className="text-xl md:text-2xl font-bold mt-8">Information Collection</h2>
  <p className="text-gray-700 text-base md:text-lg leading-relaxed pb-8 md:pb-12">
```

所有原 `pb-[5vh]` 改为 `pb-8 md:pb-12`；`text-[26px]` 标题改为 `text-xl md:text-2xl`。

- [ ] **Step 3: 目视**

- [ ] **Step 4: Commit（仅用户要求时）**

```text
feat: 关于页与隐私页响应式排版
```

---

### Task 5: Footer 响应式 + Tooltip 点击

**Files:**
- Modify: `components/Footer/index.tsx`

- [ ] **Step 1: 外层与版权行**

根内容外包一层：

```tsx
<div className="px-4">
  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-4">
    ...
  </div>
  <div className="text-sm md:text-lg leading-relaxed">
    ...
  </div>
</div>
```

- [ ] **Step 2: TooltipIcon 增加点击切换**

在现有 hover 逻辑上增加：

- `onClick`：`setOpen((v) => !v)` 并 `updateAnchor()`（手机）
- `useEffect`：当 `open` 时监听 `pointerdown`，若点击不在 `wrapRef` / `panelRef` 内则 `setOpen(false)`
- 保留桌面 `onMouseEnter` / `onMouseLeave` + 延迟关闭

示意（合并进现有组件，勿丢 hydration / portal 逻辑）：

```tsx
useEffect(() => {
  if (!open) return;
  const onPointerDown = (e: PointerEvent) => {
    const t = e.target;
    if (!(t instanceof Node)) return;
    if (wrapRef.current?.contains(t)) return;
    if (panelRef.current?.contains(t)) return;
    setOpen(false);
  };
  document.addEventListener("pointerdown", onPointerDown);
  return () => document.removeEventListener("pointerdown", onPointerDown);
}, [open]);

// 触发器：
onClick={() => {
  clearCloseTimer();
  updateAnchor();
  setOpen((v) => !v);
}}
```

- [ ] **Step 3: 375 宽度点击图标应出现二维码面板**

- [ ] **Step 4: Commit（仅用户要求时）**

```text
feat: Footer 响应式与社交二维码点击展开
```

---

### Task 6: README + 全量验证

**Files:**
- Modify: `README.md`

- [ ] **Step 1: README 第一阶段能力附近增加一句**

```markdown
- 全站响应式布局：`lg` 以下右侧抽屉导航，首页/分类/商品/关于/隐私适配手机与平板
```

- [ ] **Step 2: `pnpm lint`**

Expected: 无新增错误

- [ ] **Step 3: `pnpm build`**

Expected: 成功

- [ ] **Step 4: 手工检查清单**

| 检查 | 期望 |
|------|------|
| 375 首页 | 汉堡可用；轮播不高出屏；推荐单列；视频 1 列 |
| 375 抽屉 | 遮罩/Esc/链接关闭；body 锁定 |
| 1280 首页 | 横排导航；5/7 推荐；视频 3 列 |
| 375 分类 | 1 列卡片 |
| 375 商品 | 图上文下 |
| 375 关于/隐私 | 无横向溢出 |
| 375 Footer | 点击图标出二维码 |

- [ ] **Step 5: Commit（仅用户要求时）**

可与 README 一并提交，或等用户统一提交推送。

---

## Spec coverage checklist

| Spec 项 | Task |
|---------|------|
| MainLayout padding / 高度 | Task 1 |
| 汉堡 + 右侧抽屉 + a11y + body lock | Task 1 |
| 首页轮播/推荐/视频 | Task 2 |
| 分类网格 | Task 3 |
| 商品详情堆叠 | Task 3 |
| 关于 / 隐私 | Task 4 |
| Footer + Tooltip 点击 | Task 5 |
| lint/build/目视 + README | Task 6 |
| 非目标（SEO/loading/新库） | 全任务遵守 |

## Self-review notes

- Header 单文件 Client 实现抽屉，避免过度拆分；若后续变复杂可再抽 `MobileNavDrawer.tsx`。
- 视频 `loop` 按 `length > 3` 判断，避免 Swiper 警告。
- 不恢复 segment `loading.tsx`。
