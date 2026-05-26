import type { GetStaticProps } from "next";
import SeoHead from "@/components/SeoHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyCTA from "@/components/StickyCTA";
import { BIZ_PHONE, BIZ_TEL_HREF } from "@/lib/site";
import { BASE_GRAPH, breadcrumb, articleSchema, graph } from "@/lib/schemas";

const PATH = "/access/";
const TITLE = "대중교통 가이드 | KTX·시청·시외버스에서 가장 짧은 동선";
const DESCRIPTION = "KTX 창원중앙역 차로 15분, 창원시청 5분, 마산역 20분. 시내버스·택시·카카오T 호출 동선과 새벽 귀가 루트까지 정리.";
const PUBLISHED = "2026-05-26";

export const getStaticProps: GetStaticProps<{ dateModified: string }> = async () => ({
  props: { dateModified: new Date().toISOString().slice(0, 10) },
});

export default function Access({ dateModified }: { dateModified: string }) {
  const ld = graph([
    ...BASE_GRAPH,
    breadcrumb([{ name: "홈", path: "/" }, { name: "대중교통", path: PATH }]),
    articleSchema({ title: TITLE, description: DESCRIPTION, path: PATH, datePublished: PUBLISHED, dateModified }),
  ]);
  return (
    <>
      <SeoHead title={TITLE} description={DESCRIPTION} path={PATH} jsonLd={ld} ogImageAlt="대중교통 가이드" />
      <SiteNav current={PATH} />
      <header className="hero hero-sub">
        <div className="hero-inner">
          <span className="eyebrow">TRANSIT · 택시도 OK</span>
          <h1>택시 기사님께 <span className="grad">"상남동 모아엔트몰"</span> 한마디면 끝.</h1>
          <p className="lead">상남동 메인거리 안쪽이라 어느 방향에서 오셔도 동선이 단순합니다. 새벽 귀가도 콜택시 응답이 빠른 지역입니다.</p>
        </div>
      </header>
      <main className="wrap">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol>
            <li><a href="/">홈</a></li>
            <li aria-current="page">대중교통</li>
          </ol>
        </nav>

        <section>
          <h2>주요 출발지 → 매장</h2>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>출발지</th><th>택시/차</th><th>비고</th></tr></thead>
              <tbody>
                <tr><td>창원시청</td><td>약 5분</td><td>가장 가까운 공공시설</td></tr>
                <tr><td>창원중앙역(KTX)</td><td>약 15분</td><td>도계광장 → 상남대로</td></tr>
                <tr><td>창원역</td><td>약 20분</td><td>창원대로 경유</td></tr>
                <tr><td>마산역</td><td>약 20분</td><td>3·15대로 → 창원로</td></tr>
                <tr><td>김해공항</td><td>약 40분</td><td>남해고속 + 창원IC</td></tr>
                <tr><td>진해</td><td>약 25분</td><td>안민터널 경유</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>택시·콜 동선</h2>
          <p>택시 기사님께는 <strong>"상남동 모아엔트몰"</strong> 한마디면 충분합니다. 카카오T·UT 등 호출 앱에서도 같은 키워드로 잡힙니다. 새벽 시간대 귀가 시에는 매장 1층 출입구 앞에서 잡기 좋고, 골목 안쪽이라 안전한 편입니다.</p>
        </section>

        <section>
          <h2>시내버스</h2>
          <p>상남동 메인 정류장에 노선이 다수 정차합니다. 가장 가까운 정류장에서 도보 3~5분이면 입구에 닿습니다. 막차 이후라면 택시·대리·카카오T 야간 호출을 권합니다.</p>
        </section>

        <section className="ps">
          <h3>새벽 귀가 동선이 헷갈리면</h3>
          <p>매니저 <a href={BIZ_TEL_HREF}>{BIZ_PHONE}</a>로 전화 주시면 출발지 기준으로 동선을 한 줄로 안내해드립니다.</p>
        </section>
      </main>
      <SiteFooter dateModified={dateModified} />
      <StickyCTA />
    </>
  );
}
