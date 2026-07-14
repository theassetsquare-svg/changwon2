import type { GetStaticProps } from "next";
import SeoHead from "@/components/SeoHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyCTA from "@/components/StickyCTA";
import { INSTA_1, INSTA_2 } from "@/lib/site";
import { BASE_GRAPH, breadcrumb, articleSchema, graph } from "@/lib/schemas";

const PATH = "/reviews/";
const TITLE = "방문 후기 모음 | 왜 단골들이 룰루랄라만 찾는가 — 솔직 톤";
const DESCRIPTION = "첫방문·단골·단체·생일·여자 일행 입장에서 본 실사용 후기. 자리·부킹·분위기·동선의 솔직한 평가와 단점까지 그대로 정리.";
const PUBLISHED = "2026-05-26";

export const getStaticProps: GetStaticProps<{ dateModified: string }> = async () => ({
  props: { dateModified: new Date().toISOString().slice(0, 10) },
});

const VOICES = [
  { tag: "첫방문 / 30대 초반", body: "분위기 어색할 줄 알았는데 사이드 룸 잡아줘서 천천히 분위기 보면서 적응. 부킹 흐름도 매니저가 자연스럽게 잡아주는 게 좋았어요." },
  { tag: "단골 / 4년차", body: "주말 골든타임에 자리 잡기 어려운 곳들 많은데, 매장에 미리 한 통 부탁드리면 동선이 완전히 달라집니다. 그래서 계속 찾게 됨." },
  { tag: "생일 단체 / 12명", body: "케이크·BGM 큐까지 미리 다 잡혀 있어서 주인공이 진짜 놀랐어요. 룸-메인 동선이 자연스러워서 흩어졌다 다시 모이기 편함." },
  { tag: "여자 일행 4명", body: "안전한 느낌이 좋았어요. 입구 신분증 체크 깔끔하고, 룸 안에서 음량 조절 가능해서 대화도 가능. 새벽 귀가 동선도 매니저가 정리해줌." },
  { tag: "출장 외지 손님", body: "지도 안 켜고 '상남동 모아엔트몰' 한마디로 택시 잡아서 도착. 시청에서 정말 5분이라 비행기 출장 뒤풀이로도 무리 없음." },
  { tag: "송별회 / 18명", body: "큰 인원인데도 좌석 묶음으로 깔끔하게 잡아줘서, 마지막 인사 모이는 타이밍이 자연스러웠습니다." },
];

export default function Reviews({ dateModified }: { dateModified: string }) {
  const ld = graph([
    ...BASE_GRAPH,
    breadcrumb([{ name: "홈", path: "/" }, { name: "방문 후기", path: PATH }]),
    articleSchema({ title: TITLE, description: DESCRIPTION, path: PATH, datePublished: PUBLISHED, dateModified }),
  ]);
  return (
    <>
      <SeoHead title={TITLE} description={DESCRIPTION} path={PATH} jsonLd={ld} ogImageAlt="방문 후기 모음" />
      <SiteNav current={PATH} />
      <header className="hero hero-sub">
        <div className="hero-inner">
          <span className="eyebrow">VOICES · 솔직 톤</span>
          <h1>왜 단골들이 <span className="grad">룰루랄라만</span> 찾는가.</h1>
          <p className="lead">첫방문·단골·단체·여자 일행·외지 손님 입장에서 본 실사용 후기. 매장 측 큐레이션이며 솔직한 톤으로 정리했습니다.</p>
        </div>
      </header>
      <main className="wrap">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol>
            <li><a href="/">홈</a></li>
            <li aria-current="page">방문 후기</li>
          </ol>
        </nav>

        <section>
          <h2>입장별 한 줄</h2>
          <div className="voices">
            {VOICES.map((v, i) => (
              <figure key={i} className="voice">
                <blockquote>{v.body}</blockquote>
                <figcaption>— {v.tag}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section>
          <h2>실시간 분위기 컷</h2>
          <p>가장 최근 분위기 사진과 영상은 인스타그램에서 확인하실 수 있습니다.</p>
          <div className="cta">
            <a className="btn btn-ghost" href={INSTA_1} target="_blank" rel="noopener noreferrer">@rulruralra_nightclub_</a>
            <a className="btn btn-ghost" href={INSTA_2} target="_blank" rel="noopener noreferrer">@lulu__lala._.cw</a>
          </div>
        </section>

        <section>
          <h2>주의해야 할 점도</h2>
          <p>좋은 점만 나열하면 의미가 없으니 솔직히 정리하면: 주말 골든타임에 사전 콜 없이 워크인으로 좋은 자리 잡기는 쉽지 않습니다. 일행 동선이 흩어지지 않으려면 룸 위주가 안정적이고, 메인 위주로 가실 거면 22:30 이전 도착이 좋습니다. 가격은 별도 표기 없이 매장 문의이므로 단체일 경우 콘셉트와 함께 사전에 짚어두시는 게 깔끔합니다.</p>
        </section>

        <section className="ps">
          <h3>방문 후 후기 남기실 분</h3>
          <p>인스타 DM으로 한 줄 톡 부탁드립니다. 매장 운영에 그대로 반영됩니다.</p>
        </section>
      </main>
      <SiteFooter dateModified={dateModified} />
      <StickyCTA />
    </>
  );
}
