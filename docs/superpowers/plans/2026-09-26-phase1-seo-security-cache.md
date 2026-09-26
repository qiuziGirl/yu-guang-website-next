# 第一阶段 SEO / 安全 / 缓存 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为余光照明官网完成第一阶段轻量加固：站点 URL 与 metadata、sitemap/robots、关于页 HTML 消毒、商品 404、读路径 5 分钟缓存、首页仅查分类封面。

**Architecture:** 在 `lib/site.ts` / `lib/sanitize-html.ts` 集中站点与消毒；在 `lib/data.ts` 用 `unstable_cache`（revalidate 300）包裹读函数并新增 `getCategoriesForHome` 与 sitemap 查询；App Router 各页补 `generateMetadata`，根目录新增 `sitemap.ts` / `robots.ts`。不改视觉大结构，不引入 on-demand revalidate。

**Tech Stack:** Next.js 16 App Router、React 19、Prisma、`isomorphic-dompurify`、pnpm

**Spec:** `docs/superpowers/specs/2026-09-26-phase1-seo-security-cache-design.md`

## Global Constraints

- 正式域名回退值：`https://yuguanglighting.cn`（无尾斜杠）
- 环境变量名：`NEXT_PUBLIC_SITE_URL`；**禁止**修改任何 `.env` / `.env.*`
- 缓存：`revalidate: 300`；tags：`nav-categories`、`carousels`、`home-categories`、`sitemap`、`goods`、`category-goods`
- 注释使用简体中文，只概括代码段，不编号
- 禁止 TypeScript `any`
- 本阶段不做：英文站、响应式大改、Swiper 拆分、询盘、on-demand revalidate
- Git：仅在用户明确要求时 commit；计划中的 commit 步骤默认跳过

---

## File Map

| 文件 | 职责 |
|------|------|
| `lib/site.ts` | 站点 URL、默认 title/description/OG 图 |
| `lib/sanitize-html.ts` | 服务端 HTML 消毒 |
| `lib/data.ts` | 缓存包装、首页分类、sitemap 条目、商品/分类短缓存 |
| `app/layout.tsx` | metadataBase + OG + twitter |
| `app/sitemap.ts` / `app/robots.ts` | 爬虫入口 |
| `app/(main)/page.tsx` + `HomeContent.tsx` | 换数据源、首页 metadata、轮播 alt |
| `app/(main)/about/page.tsx` | 消毒 + metadata |
| `app/(main)/category/[categoryId]/page.tsx` | metadata；无效分类 notFound |
| `app/(main)/goods/[goodsId]/page.tsx` | notFound + metadata |
| `app/(main)/privacy-policy/page.tsx` | metadata |
| `package.json` | 增加 `isomorphic-dompurify` |
| `README.md` | 域名与 `NEXT_PUBLIC_SITE_URL` 说明 |

---

### Task 1: 站点常量 `lib/site.ts`

**Files:**
- Create: `lib/site.ts`
- Modify: `README.md`（本任务末尾一并写入环境变量说明段落，或与 Task 7 合并写完 README；本任务至少创建文件）

**Interfaces:**
- Produces: `siteUrl: string`, `defaultTitle: string`, `defaultDescription: string`, `defaultOgImage: string`

- [x] **Step 1: 创建 `lib/site.ts`**

```ts
const FALLBACK_SITE_URL = "https://yuguanglighting.cn";

function normalizeSiteUrl(raw: string): string {
  return raw.replace(/\/+$/, "");
}

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || FALLBACK_SITE_URL
);

export const defaultTitle = "余光照明";

export const defaultDescription =
  "中山市余光照明科技有限公司 - 专业LED太阳能路灯、投光灯、工矿灯、花园灯生产商";

export const defaultOgImage =
  "https://yu-guang-website.oss-ap-southeast-1.aliyuncs.com/static/logo_128x128.png";
```

- [x] **Step 2: 确认可被 TypeScript 解析**

Run: `pnpm exec tsc --noEmit -p tsconfig.json`（若项目无单独 tsc 脚本，可延后到 Task 7 的 `pnpm build` 统一验证）  
Expected: 无与 `lib/site.ts` 相关的错误

---

### Task 2: HTML 消毒 `lib/sanitize-html.ts` + 依赖

**Files:**
- Create: `lib/sanitize-html.ts`
- Modify: `package.json` / `pnpm-lock.yaml`（通过 pnpm add）

