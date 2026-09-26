# 余光照明官网（Next.js）

中山市余光照明科技有限公司官方网站。正式域名：https://yuguanglighting.cn

基于 [Next.js](https://nextjs.org) App Router，使用 Prisma 连接 MySQL/MariaDB。

## 环境变量

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | MySQL 连接串（Prisma 使用） |
| `NEXT_PUBLIC_SITE_URL` | 站点绝对根 URL，无尾斜杠；缺省 `https://yuguanglighting.cn` |

本地开发可复制 `.env.example`（如有）或自行配置；**请勿将 `.env` 提交到版本库**。`NEXT_PUBLIC_SITE_URL` 用于 sitemap、Open Graph 等绝对链接生成，生产环境建议显式配置。

## 开发

```bash
pnpm install
pnpm run dev
```

开发服务器默认端口见 `package.json` scripts（当前为 **3001**）。浏览器访问 http://localhost:3001。

其他常用命令：

```bash
pnpm run build   # 生产构建
pnpm run start   # 启动生产服务
pnpm run lint    # ESLint 检查
```

`postinstall` 会自动执行 `prisma generate`；数据库 schema 变更后需自行执行 `pnpm exec prisma migrate dev` 或部署侧迁移。

## 第一阶段能力

- 页面 metadata / Open Graph
- `/sitemap.xml`、`/robots.txt`
- 关于页富文本消毒
- 商品/分类缺失返回 404
- 导航与列表读路径约 5 分钟缓存；首页仅加载分类封面数据

## 技术栈

- Next.js 16 · React 19 · TypeScript
- Tailwind CSS 4
- Prisma 7 · MariaDB/MySQL
