import type { GetStaticPaths, GetStaticProps } from "next";
import BookingVenuePage from "./booking/[slug]";
import NightVenuePage from "./night/[slug]";
import {
  BOOKING_VENUES,
  BOOKING_BY_SLUG,
  BOOKING_KEEP_OLD,
  BOOKING_URL_MAP,
  BOOKING_SLUG_BY_URL,
  type BookingVenue,
} from "@/lib/booking/venues";
import {
  VENUES as NIGHT_VENUES,
  VENUE_BY_SLUG as NIGHT_BY_SLUG,
  NIGHT_KEEP_OLD,
  NIGHT_URL_MAP,
  NIGHT_SLUG_BY_URL,
  type Venue,
} from "@/lib/night/venues";

/**
 * ★ 2026-08-26 대표님 확정 — 가게 페이지 주소는 메인주소 바로 뒤에 가게이름.
 *   중간에 /booking/ · /night/ 같은 단어를 넣지 않는다.
 *   네이버에 이미 나오는 주소만 옛 경로에 그대로 남는다.
 *
 * 두 종류를 한 라우트가 맡으므로 주소 이름표로 어느 쪽인지 가려낸다.
 * 화면은 기존 페이지 컴포넌트를 그대로 다시 쓴다(내용이 달라지지 않게).
 *
 * 주의: Next.js 는 고정 라우트를 동적 라우트보다 먼저 찾으므로 부딪히지 않는다.
 */

type Props =
  | { kind: "booking"; venue: BookingVenue }
  | { kind: "night"; venue: Venue };

export default function VenueRoute(props: Props) {
  if (props.kind === "night") return <NightVenuePage venue={props.venue} />;
  return <BookingVenuePage venue={props.venue} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { slug: string } }[] = [];
  for (const v of BOOKING_VENUES) {
    if (BOOKING_KEEP_OLD.has(v.slug)) continue;
    paths.push({ params: { slug: BOOKING_URL_MAP[v.slug] ?? v.slug } });
  }
  for (const v of NIGHT_VENUES) {
    if (NIGHT_KEEP_OLD.has(v.slug)) continue;
    paths.push({ params: { slug: NIGHT_URL_MAP[v.slug] ?? v.slug } });
  }
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const url = String(ctx.params?.slug);

  const nightSlug = NIGHT_SLUG_BY_URL[url];
  if (nightSlug && NIGHT_BY_SLUG[nightSlug]) {
    return { props: { kind: "night", venue: NIGHT_BY_SLUG[nightSlug] } };
  }

  const bookingSlug = BOOKING_SLUG_BY_URL[url] ?? url;
  const venue = BOOKING_BY_SLUG[bookingSlug];
  if (!venue) return { notFound: true };
  return { props: { kind: "booking", venue } };
};
