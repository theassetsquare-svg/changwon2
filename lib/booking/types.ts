// /booking/{slug}/ — "부킹 문화 안내서" 40개 업소 페이지 데이터 타입.
//
// 콘셉트 고정: 모든 글은 부킹 흐름(입장 → 자리 → 부킹 시작 → 이어가기/거절)과
// 매너 축으로만 푼다. 장면 스토리텔링·시간표 분석·전체 Q&A·좌석 도감·교통 내비·
// 선택 기준표·초보 용어사전은 쓰지 않는다(자매 사이트 각도와 충돌).
//
// 사실 표기 원칙
//  · 주소·층·역·영업시간은 웹에서 확인된 것만 적고, 미확인은 "확인 불가" 로 남긴다.
//  · 연령은 "만 27세 이상" / "만 38세 이상" 완전문으로만 쓴다. 축약 금지.
//  · A그룹(광고주 있음)은 고정바에 담당자 전화, B그룹은 광고·제휴 입점 문의만 노출한다.

/* ★ 2026-08-24 — 목록(허브) 주소와 가게 페이지 상위 경로를 **반드시 나눠 둔다.**
 *
 * 주소교체로 목록이 /booking/ → /booking-2/ 로 옮겨졌는데, 가게 페이지는
 * pages/booking/[slug].tsx 라 여전히 /booking/<슬러그>/ 다.
 * 예전에는 한 상수로 묶여 있어서 가게 링크가 전부 /booking-2/<슬러그>/ 가 됐고,
 * 그 주소는 없으므로 **내부 링크 57개가 404** 였다(2026-08-24 실측).
 * 목록 주소가 또 바뀌어도 가게 경로는 따라가면 안 된다. */
export const BOOKING_BASE = "/booking-2/";        // 목록(허브) 주소
export const BOOKING_VENUE_BASE = "/booking/";    // 가게 페이지 상위 = pages/booking/[slug].tsx
export const bookingPath = (slug: string) => `${BOOKING_VENUE_BASE}${slug}/`;

export const AD_KAKAO = "besta12";
export const AD_TEXT = "광고·제휴 입점 문의";

/** 홈·허브 고정바에 쓰는 자사 매장 라인 */
export const HOME_BAR = {
  name: "창원룰루랄라나이트",
  nick: "로또",
  phone: "010-7528-4936",
  tel: "01075284936",
};

export type BookingSection = {
  /** 부킹 흐름 소제목. 질문형 2개 이상이 되도록 배분한다. */
  h2: string;
  body: string[];
};

export type BookingVenue = {
  slug: string;
  name: string;
  /** 인천아라비안나이트처럼 표기가 갈리는 경우의 병기 표기 */
  alias?: string;
  group: "A" | "B";
  /** 즉답 문장·표에 쓰는 지역 표기 */
  region: string;
  locality: string;
  addressRegion: string;
  /** 웹에서 확인된 주소만. 미확인이면 undefined → 표에 "확인 불가". */
  address?: string;
  /** 층·건물. 미확인이면 undefined. */
  floor?: string;
  /** 가장 가까운 역. 미확인이면 undefined. */
  station?: string;
  /** 확인된 영업시간만. */
  hours?: string;
  /** 연령 제한이 별도 공지된 업소만. 완전문. */
  ageBadge?: string;
  ageRange?: string;
  contact?: { nick: string; phone: string; tel: string };
  /** 썸네일 그림을 바꿨을 때 캐시를 피하려고 붙이는 판 번호. 없으면 기존 파일명 그대로. */
  ogV?: string;
  /** 같은 업소의 /night/ 안내 페이지가 있으면 슬러그 */
  nightSlug?: string;

  /** 20~30자, 업소명이 맨 앞. 40개 전부 다르다. */
  title: string;
  description: string;
  ogAlt: string;
  /** 도입 2문단 — 제목의 답은 여기서 주지 않는다. */
  lead: [string, string];
  /** 핵심 3줄 직답 박스 */
  answer3: [string, string, string];
  /** AI 인용용 한 문장 — 업소명 + 지역 + 업종 */
  answer: string;
  /** 부킹 흐름 4~6개 */
  sections: BookingSection[];
  /** 맨 끝, 제목이 던진 질문의 답 */
  closing: { h2: string; body: string[] };
  faq: { q: string; a: string }[];
  /** 한 줄 정리 */
  oneline: string;
  related: string[];
  /** OG 카드 배경(딥 퍼플 계열) */
  og: { bg: string; bg2: string };
};
