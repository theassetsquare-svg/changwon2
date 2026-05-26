import type { GetStaticProps } from "next";
import SeoHead from "@/components/SeoHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyCTA from "@/components/StickyCTA";
import { BIZ_PHONE, BIZ_TEL_HREF, BIZ_HOURS } from "@/lib/site";
import { BASE_GRAPH, breadcrumb, articleSchema, graph } from "@/lib/schemas";

const PATH = "/hours/";
const TITLE = "영업시간 365일 19~05시 | 휴무 0일 · 명절도 정상영업";
const DESCRIPTION = "월화수목금토일 모두 19:00 오픈, 다음날 05:00 마감. 휴무·연차 없음. 골든타임·라스트오더·도착 추천 시간 정리.";
const PUBLISHED = "2026-05-26";

export const getStaticProps: GetStaticProps<{ dateModified: string }> = async () => ({
  props: { dateModified: new Date().toISOString().slice(0, 10) },
});

export default function Hours({ dateModified }: { dateModified: string }) {
  const ld = graph([
    ...BASE_GRAPH,
    breadcrumb([
      { name: "홈", path: "/" },
      { name: "영업시간", path: PATH },
    ]),
    articleSchema({ title: TITLE, description: DESCRIPTION, path: PATH, datePublished: PUBLISHED, dateModified }),
  ]);
  const days = [
    { d: "월요일", note: "조용·차분, 워크인 자리 여유" },
    { d: "화요일", note: "비슷한 결, 사이드 룸 잡기 좋음" },
    { d: "수요일", note: "회사 모임 슬슬 시작" },
    { d: "목요일", note: "주말 전야 분위기 살짝" },
    { d: "금요일", note: "골든타임 22:30~02:00 — 사전 콜 권장" },
    { d: "토요일", note: "가장 진한 날 — 22:00 이전 도착 추천" },
    { d: "일요일", note: "여유 있는 마무리, 22~24시 추천" },
  ];
  return (
    <>
      <SeoHead title={TITLE} description={DESCRIPTION} path={PATH} jsonLd={ld} ogImageAlt="365일 19~05시 영업시간 안내" />
      <SiteNav current={PATH} />
      <header className="hero hero-sub">
        <div className="hero-inner">
          <span className="eyebrow">OPEN · 365 / 19→05</span>
          <h1>휴무 <span className="grad">0일</span>. {BIZ_HOURS}.</h1>
          <p className="lead">연차도, 명절도, 비 와도 같습니다. 만 19세 이상 신분증 지참 후 입장.</p>
        </div>
      </header>
      <main className="wrap">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol>
            <li><a href="/">홈</a></li>
            <li aria-current="page">영업시간</li>
          </ol>
        </nav>

        <section>
          <h2>요일별 한 줄</h2>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>요일</th><th>오픈</th><th>마감</th><th>특징</th></tr></thead>
              <tbody>
                {days.map((row) => (
                  <tr key={row.d}>
                    <td>{row.d}</td>
                    <td>19:00</td>
                    <td>다음날 05:00</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>도착 시간 권장</h2>
          <p className="capsule"><strong>여유 있게:</strong> 21:00~22:00 도착이 분위기 천천히 보면서 적응하기 가장 좋습니다.</p>
          <p className="capsule"><strong>딱 골든타임:</strong> 22:30~02:00. 사운드·조명·인원 밀도가 가장 진한 구간.</p>
          <p className="capsule"><strong>막차 컷:</strong> 03:00 이후도 들어오는 손님은 있지만, 자리가 좁아질 수 있어 사전 콜 권장.</p>
        </section>

        <section>
          <h2>명절·연휴·특별일</h2>
          <p>설날·추석·크리스마스·연말 같은 특별일도 모두 정상 영업합니다. 휴무는 없지만 손님 밀도가 평소의 1.5~2배까지 올라가는 날들이 있어 사전 콜이 사실상 필수가 됩니다. 일정이 잡혔으면 일주일 전부터 한 통 부탁드립니다.</p>
        </section>

        <section className="ps">
          <h3>오늘 가실 거면</h3>
          <p>지금 바로 짱구 매니저 직통 <a href={BIZ_TEL_HREF}>{BIZ_PHONE}</a>. 자리 상황은 시간 단위로 바뀝니다.</p>
        </section>
      </main>
      <SiteFooter dateModified={dateModified} />
      <StickyCTA />
    </>
  );
}
