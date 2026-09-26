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
    lastModified: new Date(c.updatedAt ?? now),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const goodsEntries: MetadataRoute.Sitemap = goods.map((g) => ({
    url: `${siteUrl}/goods/${g.id}`,
    lastModified: new Date(g.updatedAt ?? now),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...goodsEntries];
}