**Interfaces:**
- Produces: `sanitizeHtml(dirty: string): string`

- [x] **Step 1: 安装依赖**

Run: `pnpm add isomorphic-dompurify`  
Expected: `package.json` dependencies 出现 `isomorphic-dompurify`

- [x] **Step 2: 创建 `lib/sanitize-html.ts`**

```ts
import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "strong",
  "em",
  "b",
  "i",
  "span",
  "div",
  "blockquote",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

const ALLOWED_ATTR = [
  "href",
  "src",
  "alt",
  "title",
  "target",
  "rel",
  "width",
  "height",
  "class",
  "style",
];

/** 净化富文本 HTML，去除脚本与危险属性 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}
```

- [x] **Step 3: 用 Node 快速断言（无测试框架时）**

在仓库根目录执行（PowerShell）：

```powershell
pnpm exec node --input-type=module -e "import { sanitizeHtml } from './lib/sanitize-html.ts'; const out = sanitizeHtml('<p>ok</p><script>alert(1)</script>'); if (out.includes('script') || !out.includes('<p>ok</p>')) { console.error(out); process.exit(1); } console.log('sanitize ok');"
```

若 Next/Node 无法直接 import `.ts`，改为临时文件 `scripts/check-sanitize.mjs` 用动态 import 构建产物，或在 Task 7 用手动构造数据验证；优先尝试：

```powershell
pnpm add -D tsx
pnpm exec tsx -e "import { sanitizeHtml } from './lib/sanitize-html.ts'; const out = sanitizeHtml('<p>ok</p><script>x</script>'); if (/script/i.test(out)) process.exit(1); console.log('ok');"
```

Expected: 打印 `ok` / `sanitize ok`，exit 0  
（`tsx` 若本任务安装为 devDependency，可保留；若不希望新增，则跳过本步，在关于页联调时验证）

---

### Task 3: `lib/data.ts` 缓存、首页分类、sitemap

**Files:**
- Modify: `lib/data.ts`

**Interfaces:**
- Consumes: Prisma `prisma`、现有 serialize 函数
- Produces:
  - `getCategoriesForHome(): Promise<CategoryInfo[]>`
  - `getSitemapEntries(): Promise<{ categories: { id: number; updatedAt: Date | null }[]; goods: { id: number; updatedAt: Date | null }[] }>`
  - 现有 `getNavCategories` / `getCarousels` / `getGoodsByCategoryId` / `getGoodsById` / `getIntroduction` 行为不变但带 cache（introduction 可选 cache）

- [x] **Step 1: 在文件顶部增加 cache 导入与常量**

在既有 imports 后增加：

```ts
import { unstable_cache } from "next/cache";

const REVALIDATE_SECONDS = 300;
```

- [x] **Step 2: 将 `getNavCategories` 改为缓存版**

保留现有查询逻辑为内部 async 函数，例如 `fetchNavCategories`，再：

```ts
export const getNavCategories = unstable_cache(
  async (): Promise<CategoryInfo[]> => {
    // 将原 getNavCategories 函数体移入此处
  },
  ["nav-categories"],
  { revalidate: REVALIDATE_SECONDS, tags: ["nav-categories"] }
);
```

- [x] **Step 3: 同样包装 `getCarousels`**

```ts
export const getCarousels = unstable_cache(
  async (): Promise<CarouselInfo[]> => {
    // 原函数体
  },
  ["carousels"],
  { revalidate: REVALIDATE_SECONDS, tags: ["carousels"] }
);
```

- [x] **Step 4: 新增 `getCategoriesForHome`**

```ts
export const getCategoriesForHome = unstable_cache(
  async (): Promise<CategoryInfo[]> => {
    const categories = await prisma.category.findMany({
      where: { deleted_at: null, status: 1 },
      orderBy: { sort: "asc" },
    });
    return categories.map(serializeCategory);
  },
  ["home-categories"],
  { revalidate: REVALIDATE_SECONDS, tags: ["home-categories"] }
);
```

- [x] **Step 5: 包装 `getGoodsByCategoryId` / `getGoodsById` / `getIntroduction`**

注意：带参数的 `unstable_cache` 需把参数编入 cache key：

