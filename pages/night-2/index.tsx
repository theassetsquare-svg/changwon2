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
          <li><a href="/gangseo-hobak-night/">강서호박나이트</a></li>
          <li><a href="/gildong-chance-night/">길동찬스나이트</a></li>
          <li><a href="/nowon-hobak-night/">노원호박나이트</a></li>
          <li><a href="/booking/dapsimni-miracle-night/">답십리미라클나이트</a></li>
          <li><a href="/doksan-gukbingwan-night/">독산동국빈관나이트</a></li>
          <li><a href="/night/sangbong-hangukgwan-night/">상봉동한국관나이트</a></li>
          <li><a href="/sangbong-hangukgwan-night/">상봉동한국관나이트</a></li>
          <li><a href="/seongnam-shampoo-night/">성남샴푸나이트</a></li>
          <li><a href="/suyu-shampoo-night-1/">수유샴푸나이트</a></li>
          <li><a href="/suyu-shampoo-night/">수유샴푸나이트</a></li>
          <li><a href="/sillim-grandprix-night-1/">신림그랑프리나이트</a></li>
          <li><a href="/sillim-grandprix-night/">신림그랑프리나이트</a></li>
          <li><a href="/yeongdeungpo-terminal-night/">영등포터미널나이트</a></li>
          <li><a href="/cheongdam-night-1/">청담나이트</a></li>
          <li><a href="/cheongdam-night/">청담나이트</a></li>
        </ul>
        <h3 style={{ fontSize: ".95rem", margin: "16px 0 8px", opacity: .75 }}>경기·인천</h3>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "8px 16px", fontSize: ".92rem" }}>
          <li><a href="/guri-hobak-night/">구리호박나이트</a></li>
          <li><a href="/bucheon-gorae-night/">부천고래나이트</a></li>
          <li><a href="/suwon-chancedome-night-1/">수원찬스돔나이트</a></li>
          <li><a href="/suwon-chancedome-night/">수원찬스돔나이트</a></li>
          <li><a href="/suwon-korea-night/">수원코리아나이트</a></li>
          <li><a href="/ansan-hit-night/">안산히트나이트</a></li>
          <li><a href="/booking/ansan-hit-night/">안산히트나이트</a></li>
          <li><a href="/osan-hobak-night/">오산호박나이트</a></li>
          <li><a href="/osan-hobak-night-1/">오산호박나이트</a></li>
          <li><a href="/uijeongbu-baekakgwan-night/">의정부백악관나이트</a></li>
          <li><a href="/uijeongbu-hangukgwan-night/">의정부한국관나이트</a></li>
          <li><a href="/indeogwon-gukbingwan-night/">인덕원국빈관나이트</a></li>
          <li><a href="/incheon-arabian-night/">인천아라비안나이트</a></li>
          <li><a href="/ilsan-shampoo-night-1/">일산샴푸나이트</a></li>
          <li><a href="/ilsan-shampoo-night/">일산샴푸나이트</a></li>
          <li><a href="/paju-skydome-night/">파주야당스카이돔나이트</a></li>
          <li><a href="/pyeongtaek-hobak-night/">평택호박나이트</a></li>
        </ul>
        <h3 style={{ fontSize: ".95rem", margin: "16px 0 8px", opacity: .75 }}>충청</h3>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "8px 16px", fontSize: ".92rem" }}>
          <li><a href="/daejeon-seven-night-1/">대전세븐나이트</a></li>
          <li><a href="/daejeon-seven-night/">대전세븐나이트</a></li>
          <li><a href="/daejeon-one-night-1/">대전원나이트</a></li>
          <li><a href="/daejeon-one-night/">대전원나이트</a></li>
          <li><a href="/cheonan-stardome-night/">천안스타돔나이트</a></li>
          <li><a href="/cheonan-korea-night/">천안코리아나이트</a></li>
          <li><a href="/cheongju-hobak-night/">청주호박나이트</a></li>
        </ul>
        <h3 style={{ fontSize: ".95rem", margin: "16px 0 8px", opacity: .75 }}>영남</h3>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "8px 16px", fontSize: ".92rem" }}>
          <li><a href="/gumi-hobak-night/">구미호박나이트</a></li>
          <li><a href="/daegu-hobak-night/">대구호박나이트</a></li>
          <li><a href="/night/busan-asiad-night/">부산아시아드나이트</a></li>
          <li><a href="/booking/busan-asiad-night/">부산아시아드나이트</a></li>
          <li><a href="/ulsan-newworld-night/">울산뉴월드나이트</a></li>
          <li><a href="/ulsan-champion-night/">울산챔피언나이트</a></li>
          <li><a href="/booking/ulsan-champion-night/">울산챔피언나이트</a></li>
          <li><a href="/changwon-lululala-night/">창원룰루랄라나이트</a></li>
          <li><a href="/booking/changwon-lululala-night/">창원룰루랄라나이트</a></li>
        </ul>
        <h3 style={{ fontSize: ".95rem", margin: "16px 0 8px", opacity: .75 }}>호남·제주</h3>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "8px 16px", fontSize: ".92rem" }}>
          <li><a href="/gwangju-sangmu-night/">광주상무나이트</a></li>
          <li><a href="/gwangju-cheomdan-night/">광주첨단나이트</a></li>
          <li><a href="/jeju-night/">제주도나이트</a></li>
        </ul>
        <h3 style={{ fontSize: ".95rem", margin: "16px 0 8px", opacity: .75 }}>그 밖의 지역</h3>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "8px 16px", fontSize: ".92rem" }}>
          <li><a href="/bulgwang-hobak-night/">불광동호박나이트</a></li>
          <li><a href="/booking/bulgwang-hobak-night/">불광동호박나이트</a></li>
        </ul>
      </nav>
    </>
  );
}
