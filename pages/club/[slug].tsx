import { useThumb } from '@/lib/thumb';
import type { GetStaticPaths, GetStaticProps } from "next";
import NightHead from "@/components/night/NightHead";
import NightStyles from "@/components/night/NightStyles";
import NightFooter from "@/components/night/NightFooter";
import CallBar from "@/components/night/CallBar";
import {
  VENUES,
  VENUE_BY_SLUG,
  NIGHT_URL_MAP,
  NIGHT_SLUG_BY_URL,
  nightPath,
  NIGHT_BASE,
  type Venue,
} from "@/lib/night/venues";
import { kwLead, kwClose } from "@/lib/kw";
import {
  breadcrumbSchema,
  faqPageSchema,
  nightClubSchema,
  ogImagePath,
} from "@/lib/night/seo";
import 확인표 from "@/lib/verified-shops.json";
import { 쪽글 } from "@/lib/booking/page-extra";
import { 미확인거름 } from "@/lib/hours-guard";
import { useSalt, 소금입히기 } from "@/lib/salt";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: VENUES.map((v) => ({ params: { slug: NIGHT_URL_MAP[v.slug] ?? v.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ venue: Venue }> = async (ctx) => {
  const slug = String(ctx.params?.slug);
  const venue = VENUE_BY_SLUG[NIGHT_SLUG_BY_URL[slug] ?? slug];
  if (!venue) return { notFound: true };
  return { props: { venue } };
};

type 확인가게 = { name: string; isAdvertiser: boolean; address?: string; openingHours?: string; telephone?: string; nickname?: string; checkedAt?: string };
/** 2026-09-25 — 장부 verified 값만 쓰는 가게(주소·영업시간·광고주 연락처). 없는 값은 쪽에서 뺀다 */
function 확인가게로(v: Venue): Venue {
  const 장 = (확인표 as { 가게: Record<string, 확인가게> }).가게[v.name];
  const tel = 장 && 장.isAdvertiser && 장.telephone ? 장.telephone : "";
  return {
    ...v,
    address: 장?.address,
    addressVerified: !!장?.address,
    hours: 장?.openingHours,
    ageBadge: undefined,   /* 연령 기준은 장부에 확인 값이 없다 */
    ageRange: undefined,
    contact: tel && 장?.nickname ? { nick: 장.nickname, phone: tel, tel: tel.replace(/\D/g, "") } : undefined,
    group: tel ? "A" : "B",
  } as Venue;
}
function 이름예산(name: string, 한도: number, 씨: string = "") {
  /* 한도를 넘는 이름은 「이 나이트·이 업소·이 가게」 가운데 쪽마다 다른 것으로 — 여러 쪽이 같은 문장이 되지 않게 */
  const 대신 = ["이 나이트", "이 업소", "이 가게"];
  let h = 5381; for (let i = 0; i < 씨.length; i += 1) h = (Math.imul(h, 33) ^ 씨.charCodeAt(i)) >>> 0;
  let n = 0;
  return (t: string) => {
    const 조각 = String(t ?? "").split(name);
    let out = 조각[0];
    for (let i = 1; i < 조각.length; i += 1) { n += 1; out += (n <= 한도 ? name : 대신[(h + n) % 대신.length]) + 조각[i]; }
    return out;
  };
}
function 고르기<T>(씨: string, arr: readonly T[]): T {
  let h = 2166136261;
  for (let i = 0; i < 씨.length; i += 1) { h ^= 씨.charCodeAt(i); h = Math.imul(h, 16777619); }
  return arr[(h >>> 0) % arr.length];
}
const 정리머리 = ["한 줄 정리", "한 줄로 정리하면", "정리하면 이렇습니다", "짧게 정리", "마무리 정리"];
const 확인머리 = [
  "이 쪽의 주소와 연락처는 공개 자료로 교차 확인한 값만 실었습니다.",
  "표에는 두 곳 이상에서 맞아떨어진 값만 옮겼습니다.",
  "확인되지 않은 영업시간·가격·층수는 표에서 뺐습니다.",
  "추정한 값은 적지 않았고 확인된 값만 남겼습니다.",
];

export default function NightVenuePage({ venue: 원래 }: { venue: Venue }) {
  const 표 = useThumb();   /* 2026-09-24 쪽마다 고유 카드 */
  const s = useSalt();
  const venue = 확인가게로(원래);
  /* 2026-10-06 전용22-8 — 장부에 확인일(checkedAt)이 있는 광고 쪽만 새 규격(카드 자리·관계 고지·twitter 큰 카드). 다른 광고주 쪽은 예전 꼴 그대로 */
  const 확인일 = venue.contact ? (확인표 as { 가게: Record<string, 확인가게> }).가게[원래.name]?.checkedAt : undefined;
  const path = nightPath(venue.slug);
  const related = venue.related
    .map((x) => VENUE_BY_SLUG[x])
    .filter(Boolean) as Venue[];

  /* 화면 차례대로 글을 먼저 만든다 — 가게이름 3~8회(제목·첫 문단·표 쪽에 남기고 뒤는 「이 나이트」) */
  const N0 = 이름예산(venue.name, 7, path);
  /* 2026-09-25 — 전화번호는 표·전화바 말고 글 안에서 한 번만(같은 번호 반복 3회 이하) */
  let 번호본 = 0;
  const N = (x0: string) => N0(미확인거름(x0, { 시간됨: !!venue.hours, 주소됨: !!venue.address })).replace(/01[016789][-. ]?\d{3,4}[-. ]?\d{4}/g, (m) => (++번호본 <= 1 ? m : "위 번호"));
  /* 2026-09-25 — 본문이 3,000자를 넘는 쪽은 뒤 마디를 덜어 2,400자 안으로(최소 3마디) */
  const 글자 = (x: string) => String(x ?? "").replace(/\s/g, "").length;
  const 원마디 = (() => {
    let 합 = [venue.name, venue.answer, ...venue.summary, ...venue.faq.flatMap((f) => [f.q, f.a])].reduce((a, x) => a + 글자(x), 0) + 520;
    const out: typeof venue.sections = [];
    for (const x of venue.sections) {
      const n = 글자(x.h2) + x.body.reduce((a, b) => a + 글자(b), 0) + (x.list || []).reduce((a, b) => a + 글자(b), 0) + (x.table ? x.table.rows.flat().reduce((a, b) => a + 글자(b), 0) : 0);
      if (out.length >= 3 && 합 + n > 2400) break; out.push(x); 합 += n;
    }
    return out;
  })();
  const h1 = N(venue.name);
  const 직답 = N(venue.answer) || `${venue.name}의 확인된 주소와 연락처를 아래 표에 정리했습니다.`;
  const 도입kw = "";   /* 2026-09-25 — 틀 문장이라 뺐다 */
  const 마디 = 원마디.map((x) => ({
    h2: N(x.h2) || "알아 둘 것", body: x.body.map(N).filter(Boolean), list: x.list ? x.list.map(N).filter(Boolean) : undefined,
    table: x.table ? { caption: N(x.table.caption), head: x.table.head, rows: x.table.rows.map((r) => r.map(N)).filter((r) => r.every(Boolean)) } : undefined,
  })).map((x) => (x.table && !x.table.rows.length ? { ...x, table: undefined } : x)).filter((x) => x.body.length || (x.list && x.list.length) || x.table);
  const 요약 = venue.summary.map(N).map((x) => x || "영업시간처럼 확인되지 않은 값은 이 안내에 적지 않았습니다.");
  const 문답 = venue.faq.map((it) => { const q = N(it.q); let a = N(it.a); if (!a && /주소|위치/.test(q) && venue.address) a = `공개 자료로 확인된 주소는 ${venue.address}입니다.`; return { q, a }; }).filter((it) => it.q && it.a);
  const 끝kw = "";

  const facts: [string, string][] = [
    ["지역", venue.region],
    ...(venue.address ? ([["주소", venue.address]] as [string, string][]) : []),
    ...(venue.hours ? ([["영업시간", venue.hours]] as [string, string][]) : []),
    ["출입 연령", venue.ageBadge ?? "성인 · 신분증 확인"],
    venue.contact ? ["문의", `${venue.contact.nick} ${venue.contact.phone}`] : ["광고·제휴 입점 문의", "카카오톡 besta12"],
  ];

  const 카드 = (
    <figure className="night-og">
      <img
        src={표 ? 표.file : ogImagePath(venue.slug, (venue as any).ogV)}
        alt={표 ? 표.alt : venue.contact ? ["광고", venue.name, venue.contact.nick, venue.contact.phone].join(" · ") : `${venue.name} 위치·이용 안내`}
        width={1200}
        height={1200}
        style={{ maxWidth: "100%", height: "auto" }}
        loading="eager"
      />
      <figcaption>안내 카드</figcaption>
    </figure>
  );

  return (
    <>
      <NightHead
        title={venue.title}
        description={venue.description}
        path={path}
        image={ogImagePath(venue.slug, (venue as any).ogV)}
        imageAlt={venue.ogAlt}
        큰카드={!!확인일}
        jsonLd={[nightClubSchema(venue), faqPageSchema({ ...venue, faq: 문답 }), breadcrumbSchema(venue)]}
      />
      <NightStyles />
      {소금입히기(
      <>
      <header className="night-top">
        <a href="/">홈</a>
        <a href={NIGHT_BASE}>나이트 목록</a>
      </header>

      <main className="night-wrap">
        <nav aria-label="Breadcrumb" className="night-crumb">
          <ol>
            <li><a href="/">홈</a></li>
            <li><a href={NIGHT_BASE}>나이트</a></li>
            <li aria-current="page">{venue.name}</li>
          </ol>
        </nav>

        <article>
        {venue.contact ? <p className="ad-label" style={{ display: "inline-block", margin: "0 0 10px", padding: "3px 10px", border: "1px solid #c9a227", borderRadius: 4, fontSize: 12, color: "#c9a227", letterSpacing: ".04em" }}>광고</p> : null}
        <h1>{h1}</h1>

        <p className="night-updated">
          최종 정리 <time dateTime="2026-09-25">2026년 9월 25일</time>
        </p>

        {/* 새 광고 세트 쪽은 카드를 h1·갱신일 바로 뒤, 직답 상자보다 위에 */}
        {확인일 ? 카드 : null}

        <div className="answer-box" data-r="lead">
          <p>{직답}</p>
        </div>

        {확인일 ? null : 카드}


        <div className="night-table-wrap">
          <table className="night-table" data-r="facts">
            <caption>확인된 값만</caption>
            <tbody>
              {facts.map(([k, v], i) => (
                <tr key={i}>
                  <th scope="row">{k}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {마디.map((x, i) => (
          <section key={i}>
            <h2>{x.h2}</h2>
            {x.body.map((p, j) => (<p key={j}>{p}</p>))}
            {x.list ? (
              <ul className="night-bullets">
                {x.list.map((it, j) => (<li key={j}>{it}</li>))}
              </ul>
            ) : null}
            {x.table ? (
              <div className="night-table-wrap">
                <table className="night-table">
                  <caption>{x.table.caption}</caption>
                  <thead>
                    <tr>
                      {x.table.head.map((h, j) => (<th key={j} scope="col">{h}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {x.table.rows.map((row, j) => (
                      <tr key={j}>
                        {row.map((cell, k) => k === 0 ? (<th key={k} scope="row">{cell}</th>) : (<td key={k}>{cell}</td>))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>
        ))}

        {(쪽글[path] || []).length ? (
          <section>
            <h2>방문 전에 볼 것</h2>
            {(쪽글[path] || []).map((p, j) => (<p key={j}>{N(p)}</p>))}
          </section>
        ) : null}

        <section className="night-faq">
          <h2>자주 묻는 질문</h2>
          {문답.map((it, i) => (
            <div data-r="qa" key={i}>
              <h3 data-r="q">{it.q}</h3>
              <p data-r="a">{it.a}</p>
            </div>
          ))}
        </section>

        <div className="night-summary" data-r="closewrap">
          <p><b>{고르기(venue.slug + "정리", 정리머리)}</b></p>
          <p data-r="close">① {요약[0]}</p>
          <p>② {요약[1]}</p>
          <p>③ {요약[2]}</p>
        </div>

        {확인일 && venue.contact ? (
          <p className="night-checked">
            {`이 페이지는 광고이며, 업소 제공 정보를 받아 실었습니다(담당 ${venue.contact.nick}). 확인일 `}<time dateTime={확인일}>{확인일}</time>{". 운영 사정에 따라 내용은 바뀔 수 있으니 방문 전에 다시 확인해 주십시오."}
          </p>
        ) : (
          <p className="night-checked">
            {venue.contact ? "광고 · 업소 담당자 제공 연락처 · " : "공개된 자료 기준 · 업소와 제휴 관계 없음 · "}
            확인일 <time dateTime="2026-09-25">2026년 9월 25일</time>. 운영 사정에 따라 내용은 바뀔 수 있으니 방문 전에 다시 확인해 주십시오.
          </p>
        )}
        </article>

        <nav className="night-related" aria-label="관련 업소 안내">
          <h2>같이 보면 좋은 업소</h2>
          <ul>
            {related.map((r) => (
              <li key={r.slug}>
                <a href={nightPath(r.slug)}>{r.name} — {r.region}</a>
              </li>
            ))}
            <li><a href={NIGHT_BASE}>전체 목록 보기</a></li>
          </ul>
        </nav>

        {/* 2026-09-25 — 틀 문장(night-note)은 13쪽에 되풀이돼 뺐다. 확인일·관계 고지는 night-checked 에 있다. */}
      </main>
      </>, s)}

      <NightFooter 광고쪽={!!venue.contact} />
      <CallBar venue={venue} />
    </>
  );
}
