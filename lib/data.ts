import "server-only";

import { prisma } from "@/lib/db";
import { toCamelCase } from "@/lib/utils";
import type {
  CarouselInfo,
  CategoryInfo,
  CategoryWithGoods,
  GoodsInfo,
  IntroductionInfo,
} from "@/types/api";
import { unstable_cache } from "next/cache";

const REVALIDATE_SECONDS = 300;

type CategoryRow = Awaited<ReturnType<typeof prisma.category.findFirst>>;
type GoodsRow = Awaited<ReturnType<typeof prisma.goods.findFirst>>;
type CarouselRow = Awaited<ReturnType<typeof prisma.carousel.findFirst>>;
type IntroductionRow = Awaited<
  ReturnType<typeof prisma.introduction.findFirst>
>;

function serializeCategory(row: NonNullable<CategoryRow>): CategoryInfo {
  return toCamelCase(row) as unknown as CategoryInfo;
}

function serializeGoods(row: NonNullable<GoodsRow>): GoodsInfo {
  const camel = toCamelCase(row) as unknown as GoodsInfo;
  return {
    ...camel,
    price: row.price ? row.price.toString() : null,
  };
}

function serializeCarousel(row: NonNullable<CarouselRow>): CarouselInfo {
  return toCamelCase(row) as unknown as CarouselInfo;
}

function serializeIntroduction(
  row: NonNullable<IntroductionRow>
): IntroductionInfo {
  return toCamelCase(row) as unknown as IntroductionInfo;
}

/**
 * 顶部导航使用：仅返回有可售商品的分类
 */
export const getNavCategories = unstable_cache(
  async (): Promise<CategoryInfo[]> => {
    const categories = await prisma.category.findMany({
      where: { deleted_at: null, status: 1 },
      orderBy: { sort: "asc" },
    });

    if (categories.length === 0) return [];

    const goods = await prisma.goods.findMany({
      where: {
        category_id: { in: categories.map((c) => c.id) },
        deleted_at: null,
        status: 1,
      },
      select: { category_id: true },
    });

    const hasGoods = new Set(goods.map((g) => g.category_id));
    return categories.filter((c) => hasGoods.has(c.id)).map(serializeCategory);
  },
  ["nav-categories"],
  { revalidate: REVALIDATE_SECONDS, tags: ["nav-categories"] }
);

/**
 * 首页使用：所有上架分类
 */
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

/**
 * 分类页 metadata 使用：按 id 取上架分类
 */
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

/**
 * 首页/分类页使用：所有上架分类，附带其商品
 * 一次查询 + 内存分组，避免 N+1。
 */
export async function getCategoriesWithGoods(): Promise<CategoryWithGoods[]> {
  const categories = await prisma.category.findMany({
    where: { deleted_at: null, status: 1 },
    orderBy: { sort: "asc" },
  });

  if (categories.length === 0) return [];

  const goods = await prisma.goods.findMany({
    where: {
      category_id: { in: categories.map((c) => c.id) },
      deleted_at: null,
      status: 1,
    },
    orderBy: { created_at: "desc" },
  });

  const groupedGoods = new Map<number, GoodsInfo[]>();
  for (const g of goods) {
    const list = groupedGoods.get(g.category_id) ?? [];
    list.push(serializeGoods(g));
    groupedGoods.set(g.category_id, list);
  }

  return categories.map((c) => ({
    ...serializeCategory(c),
    goodsList: groupedGoods.get(c.id) ?? [],
  }));
}

export const getCarousels = unstable_cache(
  async (): Promise<CarouselInfo[]> => {
    const list = await prisma.carousel.findMany({
      where: { deleted_at: null, status: 1 },
      orderBy: { sort: "asc" },
    });
    return list.map(serializeCarousel);
  },
  ["carousels"],
  { revalidate: REVALIDATE_SECONDS, tags: ["carousels"] }
);

export function getIntroduction(version: number) {
  return unstable_cache(
    async (): Promise<IntroductionInfo | null> => {
      const intro = await prisma.introduction.findFirst({
        where: { deleted_at: null, status: 1, version },
        orderBy: [{ updated_at: "desc" }, { id: "desc" }],
      });
      return intro ? serializeIntroduction(intro) : null;
    },
    ["introduction", String(version)],
    { revalidate: REVALIDATE_SECONDS, tags: ["introduction"] }
  )();
}

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
