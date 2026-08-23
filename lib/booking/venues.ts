import type { BookingVenue } from "./types";
import { VENUES_1 } from "./venues-1";
import { VENUES_2 } from "./venues-2";
import { VENUES_3 } from "./venues-3";
import { VENUES_4 } from "./venues-4";

export * from "./types";

/** 40개 업소. 순서는 프롬프트 지정 목록 기준으로 재정렬한다. */
const ALL = [...VENUES_1, ...VENUES_2, ...VENUES_3, ...VENUES_4];

const ORDER = [
  "sillim-grandprix-2",
  "sangbong-hangukgwan-2",
  "suyu-shampoo-2",
  "busan-asiad-night",
  "suwon-chancedome-2",
  "ansan-hit-night",
  "daejeon-seven-night",
  "ilsan-shampoo-2",
  "cheongdam-night",
  "daejeon-one-night",
  "changwon-lululala-night",
  "bulgwang-hobak-night",
  "ulsan-champion-night",
  "doksan-gukbingwan-1",
  "dapsimni-miracle-night",
  "gangseo-hobak-1",
  "yeongdeungpo-terminal-1",
  "nowon-hobak-1",
  "gildong-chance-1",
  "paju-skydome-1",
  "guri-hobak-1",
  "uijeongbu-hangukgwan-1",
  "uijeongbu-baekakgwan-1",
  "suwon-korea-1",
  "osan-hobak-1",
  "indeogwon-gukbingwan-1",
  "seongnam-shampoo-1",
  "incheon-arabian-1",
  "bucheon-gorae-1",
  "pyeongtaek-hobak-1",
  "cheonan-stardome-1",
  "cheonan-korea-1",
  "cheongju-hobak-1",
  "ulsan-newworld-1",
  "osan-hobak-2",
  "daegu-hobak-1",
  "gumi-hobak-1",
  "gwangju-sangmu-1",
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
      "sillim-grandprix-2",
      "sangbong-hangukgwan-2",
      "suyu-shampoo-2",
      "cheongdam-night",
      "bulgwang-hobak-night",
      "doksan-gukbingwan-1",
      "dapsimni-miracle-night",
      "gangseo-hobak-1",
      "yeongdeungpo-terminal-1",
      "nowon-hobak-1",
      "gildong-chance-1",
    ],
  },
  {
    key: "gyeonggi",
    label: "경기 · 인천",
    slugs: [
      "suwon-chancedome-2",
      "ansan-hit-night",
      "ilsan-shampoo-2",
      "paju-skydome-1",
      "guri-hobak-1",
      "uijeongbu-hangukgwan-1",
      "uijeongbu-baekakgwan-1",
      "suwon-korea-1",
      "osan-hobak-1",
      "indeogwon-gukbingwan-1",
      "seongnam-shampoo-1",
      "incheon-arabian-1",
      "bucheon-gorae-1",
      "pyeongtaek-hobak-1",
    ],
  },
  {
    key: "chungcheong",
    label: "충청",
    slugs: [
      "daejeon-seven-night",
      "daejeon-one-night",
      "cheonan-stardome-1",
      "cheonan-korea-1",
      "cheongju-hobak-1",
      "osan-hobak-2",
    ],
  },
  {
    key: "yeongnam",
    label: "영남",
    slugs: [
      "busan-asiad-night",
      "changwon-lululala-night",
      "ulsan-champion-night",
      "ulsan-newworld-1",
      "daegu-hobak-1",
      "gumi-hobak-1",
    ],
  },
  {
    key: "honam-jeju",
    label: "호남 · 제주",
    slugs: ["gwangju-sangmu-1", "gwangju-cheomdan-night-hall", "jejudo-night-hall"],
  },
];
