# 全站多语言（路线 C）— 设计说明

**日期：** 2026-09-27  
**状态：** 已确认 · C1–C3 实施中  
**正式域名：** https://yuguanglighting.cn  
**方案：** 混合分期 · cookie + 字段映射 · **商品页单语模式（A）**

## 1. 目标

在现有「关于页语言切换」基础上，扩展为**全站可感知的中英切换**：

- 顶栏切换 `中文 / English` 后，首页、导航、分类、商品、关于、壳层 UI 文案随语言变化
- **单语展示**：当前语言只显示对应字段，不再默认「中文主标题 + 英文副标题」同屏
- 英文字段缺失时有明确 fallback，避免空白页
- metadata / `<html lang>` 随语言变化

**非目标（本设计不做）：**

- URL 前缀（`/en/...`）、hreflang、sitemap 语言维度（列为 C4 可选）
- 轮播图多语言 remark
- 询盘表单
- `next-intl` 全量接入

## 2. 已确认产品决策

### 2.1 商品页：单语模式（A）

| 语言 | 标题 | 描述 | 详情富文本 |
|------|------|------|------------|
| 中文 | `name` | `description` | `introduction` |
| 英文 | `englishName` | `englishDescription` | `englishIntroduction`（C2 新增） |

- 英文模式**不再**同时展示中文字段
- 分类页、首页卡片同理：只展示当前语言的主字段

### 2.2 Fallback 策略

当英文字段为空时：

| 字段类型 | Fallback |
|----------|----------|
| 名称类（`name` / `englishName`） | 回退到中文 `name` |
| 描述类（`description` / `englishDescription`） | 不展示该段落（非回退中文，避免英文页出现中文描述） |
| 商品富文本 `englishIntroduction` | 不展示详情区块；可选页内提示「英文详情暂未提供」（C2） |
| UI 壳层文案 | 字典内必有中英两套，无 fallback |

## 3. 语言机制（延续现有）

### 3.1 存储与切换

- Cookie：`site-lang`，值 `zh` | `en`，Path=/，Max-Age=31536000
- 客户端：`LangDropdown` 写 cookie → `router.refresh()`（已实现）
- 服务端：各 `page.tsx` / `generateMetadata` 通过 `cookies()` 读取（与 about 页同模式）

### 3.2 工具函数（`lib/site-lang.ts` 扩展）

```ts
type SiteLang = "zh" | "en";

// 已有
parseSiteLang(value): SiteLang
introductionVersion(lang): 0 | 1
writeSiteLang(lang): void  // 客户端

// 新增
readSiteLang(): Promise<SiteLang>           // 服务端读 cookie
localizedName(entity, lang): string
localizedDescription(entity, lang): string | null
localizedGoodsIntroduction(goods, lang): string | null  // C2
```

`localizedName`：en 且 `englishName` 非空 → `englishName`，否则 → `name`。

### 3.3 UI 文案字典（新建 `lib/i18n/ui.ts`）

集中维护壳层固定文案，示例 key：

| Key | zh | en |
|-----|----|----|
| `brandName` | 余光照明 | Yuguang Lighting |
| `navAbout` | 关于余光 | About |
| `homeRecommend` | 为您推荐 | Recommended for You |
| `homeLearnMore` | 了解更多 | Learn More |
| `categoryEmpty` | 该分类暂无商品 | No products in this category |
| `categoryEmptyHint` | 敬请期待更多内容 | More coming soon |
| `goodsPreviewAlt` | 预览图 | Preview |
| `footerContact` | 联系我们 | Contact Us |
| `aboutEmpty` | 暂无介绍 | No introduction yet |

组件通过 `useUiCopy(lang)` 或服务端 `uiCopy(lang).key` 取值。

## 4. 分阶段范围

### C1 — 全站切换（不含商品英文富文本）

**官网改动：**

| 模块 | 改动要点 |
|------|----------|
| `app/layout.tsx` | 子 layout 或动态 wrapper 设置 `<html lang>`；根 metadata 默认仍中文，各页 override |
| `components/Header` | 品牌名、关于链接、分类名用 `localizedName`；client 读 cookie |
| `app/(main)/page.tsx` | metadata 随 lang；`defaultDescription` / En 切换 |
| `HomeContent` | 推荐标题、了解更多、分类 name/description |
| `category/[categoryId]/page.tsx` | 商品卡片单语、空状态、metadata |
| `goods/[id]/page.tsx` + `GoodsDetail` | 单语 name/description；**introduction 仍仅中文字段**（C1 英文模式隐藏详情区或 fallback 提示） |
| `about/page.tsx` | 已满足，微调复用共享 `uiCopy` |
| `Footer` | Contact / Privacy 等随 lang |
| `privacy-policy/page.tsx` | C1 暂保持英文内容；中文模式仍显示英文（C3 补中文稿） |

**缓存：** 不在 `unstable_cache` tag 中拆分 lang；缓存完整 DB 行，渲染时按 lang 选字段。

**验收：** 切换语言后除商品富文本、隐私中文外，全站主内容随语言变化。

