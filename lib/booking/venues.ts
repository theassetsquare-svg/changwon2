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
  "doksan-gukbingwan-night-guide",
  "dapsimni-miracle-night",
  "gangseo-hobak-night-guide",
  "yeongdeungpo-terminal-night-guide",
  "nowon-hobak-night-guide",
  "gildong-chance-night-guide",
  "paju-yadang-skydome-night-guide",
  "guri-hobak-night-guide",
  "uijeongbu-hangukgwan-night-guide",
  "uijeongbu-baekakgwan-night-guide",
  "suwon-korea-night-guide",
  "osan-hobak-night-guide",
  "indeogwon-gukbingwan-night-guide",
  "seongnam-shampoo-night-guide",
  "incheon-arabian-night-guide",
  "bucheon-gorae-night-guide",
  "pyeongtaek-hobak-night-guide",
  "cheonan-stardome-night-guide",
  "cheonan-korea-night-guide",
  "cheongju-hobak-night-guide",
  "ulsan-newworld-night-guide",
  "seosan-hobak-night-guide",
  "daegu-hobak-night-guide",
  "gumi-hobak-night-guide",
  "gwangju-sangmu-night-guide",
  "gwangju-cheomdan-night-guide",
  "jejudo-night-guide",
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
      "doksan-gukbingwan-night-guide",
      "dapsimni-miracle-night",
      "gangseo-hobak-night-guide",
      "yeongdeungpo-terminal-night-guide",
      "nowon-hobak-night-guide",
      "gildong-chance-night-guide",
    ],
  },
  {
    key: "gyeonggi",
    label: "경기 · 인천",
    slugs: [
      "suwon-chance-dome-night",
      "ansan-hit-night",
      "ilsan-shampoo-night",
      "paju-yadang-skydome-night-guide",
      "guri-hobak-night-guide",
      "uijeongbu-hangukgwan-night-guide",
      "uijeongbu-baekakgwan-night-guide",
      "suwon-korea-night-guide",
      "osan-hobak-night-guide",
      "indeogwon-gukbingwan-night-guide",
      "seongnam-shampoo-night-guide",
      "incheon-arabian-night-guide",
      "bucheon-gorae-night-guide",
      "pyeongtaek-hobak-night-guide",
    ],
  },
  {
    key: "chungcheong",
    label: "충청",
    slugs: [
      "daejeon-seven-night",
      "daejeon-one-night",
      "cheonan-stardome-night-guide",
      "cheonan-korea-night-guide",
      "cheongju-hobak-night-guide",
      "seosan-hobak-night-guide",
    ],
  },
  {
    key: "yeongnam",
    label: "영남",
    slugs: [
      "busan-asiad-night",
      "changwon-lululala-night",
      "ulsan-champion-night",
      "ulsan-newworld-night-guide",
      "daegu-hobak-night-guide",
      "gumi-hobak-night-guide",
    ],
  },
  {
    key: "honam-jeju",
    label: "호남 · 제주",
    slugs: ["gwangju-sangmu-night-guide", "gwangju-cheomdan-night-guide", "jejudo-night-guide"],
  },
];
