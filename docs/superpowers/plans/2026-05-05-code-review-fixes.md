# 代码审查问题修复计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复5个代码审查中发现的问题：视频懒加载、API响应格式统一、API错误处理统一、移除不必要的客户端组件、添加空状态提示

**Architecture:**
- 创建 `lib/api-response.ts` 统一 API 响应格式和错误处理
- 修改 `HomeContent.tsx` 使用 Intersection Observer 实现视频懒加载
- 移除 `privacy-policy/page.tsx` 的 `"use client"` 指令
- 为 `category/[categoryId]/page.tsx` 添加空状态提示

**Tech Stack:** Next.js 15, React 19, TypeScript

---

## 文件结构

- Create: `lib/api-response.ts` — 统一 API 响应格式和错误处理
- Modify: `app/(main)/HomeContent.tsx:159-179` — 视频懒加载
- Modify: `app/(main)/privacy-policy/page.tsx:1` — 移除 `"use client"`
- Modify: `app/(main)/category/[categoryId]/page.tsx:22-56` — 添加空状态
- Modify: `app/api/v1/category/route.ts` — 使用统一响应
- Modify: `app/api/v1/goods/route.ts` — 使用统一响应
- Modify: `app/api/v1/goods/[id]/route.ts` — 使用统一响应
- Modify: `app/api/v1/carousel/route.ts` — 使用统一响应
- Modify: `app/api/v1/introduction/route.ts` — 使用统一响应

---

## Task 1: 创建统一 API 响应工具

**Files:**
- Create: `lib/api-response.ts`

- [ ] **Step 1: 创建 lib/api-response.ts**

```typescript
import { NextResponse } from "next/server";

interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

interface PaginatedData<T> {
  total: number;
  list: T[];
}

export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    code: 0,
    message: "请求成功",
    data,
  });
}

export function paginatedResponse<T>(data: PaginatedData<T>): NextResponse<ApiResponse<PaginatedData<T>>> {
  return NextResponse.json({
    code: 0,
    message: "请求成功",
    data,
  });
}

export function errorResponse(message: string, status: number = 500): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      code: -1,
      message,
      data: null,
    },
    { status }
  );
}

export function handleApiError(error: unknown, resourceName: string): NextResponse<ApiResponse<null>> {
  console.error(`获取${resourceName}失败:`, error);
  return errorResponse(`获取${resourceName}失败`, 500);
}
```

- [ ] **Step 2: 提交**

```bash
git add lib/api-response.ts
git commit -m "feat(api): add unified API response utilities"
```

---

## Task 2: 重构 category API 使用统一响应

**Files:**
- Modify: `app/api/v1/category/route.ts:1-23`

- [ ] **Step 1: 重构 category/route.ts**

修改 `app/api/v1/category/route.ts` 内容为：

```typescript
import { NextResponse } from "next/server";
import { getCategoriesWithGoods } from "@/lib/data";
import { paginatedResponse, handleApiError } from "@/lib/api-response";

// GET /api/v1/category - 获取所有分类（包含商品列表）
export async function GET() {
  try {
    const list = await getCategoriesWithGoods();
    return paginatedResponse({ total: list.length, list });
  } catch (error) {
    return handleApiError(error, "分类列表");
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add app/api/v1/category/route.ts
git commit -m "refactor(api): use unified API response in category route"
```

---

## Task 3: 重构 carousel API 使用统一响应

**Files:**
- Modify: `app/api/v1/carousel/route.ts:1-23`

- [ ] **Step 1: 重构 carousel/route.ts**

修改 `app/api/v1/carousel/route.ts` 内容为：

```typescript
import { NextResponse } from "next/server";
import { getCarousels } from "@/lib/data";
import { paginatedResponse, handleApiError } from "@/lib/api-response";

// GET /api/v1/carousel - 获取轮播图列表
export async function GET() {
  try {
    const list = await getCarousels();
    return paginatedResponse({ total: list.length, list });
  } catch (error) {
    return handleApiError(error, "轮播图列表");
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add app/api/v1/carousel/route.ts
git commit -m "refactor(api): use unified API response in carousel route"
```

---

## Task 4: 重构 introduction API 使用统一响应

**Files:**
- Modify: `app/api/v1/introduction/route.ts:1-20`

- [ ] **Step 1: 重构 introduction/route.ts**

