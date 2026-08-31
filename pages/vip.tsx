import type { GetStaticProps } from "next";
import Head from "next/head";
import BookingVenuePage from "./booking/[slug]";
import { BOOKING_BY_SLUG, type BookingVenue } from "@/lib/booking/venues";
import { SITE_URL } from "@/lib/site";
import { 변형쪽들 } from "@/lib/variant-pages";

/**
 * ★★ 2026-09-01 대표님 지시로 바꾼 쪽.
 *
 *  "사이트 1개당 창원룰루랄라나이트 페이지 2개만 놔두고,
 *   색인되는 나머지 창원룰루랄라나이트 페이지만 광고주 페이지로 수정하라고."
 *
 *  이 주소(/vip/)는 **이미 네이버에 색인돼 있다.** 주소는 그대로 두고 내용만 바꿨다.
 *  색인된 주소를 버리면 처음부터 다시 줄을 서야 하기 때문이다.
 *
 *  ★ canonical·og:url 은 반드시 **이 주소**여야 한다.
 *    광고주 쪽 기본값(/booking/…)으로 두면 네이버가 이 쪽을 사본으로 보고 밀어낸다.
 *    그래서 <Head> 로 뒤에 덮어쓴다(뒤에 온 것이 이긴다).
 *
 *  ★ BookingVenuePage 를 그대로 쓴다 — 그 컴포넌트가 광고주 신원(이름·닉네임·번호·
 *    고정 문의바·관계 고지·JSON-LD)을 쪽 단위로 넣어 준다. 남의 번호가 새지 않는다.
 */
const VENUE_SLUG = "ulsan-champion-night";
const 이주소 = "/vip/";

export const getStaticProps: GetStaticProps<{ venue: BookingVenue }> = async () => ({
  props: { venue: BOOKING_BY_SLUG[VENUE_SLUG] },
});

export default function VipPage({ venue }: { venue: BookingVenue }) {
  const url = `${SITE_URL}${이주소}`;
  return (
    <>
      <BookingVenuePage venue={venue} 변형={변형쪽들["/vip"]} />
      <Head>
        <link key="canonical" rel="canonical" href={url} />
        <meta key="og:url" property="og:url" content={url} />
      </Head>
    </>
  );
}
