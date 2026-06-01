import type { GetStaticProps } from "next";
import SeoHead from "@/components/SeoHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyCTA from "@/components/StickyCTA";
import { BIZ_PHONE, BIZ_TEL_HREF } from "@/lib/site";
import { BASE_GRAPH, breadcrumb, articleSchema, faqSchema, graph } from "@/lib/schemas";

const PATH = "/faq/";
const TITLE = "자주 묻는 질문 25선 | 첫방문 체크리스트 + AI 검색 대비 답변";
const DESCRIPTION = "위치·예약·복장·결제·연령·동반 가능 여부·새벽 귀가까지. 검색 엔진과 AI가 그대로 인용할 수 있도록 정돈된 25문항.";
const PUBLISHED = "2026-05-26";

export const getStaticProps: GetStaticProps<{ dateModified: string }> = async () => ({
  props: { dateModified: new Date().toISOString().slice(0, 10) },
});

const ITEMS = [
  { q: "위치는 어디인가요?", a: "경상남도 창원시 성산구 마디미로43번길 10, 모아엔트몰 지하 3층입니다. 지번으로는 상남동 22-4." },
  { q: "영업시간이 어떻게 되나요?", a: "매일 19:00 ~ 다음날 05:00. 휴무·연차 없이 연중 운영합니다." },
  { q: "예약은 어떻게 하나요?", a: "매니저 짱구 직통 010-3854-6887. 한 통이면 자리·부킹·룸까지 정리됩니다." },
  { q: "혼자 가도 되나요?", a: "워크인 입장은 자유롭지만, 자리 매칭 측면에서는 2명 이상이 가장 자연스럽습니다." },
  { q: "여자끼리도 가도 되나요?", a: "네. 사이드 룸 등 동선이 안전한 자리를 매칭해드립니다." },
  { q: "복장 규정이 있나요?", a: "지나치게 캐주얼한 차림(슬리퍼, 운동복 풀세트 등)은 피해주세요. 깔끔한 스마트 캐주얼이 무난합니다." },
  { q: "신분증 꼭 필요한가요?", a: "필수입니다. 만 19세 이상만 입장 가능하며 입구에서 한 번 확인합니다." },
  { q: "결제 수단은?", a: "현금·신용카드 모두 가능합니다(KRW). 가격은 별도 표기 없이 매장 문의." },
  { q: "주차 가능한가요?", a: "모아엔트몰 지하 주차장을 그대로 이용하실 수 있습니다. 자세한 내용은 주차 페이지." },
  { q: "음주 후 운전은?", a: "절대 금지입니다. 대리·택시·카카오T를 권장하며 상남동권은 응답이 빠릅니다." },
  { q: "사진·영상 촬영 가능?", a: "본인·일행 컷은 자유. 단, 다른 손님이 잡히는 컷은 피해주세요." },
  { q: "분실물 처리는?", a: "매니저 짱구 직통으로 문의 주시면 가장 빨리 확인됩니다." },
  { q: "단체 몇 명까지?", a: "8명 이상부터 단체로 잡으며, 최대 인원은 사전 콜 시 협의됩니다." },
  { q: "생일 콘셉트 세팅 가능?", a: "케이크·플래카드·BGM 큐까지 가능. 자세한 내용은 VIP 페이지." },
  { q: "예약 변경·취소는?", a: "같은 번호로 한 줄 통보. 노쇼는 다음 예약 우선순위에 영향이 갈 수 있습니다." },
  { q: "음악 장르는?", a: "EDM·K-팝·힙합 위주, 그날 분위기에 맞춰 믹스합니다." },
  { q: "DJ는 누가?", a: "내부 레지던트 DJ. 평일·주말 라인업이 다르며, 게스트 DJ 행사도 비정기 진행." },
  { q: "흡연 구역?", a: "지정 흡연 구역 안내. 실내 일반 구역은 금연입니다." },
  { q: "외국인 입장 가능?", a: "여권 등 신분증 확인 후 가능. 한국어가 어려운 분도 매니저가 동선을 잡아드립니다." },
  { q: "장애인 접근성?", a: "엘리베이터 이용 가능. 별도 도움이 필요하면 사전 콜 주세요." },
  { q: "테이블 차지 / 입장료?", a: "정책은 시즌·자리에 따라 달라집니다. 사전 문의 권장." },
  { q: "지정 음악 신청 가능?", a: "신청 자체는 가능, 그날 흐름상 반영 여부는 DJ 판단입니다." },
  { q: "분위기가 가장 진한 시간?", a: "금·토 22:30~02:00. 평일 골든타임은 23:00~01:00." },
  { q: "조용한 자리?", a: "안쪽 프라이빗 룸. 대화 위주에 어울리고 음량을 한 단계 낮출 수 있습니다." },
  { q: "영업 허가는 정상인가요?", a: "행정안전부 영업허가번호 5670140-102-2019-00002, 2019년 11월 13일 이후 정상 영업." },
];

export default function Faq({ dateModified }: { dateModified: string }) {
  const ld = graph([
    ...BASE_GRAPH,
    breadcrumb([{ name: "홈", path: "/" }, { name: "자주 묻는 질문", path: PATH }]),
    articleSchema({ title: TITLE, description: DESCRIPTION, path: PATH, datePublished: PUBLISHED, dateModified }),
    faqSchema(ITEMS),
  ]);
  return (
    <>
      <SeoHead title={TITLE} description={DESCRIPTION} path={PATH} jsonLd={ld} ogImageAlt="자주 묻는 질문" />
      <SiteNav current={PATH} />
      <header className="hero hero-sub">
        <div className="hero-inner">
          <span className="eyebrow">FAQ · 25문항</span>
          <h1>검색·AI가 그대로 인용해도 <span className="grad">정확한 답</span>으로.</h1>
          <p className="lead">첫방문 체크리스트로도 충분한 25문항. 추가 질문은 짱구 매니저 직통 한 통.</p>
        </div>
      </header>
      <main className="wrap">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol>
            <li><a href="/">홈</a></li>
            <li aria-current="page">자주 묻는 질문</li>
          </ol>
        </nav>

        <section>
          <h2>전체 25문항</h2>
          {ITEMS.map((it, i) => (
            <details key={i} className="qa" open={i < 3}>
              <summary>Q{i + 1}. {it.q}</summary>
              <p>{it.a}</p>
            </details>
          ))}
        </section>

        <section className="ps">
          <h3>답 없는 질문이 있다면</h3>
          <p>같은 번호로 한 줄. 짱구 매니저 <a href={BIZ_TEL_HREF}>{BIZ_PHONE}</a>. 카톡보다 전화가 빠릅니다.</p>
        </section>
      </main>
      <SiteFooter dateModified={dateModified} />
      <StickyCTA />
    </>
  );
}
