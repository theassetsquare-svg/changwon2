import NightHead from "@/components/night/NightHead";
import NightFooter from "@/components/night/NightFooter";
import BookingStyles from "@/components/booking/BookingStyles";
import { BookingHomeBar } from "@/components/booking/BookingBar";
import { SITE_URL, BIZ_NICKNAME, BIZ_PHONE, BIZ_PHONE_TEL, BIZ_MIN_AGE } from "@/lib/site";
import {
  BOOKING_VENUES,
  BOOKING_BY_SLUG,
  REGION_GROUPS,
  bookingPath,
  BOOKING_BASE,
  AD_KAKAO,
} from "@/lib/booking/venues";
import { bookingOgPath } from "@/lib/booking/seo";

const TITLE = "창원룰루랄라나이트 | 전국 나이트 부킹 안내 40";
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
    { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL + "/" },
    { "@type": "ListItem", position: 2, name: "부킹 안내", item: SITE_URL + BOOKING_BASE },
  ],
};

export default function BookingHub() {
  return (
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
            <h2>창원룰루랄라나이트 부킹은 어떻게 잡나요?</h2>
            <p>
              이 사이트를 운영하는 매장은 경남 창원시 성산구 상남동 모아엔트몰 지하 3층의
              창원룰루랄라나이트입니다. 자리와 부킹은 전화 한 통으로 정리됩니다. 인원과 성비,
              도착 예정 시각, 원하는 자리 성격을 한 번에 전해 주시면 그에 맞춰 자리를 잡아 둡니다.
            </p>
            <p>
              출입 연령은 {BIZ_MIN_AGE}으로 안내되며 입구에서 신분증을 확인합니다. 일행 전원이
              신분증을 챙겨 주세요. 예약문의 {BIZ_NICKNAME}{" "}
              <a href={`tel:${BIZ_PHONE_TEL}`}>{BIZ_PHONE}</a> 로 연락하시면 됩니다. 부킹 흐름을
              먼저 보고 싶다면{" "}
              <a href={bookingPath("changwon-lululala-night")}>창원룰루랄라나이트 부킹 안내</a>{" "}
              페이지에 순서대로 정리해 두었습니다.
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
                          {v.ageBadge ? <em className="bk-badge">{v.ageBadge}</em> : null}
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

      <NightFooter />
      <BookingHomeBar />
    </>
  );
}
