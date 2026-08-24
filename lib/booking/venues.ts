import type { BookingVenue } from "./types";
import { VENUES_1 } from "./venues-1";
import { VENUES_2 } from "./venues-2";
import { VENUES_3 } from "./venues-3";
import { VENUES_4 } from "./venues-4";

export * from "./types";

/** 40개 업소. 순서는 프롬프트 지정 목록 기준으로 재정렬한다. */
const ALL = [...VENUES_1, ...VENUES_2, ...VENUES_3, ...VENUES_4];

const ORDER = [
  "sillim-grandprix-3",
  "sangbong-hangukgwan-3",
  "suyu-shampoo-3",
  "busan-asiad-night",
  "suwon-chancedome-3",
  "ansan-hit-night",
  "daejeon-seven-night",
  "ilsan-shampoo-3",
  "cheongdam-night",
  "daejeon-one-night",
  "changwon-lululala-night",
  "bulgwang-hobak-night",
  "ulsan-champion-night",
  "doksan-gukbingwan-2",
  "dapsimni-miracle-night",
  "gangseo-hobak-2",
  "yeongdeungpo-terminal-2",
  "nowon-hobak-2",
  "gildong-chance-2",
  "paju-skydome-2",
  "guri-hobak-2",
  "uijeongbu-hangukgwan-2",
  "uijeongbu-baekakgwan-2",
  "suwon-korea-2",
  "osan-hobak-3",
  "indeogwon-gukbingwan-2",
  "seongnam-shampoo-2",
  "incheon-arabian-2",
  "bucheon-gorae-2",
  "pyeongtaek-hobak-2",
  "cheonan-stardome-2",
  "cheonan-korea-2",
  "cheongju-hobak-2",
  "ulsan-newworld-2",
  "osan-hobak-4",
  "daegu-hobak-2",
  "gumi-hobak-2",
  "gwangju-sangmu-2",
  "gwangju-cheomdan-1",
  "jeju-1",
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
      "sillim-grandprix-3",
      "sangbong-hangukgwan-3",
      "suyu-shampoo-3",
      "cheongdam-night",
      "bulgwang-hobak-night",
      "doksan-gukbingwan-2",
      "dapsimni-miracle-night",
      "gangseo-hobak-2",
      "yeongdeungpo-terminal-2",
      "nowon-hobak-2",
      "gildong-chance-2",
    ],
  },
  {
    key: "gyeonggi",
    label: "경기 · 인천",
    slugs: [
      "suwon-chancedome-3",
      "ansan-hit-night",
      "ilsan-shampoo-3",
      "paju-skydome-2",
      "guri-hobak-2",
      "uijeongbu-hangukgwan-2",
      "uijeongbu-baekakgwan-2",
      "suwon-korea-2",
      "osan-hobak-3",
      "indeogwon-gukbingwan-2",
      "seongnam-shampoo-2",
      "incheon-arabian-2",
      "bucheon-gorae-2",
      "pyeongtaek-hobak-2",
    ],
  },
  {
    key: "chungcheong",
    label: "충청",
    slugs: [
      "daejeon-seven-night",
      "daejeon-one-night",
      "cheonan-stardome-2",
      "cheonan-korea-2",
      "cheongju-hobak-2",
      "osan-hobak-4",
    ],
  },
  {
    key: "yeongnam",
    label: "영남",
    slugs: [
      "busan-asiad-night",
      "changwon-lululala-night",
      "ulsan-champion-night",
      "ulsan-newworld-2",
      "daegu-hobak-2",
      "gumi-hobak-2",
    ],
  },
  {
    key: "honam-jeju",
    label: "호남 · 제주",
    slugs: ["gwangju-sangmu-2", "gwangju-cheomdan-1", "jeju-1"],
  },
];
