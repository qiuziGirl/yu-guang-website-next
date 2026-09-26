# 全面响应式（移动端）— 设计说明

**日期：** 2026-09-26  
**状态：** 已确认  
**范围选择：** C · 全面响应式重排  
**导航选择：** A · 右侧滑出抽屉  
**实现方案：** 1 · Tailwind 断点铺满（已确认）

## 1. 目标

让官网在手机 / 平板 / 桌面上均可正常浏览与导航，不改变品牌色与整体桌面视觉语言，不引入新 UI 组件库。

**成功标准：**

- [ ] `< lg` 使用汉堡 + 右侧抽屉；`≥ lg` 保持横排导航
- [ ] 首页推荐区、视频 Swiper、分类网格、商品详情在小屏可阅读、可点击
- [ ] 关于 / 隐私 / Footer 边距与字号不再依赖 `vh` 等导致小屏溢出的单位
- [ ] 抽屉具备遮罩关闭、Esc、点击链接关闭、打开时锁定背景滚动
- [ ] 桌面（≥1024）布局与现网大体一致
- [ ] `pnpm lint` / `pnpm build` 通过；README 补充响应式说明（若有必要）

## 2. 非目标

- 英文站落地
- 询盘 / 联系表单
- 首页轮播 Server/Client 架构拆分
- 视觉换肤、新设计系统、新 UI 依赖（Radix / Headless UI 等）
- 恢复 `(main)/loading.tsx` 段级骨架（避免再次 soft-404）

## 3. 断点约定

| 场景 | Tailwind | 行为 |
|------|----------|------|
| 手机 | 默认 / `sm` | 单列、紧凑边距、抽屉导航 |
| 平板 | `md`（768+） | 部分 2 列 |
| 桌面 | `lg`（1024+） | 横排导航、现有分栏布局 |

导航切换点统一为 **`lg`**：`< lg` 显示汉堡并隐藏桌面 `nav`；`≥ lg` 相反。

## 4. Header 与右侧抽屉

### 4.1 结构

- `MainLayout` header：`px-4 sm:px-6 lg:px-16`；高度可 `h-16 lg:h-20`
- 将导航交互拆为 Client 组件（建议 `components/Header/index.tsx` 改为 client，或新增 `MobileNavDrawer.tsx`，由 Header 组合）
- Logo 始终可见；右侧：`lg` 以下为汉堡按钮，`lg` 及以上为现有横排链接 + `LangDropdown`

### 4.2 抽屉行为

- 从右侧滑入，宽度约 `min(80vw, 320px)`，全高，`z-index` 高于 header
- 半透明遮罩；点击遮罩关闭
- `Escape` 关闭
- 点击任意导航 `Link` 后关闭
- 打开时 `document.body.style.overflow = 'hidden'`，卸载/关闭时恢复
- 无障碍：`aria-expanded`（按钮）、抽屉 `role="dialog"` + `aria-modal="true"` + 标题（如「菜单」）
- 打开期间汉堡可变为关闭图标（`X`），或抽屉内提供关闭按钮（二选一，推荐汉堡切换为 X）

### 4.3 菜单内容

与桌面一致：各分类链接、「关于余光」、`LangDropdown`（或抽屉内等价语言入口）。样式：纵向列表、足够触控高度（约 `py-3`）。

## 5. 页面布局

### 5.1 首页 `HomeContent`

| 区块 | 小屏 | 桌面 `lg+` |
|------|------|------------|
| 轮播 | `h-[220px] sm:h-[320px]` | `lg:h-[490px]`（容器与 slide 同步） |
| 「为您推荐」标题 | `text-2xl mt-8 mb-6 px-4` | 保持接近现有 `text-3xl mt-12 mb-10` |
| 推荐区 | 单列：大图/详情在上或卡片流；`px-4` | 保持 `grid-cols-12` 的 5/7 分栏 |
| 分类卡片 | 小屏可 `grid-cols-1 sm:grid-cols-2` | 右侧 2×2 不变 |
| 视频 Swiper | `breakpoints`：1 / md:2 / lg:3；`spaceBetween` 缩小；小屏可隐藏或缩小 nav 按钮 | 现有 3 列 |
| 视频高度 | `h-[200px] sm:h-[280px] lg:h-[350px]` | — |

