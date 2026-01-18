export interface CategoryInfo {
  id: number;
  name: string;
  englishName: string;
  description: string | null;
  englishDescription: string | null;
  coverImageUrl: string | null;
  sort: number | null;
  status: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface GoodsInfo {
  id: number;
  name: string;
  englishName: string;
  description: string | null;
  englishDescription: string | null;
  imageListUrl: string | null;
  price: string | null;
  categoryId: number;
  introduction: string | null;
  status: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface CarouselInfo {
  id: number;
  imageUrl: string;
  sort: number | null;
  status: number | null;
  remark: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface IntroductionInfo {
  id: number;
  richText: string | null;
  version: number | null;
  status: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface CategoryWithGoods extends CategoryInfo {
  goodsList: GoodsInfo[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ListData<T> {
  total: number;
  list: T[];
}
