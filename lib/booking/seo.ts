import { SITE_URL } from "@/lib/site";
import type { BookingVenue } from "./types";
import { bookingPath, BOOKING_BASE } from "./types";

export const bookingOgPath = (slug: string) => `/og/booking-${slug}-og.png`;
export const absUrl = (path: string) => SITE_URL + path;

/** ① NightClub — 확인되지 않은 항목(상세 주소·영업시간·가격)은 키 자체를 넣지 않는다. */
export function bookingClubSchema(v: BookingVenue) {
  const url = absUrl(bookingPath(v.slug));
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: v.name,
    url,
    image: absUrl(bookingOgPath(v.slug)),
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

/** ② FAQPage */
export function bookingFaqSchema(v: BookingVenue) {
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

/** ③ BreadcrumbList — 홈 > 부킹 안내 > {업소명} */
export function bookingBreadcrumbSchema(v: BookingVenue) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: absUrl("/") },
      { "@type": "ListItem", position: 2, name: "부킹 안내", item: absUrl(BOOKING_BASE) },
      {
        "@type": "ListItem",
        position: 3,
        name: v.name,
        item: absUrl(bookingPath(v.slug)),
      },
    ],
  };
}
