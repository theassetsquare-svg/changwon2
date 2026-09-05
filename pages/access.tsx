import type { GetStaticProps } from "next";
import PageThumb from '@/components/PageThumb';
import SeoHead from "@/components/SeoHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyCTA from "@/components/StickyCTA";
import { BASE_GRAPH, breadcrumb, articleSchema, graph } from "@/lib/schemas";

const PATH = "/access/";
const TITLE = "창원룰루랄라나이트 대중교통 가이드 | KTX·시청·시외버스에서 가장 짧은 동선";
const DESCRIPTION = "KTX 창원중앙역 차로 15분, 창원시청 5분, 마산역 20분. 시내버스·택시·카카오T 호출 동선과 새벽 귀가 루트까지 정리.";
const PUBLISHED = "2026-05-26";

export const getStaticProps: GetStaticProps<{ dateModified: string }> = async () => ({
  props: { dateModified: new Date().toISOString().slice(0, 10) },
});

export default function Access({ dateModified }: { dateModified: string }) {
  const ld = graph([
    /* S4 T-006(2026-09-05): 업소 JSON-LD 의 image 를 이 쪽 og:image 와 같게 */
    ...BASE_GRAPH.map((x: any) => (Array.isArray(x["@type"]) && x["@type"].includes("NightClub") ? { ...x, image: "https://i.nolcool.com/og/auto-access-index.png" } : x)),
    breadcrumb([{ name: "새벽 4시 40분", path: "/" }, { name: "대중교통", path: PATH }]),
    { ...articleSchema({ title: TITLE, description: DESCRIPTION, path: PATH, datePublished: PUBLISHED, dateModified }), image: "https://i.nolcool.com/og/auto-access-index.png" },
  ]);
  return (
    <>
      <SeoHead title={TITLE} description={DESCRIPTION} path={PATH} jsonLd={ld} ogImageAlt="대중교통 가이드" ogImage={"https://i.nolcool.com/og/auto-access-index.png"} />
      <SiteNav current={PATH} />
      <header className="hero hero-sub">
        <div className="hero-inner">
          <span className="eyebrow">TRANSIT · 택시도 OK</span>
          {/* 설계도 4장 — 광고주 쪽 상단 「광고」 라벨 (S4 2026-09-05) */}
          <p className="ad-label" style={{ display: "inline-block", margin: "0 0 10px", padding: "3px 10px", border: "1px solid #c9a227", borderRadius: 4, fontSize: 12, color: "#c9a227", letterSpacing: ".04em" }}>광고</p>
          <h1>택시 기사님께 <span className="grad">"상남동 모아엔트몰"</span> 한마디면 끝.</h1>
          <p className="lead">상남동 메인거리 안쪽이라 어느 방향에서 오셔도 동선이 단순합니다. 새벽 귀가도 콜택시 응답이 빠른 지역입니다.</p>
        </div>
      </header>
      <PageThumb path="/access" alt="대중교통 가이드" />
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

        <section>
          <h2>도착 시각에 따라 달라지는 것</h2>
          <p>
            초저녁에는 상남동 큰길에서 바로 들어오시면 됩니다. 밤이 깊어질수록 골목 진입 차량이
            늘어 정차 위치를 잡기 어려워지므로, 큰길에서 내려 도보로 들어오시는 편이 빠릅니다.
            일행이 나눠 도착하실 때는 만나는 지점을 한 곳으로 정해 두시면 헤맬 일이 없습니다.
          </p>
        </section>

        <section>
          <h2>돌아갈 방법을 먼저 정해 두십시오</h2>
          <p>
            새벽 두 시를 넘기면 상남동 큰길에서도 택시 잡기가 경쟁이 됩니다. 호출 앱을 미리 켜
            두시거나, 대리를 부르실 계획이라면 차를 어디에 세워 두었는지 먼저 확인해 두십시오.
            돌아갈 방법을 정해 두면 남은 시간을 마음 편히 쓰실 수 있습니다.
          </p>
          <p>
            술을 드실 예정이라면 차는 두고 오시는 편이 안전합니다. 다음 날 찾아가시는 것이
            번거로워 보여도, 대리비와 견주면 크게 손해가 아닙니다.
          </p>
        </section>

        <section>
          <h2>처음 오시는 분이 자주 묻는 것</h2>
          <p>
            길이 헷갈릴 만한 구간은 큰길에서 골목으로 꺾는 부분 하나입니다. 그 지점만 지나면
            입구가 바로 보입니다. 도착 직전에 연락 주시면 어느 쪽으로 들어오시면 되는지
            알려 드립니다.
          </p>
          <p>
            확인되지 않은 소요 시간이나 요금은 적지 않았습니다. 위 표의 시간은 교통 상황에 따라
            달라질 수 있으니 여유를 두고 출발하시길 권합니다.
          </p>
        </section>

        <section className="ps">
          <h3>새벽 귀가 동선이 헷갈리면</h3>
          <p>매장에 문의 주시면 출발지 기준으로 동선을 한 줄로 안내해드립니다.</p>
        </section>
      </main>
      <SiteFooter dateModified={dateModified} />
      <StickyCTA />
    </>
  );
}
