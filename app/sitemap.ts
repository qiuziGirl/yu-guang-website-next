import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/data";
import { pageUrl } from "@/lib/locale-path";

function sitemapLanguages(internalPath: string) {
  return {
    "zh-CN": pageUrl(internalPath, "zh"),
    en: pageUrl(internalPath, "en"),
  };
}

function staticEntry(
  internalPath: string,
  options: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">
): MetadataRoute.Sitemap[number] {
  return {
    ...options,
    url: pageUrl(internalPath, "zh"),
    alternates: { languages: sitemapLanguages(internalPath) },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, goods } = await getSitemapEntries();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    staticEntry("/", {
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    }),
    staticEntry("/about", {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    staticEntry("/privacy-policy", {
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    }),
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => {
    const internalPath = `/category/${c.id}`;
    return {
      url: pageUrl(internalPath, "zh"),
      lastModified: new Date(c.updatedAt ?? now),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: sitemapLanguages(internalPath) },
    };
  });

  const goodsEntries: MetadataRoute.Sitemap = goods.map((g) => {
    const internalPath = `/goods/${g.id}`;
    return {
      url: pageUrl(internalPath, "zh"),
      lastModified: new Date(g.updatedAt ?? now),
      changeFrequency: "weekly",
      priority: 0.6,
      alternates: { languages: sitemapLanguages(internalPath) },
    };
  });

  return [...staticEntries, ...categoryEntries, ...goodsEntries];
}
