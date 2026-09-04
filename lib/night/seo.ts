import { SITE_URL } from "@/lib/site";
import type { Venue } from "./venues";
import { nightPath, NIGHT_BASE } from "./venues";

export const ogImagePath = (slug: string, v?: string) => `/og/${slug}-og${v ?? ""}.png`;
export const absUrl = (path: string) => SITE_URL + path;

/** ① NightClub — 확인 불가 항목(상세번지·영업시간·가격)은 키 자체를 넣지 않는다. */
export function nightClubSchema(v: Venue) {
  const url = absUrl(nightPath(v.slug));
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: v.name,
    url,
    image: absUrl(ogImagePath(v.slug, (v as any).ogV)),
    description: v.answer,
    address: {
      "@type": "PostalAddress",
      addressLocality: v.locality,
      addressRegion: v.addressRegion,
      addressCountry: "KR",
    },
  };
  /* 2026-09-05 AI-088 — JSON-LD 전화는 +82 국가코드 꼴(화면 표기는 그대로) */
  if (v.contact) schema.telephone = String(v.contact.phone).replace(/^0(\d{1,2})-?(\d{3,4})-?(\d{4})$/, '+82-$1-$2-$3');
  if (v.ageRange) schema.typicalAgeRange = v.ageRange;
  return schema;
}

/** ② FAQPage */
export function faqPageSchema(v: Venue) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: v.faq.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

/** ③ BreadcrumbList — 홈 > 나이트 > {업소명} */
export function breadcrumbSchema(v: Venue) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "새벽 4시 40분", item: absUrl("/") },
      { "@type": "ListItem", position: 2, name: "나이트", item: absUrl(NIGHT_BASE) },
      {
        "@type": "ListItem",
        position: 3,
        name: v.name,
        item: absUrl(nightPath(v.slug)),
      },
    ],
  };
}