修改 `app/api/v1/introduction/route.ts` 内容为：

```typescript
import { NextResponse } from "next/server";
import { getIntroduction } from "@/lib/data";
import { successResponse, handleApiError } from "@/lib/api-response";

// GET /api/v1/introduction - 获取公司介绍
export async function GET() {
  try {
    const data = await getIntroduction();
    return successResponse(data);
  } catch (error) {
    return handleApiError(error, "公司介绍");
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add app/api/v1/introduction/route.ts
git commit -m "refactor(api): use unified API response in introduction route"
```

---

## Task 5: 重构 goods list API 使用统一响应

**Files:**
- Modify: `app/api/v1/goods/route.ts:1-49`

- [ ] **Step 1: 重构 goods/route.ts**

修改 `app/api/v1/goods/route.ts` 内容为：

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import { getGoodsByCategoryId } from "@/lib/data";
import { paginatedResponse, errorResponse, handleApiError } from "@/lib/api-response";
import type { GoodsInfo } from "@/types/api";

// GET /api/v1/goods - 获取商品列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryIdRaw = searchParams.get("categoryId");

    let goodsList: GoodsInfo[];
    if (categoryIdRaw) {
      const id = Number(categoryIdRaw);
      if (!Number.isInteger(id) || id <= 0) {
        return errorResponse("categoryId 参数无效", 400);
      }
      goodsList = await getGoodsByCategoryId(id);
    } else {
      const goods = await prisma.goods.findMany({
        where: { deleted_at: null, status: 1 },
        orderBy: { created_at: "desc" },
      });
      goodsList = goods.map((g) => ({
        ...(toCamelCase(g) as unknown as GoodsInfo),
        price: g.price ? g.price.toString() : null,
      }));
    }

    return paginatedResponse({ total: goodsList.length, list: goodsList });
  } catch (error) {
    return handleApiError(error, "商品列表");
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add app/api/v1/goods/route.ts
git commit -m "refactor(api): use unified API response in goods list route"
```

---

## Task 6: 重构 goods detail API 使用统一响应

**Files:**
- Modify: `app/api/v1/goods/[id]/route.ts:1-41`

- [ ] **Step 1: 重构 goods/[id]/route.ts**

修改 `app/api/v1/goods/[id]/route.ts` 内容为：

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getGoodsById } from "@/lib/data";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";

// GET /api/v1/goods/:id - 获取单个商品详情
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const goodsId = Number(id);

    if (!Number.isInteger(goodsId) || goodsId <= 0) {
      return errorResponse("id 参数无效", 400);
    }

    const goods = await getGoodsById(goodsId);

    if (!goods) {
      return errorResponse("商品不存在", 404);
    }

    return successResponse(goods);
  } catch (error) {
    return handleApiError(error, "商品详情");
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add app/api/v1/goods/[id]/route.ts
git commit -m "refactor(api): use unified API response in goods detail route"
```

---

## Task 7: 移除隐私政策页面的不必要客户端组件

**Files:**
- Modify: `app/(main)/privacy-policy/page.tsx:1`

- [ ] **Step 1: 移除 "use client" 指令**

修改 `app/(main)/privacy-policy/page.tsx` 第1行，删除 `"use client";`

原文件第1-2行：
```typescript
"use client";

export default function PrivacyPolicyPage() {
```

改为：
```typescript
export default function PrivacyPolicyPage() {
```

- [ ] **Step 2: 提交**

```bash
git add "app/(main)/privacy-policy/page.tsx"
git commit -m "refactor(pages): remove unnecessary 'use client' from privacy policy page"
```

---

## Task 8: 为分类页面添加空状态提示

**Files:**
- Modify: `app/(main)/category/[categoryId]/page.tsx:22-56`

- [ ] **Step 1: 修改分类页面添加空状态**

修改 `app/(main)/category/[categoryId]/page.tsx` 的 return 部分：

原 return 语句 (22-56行)：
```typescript
return (
    <section className="flex justify-center px-24 py-10 bg-gray-100 min-h-[calc(100vh-200px)]">
      <div className="grid grid-cols-3 gap-6 max-w-[1400px] w-full">
        {goodsList.map((goods) => {
          const imageUrl =
            goods.imageListUrl && goods.imageListUrl.trim()
              ? goods.imageListUrl.split(",")[0]
              : EMPTY_IMAGE_URL;
          return (
            <Link
              key={goods.id}
              href={`/goods/${goods.id}`}
              ...
            >
              ...
            </Link>
          );
        })}
      </div>
    </section>
  );
```

改为：
```typescript
return (
    <section className="flex justify-center px-24 py-10 bg-gray-100 min-h-[calc(100vh-200px)]">
      {goodsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-gray-400 text-lg mb-4">该分类暂无商品</div>
          <div className="text-gray-300 text-sm">敬请期待更多内容</div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 max-w-[1400px] w-full">
          {goodsList.map((goods) => {
            const imageUrl =
              goods.imageListUrl && goods.imageListUrl.trim()
                ? goods.imageListUrl.split(",")[0]
                : EMPTY_IMAGE_URL;
            return (
              <Link
                key={goods.id}
                href={`/goods/${goods.id}`}
                ...
              >
                ...
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
```

- [ ] **Step 2: 提交**

```bash
git add "app/(main)/category/[categoryId]/page.tsx"
git commit -m "feat(ui): add empty state message for category page"
```

---

## Task 9: 实现视频懒加载

**Files:**
- Modify: `app/(main)/HomeContent.tsx:1-182`

- [ ] **Step 1: 添加 useEffect 和 ref 用于视频懒加载**

在 `HomeContent.tsx` 中：
1. 导入 `useEffect, useRef`
2. 添加 `useState` 用于存储可见视频索引
3. 添加 Intersection Observer 逻辑

修改 import 语句 (第7行)：
```typescript
import { useState, useEffect, useRef } from "react";
```

在 `export default function HomeContent` 函数内 (约第47行后)，添加：
```typescript
const [visibleVideos, setVisibleVideos] = useState<Set<number>>(new Set());
const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.getAttribute("data-video-index"));
        if (entry.isIntersecting) {
          setVisibleVideos((prev) => new Set([...prev, index]));
        }
      });
    },
    { threshold: 0.3 }
  );

  videoRefs.current.forEach((video) => {
    if (video) observer.observe(video);
  });

  return () => observer.disconnect();
}, []);
```

- [ ] **Step 2: 修改视频渲染部分实现懒加载**

修改视频渲染部分 (第169-177行)，将：
```typescript
{carouselVideoList.map((item, index) => (
  <SwiperSlide key={index}>
    <video
      src={item.videoUrl}
      controls
      className="w-full h-[350px] bg-black"
    />
  </SwiperSlide>
))}
```

改为：
```typescript
{carouselVideoList.map((item, index) => (
  <SwiperSlide key={index}>
    <div className="relative w-full h-[350px] bg-black">
      {visibleVideos.has(index) ? (
        <video
          ref={(el) => { videoRefs.current[index] = el; }}
          src={item.videoUrl}
          controls
          className="w-full h-full"
          data-video-index={index}
        />
      ) : (
        <div
          ref={(el) => { videoRefs.current[index] = el; }}
          className="w-full h-full flex items-center justify-center bg-gray-800"
          data-video-index={index}
        >
          <div className="text-gray-400 text-sm">加载中...</div>
        </div>
      )}
    </div>
  </SwiperSlide>
))}
```

- [ ] **Step 3: 提交**

```bash
git add "app/(main)/HomeContent.tsx"
git commit -m "feat(performance): add lazy loading for videos using Intersection Observer"
```

---

## Task 10: 验证所有修复

- [ ] **Step 1: 运行 lint 检查**

```bash
pnpm lint
```

预期：无错误

- [ ] **Step 2: 运行 build 检查**

```bash
pnpm build
```

预期：构建成功

- [ ] **Step 3: 启动开发服务器并手动验证**

```bash
pnpm dev
```

验证项目：
1. 首页视频区域是否正常显示
2. 分类页面为空时是否显示空状态提示
3. 隐私政策页面是否正常显示

---

## 自检清单

- [ ] API 响应格式统一到 5 个 route
- [ ] API 错误处理统一到 `handleApiError`
- [ ] 隐私政策页面不再有 `"use client"`
- [ ] 分类页面空状态有友好提示
- [ ] 视频懒加载通过 Intersection Observer 实现
- [ ] 所有 commit 已完成
- [ ] lint 和 build 通过