不强制本期加视频 `poster`（无现成封面资源则跳过）。

### 5.2 分类页

- 外层：`px-4 md:px-10 lg:px-24 py-6 md:py-10`
- 网格：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6`
- 图片高度：`h-[200px] md:h-[240px] lg:h-[280px]`

### 5.3 商品详情 `GoodsDetail`

- 头部容器：`flex-col lg:flex-row`；`px-4 md:px-10 lg:px-24 py-8 lg:py-12`；`gap-6 lg:gap-12`
- 主图区：小屏 `w-full`，桌面 `lg:w-1/3`；主图高度 `h-[280px] lg:h-[400px]`
- 文案区：标题 `text-2xl lg:text-3xl`
- 介绍 HTML 区：同样收紧 `px`

### 5.4 关于页

- `px-4 md:px-10 lg:px-24 py-8 md:py-10`
- 富文本容器保持 `max-w-[1200px]`；图片已有 `max-w-full`

### 5.5 隐私页

- 去掉 `px-[15vh]`、`py-[3vw]`、`pb-[5vh]` 等视口单位边距
- 改为：`px-4 md:px-10 lg:px-24 py-8 md:py-12 max-w-[960px] mx-auto`
- 标题：`text-3xl md:text-4xl lg:text-5xl`（替代固定 `56px`）
- 正文：`text-base md:text-lg`

### 5.6 Footer

- 外层已有 `py-8`；内容区增加 `px-4`，允许图标行 `flex-wrap`
- Copyright / 备案链接：小屏允许换行，`text-sm md:text-lg`
- Tooltip：小屏无可靠 hover —— 增加 **点击切换** 打开/关闭（保留桌面 hover）；打开时点击外部关闭

## 6. 文件变更清单（预期）

| 路径 | 变更 |
|------|------|
| `components/MainLayout/index.tsx` | header 响应式 padding / 高度 |
| `components/Header/index.tsx`（及可能的 `MobileNavDrawer.tsx`） | 汉堡 + 抽屉 |
| `components/Footer/index.tsx` | 换行边距 + Tooltip 点击 |
| `app/(main)/HomeContent.tsx` | 轮播高度、推荐分栏、视频 breakpoints |
| `app/(main)/category/[categoryId]/page.tsx` | 边距与网格 |
| `app/(main)/goods/[goodsId]/GoodsDetail.tsx` | 堆叠布局与边距 |
| `app/(main)/about/page.tsx` | 边距 |
| `app/(main)/privacy-policy/page.tsx` | 边距与字号 |
| `app/globals.css` | 仅当视频 nav 小屏需微调时 |
| `README.md` | 简要说明已支持响应式布局（可选一句） |

## 7. 验证计划

1. `pnpm lint` / `pnpm build` 通过  
2. Chrome DevTools：375 / 768 / 1280 宽度目视检查首页、分类、商品、关于、隐私  
3. 抽屉：打开/遮罩关闭/Esc/链接跳转后关闭；打开时页面不可滚动  
4. `≥ lg` 横排导航仍可见，无汉堡  
5. Footer 图标在触控宽度下可点开二维码提示  

## 8. 风险与回退

- Header 改为 Client 会略增 hydration；可接受。Logo 与静态结构尽量保持简单。  
- Footer Tooltip 点击与 hover 并存时注意定时器清理（已有 `scheduleClose` 逻辑可扩展）。  
- 视频 `loop` + 少 slide 时 Swiper 警告：若视频不足 3 个，小屏 `loop` 可按需关闭（实现时按数量判断）。

## 9. 与第一阶段关系

- 不改动 SEO metadata / sitemap / 缓存策略  
- 不恢复 segment 级 `loading.tsx`  
- 商品/分类 `notFound()` 行为保持不变
