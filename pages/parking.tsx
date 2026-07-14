import type { GetStaticProps } from "next";
import SeoHead from "@/components/SeoHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyCTA from "@/components/StickyCTA";
import { BASE_GRAPH, breadcrumb, articleSchema, graph } from "@/lib/schemas";

const PATH = "/parking/";
const TITLE = "주차 OK | 모아엔트몰 지하 주차장 그대로 — 발렛·대리 동선";
const DESCRIPTION = "건물 지하 주차장 직접 이용. 진입로·출차 동선, 대리운전 호출 위치, 인근 대체 주차장까지 정리. 음주 시 대중교통·대리 사용 권장.";
const PUBLISHED = "2026-05-26";

export const getStaticProps: GetStaticProps<{ dateModified: string }> = async () => ({
  props: { dateModified: new Date().toISOString().slice(0, 10) },
});

export default function Parking({ dateModified }: { dateModified: string }) {
  const ld = graph([
    ...BASE_GRAPH,
    breadcrumb([{ name: "홈", path: "/" }, { name: "주차", path: PATH }]),
    articleSchema({ title: TITLE, description: DESCRIPTION, path: PATH, datePublished: PUBLISHED, dateModified }),
  ]);
  return (
    <>
      <SeoHead title={TITLE} description={DESCRIPTION} path={PATH} jsonLd={ld} ogImageAlt="주차 안내" />
      <SiteNav current={PATH} />
      <header className="hero hero-sub">
        <div className="hero-inner">
          <span className="eyebrow">PARKING · 차 끌고 오셔도 OK</span>
          <h1>주차는 <span className="grad">건물 지하 그대로</span>입니다.</h1>
          <p className="lead">모아엔트몰 지하 주차장 진입 → 엘리베이터 → 지하 3층. 별도 안내 없이 동선이 자연스럽습니다.</p>
        </div>
      </header>
      <main className="wrap">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol>
            <li><a href="/">홈</a></li>
            <li aria-current="page">주차</li>
          </ol>
        </nav>

        <section>
          <h2>주차 한 줄 정리</h2>
          <p className="capsule"><strong>요지:</strong> 모아엔트몰 자체 지하 주차장을 이용. 입구 진입 후 지하층 표시 따라가시면 됩니다.</p>
          <p>지하 주차장 진입 → 한 번에 내려가 주차 → 엘리베이터·계단으로 지하 3층까지. 1차 끝나고 차 끌고 오시는 분도 동선이 단순합니다. 주말 골든타임에는 자리가 빠르게 차므로 일찍 도착하시거나 인근 공영주차장을 같이 보시면 안정적입니다.</p>
        </section>

        <section>
          <h2>음주 시 권장 동선</h2>
          <p>마시고 운전은 절대 금지입니다. 음주가 예정된 자리라면 처음부터 대중교통·택시로 오시거나, 차를 가져오신 경우 대리운전을 부르세요. 상남동 권은 대리 콜 응답이 빨라 5~10분 내 도착이 일반적입니다. 자세한 대중교통 동선은 <a href="/access/">대중교통 페이지</a>에서.</p>
        </section>

        <section>
          <h2>대체 주차장</h2>
          <ul className="bullets">
            <li>상남시장 인근 공영주차장 — 도보 5분권</li>
            <li>용지호수공원 주변 공영 노상 — 시간대 따라 가능</li>
            <li>인근 사설 유료 주차장 — 모아엔트몰 만차 시 백업</li>
          </ul>
          <p className="muted-mini">※ 시간·요금은 운영처 기준이며 변동될 수 있습니다.</p>
        </section>

        <section className="ps">
          <h3>당일 막혀 있으면</h3>
          <p>주차 상황이 헷갈리면 매장에 문의 주세요. 들어오시는 동안 동선을 잡아드립니다.</p>
        </section>
      </main>
      <SiteFooter dateModified={dateModified} />
      <StickyCTA />
    </>
  );
}
