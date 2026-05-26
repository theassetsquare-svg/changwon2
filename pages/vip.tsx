import type { GetStaticProps } from "next";
import SeoHead from "@/components/SeoHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyCTA from "@/components/StickyCTA";
import { BIZ_PHONE, BIZ_TEL_HREF } from "@/lib/site";
import { BASE_GRAPH, breadcrumb, articleSchema, graph } from "@/lib/schemas";

const PATH = "/vip/";
const TITLE = "VIP·단체 8인+ | 생일·송별·동호회 콘셉트 세팅 한 번에";
const DESCRIPTION = "프라이빗 룸 + 콘셉트 세팅 + 케이크·플래카드 옵션. 8명 이상 단체, 생일·승진·송별·MT·동호회를 한 통으로 정리합니다.";
const PUBLISHED = "2026-05-26";

export const getStaticProps: GetStaticProps<{ dateModified: string }> = async () => ({
  props: { dateModified: new Date().toISOString().slice(0, 10) },
});

export default function Vip({ dateModified }: { dateModified: string }) {
  const ld = graph([
    ...BASE_GRAPH,
    breadcrumb([{ name: "홈", path: "/" }, { name: "VIP·단체", path: PATH }]),
    articleSchema({ title: TITLE, description: DESCRIPTION, path: PATH, datePublished: PUBLISHED, dateModified }),
  ]);
  return (
    <>
      <SeoHead title={TITLE} description={DESCRIPTION} path={PATH} jsonLd={ld} ogImageAlt="VIP·단체 가이드" />
      <SiteNav current={PATH} />
      <header className="hero hero-sub">
        <div className="hero-inner">
          <span className="eyebrow">VIP · GROUP · CONCEPT</span>
          <h1>8인 이상 단체, <span className="grad">콘셉트 세팅</span>까지 한 통으로.</h1>
          <p className="lead">생일·송별·승진·MT·동호회·기념일. 룸 + 음악 + 조명 + 데코까지 미리 잡습니다.</p>
        </div>
      </header>
      <main className="wrap">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol>
            <li><a href="/">홈</a></li>
            <li aria-current="page">VIP·단체</li>
          </ol>
        </nav>

        <section>
          <h2>이런 자리에 추천</h2>
          <div className="card-grid">
            <article className="card"><h3>🎂 생일</h3><p>케이크·플래카드·생일축하 BGM 큐 사인까지. 주인공 들어올 타이밍 맞춰 조명 한 번에 떨어집니다.</p></article>
            <article className="card"><h3>🚀 승진·축하</h3><p>회사 단위 모임에 어울리는 안쪽 룸. 시작은 차분하게, 분위기 익으면 메인으로.</p></article>
            <article className="card"><h3>🎓 송별·환영</h3><p>15~25명 규모. 룸 + 사이드 자리를 묶어 일행이 흩어졌다 모이기 편한 구조로.</p></article>
            <article className="card"><h3>🏖️ MT·동호회</h3><p>인원이 많아도 좌석·동선·음악을 동호회 결에 맞춰 세팅합니다.</p></article>
          </div>
        </section>

        <section>
          <h2>사전에 알려주시면 좋은 것</h2>
          <ul className="howto">
            <li><strong>총 인원·성비·연령대</strong></li>
            <li><strong>방문일·도착 예정 시각</strong></li>
            <li><strong>콘셉트</strong> (생일/송별/MT/일반 등)</li>
            <li><strong>주인공 여부</strong> (있다면 이름·등장 타이밍)</li>
            <li><strong>희망 음악 분위기</strong> (EDM/K-팝/힙합 비중)</li>
          </ul>
          <p>이 5가지만 한 통화로 정리되면 룸·동선·BGM·조명 큐가 다 짜입니다.</p>
        </section>

        <section>
          <h2>예약 시점</h2>
          <p>금·토·연휴 전야의 단체는 <strong>최소 3~5일 전</strong> 사전 콜을 권합니다. 평일은 당일~전날도 가능합니다. 노쇼 방지를 위해 인원 변동이 생기면 즉시 알려주세요.</p>
        </section>

        <section className="ps">
          <h3>단체 라인은 직통이 가장 빠름</h3>
          <p>매니저 <a href={BIZ_TEL_HREF}>{BIZ_PHONE}</a>. 한 번에 정리됩니다.</p>
        </section>
      </main>
      <SiteFooter dateModified={dateModified} />
      <StickyCTA />
    </>
  );
}
