import type { SiteLang } from "@/lib/site-lang";

export interface PrivacySection {
  title: string;
  body: string;
}

export interface PrivacyContent {
  title: string;
  intro: string;
  sections: PrivacySection[];
}

const PRIVACY_ZH: PrivacyContent = {
  title: "隐私政策",
  intro:
    "余光照明重视访问者隐私。本政策简要说明您访问本站时，我们可能如何处理 Cookie 与基础访问信息。",
  sections: [
    {
      title: "信息收集",
      body: "我们可能通过 Cookie 记录语言偏好（site-lang）及基础访问统计，用于改进网站体验。除您主动提交的信息外，我们不会强制收集可识别个人身份的详细资料。",
    },
    {
      title: "信息使用",
      body: "收集的信息仅用于网站功能优化、安全防护与服务质量提升，不会出售给第三方。",
    },
    {
      title: "信息安全",
      body: "我们将采取合理措施保护相关信息。除法律法规要求或经您同意外，不会对外公开您的个人信息。",
    },
    {
      title: "第三方链接",
      body: "本站可能包含指向第三方网站的链接，我们不对其隐私做法或内容负责。",
    },
    {
      title: "政策更新",
      body: "我们可能适时更新本政策，请不定期查阅本页以了解最新内容。",
    },
  ],
};

const PRIVACY_EN: PrivacyContent = {
  title: "Privacy Policy",
  intro:
    "YuGuang Lighting is committed to protecting the privacy of individuals and organizations visiting this website. This policy outlines how we handle cookies and basic visit information.",
  sections: [
    {
      title: "Information Collection",
      body: "We may use cookies to remember language preferences (site-lang) and collect basic visit statistics to improve the website experience. We do not require personally identifiable information unless you choose to submit it.",
    },
    {
      title: "Information Use",
      body: "Collected information is used only to optimize site functionality, security, and service quality. We do not sell your data to third parties.",
    },
    {
      title: "Information Security",
      body: "We take reasonable measures to protect relevant information and will not disclose your personal data except as required by law or with your consent.",
    },
    {
      title: "Links to Other Sites",
      body: "This website may contain links to third-party sites. We are not responsible for their privacy practices or content.",
    },
    {
      title: "Changes to this Policy",
      body: "We may update this policy from time to time. Please review this page periodically for the latest version.",
    },
  ],
};

export function privacyContent(lang: SiteLang): PrivacyContent {
  return lang === "en" ? PRIVACY_EN : PRIVACY_ZH;
}
