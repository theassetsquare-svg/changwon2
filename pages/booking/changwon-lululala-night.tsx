import type { GetStaticProps } from "next";
import BookingVenuePage from "./[slug]";
import { BOOKING_BY_SLUG, type BookingVenue } from "@/lib/booking/venues";
import { 변형쪽들 } from "@/lib/variant-pages";

/**
 * ★★ 2026-09-02 대표님 지시로 바꾼 쪽 — 신림그랑프리나이트 정보 페이지.
 *
 *  주소(/booking/changwon-lululala-night/)는 **그대로 두고** 안에 든 내용만 바꿨다.
 *  색인된 주소는 자산이라 버리지 않는다 · 301 리디렉션도 걸지 않는다.
 *
 *  ★ 이주소 를 넘기므로 canonical·og:url·구조화 데이터가 전부 이 주소가 된다.
 *    기본값(/booking/…)으로 두면 네이버가 이 쪽을 그쪽의 사본으로 보고 밀어낸다.
 *  ★ 설명문도 이 쪽만의 것을 넘긴다 — 설명문을 나눠 쓰면 그것만으로 색인이 막힌다.
 *  ★ BookingVenuePage 가 신원(이름·닉네임·번호·문의바·관계 고지·JSON-LD)을 쪽 단위로
 *    넣는다. 남의 번호가 새지 않는다.
 */
const VENUE_SLUG = "sillim-grandprix-3";
const 이주소 = "/booking/changwon-lululala-night/";
const 변형 = 변형쪽들["/booking/changwon-lululala-night"];

export const getStaticProps: GetStaticProps<{ venue: BookingVenue }> = async () => ({
  props: { venue: BOOKING_BY_SLUG[VENUE_SLUG] },
});

export default function BookingOverridePage({ venue }: { venue: BookingVenue }) {
  return (
    <BookingVenuePage
      venue={venue}
      변형={변형}
      이주소={이주소}
      설명={변형.description}
    />
  );
}
