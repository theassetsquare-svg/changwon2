import type { GetStaticProps } from "next";
import SeoHead from "@/components/SeoHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyCTA from "@/components/StickyCTA";
import { BIZ_AREA } from "@/lib/site";
import { BASE_GRAPH, breadcrumb, articleSchema, graph } from "@/lib/schemas";

const PATH = "/rooms/";
const TITLE = "룸·메인홀·DJ존 한눈에 | 어디 앉아야 그날 밤이 살아나는가";
const DESCRIPTION = "457평 메인홀, 프라이빗 룸, DJ 부스 옆 진한 자리, 사이드 룸의 차이를 정리. 첫방문·단골·단체에게 맞는 포지션 매칭 가이드.";
const PUBLISHED = "2026-05-26";

export const getStaticProps: GetStaticProps<{ dateModified: string }> = async () => ({
  props: { dateModified: new Date().toISOString().slice(0, 10) },
});

export default function Rooms({ dateModified }: { dateModified: string }) {
  const ld = graph([
    ...BASE_GRAPH,
    breadcrumb([
      { name: "홈", path: "/" },
      { name: "룸·메인홀·DJ존", path: PATH },
    ]),
    articleSchema({ title: TITLE, description: DESCRIPTION, path: PATH, datePublished: PUBLISHED, dateModified }),
  ]);
  return (
    <>
      <SeoHead title={TITLE} description={DESCRIPTION} path={PATH} jsonLd={ld} ogImageAlt="룸·메인홀·DJ존 안내" />
      <SiteNav current={PATH} />
      <header className="hero hero-sub">
        <div className="hero-inner">
          <span className="eyebrow">FLOORPLAN · 자리의 과학</span>
          <h1><span className="grad">어디 앉느냐</span>가 그날 밤의 8할입니다.</h1>
          <p className="lead">{BIZ_AREA} 안에서 사이드 룸·메인 플로어·DJ 부근·안쪽 프라이빗까지. 인원과 분위기에 맞는 자리를 매칭해드립니다.</p>
        </div>
      </header>
      <main className="wrap">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol>
            <li><a href="/">홈</a></li>
            <li aria-current="page">룸·메인홀·DJ존</li>
          </ol>
        </nav>

        <section>
          <h2>4가지 포지션</h2>
          <div className="card-grid">
            <article className="card">
              <h3>① 사이드 룸 (첫방문 추천)</h3>
              <p>메인 플로어가 잘 보이는 쪽. 분위기 전체를 천천히 읽으면서 적응하기 좋고, 부킹 흐름이 자연스럽게 잡힙니다.</p>
              <ul className="bullets"><li>처음 오시는 분</li><li>4~6명 일행</li><li>여유 있게 보고 싶을 때</li></ul>
            </article>
            <article className="card">
              <h3>② DJ 부스 근처 (진하게)</h3>
              <p>사운드와 조명을 가장 진하게 받는 자리. 비트 떨어질 때 일행 전체가 한 호흡으로 같이 움직이는 느낌이 좋습니다.</p>
              <ul className="bullets"><li>EDM·K-팝·힙합 위주로 즐길 때</li><li>춤·사진·영상 컷 잘 받음</li><li>대화보다 분위기 우선</li></ul>
            </article>
            <article className="card">
              <h3>③ 안쪽 프라이빗 룸</h3>
              <p>조명을 한 톤 낮춰 일행끼리 대화하기 편한 톤. 음량 조절 가능, 필요할 때 메인으로 나갔다 들어오기 자연스러움.</p>
              <ul className="bullets"><li>생일·송별·모임 콘셉트</li><li>대화 위주 일행</li><li>VIP/단체</li></ul>
            </article>
            <article className="card">
              <h3>④ 메인 플로어</h3>
              <p>천장이 높고 사운드가 위에서 묵직하게 떨어지는 핵심 공간. 부킹과 만남의 중심.</p>
              <ul className="bullets"><li>워크인 자리</li><li>친구 그룹과 자연스럽게 섞이고 싶을 때</li><li>주말 골든타임 메인</li></ul>
            </article>
          </div>
        </section>

        <section>
          <h2>인원별 자리 매칭</h2>
          <p className="capsule"><strong>2~3명</strong> — 사이드 룸 또는 메인 코너. 부킹 흐름이 가장 자연스럽습니다.</p>
          <p className="capsule"><strong>4~6명</strong> — 사이드 룸 표준. 그날 분위기에 맞춰 DJ 근처로 옮길 수 있습니다.</p>
          <p className="capsule"><strong>7~10명</strong> — 안쪽 프라이빗 룸. 대화도 편하고 콘셉트 세팅도 미리 가능.</p>
          <p className="capsule"><strong>11명 이상</strong> — <a href="/vip/">VIP/단체 페이지</a> 참고 후 사전 콜 필수.</p>
        </section>

        <section>
          <h2>사운드·조명</h2>
          <p>최신 EDM, K-팝, 힙합을 그날 분위기 따라 믹스합니다. LED 무빙 헤드와 레이저 위주 조명이라 사진·영상이 잘 받는 편입니다. 룸은 조명 톤이 한 단계 다운되어 있어 일행끼리 대화하기에도 편합니다.</p>
        </section>

        <section className="ps">
          <h3>자리는 무조건 사전 콜</h3>
          <p>어떤 자리든 매장에 미리 연락하고 가시는 게 가장 확실합니다.</p>
        </section>
      </main>
      <SiteFooter dateModified={dateModified} />
      <StickyCTA />
    </>
  );
}
