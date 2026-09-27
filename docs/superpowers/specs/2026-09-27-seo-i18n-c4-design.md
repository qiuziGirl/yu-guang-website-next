# SEO 多语言深化（C4）— 设计说明

**日期：** 2026-09-27  
**状态：** 已实施  
**正式域名：** https://yuguanglighting.cn  
**前置：** C1–C3 已完成（cookie + 字段映射 + 单语展示）

## 1. 为什么要做 C4

当前语言切换依赖 **cookie + `router.refresh()`**，同一 URL（如 `/about`）在中文/英文下内容不同。

| 角色 | 行为 |
|------|------|
| 用户浏览器 | 读 cookie，切换有效 |
| 搜索引擎爬虫 | **通常不带 cookie**，只能看到默认中文 |
| 外链 / 收录 | 无独立英文 URL，无法单独收录英文页 |

**结论：** 若希望 Google/Bing 收录英文内容，必须为英文提供**可爬取的独立 URL**，并输出 **hreflang** 与 **sitemap alternates**。

## 2. 目标

- 中文 URL **保持不变**（`/`, `/about`, `/category/:id`, `/goods/:id`）
- 英文 URL 使用 **`/en` 前缀**（`/en`, `/en/about`, `/en/category/:id`, …）
- 各页 `metadata.alternates.languages` 输出 hreflang（`zh-CN` / `en` / `x-default`）
- `sitemap.xml` 每 URL 带语言 alternate
- 语言切换器改为 **跳转对应语言 URL**（同步写 cookie）
- 不引入 `next-intl` 全量重构；复用现有 C1–C3 组件与 `localized*` 工具

**非目标：**

- 子域名（`en.yuguanglighting.cn`）
- 自动翻译 / CMS 改动
- 询盘表单

## 3. 方案对比

### 方案 A：`/en` 前缀 + Middleware 重写（推荐）

```
用户访问 /en/about
  → middleware 识别 locale=en，写 cookie，设置 x-site-lang 头
  → rewrite 到内部 /about（页面文件不搬家）
  → readSiteLang() 优先读 x-site-lang，渲染英文
```

| 优点 | 缺点 |
|------|------|
| 改动面可控，不复制页面 | 需新增 middleware + path 工具 |
| 中文 URL 零迁移 | `usePathname()` 为内部路径，切换语言需读浏览器 pathname |
| SEO 友好，爬虫可抓 `/en/*` | Nginx 需放行 `/en`（一般默认即可） |

### 方案 B：`app/[locale]/...` 路由重构

将 `(main)` 迁入 `[locale]` 动态段，中英文各生成静态路径。

| 优点 | 缺点 |
|------|------|
| 路由语义最清晰 | 移动全部 page 文件，diff 大 |
| | 中文无前缀需额外 middleware |

### 方案 C：仅 metadata hreflang，不改 URL

同 URL 输出 alternates，依赖 cookie 区分语言。

| 优点 | 缺点 |
|------|------|
| 几乎零路由改动 | **爬虫仍只看中文**，SEO 价值有限 |

**推荐：方案 A**

## 4. URL 规范

| 页面 | 中文（canonical） | 英文 |
|------|-------------------|------|
| 首页 | `/` | `/en` |
| 关于 | `/about` | `/en/about` |
| 隐私 | `/privacy-policy` | `/en/privacy-policy` |
| 分类 | `/category/:id` | `/en/category/:id` |
| 商品 | `/goods/:id` | `/en/goods/:id` |

- `x-default` → 中文 URL（主市场）
- 无效路径 `/en/xxx` → 404（与中文版一致）

## 5. 技术设计（方案 A）

### 5.1 新增 `lib/locale-path.ts`

```typescript
detectLocaleFromPath(pathname): SiteLang
stripEnPrefix(pathname): string      // /en/about → /about
localizedPath(pathname, lang): string
pageUrl(path, lang): string         // 绝对 URL，供 metadata / sitemap
```

### 5.2 新增 `middleware.ts`

- Matcher 排除 `/api`, `/_next`, 静态资源
- `/en` 或 `/en/*` → `locale = en`，rewrite 到去掉前缀的路径
- 其他 → `locale = zh`
- 设置 `site-lang` cookie 与 `x-site-lang` 请求头

### 5.3 调整 `readSiteLang()`

优先级：`x-site-lang`（URL）> cookie > 默认 `zh`

### 5.4 调整 `LangDropdown`

- 切换语言：`router.push(localizedPath(window.location.pathname, next))`
- 不再仅 `router.refresh()`

### 5.5 Metadata

各 `generateMetadata` 增加：

```typescript
alternates: {
  canonical: pageUrl(internalPath, lang),
  languages: {
    "zh-CN": pageUrl(internalPath, "zh"),
    en: pageUrl(internalPath, "en"),
    "x-default": pageUrl(internalPath, "zh"),
  },
},
openGraph: { locale: lang === "en" ? "en_US" : "zh_CN", ... }
```

抽取 helper：`buildPageAlternates(internalPath, lang)` → `lib/seo/alternates.ts`

### 5.6 Sitemap

每条 entry 增加 `alternates.languages`（Next.js `MetadataRoute.Sitemap` 支持）。

静态页 + 每个 category/goods 各 2 条逻辑 URL（实际 sitemap 一条 entry 带 alternates 即可）。

### 5.7 站内链接

- `Header` / `Footer` / `HomeContent` 内 `Link href` 使用 `localizedPath(currentPath, lang)` 或基于当前 lang 生成
- 首页卡片、商品链等：href 加 `/en` 前缀（当 lang=en）

**实现方式：** client 组件用 `useSiteLang()` + `usePathname`/`window.location`；服务端渲染的 Link 传入 `lang` prop 或由 client 包裹。

### 5.8 缓存

- `unstable_cache` tag **不需按语言拆分**（仍缓存完整 DB 行）
- 若使用 CDN：同一内部路径 rewrite 后，需确保 `/en/*` 与无前缀 URL 分别缓存（Vary: Cookie 或按 URL 自然分离）

## 6. 验收标准

- [ ] `https://yuguanglighting.cn/en` 英文首页可访问，view-source 含 hreflang
- [ ] `https://yuguanglighting.cn/about` 与 `/en/about` 各显示对应语言
- [ ] 切换语言跳转 URL 变化（非仅 refresh）
- [ ] `/sitemap.xml` 含 alternates
- [ ] Google Search Console URL 检查 `/en/about` 可抓取英文 title/description
- [ ] 旧中文 URL 仍可访问，无 404 回归

## 7. 工作量估算

| 任务 | 人日 |
|------|------|
| middleware + locale-path + readSiteLang | 0.5 |
| metadata alternates 全页 | 0.5 |
| sitemap alternates | 0.25 |
| LangDropdown + 站内 Link | 0.5 |
| 测试与文档 | 0.25 |
| **合计** | **~2 人日** |

## 8. 确认项

- [ ] 采用方案 A（`/en` 前缀 + middleware 重写）
- [ ] 中文 URL 保持不变
- [ ] `x-default` 指向中文 URL

确认后进入实施。
