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
export async function getNavCategories(): Promise<CategoryInfo[]> {
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

export async function getCarousels(): Promise<CarouselInfo[]> {
  const list = await prisma.carousel.findMany({
    where: { deleted_at: null, status: 1 },
    orderBy: { sort: "asc" },
  });
  return list.map(serializeCarousel);
}

export async function getIntroduction(): Promise<IntroductionInfo | null> {
  const intro = await prisma.introduction.findFirst({
    where: { deleted_at: null, status: 1 },
    orderBy: { version: "desc" },
  });
  return intro ? serializeIntroduction(intro) : null;
}

export async function getGoodsByCategoryId(
  categoryId: number
): Promise<GoodsInfo[]> {
  const list = await prisma.goods.findMany({
    where: { category_id: categoryId, deleted_at: null, status: 1 },
    orderBy: { created_at: "desc" },
  });
  return list.map(serializeGoods);
}

export async function getGoodsById(id: number): Promise<GoodsInfo | null> {
  const g = await prisma.goods.findFirst({
    where: { id, deleted_at: null },
  });
  return g ? serializeGoods(g) : null;
}
