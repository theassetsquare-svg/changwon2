import type { GetStaticProps } from "next";
import SeoHead from "@/components/SeoHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyCTA from "@/components/StickyCTA";
import {
  BIZ_PHONE,
  BIZ_TEL_HREF,
  BIZ_ADDRESS_ROAD,
  BIZ_FLOOR,
  BIZ_HOURS,
  BIZ_AREA,
  BIZ_LICENSE,
  SITE_URL,
  INSTA_1,
  PAGES,
} from "@/lib/site";
import {
  BASE_GRAPH,
  breadcrumb,
  articleSchema,
  faqSchema,
  graph,
} from "@/lib/schemas";

const PATH = "/";
const TITLE =
  "창원 룰루랄라 나이트 | 짱구 직통 한 통이면 자리 끝 · 상남동 No.1";
const DESCRIPTION =
  "상남동 모아엔트몰 지하 3층, 457평 메인홀에서 매일 19시부터 새벽 5시. 부킹·룸·VIP는 짱구  직통이 가장 빠릅니다.";
const PUBLISHED = "2026-05-19";

export const getStaticProps: GetStaticProps<{ dateModified: string }> = async () => ({
  props: { dateModified: new Date().toISOString().slice(0, 10) },
});

const HOME_FAQ = [
  {
    q: "창원에서 가장 큰 나이트는 어디인가요?",
    a: "상남동 모아엔트몰 지하 3층의 룰루랄라가 약 457평(1,508.46㎡)으로 창원 시내 최대 규모입니다.",
  },
  {
    q: "예약 없이 그냥 가도 되나요?",
    a: "평일은 워크인 가능하지만 주말 골든타임(22:30~02:00)은 짱구  사전 콜이 사실상 필수입니다.",
  },
  {
    q: "여성/남성/단체 구성에 따라 자리가 달라지나요?",
    a: "네. 인원·성비·연령대·콘셉트에 맞춰 자리와 부킹 라인이 매칭됩니다. 미리 짱구에게 한 통 부탁드립니다.",
  },
  {
    q: "결제는 카드 되나요?",
    a: "현금·신용카드 모두 가능합니다. 가격은 별도 표기 없이 매장 문의입니다.",
  },
];

