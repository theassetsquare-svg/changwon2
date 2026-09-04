import { SITE_URL } from "@/lib/site";
import type { BookingVenue } from "./types";
import { bookingPath, BOOKING_BASE } from "./types";

export const bookingOgPath = (slug: string, v?: string) => `/og/booking-${slug}-og${v ?? ""}.png`;
export const absUrl = (path: string) => SITE_URL + path;

/** ① NightClub — 확인되지 않은 항목(상세 주소·영업시간·가격)은 키 자체를 넣지 않는다. */
export function bookingClubSchema(v: BookingVenue, 이주소?: string) {
  /* ★ 2026-09-02 — 이 쪽 자신의 주소를 주면 그것을 쓴다.
     구조화 데이터의 url 이 다른 쪽을 가리키면 네이버가 그쪽을 정본으로 보고
     이 쪽을 사본 취급한다 [[url-one-shape-rule]]. */
  const url = absUrl(이주소 ?? bookingPath(v.slug));
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: v.name,
    url,
    image: absUrl(bookingOgPath(v.slug, (v as any).ogV)),
    description: v.answer,
    address: {
      "@type": "PostalAddress",
      addressLocality: v.locality,
      addressRegion: v.addressRegion,
      addressCountry: "KR",
    },
  };
  if (v.alias) schema.alternateName = v.alias;
  if (v.address) (schema.address as Record<string, unknown>).streetAddress = v.address;
  if (v.hours) schema.openingHours = v.hours;
  if (v.contact) schema.telephone = v.contact.phone;
  if (v.ageRange) schema.typicalAgeRange = v.ageRange;
  return schema;
}

/** ② FAQPage
 *  ★ 2026-09-02 — 화면에 보이는 FAQ 와 구조화 데이터가 반드시 같아야 한다.
 *  변형 쪽은 화면에 변형 FAQ 를 그리는데 여기서 원래 FAQ 를 내보내고 있었다.
 *  화면과 다른 구조화 데이터는 네이버가 기만으로 보는 항목이다. */
export function bookingFaqSchema(v: BookingVenue, 보이는FAQ?: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (보이는FAQ?.length ? 보이는FAQ : v.faq).map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

/** ③ BreadcrumbList — 홈 > 부킹 안내 > {업소명} */
export function bookingBreadcrumbSchema(v: BookingVenue, 이주소?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "새벽 4시 40분", item: absUrl("/") },
      { "@type": "ListItem", position: 2, name: "부킹 안내", item: absUrl(BOOKING_BASE) },
      {
        "@type": "ListItem",
        position: 3,
        name: v.name,
        item: absUrl(이주소 ?? bookingPath(v.slug)),
      },
    ],
  };
}