### C2 — 商品英文富文本

**数据库：**

```sql
ALTER TABLE goods ADD COLUMN english_introduction TEXT NULL AFTER introduction;
```

**Prisma：** `english_introduction String? @db.Text`

**Egg：**

- `app/model/goods.js` 增加 `englishIntroduction`
- create/update 读写

**管理端：**

- 商品详情页增加 Tab 或分块：「中文详情 / English Details」
- 英文 Tinymce 绑定 `englishIntroduction`

**官网：**

- `localizedGoodsIntroduction(goods, lang)` 英文读 `englishIntroduction`
- `GoodsDetail` 英文模式渲染英文富文本（服务端消毒或客户端 DOMPurify 与现逻辑一致）

**缓存刷新：** goods 变更已有 revalidate，无需改 tag。

### C3 — 内容与合规补全

- 隐私政策：新增中文版页面内容，或同一页按 lang 切换 MD/段落
- 生产 DB 审计：`english_name` / `english_description` 填充率报告
- 运营补录优先级：导航分类名 > 商品名 > 商品描述 > 英文富文本

### C4 — SEO 深化（可选，后续单独立项）

- `/en` 路径或 `?lang=en` 规范化
- `hreflang`、`alternate` metadata
- sitemap 语言条目
- `openGraph.locale` 动态 `en_US` / `zh_CN`

## 5. 各页行为明细

### 5.1 首页

- metadata title/description 随 lang
- 轮播 alt：`余光照明 - 轮播 N` / `Yuguang Lighting - Slide N`
- 分类区：单语 name + description（en 时 `englishDescription` 为空则不展示描述段落）

### 5.2 分类页

- metadata：单语 category name + localized description
- 商品卡片：单语 goods name（en 无 englishName 则 fallback name）
- **移除** englishName 副标题行

### 5.3 商品页

- metadata：单语 goods name + localized description
- 头部：单语 h1 + 单语描述段落（不再 h1+h2 中英并列）
- 富文本区：C1 英文模式无 `englishIntroduction` 时不渲染；C2 后渲染英文 HTML
- 图片 alt 使用 localized name

### 5.4 关于页

- 保持 `getIntroduction(introductionVersion(lang))`
- 文案并入 `uiCopy`

### 5.5 导航

- `Header` / 抽屉：`localizedName(category, lang)`
- `MainLayout` 仍服务端取 `getNavCategories()`（缓存不变），client Header 读 lang 选字段

## 6. Client / Server 分工

| 组件类型 | 读 lang 方式 |
|----------|--------------|
| Server `page.tsx` / `generateMetadata` | `await readSiteLang()` |
| Client（Header, HomeContent, Footer, GoodsDetail） | `useSyncExternalStore` 读 cookie（复用 LangDropdown 模式）或 props 传入 |

**注意：** Client 组件 SSR 首屏可能与 cookie 不一致（默认 zh），水合后一致；可接受，与当前 about 页行为一致。若需首屏准确，可将 lang 通过 Server Component 向下传递。

**C1 推荐：** 关键 SEO 页（category/goods/about/home metadata）服务端读 cookie；Client 展示层读 cookie。

## 7. 管理端影响

| 阶段 | admin 改动 |
|------|------------|
| C1 | 无必须改动（字段已存在） |
| C2 | 商品详情增加 `englishIntroduction` 编辑器 |
| C3 | 无 |

## 8. 测试计划

| 场景 | 期望 |
|------|------|
| 默认访问（无 cookie） | 中文 |
| 切 EN 刷新首页 | 英文 UI + 英文分类名（有值时） |
| 分类页 EN | 商品卡片仅英文主标题 |
| 商品页 EN，无 englishDescription | 无描述段落，不显示中文 |
| 商品页 EN，无 englishName | fallback 显示中文 name |
| 商品页 C2 后有 englishIntroduction | 仅显示英文富文本 |
| about EN | 英文 introduction v=0 |
| metadata | title/description 随 lang |
| `<html lang>` | `en` / `zh-CN` |
| 语言 cookie 跨页 | 全站一致 |

## 9. 风险

| 风险 | 缓解 |
|------|------|
| 英文内容大量缺失 | fallback 名称 + 隐藏空描述；C3 审计 |
| Client 首屏语言闪动 | 可后续改为 Server 传 lang props |
| 商品详情 C1 英文无正文 | 接受暂时无详情区，C2 补齐 |
| 隐私页中文缺失 | C3 补稿；C1 不阻塞上线 |

## 10. 工作量估算

| 阶段 | 开发 | 测试 |
|------|------|------|
| C1 | 3–4 人日 | 1 人日 |
| C2 | 1.5–2 人日 | 0.5 人日 |
| C3 | 0.5–1 人日 | 0.5 人日 |

建议实施顺序：**C1 → C2 → C3**；C4 单独评估。

## 11. 确认项

- [x] 商品页单语模式（A）
- [x] C1 范围与 fallback 策略
- [x] C2 数据库字段名 `english_introduction`
- [x] C3 隐私政策先用简短中文模板
