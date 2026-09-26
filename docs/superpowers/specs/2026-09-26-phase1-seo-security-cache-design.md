# 第一阶段：SEO + 安全 + 缓存 — 设计说明

**日期：** 2026-09-26  
**状态：** 已确认  
**正式域名：** https://yuguanglighting.cn  
**方案：** A · 轻量加固（已确认）

## 1. 目标

在不大改页面结构与视觉的前提下，完成公司官网第一阶段基础加固：

- 搜索引擎可发现、可理解各关键页面（metadata / sitemap / robots / OG）
- 关于页富文本渲染安全
- 商品缺失使用正确 HTTP 语义（404）
- 降低导航与首页的重复查库成本，首页查询收敛为「仅需字段」

**非目标（本阶段不做）：** 英文站、响应式大改、首页 Swiper 拆分、询盘表单、on-demand revalidate / webhook。

## 2. 站点配置

### 2.1 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `NEXT_PUBLIC_SITE_URL` | 站点绝对根 URL，无尾斜杠 | `https://yuguanglighting.cn` |

- 在 `README.md` 中说明该变量；**不修改** `.env` / `.env.*`（项目规范禁止）
- 缺省时回退到 `https://yuguanglighting.cn`，避免本地漏配导致 sitemap/OG 崩溃；生产仍应显式配置

### 2.2 `lib/site.ts`

集中导出：

- `siteUrl`：规范化后的站点根（去尾 `/`）
- `defaultTitle`：`余光照明`
- `defaultDescription`：与现有 root layout 描述对齐
- `defaultOgImage`：现有 OSS logo（如 `.../static/logo_128x128.png`），后续可换更大尺寸 OG 图而不改调用方

## 3. 安全

### 3.1 关于页富文本消毒

**现状：** `app/(main)/about/page.tsx` 对 `introduction.richText` 直接 `dangerouslySetInnerHTML`。  
**商品详情：** 客户端已用 `dompurify`。

**方案：**

- 新增依赖 `isomorphic-dompurify`（及必要类型），在服务端消毒后再传入 JSX
- 新增 `lib/sanitize-html.ts`：`sanitizeHtml(dirty: string): string`
- 允许常见富文本标签（`p/h1-h3/ul/ol/li/a/img/strong/em/br` 等），去掉 `script`、事件属性、`javascript:` 等
- `about/page.tsx` 仅渲染消毒后的 HTML

商品详情本阶段可保持客户端 `DOMPurify`；若顺手可抽同一 `sanitizeHtml` 到 Server Component 侧渲染，列为可选、非必须。

### 3.2 商品不存在

**现状：** `getGoodsById` 为空时渲染「商品不存在」自定义区块。  
**改为：** 调用 `notFound()`，由 Next.js 返回 404（若无 `not-found.tsx` 则用默认；本阶段可不新增定制 404 页）。

## 4. SEO

### 4.1 Root layout metadata

在 `app/layout.tsx`：

- `metadataBase: new URL(siteUrl)`
- 保留现有 title / description
- 补充 `openGraph`（type、locale `zh_CN`、url、siteName、images）
- 补充 `twitter`（`summary_large_image` 或 `summary`，与默认图尺寸匹配即可）

### 4.2 各页 `generateMetadata`

| 页面 | Title / Description 来源 | OG 图 |
|------|--------------------------|-------|
| 首页 `app/(main)/page.tsx` | 默认站点文案；title 可用模板如「余光照明」 | 默认 OG 或首张轮播（可选：取 carousel 第一张，失败回退默认） |
| 关于 `about/page.tsx` | 「关于余光 \| 余光照明」+ 默认或截断简介 | 默认 OG |
| 分类 `category/[categoryId]/page.tsx` | 分类 `name` + description；无效 id → 不生成特殊页（走 notFound 流程时可不单独处理） | `coverImageUrl` 或默认 |
| 商品 `goods/[goodsId]/page.tsx` | 商品 `name` + description；缺失走 notFound | 图册首图或默认 |
| 隐私 `privacy-policy/page.tsx` | 「隐私政策 \| 余光照明」固定文案 | 默认 |

轮播图与商品图 `alt`：首页轮播由「轮播图」改为可用 `remark`（若有）或「余光照明 - 轮播 {index+1}」；不强制改库表。

### 4.3 `app/sitemap.ts`

- 静态：`/`、`/about`、`/privacy-policy`
- 动态：上架分类 `/category/{id}`、上架商品 `/goods/{id}`（`deleted_at: null` 且 `status: 1`）
- `lastModified`：有则用 `updated_at`，否则 `new Date()`
- `base` 使用 `siteUrl`

