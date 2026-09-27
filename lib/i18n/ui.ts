import type { SiteLang } from "@/lib/site-lang";

const UI_COPY = {
  zh: {
    brandName: "余光照明",
    navAbout: "关于余光",
    homeRecommend: "为您推荐",
    homeLearnMore: "了解更多",
    categoryEmpty: "该分类暂无商品",
    categoryEmptyHint: "敬请期待更多内容",
    categoryMetaFallback: "余光照明产品分类",
    goodsMetaFallback: "余光照明",
    goodsPreviewAlt: "预览图",
    goodsIntroMissing: "英文详情暂未提供",
    carouselAlt: "余光照明 - 轮播",
    footerContact: "联系我们",
    footerPrivacy: "隐私政策",
    menuOpen: "打开菜单",
    menuClose: "关闭菜单",
    menuOverlay: "关闭菜单遮罩",
    menuDialog: "菜单",
    aboutTitle: "关于余光",
    aboutEmpty: "暂无介绍",
    privacyTitle: "隐私政策",
    privacyDescription: "余光照明网站隐私与 Cookie 政策",
  },
  en: {
    brandName: "Yuguang Lighting",
    navAbout: "About",
    homeRecommend: "Recommended for You",
    homeLearnMore: "Learn More",
    categoryEmpty: "No products in this category",
    categoryEmptyHint: "More coming soon",
    categoryMetaFallback: "Yuguang Lighting product category",
    goodsMetaFallback: "Yuguang Lighting",
    goodsPreviewAlt: "Preview",
    goodsIntroMissing: "English details are not available yet",
    carouselAlt: "Yuguang Lighting - Slide",
    footerContact: "Contact Us",
    footerPrivacy: "Privacy Policy",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    menuOverlay: "Close menu overlay",
    menuDialog: "Menu",
    aboutTitle: "About",
    aboutEmpty: "No introduction yet",
    privacyTitle: "Privacy Policy",
    privacyDescription: "Yuguang Lighting website privacy and cookie policy",
  },
} as const;

export type UiCopy = (typeof UI_COPY)[SiteLang];

export function uiCopy(lang: SiteLang): UiCopy {
  return UI_COPY[lang];
}
