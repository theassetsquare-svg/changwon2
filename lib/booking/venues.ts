import type { BookingVenue } from "./types";
import { VENUES_1 } from "./venues-1";
import { VENUES_2 } from "./venues-2";
import { VENUES_3 } from "./venues-3";
import { VENUES_4 } from "./venues-4";

export * from "./types";

/** 40개 업소. 순서는 프롬프트 지정 목록 기준으로 재정렬한다. */
const ALL = [...VENUES_1, ...VENUES_2, ...VENUES_3, ...VENUES_4];

const ORDER = [
  "night-grandprix-sillim",
  "sangbong-hangukgwan-night",
  "suyu-shampoo-night-hall",
  "busan-asiad-night",
  "suwon-chance-dome-night",
  "ansan-hit-night",
  "daejeon-seven-night",
  "ilsan-shampoo-night-hall",
  "cheongdam-night",
  "daejeon-one-night",
  "changwon-lululala-night",
  "bulgwang-hobak-night",
  "ulsan-champion-night",
  "doksan-gukbingwan-night-hall",
  "dapsimni-miracle-night",
  "gangseo-hobak-night-hall",
  "yeongdeungpo-terminal-night-hall",
  "nowon-hobak-night-hall",
  "gildong-chance-night-hall",
  "paju-yadang-skydome-night-hall",
  "guri-hobak-night-hall",
  "uijeongbu-hangukgwan-night-hall",
  "uijeongbu-baekakgwan-night-hall",
  "suwon-korea-night-hall",
  "osan-hobak-night-hall",
  "indeogwon-gukbingwan-night-hall",
  "seongnam-shampoo-night-hall",
  "incheon-arabian-night-hall",
  "bucheon-gorae-night-hall",
  "pyeongtaek-hobak-night-hall",
  "cheonan-stardome-night-hall",
  "cheonan-korea-night-hall",
  "cheongju-hobak-night-hall",
  "ulsan-newworld-night-hall",
  "seosan-hobak-night-hall",
  "daegu-hobak-night-hall",
  "gumi-hobak-night-hall",
  "gwangju-sangmu-night-hall",
  "gwangju-cheomdan-night-hall",
  "jejudo-night-hall",
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
      "night-grandprix-sillim",
      "sangbong-hangukgwan-night",
      "suyu-shampoo-night-hall",
      "cheongdam-night",
      "bulgwang-hobak-night",
      "doksan-gukbingwan-night-hall",
      "dapsimni-miracle-night",
      "gangseo-hobak-night-hall",
      "yeongdeungpo-terminal-night-hall",
      "nowon-hobak-night-hall",
      "gildong-chance-night-hall",
    ],
  },
  {
    key: "gyeonggi",
    label: "경기 · 인천",
    slugs: [
      "suwon-chance-dome-night",
      "ansan-hit-night",
      "ilsan-shampoo-night-hall",
      "paju-yadang-skydome-night-hall",
      "guri-hobak-night-hall",
      "uijeongbu-hangukgwan-night-hall",
      "uijeongbu-baekakgwan-night-hall",
      "suwon-korea-night-hall",
      "osan-hobak-night-hall",
      "indeogwon-gukbingwan-night-hall",
      "seongnam-shampoo-night-hall",
      "incheon-arabian-night-hall",
      "bucheon-gorae-night-hall",
      "pyeongtaek-hobak-night-hall",
    ],
  },
  {
    key: "chungcheong",
    label: "충청",
    slugs: [
      "daejeon-seven-night",
      "daejeon-one-night",
      "cheonan-stardome-night-hall",
      "cheonan-korea-night-hall",
      "cheongju-hobak-night-hall",
      "seosan-hobak-night-hall",
    ],
  },
  {
    key: "yeongnam",
    label: "영남",
    slugs: [
      "busan-asiad-night",
      "changwon-lululala-night",
      "ulsan-champion-night",
      "ulsan-newworld-night-hall",
      "daegu-hobak-night-hall",
      "gumi-hobak-night-hall",
    ],
  },
  {
    key: "honam-jeju",
    label: "호남 · 제주",
    slugs: ["gwangju-sangmu-night-hall", "gwangju-cheomdan-night-hall", "jejudo-night-hall"],
  },
];