export default function Home({ dateModified }: { dateModified: string }) {
  const ld = graph([
    ...BASE_GRAPH,
    breadcrumb([
      { name: "홈", path: "/" },
      { name: "창원 나이트", path: "/" },
    ]),
    articleSchema({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      datePublished: PUBLISHED,
      dateModified,
    }),
    faqSchema(HOME_FAQ),
  ]);

  return (
    <>
      <SeoHead
        title={TITLE}
        description={DESCRIPTION}
        path={PATH}
        ogImageAlt="창원 룰루랄라 나이트 짱구 직통 라인 - 상남동 모아엔트몰 지하 3층"
        jsonLd={ld}
      />

      <SiteNav current={PATH} />

      <header className="hero hero-home">
        <div className="hero-inner">
          <span className="eyebrow">CHANGWON · SANGNAM · SINCE 2019</span>
          <h1>
            창원 룰루랄라 나이트
            <br />
            <span className="grad">짱구 직통 한 통</span>이면 자리 끝.
          </h1>
          <p className="lead">
            상남동 모아엔트몰 지하 3층. 457평 메인홀과 프라이빗 룸, 매일{" "}
            <strong>19시부터 새벽 5시</strong>. 부킹·룸·VIP·단체까지{" "}
            <strong>짱구 </strong> 한 라인으로 정리됩니다.
          </p>

          <div className="cta">
            <a className="btn btn-primary btn-lg" href={BIZ_TEL_HREF}>
              <span aria-hidden>📞</span> 짱구 직통 {BIZ_PHONE}
            </a>
            <a className="btn btn-ghost btn-lg" href="/booking/">
              부킹 가이드 →
            </a>
          </div>

          <ul className="kpis">
            <li>
              <strong>457평</strong>
              <span>창원 최대급 메인홀</span>
            </li>
            <li>
              <strong>19→05</strong>
              <span>연중무휴 10시간 영업</span>
            </li>
            <li>
              <strong>2019</strong>
              <span>정식 허가 운영</span>
            </li>
          </ul>
        </div>
      </header>

      <main className="wrap">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol>
            <li><a href="/">홈</a></li>
            <li aria-current="page">메인</li>
          </ol>
        </nav>

        <section>
          <h2>왜 짱구 라인인가</h2>
          <p className="capsule">
            <strong>한 줄 요약:</strong> 자리·부킹·룸 매칭이 매니저 라인 하나로 끝납니다.
            평일 워크인도, 주말 골든타임도, 단체 8인 이상도 같은 번호 한 통입니다.
          </p>
          <p>
            클럽은 어떤 자리에 앉느냐가 그날 밤의 8할입니다. 메인 플로어가 잘 보이는 사이드 룸,
            DJ 부스 바로 옆 진한 자리, 일행끼리 대화하기 좋은 안쪽 — 같은 매장이라도 자리에 따라
            완전히 다른 곳이 됩니다. 매니저 짱구는 그날 분위기·성비·온도를 읽고 자리와 부킹 동선을
            짭니다. 처음 오시는 분이 어색하지 않게 흐름부터 잡아주는 게 단골이 많은 이유입니다.
          </p>
        </section>

        <section>
          <h2>한눈에 보는 매장</h2>
          <div className="fact-grid">
            <div className="fact">
              <div className="fact-label">위치</div>
              <div className="fact-value">{BIZ_ADDRESS_ROAD}</div>
              <div className="fact-sub">{BIZ_FLOOR} · 상남동 22-4</div>
            </div>
            <div className="fact">
              <div className="fact-label">영업</div>
              <div className="fact-value">{BIZ_HOURS}</div>
              <div className="fact-sub">연중무휴 · 명절 정상영업</div>
            </div>
            <div className="fact">
              <div className="fact-label">규모</div>
              <div className="fact-value">{BIZ_AREA}</div>
              <div className="fact-sub">메인홀 + 룸 + DJ 부스</div>
            </div>
            <div className="fact">
              <div className="fact-label">허가</div>
              <div className="fact-value">{BIZ_LICENSE}</div>
              <div className="fact-sub">행정안전부 등록 합법 영업</div>
            </div>
            <div className="fact">
              <div className="fact-label">연령</div>
              <div className="fact-value">만 19세 이상</div>
              <div className="fact-sub">신분증 지참 필수</div>
            </div>
            <div className="fact">
              <div className="fact-label">결제</div>
              <div className="fact-value">현금·카드</div>
              <div className="fact-sub">KRW 기준</div>
            </div>
          </div>
        </section>

        <section>
          <h2>매장 모습</h2>
          <div className="gallery">
            <img className="ph wide" src="/images/1-exterior.svg" alt="모아엔트몰 외관 진입로" width={1600} height={900} loading="eager" />
            <img className="ph" src="/images/2-mainhall.svg" alt="메인홀 — 천장이 높은 457평 플로어" width={1200} height={900} loading="lazy" />
            <img className="ph" src="/images/3-room.svg" alt="프라이빗 룸 — 일행끼리 대화하기 편한 톤" width={1200} height={900} loading="lazy" />
            <img className="ph" src="/images/4-dj.svg" alt="DJ 부스 — 메인홀 정면 배치" width={1200} height={900} loading="lazy" />
            <img className="ph" src="/images/5-bar.svg" alt="바 카운터 — 대형 라운드 바" width={1200} height={900} loading="lazy" />
          </div>
          <p className="muted-mini">※ 실제 매장 컷은 인스타 <a href={INSTA_1} target="_blank" rel="noopener noreferrer">@rulruralra_nightclub_</a> 에서 가장 최신.</p>
        </section>

        <section>
          <h2>다음에 볼 페이지</h2>
          <div className="link-grid">
            {PAGES.filter((p) => p.path !== PATH).map((p) => (
              <a key={p.path} className="link-card" href={p.path}>
                <span className="link-card-label">{p.label}</span>
                <span className="link-card-arrow" aria-hidden>→</span>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2>핵심 Q&A</h2>
          {HOME_FAQ.map((it, i) => (
            <details key={i} className="qa">
              <summary>Q. {it.q}</summary>
              <p>{it.a}</p>
            </details>
          ))}
          <p className="muted-mini" style={{ marginTop: 12 }}>
            더 자세한 25문항은 <a href="/faq/">자주 묻는 질문</a> 페이지에서.
          </p>
        </section>

        <section className="ps">
          <h3>마지막으로</h3>
          <p>
            출발 전 한 통이면 자리·부킹·룸이 한 번에 정리됩니다. 짱구 매니저 직통{" "}
            <a href={BIZ_TEL_HREF}>{BIZ_PHONE}</a>. 카톡보다 전화가 빠릅니다.
            인스타 <a href={INSTA_1} target="_blank" rel="noopener noreferrer">@rulruralra_nightclub_</a> 에서 최근 분위기 컷도 확인 가능합니다.
          </p>
        </section>
      </main>

      <SiteFooter dateModified={dateModified} />
      <StickyCTA />
    </>
  );
}