在 `lib/data.ts` 增加轻量查询（如 `getSitemapEntries()` 或分别 `listCategoryIdsForSitemap` / `listGoodsIdsForSitemap`），避免在 sitemap 里散落 Prisma。

### 4.4 `app/robots.ts`

- `allow: /`
- `sitemap: ${siteUrl}/sitemap.xml`
- 不额外 Disallow API（公开只读 API 可被爬；若后续敏感再收紧）

## 5. 缓存与查询收敛

### 5.1 缓存策略

对读多写少的列表类数据使用 `unstable_cache`（或 Next 16 等价 Data Cache API，以项目当前 Next 文档为准），统一：

- `revalidate: 300`（5 分钟）
- `tags`（便于日后扩展）：`nav-categories`、`carousels`、`home-categories`、`sitemap` 等

建议包裹的函数：

- `getNavCategories`
- `getCarousels`
- 新建的 `getCategoriesForHome`
- sitemap 用列表查询

分类商品列表、单商品详情：同样 `revalidate: 300`，保证详情/sitemap 与前台一致性窗口一致。

**不引入** on-demand `revalidateTag`（无后台 webhook 时无入口）。

### 5.2 首页查询收敛

**现状：** `getCategoriesWithGoods()` 拉取全部分类 + 全量商品，首页 `HomeContent` 实际只用分类的 `id/name/description/coverImageUrl`。

**新建：** `getCategoriesForHome(): Promise<CategoryInfo[]>`  

- 条件：`deleted_at: null`, `status: 1`
- 排序：`sort asc`
- **不**查询 `goods`

首页 `page.tsx` 改为 `Promise.all([getCategoriesForHome(), getCarousels()])`。  
`getCategoriesWithGoods` 保留给仍需要商品列表的调用方（若无则仅保留 API/其它页使用；分类页继续用 `getGoodsByCategoryId`）。

### 5.3 类型

首页 props 继续使用 `CategoryInfo[]`（无需 `CategoryWithGoods`）。

## 6. 文件变更清单（预期）

| 路径 | 变更 |
|------|------|
| `lib/site.ts` | 新建 |
| `lib/sanitize-html.ts` | 新建 |
| `lib/data.ts` | 缓存包装、`getCategoriesForHome`、sitemap 查询 |
| `app/layout.tsx` | metadataBase / OG / twitter |
| `app/(main)/page.tsx` | 换数据源；可选 generateMetadata |
| `app/(main)/HomeContent.tsx` | 轮播 alt；props 类型若需微调 |
| `app/(main)/about/page.tsx` | 消毒 + metadata |
| `app/(main)/category/[categoryId]/page.tsx` | metadata；无效分类可考虑 notFound（若分类本身不存在） |
| `app/(main)/goods/[goodsId]/page.tsx` | notFound + metadata |
| `app/(main)/privacy-policy/page.tsx` | metadata |
| `app/sitemap.ts` | 新建 |
| `app/robots.ts` | 新建 |
| `package.json` | `isomorphic-dompurify` |
| `README.md` | 补充 `NEXT_PUBLIC_SITE_URL`、正式域名与第一阶段能力说明 |

## 7. 验证计划

1. `pnpm lint` / `pnpm build` 通过  
2. 本地打开 `/about`：富文本正常；构造含 `<script>` 的内容时脚本被剥离（可用临时测试数据或单测式断言 sanitize 函数）  
3. 访问不存在商品 id → 404  
4. `/sitemap.xml`、`/robots.txt` 含正确域名与路径  
5. 查看页面源码：`<title>`、`og:` 元标签符合预期  
6. 连续刷新首页：数据库查询频率相对下降（开发环境可看 Prisma/日志或 Network；生产以 revalidate 窗口为准）

## 8. 风险与回退

- **缓存延迟：** 后台改分类/轮播最多约 5 分钟才反映；可接受。紧急时可临时缩短 `revalidate` 或重启进程清空 Data Cache。  
- **isomorphic-dompurify：** 依赖 JSDOM，注意包体积仅影响服务端；构建失败时改查 peer 依赖版本。  
- **metadataBase：** 必须与正式域名一致，否则 OG 绝对 URL 错误。

## 9. 成功标准

- [ ] 关于页不再渲染未消毒 HTML  
- [ ] 无效商品返回 404  
- [ ] 首页/关于/分类/商品/隐私均有合理 title/description（及 OG）  
- [ ] 生产域名下 sitemap/robots 可访问且内容正确  
- [ ] 首页不再为展示封面而拉取全站商品  
- [ ] 导航与首页相关读路径带 5 分钟缓存  
- [ ] README 已说明站点 URL 环境变量
