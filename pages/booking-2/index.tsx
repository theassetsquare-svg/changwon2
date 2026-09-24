import PageThumb from '@/components/PageThumb';
import { useThumb } from '@/lib/thumb';
import NightHead from "@/components/night/NightHead";
import NightFooter from "@/components/night/NightFooter";
import BookingStyles from "@/components/booking/BookingStyles";
import { BookingHomeBar } from "@/components/booking/BookingBar";
import { SITE_URL, BIZ_MIN_AGE } from "@/lib/site";
import {
  BOOKING_VENUES,
  BOOKING_BY_SLUG,
  REGION_GROUPS,
  bookingPath,
  BOOKING_BASE,
  AD_KAKAO,
} from "@/lib/booking/venues";
import { bookingOgPath } from "@/lib/booking/seo";
import { useSalt, 소금입히기 } from "@/lib/salt";

const TITLE = "전국 나이트 부킹 안내 40 — 지역별 목록";
const DESCRIPTION =
  "부킹이 실제로 어떤 순서로 도는지, 입장부터 자리·첫 연결·거절 매너까지 전국 40개 나이트 업소를 기준으로 정리한 안내 목록입니다. 확인되지 않은 표기합니다.";

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "전국 나이트 부킹 안내 40",
  numberOfItems: BOOKING_VENUES.length,
  itemListElement: BOOKING_VENUES.map((v, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: v.name,
    url: SITE_URL + bookingPath(v.slug),
  })),
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "새벽 4시 40분", item: SITE_URL + "/" },
    { "@type": "ListItem", position: 2, name: "부킹 안내", item: SITE_URL + BOOKING_BASE },
  ],
};

export default function BookingHub() {
  const 표 = useThumb();   /* 2026-09-24 쪽마다 고유 카드 */
  const s = useSalt();
  return 소금입히기(
    <>
      <NightHead
        title={TITLE}
        description={DESCRIPTION}
        path={BOOKING_BASE}
        그림없음
        image={bookingOgPath("index")}
        imageAlt="전국 나이트 부킹 안내 40 목록 카드 — 부킹 흐름과 매너 정리"
        jsonLd={[itemListSchema, breadcrumb]}
      />
      <BookingStyles />

      <header className="bk-top">
        <a href="/">홈</a>
        <a href="/night-2/">나이트 업소 목록</a>
      </header>

      <main className="bk-wrap">
        <nav aria-label="Breadcrumb" className="bk-crumb">
          <ol>
            <li>
              <a href="/">홈</a>
            </li>
            <li aria-current="page">부킹 안내</li>
          </ol>
        </nav>

        <article>
          <h1>전국 나이트 부킹 안내 40</h1>
          {표 ? <PageThumb path="/booking-2" alt={표.alt} /> : null}

          <p className="bk-updated">부킹 흐름·매너 기준으로 정리한 업소별 안내서</p>

          <div className="answer-box">
            <p>
              <span className="bk-anum">①</span>
              부킹은 손님이 만드는 것이 아니라 담당 웨이터가 팀과 팀을 잇는 흐름입니다.
            </p>
            <p>
              <span className="bk-anum">②</span>
              입장할 때 인원·성비·머무는 시간을 넘기면 첫 연결까지의 시간이 줄어듭니다.
            </p>
            <p>
              <span className="bk-anum">③</span>
              맞지 않는 자리는 담당 웨이터를 통해 정리하는 것이 서로에게 가장 편한 방법입니다.
            </p>
          </div>

          <section>
            <h2>이 안내서는 무엇을 다루나요?</h2>
            <p>
              전국 40개 나이트 업소를 기준으로, 입장에서 자리 배정, 첫 연결, 이어가기와 거절까지
              부킹이 실제로 도는 순서를 정리했습니다. 업소마다 다른 각도로 다루기 때문에 40개
              페이지가 서로 다른 이야기를 담고 있습니다.
            </p>
            <p>
              주소, 층, 가까운 역, 영업시간은 공개 자료에서 확인된 것만 적었습니다. 두 곳 이상에서
              교차 확인되지 않은 항목은 추측해서 채우지 않고 확인 불가로 남겨 두었습니다.
            </p>
          </section>

          <section>
            <h2>이 목록에서 안내를 고르는 방법</h2>
            <p>
              지역 이름으로 먼저 좁히고, 그 안에서 업소 이름을 누르면 그 업소 한 곳만 다룬 부킹 안내가 열립니다.
              페이지마다 다루는 장면이 다르므로 같은 흐름이 되풀이되지 않습니다. 이 목록 쪽은 예약을 받지 않고,
              손님 응대용 연락처도 싣지 않습니다. 업소 페이지에 적힌 주소와 영업시간은 공개 자료로 확인된 값만이며, 확인하지 못한 값은 적지 않고 비워 두었습니다. 업소 이름을 누르면 그 업소 안내로 넘어갑니다.
            </p>
            <p>
              광고로 실린 업소는 업소 페이지 맨 위에 「광고」 표시와 담당자 연락처가 함께 있습니다. 표시가 없는
              업소는 공개 자료로 확인한 값만 정리한 안내이며 업소와 제휴 관계가 없습니다. 출입은 성인만 가능하고 입구에서 신분증을 확인하니 일행 모두 챙겨 가시는 편이 안전합니다.
            </p>
            <p className="bk-checked">
              확인일 <time dateTime="2026-09-25">2026년 9월 25일</time>. 운영 사정에 따라 내용은 바뀔 수 있으니 방문
              전에 각 업소 안내를 한 번 더 확인해 주십시오.
            </p>
          </section>

          {REGION_GROUPS.map((g) => (
            <section className="bk-group" key={g.key}>
              <h2>
                {g.label} 부킹 안내 {g.slugs.length}곳
              </h2>
              <nav aria-label="지역별 부킹 안내 목록">
              <ul className="bk-list">
                {g.slugs.map((slug) => {
                  const v = BOOKING_BY_SLUG[slug];
                  if (!v) return null;
                  return (
                    <li key={slug}>
                      <a href={bookingPath(v.slug)}>
                        <strong>
                          {v.name}
                          
                        </strong>
                        <span>{v.region}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
              </nav>
            </section>
          ))}
        </article>

        <p className="bk-note">
          업소를 운영하시는 사장님의 광고·제휴 입점 문의는 카카오톡 {AD_KAKAO} 로 받습니다. 손님
          예약이나 이용 문의를 받는 채널이 아닙니다. 각 업소의 위치와 기본 이용 안내는{" "}
          <a href="/night-2/">나이트 업소 목록</a> 에서도 확인할 수 있습니다.
        </p>
      </main>

      <NightFooter 광고쪽={false} />
      <BookingHomeBar />
    </>
  , s);
}
