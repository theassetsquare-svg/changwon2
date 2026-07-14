import type { GetStaticProps } from "next";
import SeoHead from "@/components/SeoHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyCTA from "@/components/StickyCTA";
import { SITE_URL } from "@/lib/site";
import { BASE_GRAPH, breadcrumb, articleSchema, graph } from "@/lib/schemas";

const PATH = "/booking/";
const TITLE = "부킹·룸 예약 4단계 | 한 통 가이드";
const DESCRIPTION = "전화 30초로 자리·부킹·룸을 다 잡는 법. 인원·성비·콘셉트별 매칭, 주말 골든타임 사전 콜 타이밍, 단체·생일·송별 세팅까지 정리.";
const PUBLISHED = "2026-05-26";

export const getStaticProps: GetStaticProps<{ dateModified: string }> = async () => ({
  props: { dateModified: new Date().toISOString().slice(0, 10) },
});

export default function Booking({ dateModified }: { dateModified: string }) {
  const howto = {
    "@type": "HowTo",
    name: "창원 룰루랄라 부킹·룸 예약 방법",
    description: "한 통으로 자리부터 부킹까지 끝내는 4단계 가이드",
    totalTime: "PT2M",
    tool: [{ "@type": "HowToTool", name: "휴대전화" }],
    step: [
      { "@type": "HowToStep", position: 1, name: "직통 콜", text: "매장 직통으로 연락. 빠른 확인이 가능합니다." },
      { "@type": "HowToStep", position: 2, name: "정보 전달", text: "인원, 성비, 연령대, 원하는 분위기(룸/메인/DJ 근처)를 한 줄로 전달." },
      { "@type": "HowToStep", position: 3, name: "시간 확정", text: "도착 예정 시각으로 자리 홀딩. 주말은 22:30 이전 도착 추천." },
      { "@type": "HowToStep", position: 4, name: "신분증 지참", text: "모아엔트몰 지하 3층 입구에서 신분증 확인 후 입장." },
    ],
  };
  const ld = graph([
    ...BASE_GRAPH,
    breadcrumb([
      { name: "홈", path: "/" },
      { name: "부킹·룸 예약", path: PATH },
    ]),
    articleSchema({ title: TITLE, description: DESCRIPTION, path: PATH, datePublished: PUBLISHED, dateModified }),
    howto,
  ]);

  return (
    <>
      <SeoHead title={TITLE} description={DESCRIPTION} path={PATH} jsonLd={ld} ogImageAlt="부킹·룸 예약 가이드" />
      <SiteNav current={PATH} />
      <header className="hero hero-sub">
        <div className="hero-inner">
          <span className="eyebrow">BOOKING · 30초 가이드</span>
          <h1>한 통이면 <span className="grad">자리·부킹·룸</span>이 끝납니다.</h1>
          <p className="lead">인원·성비·콘셉트만 알려주시면 그날 분위기에 맞는 자리로 매칭됩니다.</p>
          <div className="cta">
            <a className="btn btn-ghost" href="/vip/">단체·VIP는 여기 →</a>
          </div>
        </div>
      </header>
      <main className="wrap">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol>
            <li><a href="/">홈</a></li>
            <li aria-current="page">부킹·룸 예약</li>
          </ol>
        </nav>

        <section>
          <h2>4단계 — 전화 30초 컷</h2>
          <ol className="howto numbered">
            <li><span className="step-no">1</span><div><strong>직통 콜</strong><p>매장 직통으로 연락하세요. 한 줄 통화가 가장 빠릅니다.</p></div></li>
            <li><span className="step-no">2</span><div><strong>한 줄 정보</strong><p>몇 명, 성비, 연령대, 원하는 분위기(조용한 룸/메인 플로어/DJ 부근) 한 번에 전달.</p></div></li>
            <li><span className="step-no">3</span><div><strong>시간 확정</strong><p>도착 예정 시각을 알려주시면 자리 홀딩됩니다. 주말은 22:30 이전 도착이 자리 잡기 좋아요.</p></div></li>
            <li><span className="step-no">4</span><div><strong>신분증 지참</strong><p>{`만 19세 이상 입장. 입구에서 한 번 확인 후 바로 메인 홀로 이어집니다.`}</p></div></li>
          </ol>
        </section>

        <section>
          <h2>이렇게 말씀하시면 빨라요</h2>
          <p className="capsule"><strong>예시 1:</strong> "토요일 10시, 4명, 남자 2 / 여자 2, 30대 초반, 메인 잘 보이는 사이드 룸으로."</p>
          <p className="capsule"><strong>예시 2:</strong> "생일자 1명 포함 8명, 콘셉트 세팅 부탁드려요. 9시 도착."</p>
          <p className="capsule"><strong>예시 3:</strong> "지금 1차 끝나고 출발, 30분 내 도착, 6명 남여 반반, 진한 분위기."</p>
        </section>

        <section>
          <h2>주말 골든타임 사전 콜 타이밍</h2>
          <p>금·토·연휴 전야는 22:30 ~ 02:00 구간이 가장 진합니다. 이 구간에 좋은 자리를 잡고 싶다면 <strong>당일 오후 또는 전날 밤</strong>에 한 통 미리 부탁드립니다. 평일과 일~목은 워크인도 자리 잡기 무난합니다.</p>
        </section>

        <section>
          <h2>예약 변경·취소</h2>
          <p>일정이 바뀌면 같은 번호로 한 줄 통보만 부탁드립니다. 노쇼는 다음 예약 우선순위에 영향이 갈 수 있으니, 못 가시게 되면 미리 말씀해 주세요.</p>
        </section>

        <section className="ps">
          <h3>저장해두면 편한 연락처</h3>
          <p>단축번호 등록해두시면 출발 전 한 번에 끝납니다.</p>
        </section>
      </main>
      <SiteFooter dateModified={dateModified} />
      <StickyCTA />
    </>
  );
}
