import {
  SITE_URL,
  BIZ_ADDRESS_ROAD,
  BIZ_FLOOR,
  BIZ_HOURS,
  BIZ_FOUNDED,
  BIZ_LICENSE,
  GEO_LAT,
  GEO_LNG,
  INSTA_1,
  INSTA_2,
} from "./site";

export const ORG_ID = SITE_URL + "/#organization";
export const PLACE_ID = SITE_URL + "/#place";
export const WEBSITE_ID = SITE_URL + "/#website";

export function placeSchema() {
  return {
    "@type": ["NightClub", "LocalBusiness"],
    "@id": PLACE_ID,
    name: "창원 룰루랄라 나이트클럽",
    alternateName: [
      "창원 룰루랄라",
      "룰루랄라 나이트",
      "창원 나이트 룰루랄라",
      "Changwon Rululala Nightclub",
    ],
    description:
      "경상남도 창원시 성산구 상남동 모아엔트몰 지하 3층, 약 457평 규모의 합법 유흥주점.",
    url: SITE_URL + "/",
    image: [
      SITE_URL + "/images/og-cover.svg",
      SITE_URL + "/images/1-exterior.svg",
      SITE_URL + "/images/2-mainhall.svg",
      SITE_URL + "/images/3-room.svg",
      SITE_URL + "/images/4-dj.svg",
      SITE_URL + "/images/5-bar.svg",
    ],
    priceRange: "문의 (별도 표기 없음)",
    currenciesAccepted: "KRW",
    paymentAccepted: "Cash, Credit Card",
    address: {
      "@type": "PostalAddress",
      streetAddress: "마디미로43번길 10, " + BIZ_FLOOR,
      addressLocality: "창원시 성산구",
      addressRegion: "경상남도",
      postalCode: "51495",
      addressCountry: "KR",
    },
    geo: { "@type": "GeoCoordinates", latitude: GEO_LAT, longitude: GEO_LNG },
    hasMap:
      "https://map.naver.com/p/search/" +
      encodeURIComponent("창원 룰루랄라 나이트클럽 마디미로43번길 10"),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "19:00",
        closes: "05:00",
      },
    ],
    openingHours: "Mo-Su 19:00-05:00",
    areaServed: { "@type": "City", name: "창원시" },
    publicAccess: false,
    smokingAllowed: true,
    isAccessibleForFree: false,
    slogan: "상남동 한복판, " + BIZ_FLOOR,
    foundingDate: BIZ_FOUNDED,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "영업허가번호",
      value: BIZ_LICENSE,
    },
    parentOrganization: { "@id": ORG_ID },
    sameAs: [INSTA_1, INSTA_2],
  };
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "창원 룰루랄라 나이트클럽",
    url: SITE_URL + "/",
    logo: SITE_URL + "/images/og-cover.svg",
    sameAs: [INSTA_1, INSTA_2],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL + "/",
    name: "창원 룰루랄라 나이트클럽 공식 안내",
    inLanguage: "ko-KR",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: SITE_URL + "/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumb(
  items: { name: string; path: string }[],
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: SITE_URL + it.path,
    })),
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@type": "Article",
    "@id": SITE_URL + opts.path + "#article",
    headline: opts.title,
    description: opts.description,
    inLanguage: "ko-KR",
    url: SITE_URL + opts.path,
    mainEntityOfPage: SITE_URL + opts.path,
    image: SITE_URL + "/images/og-cover.svg",
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    publisher: { "@id": ORG_ID },
    about: { "@id": PLACE_ID },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function graph(items: object[]) {
  return { "@context": "https://schema.org", "@graph": items };
}

export const BASE_GRAPH = [
  placeSchema(),
  organizationSchema(),
  websiteSchema(),
];

export const BIZ = {
  HOURS: BIZ_HOURS,
  ADDR: BIZ_ADDRESS_ROAD,
  FLOOR: BIZ_FLOOR,
};
