import type { GetStaticProps } from "next";
import SeoHead from "@/components/SeoHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyCTA from "@/components/StickyCTA";
import { BIZ_ADDRESS_ROAD, BIZ_ADDRESS_LOT, BIZ_FLOOR, GEO_LAT, GEO_LNG } from "@/lib/site";
import { BASE_GRAPH, breadcrumb, articleSchema, graph } from "@/lib/schemas";

const PATH = "/location/";
const TITLE = "위치 · 찾아가는 길 | 상남동 모아엔트몰 지하 3층 도착 5분컷";
const DESCRIPTION = "마디미로43번길 10, 상남동 22-4. 창원시청 차로 5분, KTX 창원중앙 15분. 모아엔트몰 지하 주차장 그대로 사용. 도보·차·택시 동선 정리.";
const PUBLISHED = "2026-05-26";

export const getStaticProps: GetStaticProps<{ dateModified: string }> = async () => ({
  props: { dateModified: new Date().toISOString().slice(0, 10) },
});

export default function Location({ dateModified }: { dateModified: string }) {
  const ld = graph([
    ...BASE_GRAPH,
    breadcrumb([
      { name: "홈", path: "/" },
      { name: "위치", path: PATH },
    ]),
    articleSchema({ title: TITLE, description: DESCRIPTION, path: PATH, datePublished: PUBLISHED, dateModified }),
  ]);
  const naverMap = "https://map.naver.com/p/search/" + encodeURIComponent("창원 룰루랄라 나이트클럽 마디미로43번길 10");
  const kakaoMap = "https://map.kakao.com/?q=" + encodeURIComponent("마디미로43번길 10 모아엔트몰");
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${GEO_LAT},${GEO_LNG}`;
  return (
    <>
      <SeoHead title={TITLE} description={DESCRIPTION} path={PATH} jsonLd={ld} ogImageAlt="모아엔트몰 외관 · 마디미로43번길 진입로" />
      <SiteNav current={PATH} />
      <header className="hero hero-sub">
        <div className="hero-inner">
          <span className="eyebrow">FIND US · 도착 5분컷</span>
          <h1>지도 켜지 마세요. <span className="grad">상남동 모아엔트몰 지하 3층</span>입니다.</h1>
          <p className="lead">도로명 {BIZ_ADDRESS_ROAD}, 지번 {BIZ_ADDRESS_LOT}. 메인거리 안쪽이라 1차 끝나고 도보로 넘어오기 좋습니다.</p>
          <div className="cta">
            <a className="btn btn-primary" href={naverMap} target="_blank" rel="noopener noreferrer">네이버 지도</a>
            <a className="btn btn-ghost" href={kakaoMap} target="_blank" rel="noopener noreferrer">카카오맵</a>
            <a className="btn btn-ghost" href={gmaps} target="_blank" rel="noopener noreferrer">Google Maps</a>
          </div>
        </div>
      </header>
      <main className="wrap">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol>
            <li><a href="/">홈</a></li>
            <li aria-current="page">위치·찾아가는 길</li>
          </ol>
        </nav>

        <section>
          <h2>주소 두 줄 정리</h2>
          <div className="fact-grid">
            <div className="fact"><div className="fact-label">도로명</div><div className="fact-value">{BIZ_ADDRESS_ROAD}</div><div className="fact-sub">{BIZ_FLOOR}</div></div>
            <div className="fact"><div className="fact-label">지번</div><div className="fact-value">{BIZ_ADDRESS_LOT}</div><div className="fact-sub">상남동 메인 안쪽</div></div>
            <div className="fact"><div className="fact-label">좌표</div><div className="fact-value">{GEO_LAT}, {GEO_LNG}</div><div className="fact-sub">WGS84</div></div>
            <div className="fact"><div className="fact-label">우편번호</div><div className="fact-value">51495</div><div className="fact-sub">창원시 성산구</div></div>
          </div>
        </section>

        <section>
          <h2>이렇게 오세요 — 거리·시간</h2>
          <p className="capsule"><strong>요약:</strong> 창원시청 차로 5분, KTX 창원중앙역 차로 15분, 마산항·진해까지 차로 20~30분권.</p>
          <ul className="howto">
            <li><strong>창원시청 출발</strong> — 용지호수 옆으로 빠져 상남시장 방향. 차로 약 5분.</li>
            <li><strong>창원중앙역(KTX)</strong> — 도계광장 방향 진입 후 상남대로 직진. 차로 약 15분.</li>
            <li><strong>김해공항</strong> — 남해고속도로 → 창원IC → 시청 방향. 차로 약 40분.</li>
            <li><strong>마산역</strong> — 3·15대로 → 창원로 진입. 차로 약 20분.</li>
          </ul>
        </section>

        <section>
          <h2>입구 찾는 법</h2>
          <p>상남동 메인거리에서 한 블록 안쪽으로 들어오면 모아엔트몰 건물이 보입니다. 입구는 1층 출입구에서 엘리베이터·계단으로 지하 3층까지 한 번에 내려옵니다. 지하 1~2층은 다른 시설이고, 지하 3층 전체 플로어가 매장 입구입니다. 도착 후 신분증 확인을 한 번 거치면 바로 메인홀로 이어집니다.</p>
        </section>

        <section>
          <h2>주변 랜드마크</h2>
          <p>상남시장, 용지호수공원, 더시티세븐 라인이 도보권입니다. 1차로 상남동에서 식사·술자리 잡으셨다면 도보로 그대로 넘어오시는 분들이 많고, 차로 오시는 분은 모아엔트몰 지하 주차장을 이용하시면 됩니다. 자세한 주차 안내는 <a href="/parking/">주차 페이지</a>, 대중교통은 <a href="/access/">대중교통 페이지</a>에서.</p>
        </section>

        <section className="ps">
          <h3>출발 전 한 통</h3>
          <p>위치 헷갈리면 매장에 문의하시면 입구까지 안내됩니다.</p>
        </section>
      </main>
      <SiteFooter dateModified={dateModified} />
      <StickyCTA />
    </>
  );
}
