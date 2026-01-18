export interface CategoryInfo {
  id: number;
  name: string;
  english_name: string;
  description: string | null;
  english_description: string | null;
  cover_image_url: string | null;
  sort: number | null;
  status: number | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface GoodsInfo {
  id: number;
  name: string;
  english_name: string;
  description: string | null;
  english_description: string | null;
  image_list_url: string | null;
  price: string | null;
  category_id: number;
  introduction: string | null;
  status: number | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface CarouselInfo {
  id: number;
  image_url: string;
  sort: number | null;
  status: number | null;
  remark: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface IntroductionInfo {
  id: number;
  rich_text: string | null;
  version: number | null;
  status: number | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface CategoryWithGoods extends CategoryInfo {
  goodsList: GoodsInfo[];
}