```ts
export async function getGoodsByCategoryId(
  categoryId: number
): Promise<GoodsInfo[]> {
  return unstable_cache(
    async () => {
      const list = await prisma.goods.findMany({
        where: { category_id: categoryId, deleted_at: null, status: 1 },
        orderBy: { created_at: "desc" },
      });
      return list.map(serializeGoods);
    },
    ["goods-by-category", String(categoryId)],
    { revalidate: REVALIDATE_SECONDS, tags: ["category-goods"] }
  )();
}

export async function getGoodsById(id: number): Promise<GoodsInfo | null> {
  return unstable_cache(
    async () => {
      const g = await prisma.goods.findFirst({
        where: { id, deleted_at: null },
      });
      return g ? serializeGoods(g) : null;
    },
    ["goods-by-id", String(id)],
    { revalidate: REVALIDATE_SECONDS, tags: ["goods"] }
  )();
}

export const getIntroduction = unstable_cache(
  async (): Promise<IntroductionInfo | null> => {
    const intro = await prisma.introduction.findFirst({
      where: { deleted_at: null, status: 1 },
      orderBy: { version: "desc" },
    });
    return intro ? serializeIntroduction(intro) : null;
  },
  ["introduction"],
  { revalidate: REVALIDATE_SECONDS, tags: ["introduction"] }
);
```

`getCategoriesWithGoods` 保留不强制 cache（若仅 API 偶发调用）；可选同样加 cache，key `["categories-with-goods"]`。

- [x] **Step 6: 新增 sitemap 查询**

```ts
export const getSitemapEntries = unstable_cache(
  async (): Promise<{
    categories: { id: number; updatedAt: Date | null }[];
    goods: { id: number; updatedAt: Date | null }[];
  }> => {
    const [categories, goods] = await Promise.all([
      prisma.category.findMany({
        where: { deleted_at: null, status: 1 },
        select: { id: true, updated_at: true },
        orderBy: { sort: "asc" },
      }),
      prisma.goods.findMany({
        where: { deleted_at: null, status: 1 },
        select: { id: true, updated_at: true },
        orderBy: { id: "asc" },
      }),
    ]);
    return {
      categories: categories.map((c) => ({
        id: c.id,
        updatedAt: c.updated_at,
      })),
      goods: goods.map((g) => ({
        id: g.id,
        updatedAt: g.updated_at,
      })),
    };
  },
  ["sitemap-entries"],
  { revalidate: REVALIDATE_SECONDS, tags: ["sitemap"] }
);
```

- [x] **Step 7: 可选为 metadata 增加按 id 取分类**

分类页 metadata 需要分类名。新增：

```ts
export async function getCategoryById(
  id: number
): Promise<CategoryInfo | null> {
  return unstable_cache(
    async () => {
      const row = await prisma.category.findFirst({
        where: { id, deleted_at: null, status: 1 },
      });
      return row ? serializeCategory(row) : null;
    },
    ["category-by-id", String(id)],
    { revalidate: REVALIDATE_SECONDS, tags: ["home-categories"] }
  )();
}
```

---

### Task 4: Root metadata + sitemap + robots

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

**Interfaces:**
- Consumes: `siteUrl`, `defaultTitle`, `defaultDescription`, `defaultOgImage`, `getSitemapEntries`

- [x] **Step 1: 更新 `app/layout.tsx` metadata**

```tsx
import type { Metadata } from "next";
import MainLayout from "@/components/MainLayout";
import {
  defaultDescription,
  defaultOgImage,
  defaultTitle,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${defaultTitle}`,
  },
  description: defaultDescription,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: defaultTitle,
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: defaultOgImage }],
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage],
  },
};

// RootLayout 保持不变
```

- [x] **Step 2: 创建 `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

- [x] **Step 3: 创建 `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, goods } = await getSitemapEntries();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/category/${c.id}`,
    lastModified: c.updatedAt ?? now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const goodsEntries: MetadataRoute.Sitemap = goods.map((g) => ({
    url: `${siteUrl}/goods/${g.id}`,
    lastModified: g.updatedAt ?? now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...goodsEntries];
}
```

---

### Task 5: 各页 metadata、安全、404、首页数据源

**Files:**
- Modify: `app/(main)/page.tsx`
- Modify: `app/(main)/HomeContent.tsx`
- Modify: `app/(main)/about/page.tsx`
- Modify: `app/(main)/category/[categoryId]/page.tsx`
- Modify: `app/(main)/goods/[goodsId]/page.tsx`
- Modify: `app/(main)/privacy-policy/page.tsx`

**Interfaces:**
- Consumes: `getCategoriesForHome`, `getCarousels`, `sanitizeHtml`, `getCategoryById`, `getGoodsById`, `getIntroduction`, site 常量

- [x] **Step 1: 首页 `page.tsx`**

```tsx
import type { Metadata } from "next";
import { getCarousels, getCategoriesForHome } from "@/lib/data";
import { defaultDescription, defaultTitle } from "@/lib/site";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: defaultTitle,
  description: defaultDescription,
};

