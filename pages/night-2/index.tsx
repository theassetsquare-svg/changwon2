import NightHead from "@/components/night/NightHead";
import NightStyles from "@/components/night/NightStyles";
import NightFooter from "@/components/night/NightFooter";
import { SITE_URL } from "@/lib/site";
import { VENUES, nightPath, NIGHT_BASE, AD_KAKAO } from "@/lib/night/venues";
import { ogImagePath } from "@/lib/night/seo";

const TITLE = "전국 나이트 업소 안내 목록";
const DESCRIPTION =
  "서울·경기·충청·영남 13개 나이트 업소의 위치와 이용 안내를 지역별로 정리한 목록입니다. 출입 연령 기준이 따로 있는 업소는 목록에서 바로 확인할 수 있습니다.";

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: TITLE,
  itemListElement: VENUES.map((v, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: v.name,
    url: SITE_URL + nightPath(v.slug),
  })),
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL + "/" },
    { "@type": "ListItem", position: 2, name: "나이트", item: SITE_URL + NIGHT_BASE },
  ],
};

export default function NightIndex() {
  return (
    <>
      <NightHead
        title={TITLE}
        description={DESCRIPTION}
        path={NIGHT_BASE}
        그림없음
        image={ogImagePath("index")}
        imageAlt="전국 나이트 업소 안내 목록 카드"
        jsonLd={[itemListSchema, breadcrumb]}
      />
      <NightStyles />

      <div className="night-top">
        <a href="/">홈</a>
      </div>

      <main className="night-wrap">
        <nav aria-label="Breadcrumb" className="night-crumb">
          <ol>
            <li>
              <a href="/">홈</a>
            </li>
            <li aria-current="page">나이트</li>
          </ol>
        </nav>

        <h1>전국 나이트 업소 안내</h1>

        <div className="answer-box">
          <p>
            서울과 경기, 충청, 영남 지역 13개 나이트 업소의 위치와 이용 안내를 지역 단위로
            정리한 목록입니다. 확인되지 않은 주소나 영업시간은 싣지 않으며, 출입 연령 기준이
            별도로 있는 업소는 목록에 표시해 두었습니다.
          </p>
        </div>

        <section className="answer-box">
          <h2>이 목록을 읽는 방법</h2>
          <p>
            업소는 지역 단위로 묶었습니다. 같은 시·도 안에서도 상권이 다르면 밤의 성격이 달라지기
            때문에, 시·군·구와 동까지 함께 적어 두었습니다. 이동 거리를 먼저 보고 고르시면 그날
            일정을 짜기가 수월합니다.
          </p>
          <p>
            주소와 영업시간은 공개 자료로 교차 확인된 것만 실었습니다. 확인되지 않은 항목은
            채우지 않고 비워 두었으니, 목록에 값이 없다면 아직 확인하지 못했다는 뜻으로 보시면
            됩니다. 방문 전에는 각 업소 안내를 한 번 더 확인해 주십시오.
          </p>
          <p>
            출입 연령 기준이 따로 있는 곳은 목록에 표시해 두었습니다. 표시가 없다고 해서 제한이
            없다는 뜻은 아니며, 기준을 확인하지 못했다는 의미입니다. 신분증은 어느 곳이든
            챙겨 가시는 편이 안전합니다.
          </p>
          <p>
            처음 찾으시는 분이라면 이동 시간과 귀가 방법을 먼저 정하시길 권합니다. 자리와 인원은
            도착한 뒤에도 조정할 수 있지만, 돌아갈 길은 미리 정해 두지 않으면 밤이 길어집니다.
          </p>
        </section>

        <nav aria-label="지역별 업소 목록">
        <ul className="night-list">
          {VENUES.map((v) => (
            <li key={v.slug}>
              <a href={nightPath(v.slug)}>
                <strong>{v.name}</strong>
                <span>
                  {v.region}
                  {v.ageBadge ? ` · ${v.ageBadge}` : ""}
                </span>
              </a>
            </li>
          ))}
        </ul>
        </nav>

        <p className="night-note">
          업소를 운영하시는 사장님의 광고·제휴 입점 문의는 카카오톡 {AD_KAKAO} 로 받습니다.
          손님 예약이나 이용 문의를 받는 채널이 아닙니다.
        </p>
      </main>

      <NightFooter />

      <div className="callbar" role="complementary" aria-label="광고 제휴 문의">
        <span>
          광고·제휴 입점 문의 카톡 <b>{AD_KAKAO}</b>
        </span>
      </div>
      {/* ★ 전체 목록 — 허브가 모든 가게 페이지를 링크해야 네이버가 전부 찾아간다 */}
      <nav className="nl-all" aria-label="전체 업소 목록" style={{ maxWidth: 900, margin: "48px auto 40px", padding: "22px 18px", borderTop: "1px solid rgba(128,128,128,.28)" }}>
        <h2 style={{ fontSize: "1.05rem", margin: "0 0 14px" }}>전체 업소 목록 (53곳)</h2>
        <h3 style={{ fontSize: ".95rem", margin: "16px 0 8px", opacity: .75 }}>서울</h3>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "8px 16px", fontSize: ".92rem" }}>
          <li><a href="/booking/gangseo-hobak-night/">강서호박나이트</a></li>
          <li><a href="/booking/gildong-chance-night/">길동찬스나이트</a></li>
          <li><a href="/booking/nowon-hobak-night/">노원호박나이트</a></li>
          <li><a href="/booking/dapsimni-miracle-night/">답십리미라클나이트</a></li>
          <li><a href="/booking/doksan-gukbingwan-night/">독산동국빈관나이트</a></li>
          <li><a href="/club/sangbong-hangukgwan-night/">상봉동한국관나이트</a></li>
          <li><a href="/club/sangbong-hangukgwan-night/">상봉동한국관나이트</a></li>
          <li><a href="/booking/seongnam-shampoo-night/">성남샴푸나이트</a></li>
          <li><a href="/club/suyu-shampoo-night-1/">수유샴푸나이트</a></li>
          <li><a href="/booking/suyu-shampoo-night/">수유샴푸나이트</a></li>
          <li><a href="/club/sillim-grandprix-night-1/">신림그랑프리나이트</a></li>
          <li><a href="/booking/sillim-grandprix-night/">신림그랑프리나이트</a></li>
          <li><a href="/booking/yeongdeungpo-terminal-night/">영등포터미널나이트</a></li>
          <li><a href="/club/cheongdam-night-1/">청담나이트</a></li>
          <li><a href="/booking/cheongdam-night/">청담나이트</a></li>
        </ul>
        <h3 style={{ fontSize: ".95rem", margin: "16px 0 8px", opacity: .75 }}>경기·인천</h3>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "8px 16px", fontSize: ".92rem" }}>
          <li><a href="/booking/guri-hobak-night/">구리호박나이트</a></li>
          <li><a href="/booking/bucheon-gorae-night/">부천고래나이트</a></li>
          <li><a href="/club/suwon-chancedome-night-1/">수원찬스돔나이트</a></li>
          <li><a href="/booking/suwon-chancedome-night/">수원찬스돔나이트</a></li>
          <li><a href="/booking/suwon-korea-night/">수원코리아나이트</a></li>
          <li><a href="/club/ansan-hit-night/">안산히트나이트</a></li>
          <li><a href="/booking/club/ansan-hit-night/">안산히트나이트</a></li>
          <li><a href="/booking/osan-hobak-night/">오산호박나이트</a></li>
          <li><a href="/booking/osan-hobak-night-1/">오산호박나이트</a></li>
          <li><a href="/booking/uijeongbu-baekakgwan-night/">의정부백악관나이트</a></li>
          <li><a href="/booking/uijeongbu-hangukgwan-night/">의정부한국관나이트</a></li>
          <li><a href="/booking/indeogwon-gukbingwan-night/">인덕원국빈관나이트</a></li>
          <li><a href="/booking/incheon-arabian-night/">인천아라비안나이트</a></li>
          <li><a href="/club/ilsan-shampoo-night-1/">일산샴푸나이트</a></li>
          <li><a href="/booking/ilsan-shampoo-night/">일산샴푸나이트</a></li>
          <li><a href="/booking/paju-skydome-night/">파주야당스카이돔나이트</a></li>
          <li><a href="/booking/pyeongtaek-hobak-night/">평택호박나이트</a></li>
        </ul>
        <h3 style={{ fontSize: ".95rem", margin: "16px 0 8px", opacity: .75 }}>충청</h3>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "8px 16px", fontSize: ".92rem" }}>
          <li><a href="/club/daejeon-seven-night-1/">대전세븐나이트</a></li>
          <li><a href="/booking/daejeon-seven-night/">대전세븐나이트</a></li>
          <li><a href="/club/daejeon-one-night-1/">대전원나이트</a></li>
          <li><a href="/booking/daejeon-one-night/">대전원나이트</a></li>
          <li><a href="/booking/cheonan-stardome-night/">천안스타돔나이트</a></li>
          <li><a href="/booking/cheonan-korea-night/">천안코리아나이트</a></li>
          <li><a href="/booking/cheongju-hobak-night/">청주호박나이트</a></li>
        </ul>
        <h3 style={{ fontSize: ".95rem", margin: "16px 0 8px", opacity: .75 }}>영남</h3>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "8px 16px", fontSize: ".92rem" }}>
          <li><a href="/booking/gumi-hobak-night/">구미호박나이트</a></li>
          <li><a href="/booking/daegu-hobak-night/">대구호박나이트</a></li>
          <li><a href="/club/busan-asiad-night/">부산아시아드나이트</a></li>
          <li><a href="/booking/busan-asiad-night/">부산아시아드나이트</a></li>
          <li><a href="/booking/ulsan-newworld-night/">울산뉴월드나이트</a></li>
          <li><a href="/night/ulsan-champion-night/">울산챔피언나이트</a></li>
          <li><a href="/booking/night/ulsan-champion-night/">울산챔피언나이트</a></li>
          <li><a href="/club/changwon-lululala-night/">창원룰루랄라나이트</a></li>
          <li><a href="/booking/club/changwon-lululala-night/">창원룰루랄라나이트</a></li>
        </ul>
        <h3 style={{ fontSize: ".95rem", margin: "16px 0 8px", opacity: .75 }}>호남·제주</h3>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "8px 16px", fontSize: ".92rem" }}>
          <li><a href="/booking/gwangju-sangmu-night/">광주상무나이트</a></li>
          <li><a href="/booking/gwangju-cheomdan-night/">광주첨단나이트</a></li>
          <li><a href="/booking/jeju-night/">제주도나이트</a></li>
        </ul>
        <h3 style={{ fontSize: ".95rem", margin: "16px 0 8px", opacity: .75 }}>그 밖의 지역</h3>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "8px 16px", fontSize: ".92rem" }}>
          <li><a href="/club/bulgwang-hobak-night/">불광동호박나이트</a></li>
          <li><a href="/booking/club/bulgwang-hobak-night/">불광동호박나이트</a></li>
        </ul>
      </nav>
    </>
  );
}
