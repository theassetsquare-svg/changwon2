import type { BookingVenue } from "./types";
import { VENUES_1 } from "./venues-1";
import { VENUES_2 } from "./venues-2";
import { VENUES_3 } from "./venues-3";
import { VENUES_4 } from "./venues-4";

export * from "./types";

/** 40개 업소. 순서는 프롬프트 지정 목록 기준으로 재정렬한다. */
const ALL = [...VENUES_1, ...VENUES_2, ...VENUES_3, ...VENUES_4];

const ORDER = [
  "sillim-grandprix-night",
  "sangbong-hangukgwan-night",
  "suyu-shampoo-night",
  "busan-asiad-night",
  "suwon-chance-dome-night",
  "ansan-hit-night",
  "daejeon-seven-night",
  "ilsan-shampoo-night",
  "cheongdam-night",
  "daejeon-one-night",
  "changwon-lululala-night",
  "bulgwang-hobak-night",
  "ulsan-champion-night",
  "doksan-gukbingwan-night",
  "dapsimni-miracle-night",
  "gangseo-hobak-night",
  "yeongdeungpo-terminal-night",
  "nowon-hobak-night",
  "gildong-chance-night",
  "paju-yadang-skydome-night",
  "guri-hobak-night",
  "uijeongbu-hangukgwan-night",
  "uijeongbu-baekakgwan-night",
  "suwon-korea-night",
  "osan-hobak-night",
  "indeogwon-gukbingwan-night",
  "seongnam-shampoo-night",
  "incheon-arabian-night",
  "bucheon-gorae-night",
  "pyeongtaek-hobak-night",
  "cheonan-stardome-night",
  "cheonan-korea-night",
  "cheongju-hobak-night",
  "ulsan-newworld-night",
  "seosan-hobak-night",
  "daegu-hobak-night",
  "gumi-hobak-night",
  "gwangju-sangmu-night",
  "gwangju-cheomdan-night",
  "jejudo-night",
];

export const BOOKING_VENUES: BookingVenue[] = ORDER.map((slug) => {
  const v = ALL.find((x) => x.slug === slug);
  if (!v) throw new Error(`업소 데이터 누락: ${slug}`);
  return v;
});

if (BOOKING_VENUES.length !== 40) {
  throw new Error(`업소 40개가 아님: ${BOOKING_VENUES.length}`);
}

export const BOOKING_BY_SLUG: Record<string, BookingVenue> = Object.fromEntries(
  BOOKING_VENUES.map((v) => [v.slug, v]),
);

/** 허브 목록에서 쓰는 권역 분류 */
export const REGION_GROUPS: { key: string; label: string; slugs: string[] }[] = [
  {
    key: "seoul",
    label: "서울",
    slugs: [
      "sillim-grandprix-night",
      "sangbong-hangukgwan-night",
      "suyu-shampoo-night",
      "cheongdam-night",
      "bulgwang-hobak-night",
      "doksan-gukbingwan-night",
      "dapsimni-miracle-night",
      "gangseo-hobak-night",
      "yeongdeungpo-terminal-night",
      "nowon-hobak-night",
      "gildong-chance-night",
    ],
  },
  {
    key: "gyeonggi",
    label: "경기 · 인천",
    slugs: [
      "suwon-chance-dome-night",
      "ansan-hit-night",
      "ilsan-shampoo-night",
      "paju-yadang-skydome-night",
      "guri-hobak-night",
      "uijeongbu-hangukgwan-night",
      "uijeongbu-baekakgwan-night",
      "suwon-korea-night",
      "osan-hobak-night",
      "indeogwon-gukbingwan-night",
      "seongnam-shampoo-night",
      "incheon-arabian-night",
      "bucheon-gorae-night",
      "pyeongtaek-hobak-night",
    ],
  },
  {
    key: "chungcheong",
    label: "충청",
    slugs: [
      "daejeon-seven-night",
      "daejeon-one-night",
      "cheonan-stardome-night",
      "cheonan-korea-night",
      "cheongju-hobak-night",
      "seosan-hobak-night",
    ],
  },
  {
    key: "yeongnam",
    label: "영남",
    slugs: [
      "busan-asiad-night",
      "changwon-lululala-night",
      "ulsan-champion-night",
      "ulsan-newworld-night",
      "daegu-hobak-night",
      "gumi-hobak-night",
    ],
  },
  {
    key: "honam-jeju",
    label: "호남 · 제주",
    slugs: ["gwangju-sangmu-night", "gwangju-cheomdan-night", "jejudo-night"],
  },
];