export default async function HomePage() {
  const [categoryList, carouselList] = await Promise.all([
    getCategoriesForHome(),
    getCarousels(),
  ]);

  return (
    <HomeContent categoryList={categoryList} carouselList={carouselList} />
  );
}
```

注意：根 layout 已有 `template: %s | 余光照明`，首页若再设 `title: defaultTitle` 可能变成「余光照明 | 余光照明」。首页应使用：

```ts
export const metadata: Metadata = {
  title: { absolute: defaultTitle },
  description: defaultDescription,
};
```

- [x] **Step 2: `HomeContent.tsx` 轮播 alt**

将：

```tsx
alt="轮播图"
```

改为：

```tsx
alt={carousel.remark?.trim() || `余光照明 - 轮播 ${index + 1}`}
```

- [x] **Step 3: 关于页**

```tsx
import type { Metadata } from "next";
import { getIntroduction } from "@/lib/data";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { defaultDescription, defaultOgImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于余光",
  description: defaultDescription,
  openGraph: {
    title: "关于余光",
    description: defaultDescription,
    images: [{ url: defaultOgImage }],
  },
};

export default async function AboutPage() {
  const introduction = await getIntroduction();
  const richText = sanitizeHtml(introduction?.richText ?? "");

  return (
    <section className="min-h-[calc(100vh-200px)] px-24 py-10 bg-white">
      <div
        dangerouslySetInnerHTML={{ __html: richText }}
        className="max-w-[1200px] mx-auto leading-relaxed text-gray-800 text-base
          [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-5
          [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-gray-900
          [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-gray-900
          [&_h3]:mt-5 [&_h3]:mb-3 [&_h3]:text-gray-900
          [&_p]:mb-4"
      />
    </section>
  );
}
```

- [x] **Step 4: 隐私页 metadata**

在 `privacy-policy/page.tsx` 增加：

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "余光照明网站隐私与 Cookie 政策",
};
```

- [x] **Step 5: 分类页 — metadata + 无效分类 notFound**

```tsx
import type { Metadata } from "next";
import { getCategoryById, getGoodsByCategoryId } from "@/lib/data";
import { defaultOgImage } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// EMPTY_IMAGE_URL 保持不变

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const id = Number(categoryId);
  if (!Number.isInteger(id) || id <= 0) {
    return { title: "分类不存在" };
  }
  const category = await getCategoryById(id);
  if (!category) {
    return { title: "分类不存在" };
  }
  const description =
    category.description?.trim() || `${category.name} - 余光照明产品分类`;
  const image = category.coverImageUrl || defaultOgImage;
  return {
    title: category.name,
    description,
    openGraph: {
      title: category.name,
      description,
      images: [{ url: image }],
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  const id = Number(categoryId);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const category = await getCategoryById(id);
  if (!category) {
    notFound();
  }

  const goodsList = await getGoodsByCategoryId(id);
  // 其余 JSX 保持现有网格渲染逻辑
}
```

- [x] **Step 6: 商品页 — notFound + generateMetadata**

将「商品不存在」自定义区块改为 `notFound()`。

```tsx
import type { Metadata } from "next";
import { getGoodsById } from "@/lib/data";
import { defaultOgImage } from "@/lib/site";
import { notFound } from "next/navigation";
import GoodsDetail from "./GoodsDetail";

interface PageProps {
  params: Promise<{ goodsId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { goodsId } = await params;
  const id = Number(goodsId);
  if (!Number.isInteger(id) || id <= 0) {
    return { title: "商品不存在" };
  }
  const goods = await getGoodsById(id);
  if (!goods) {
    return { title: "商品不存在" };
  }
  const description =
    goods.description?.trim() || `${goods.name} - 余光照明`;
  const firstImage =
    goods.imageListUrl
      ?.split(",")
      .map((u) => u.trim())
      .find(Boolean) || defaultOgImage;
  return {
    title: goods.name,
    description,
    openGraph: {
      title: goods.name,
      description,
      images: [{ url: firstImage }],
    },
  };
}

export default async function GoodsPage({ params }: PageProps) {
  const { goodsId } = await params;
  const id = Number(goodsId);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const goods = await getGoodsById(id);
  if (!goods) {
    notFound();
  }

  const imageUrlList =
    goods.imageListUrl && goods.imageListUrl.trim()
      ? goods.imageListUrl.split(",").filter((url) => url.trim())
      : [];

  return <GoodsDetail goods={goods} imageUrlList={imageUrlList} />;
}
```

---

### Task 6: README 同步

**Files:**
- Modify: `README.md`

- [x] **Step 1: 将模板 README 改为项目说明（保留 Getting Started 可精简）**

至少包含：

```markdown
# 余光照明官网（Next.js）

中山市余光照明科技有限公司官方网站。正式域名：https://yuguanglighting.cn

## 环境变量

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | MySQL 连接串 |
| `NEXT_PUBLIC_SITE_URL` | 站点绝对根 URL，无尾斜杠；缺省 `https://yuguanglighting.cn` |

## 开发

\`\`\`bash
pnpm install
pnpm run dev
\`\`\`

开发服务器默认端口见 `package.json` scripts（当前为 3001）。

## 第一阶段能力

- 页面 metadata / Open Graph
- `/sitemap.xml`、`/robots.txt`
- 关于页富文本消毒
- 商品/分类缺失返回 404
- 导航与列表读路径约 5 分钟缓存；首页仅加载分类封面数据
```

按现有 README 结构合并，勿删除团队仍需要的 Prisma/部署说明（若原本没有则以上即可）。

---

### Task 7: 验证

- [x] **Step 1: Lint**

Run: `pnpm lint`  
Expected: 无新增错误

- [x] **Step 2: Build**

Run: `pnpm build`  
Expected: 成功；构建日志可出现 sitemap/robots 相关路由

- [x] **Step 3: 手动检查（dev 已在跑则可直接访问）**

| 检查项 | 方法 | 期望 |
|--------|------|------|
| robots | 打开 `http://localhost:3001/robots.txt` | 含 `Sitemap: https://yuguanglighting.cn/sitemap.xml` |
| sitemap | 打开 `http://localhost:3001/sitemap.xml` | 含首页、about、privacy、category、goods URL |
| 关于页 | `/about` 正常；源码无裸露 script（若库内有危险 HTML） | 页面正常 |
| 商品 404 | `/goods/999999999` | 404 |
| 分类 404 | `/category/999999999` | 404 |
| 首页 title | 查看源码 | `余光照明`（非重复拼接） |
| 商品/分类 title | 打开真实 id 页 | `<title>` 含商品/分类名 |

- [x] **Step 4: Commit（仅当用户要求时）**

若用户要求提交，使用中文或仓库惯例的 Conventional Commits，例如：

```bash
git add lib/site.ts lib/sanitize-html.ts lib/data.ts app/layout.tsx app/sitemap.ts app/robots.ts "app/(main)" package.json pnpm-lock.yaml README.md docs/superpowers/specs docs/superpowers/plans
git commit -m "$(cat <<'EOF'
feat: 官网第一阶段 SEO、富文本消毒与读缓存

统一站点 URL 与 metadata，新增 sitemap/robots，关于页服务端消毒，商品/分类 404，并收敛首页查询与 5 分钟缓存。
EOF
)"
```

Windows PowerShell 无 HEREDOC 时改用：

```powershell
git commit -m "feat: 官网第一阶段 SEO、富文本消毒与读缓存"
```

---

## Spec coverage checklist

| Spec 项 | Task |
|---------|------|
| `lib/site.ts` + 域名回退 | Task 1 |
| README 说明 URL，不改 `.env.*` | Task 6 |
| isomorphic-dompurify + about 消毒 | Task 2, 5 |
| 商品 notFound | Task 5 |
| Root metadataBase/OG/twitter | Task 4 |
| 各页 generateMetadata | Task 5 |
| 轮播 alt | Task 5 |
| sitemap / robots | Task 4 |
| unstable_cache 300 + tags | Task 3 |
| getCategoriesForHome | Task 3, 5 |
| lint/build/手动验证 | Task 7 |

## Self-review notes

- 首页 title 使用 `absolute` 避免与 layout `template` 重复拼接。
- 分类页增加 `getCategoryById` + notFound，覆盖 spec「无效分类可考虑 notFound」。
- `getCategoriesWithGoods` 保留给 API；首页不再调用。
- 无测试框架时消毒验证用 `tsx` 一次性断言或联调；不强制引入完整 Vitest。
