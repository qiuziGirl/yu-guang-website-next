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
