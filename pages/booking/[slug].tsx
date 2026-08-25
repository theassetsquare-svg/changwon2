import type { GetStaticPaths, GetStaticProps } from "next";
import NightHead from "@/components/night/NightHead";
import NightFooter from "@/components/night/NightFooter";
import BookingStyles from "@/components/booking/BookingStyles";
import BookingBar from "@/components/booking/BookingBar";
import {
  BOOKING_VENUES,
  BOOKING_KEEP_OLD,
  BOOKING_BY_SLUG,
  bookingPath,
  BOOKING_BASE,
  type BookingVenue,
} from "@/lib/booking/venues";
import { kwLead, kwClose } from "@/lib/kw";
import {
  bookingBreadcrumbSchema,
  bookingClubSchema,
  bookingFaqSchema,
  bookingOgPath,
} from "@/lib/booking/seo";
import { VENUE_BY_SLUG as NIGHT_BY_SLUG, nightPath } from "@/lib/night/venues";

const UPDATED = "2026-08-17";
const UPDATED_LABEL = "2026년 8월 17일";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: BOOKING_VENUES.filter((v) => BOOKING_KEEP_OLD.has(v.slug)).map((v) => ({ params: { slug: v.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ venue: BookingVenue }> = async (ctx) => {
  const slug = String(ctx.params?.slug);
  const venue = BOOKING_BY_SLUG[slug];
  if (!venue) return { notFound: true };
  return { props: { venue } };
};

export default function BookingVenuePage({ venue }: { venue: BookingVenue }) {
  const path = bookingPath(venue.slug);
  const related = venue.related
    .map((s) => BOOKING_BY_SLUG[s])
    .filter(Boolean) as BookingVenue[];

  const facts: [string, string][] = [
    ["지역", venue.region],
    ["주소", venue.address ?? "확인 불가"],
    ["가까운 역", venue.station ?? "확인 불가"],
    ["층·건물", venue.floor ?? "확인 불가"],
    ["영업시간", venue.hours ?? "확인 불가"],
    ["출입 연령", venue.ageBadge ?? "성인 · 신분증 확인"],
    [
      venue.contact ? "문의" : "광고·제휴 입점 문의",
      venue.contact
        ? `${venue.contact.nick} ${venue.contact.phone}`
        : "카카오톡 besta12",
    ],
  ];

  return (
    <>
      <NightHead
        title={venue.title}
        description={venue.description}
        path={path}
        image={bookingOgPath(venue.slug, (venue as any).ogV)}
        imageAlt={venue.ogAlt}
        jsonLd={[
          bookingClubSchema(venue),
          bookingFaqSchema(venue),
          bookingBreadcrumbSchema(venue),
        ]}
      />
      <BookingStyles />

      <header className="bk-top">
        <a href="/">홈</a>
        <a href={BOOKING_BASE}>부킹 안내 40</a>
      </header>

      <main className="bk-wrap">
        <nav aria-label="Breadcrumb" className="bk-crumb">
          <ol>
            <li>
              <a href="/">홈</a>
            </li>
            <li>
              <a href={BOOKING_BASE}>부킹 안내</a>
            </li>
            <li aria-current="page">{venue.name}</li>
          </ol>
        </nav>

        <article>
          <h1>{venue.title}</h1>

          <p className="bk-updated">
            부킹 흐름 기준 정리 · 최종 <time dateTime={UPDATED}>{UPDATED_LABEL}</time>
          </p>

          <section>
            {venue.lead.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="bk-kw">{kwLead(venue.name, venue.region, venue.slug)}</p>
          </section>

          <div className="answer-box">
            {venue.answer3.map((line, i) => (
              <p key={i}>
                <span className="bk-anum">{["①", "②", "③"][i]}</span>
                {line}
              </p>
            ))}
          </div>

          <figure className="bk-og">
            <img
              src={bookingOgPath(venue.slug, (venue as any).ogV)}
              alt={`${venue.name} 부킹 안내`}
              width={1200}
              height={1200}
              style={{ maxWidth: "100%", height: "auto" }}
              loading="eager"
            />
            <figcaption>{venue.name} 부킹 안내 카드</figcaption>
          </figure>

          <div className="bk-table-wrap">
            <table className="bk-facts">
              <caption>{venue.name} 확인된 사실 정리 — 미확인 항목은 확인 불가로 둡니다.</caption>
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

          {venue.sections.map((s, i) => (
            <section key={i}>
              <h2>{s.h2}</h2>
              {s.body.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </section>
          ))}

          <section>
            <h2>{venue.closing.h2}</h2>
            {venue.closing.body.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
            <p className="bk-kw">{kwClose(venue.name, venue.slug)}</p>
          </section>

          <section className="bk-faq">
            <h2>{venue.name} 부킹 자주 묻는 질문</h2>
            {venue.faq.map((it, i) => (
              <div className="bk-card" key={i}>
                <h3>Q. {it.q}</h3>
                <p>{it.a}</p>
              </div>
            ))}
          </section>

          <div className="bk-oneline">
            <b>한 줄 정리</b>
            {venue.oneline}
          </div>
        </article>

        <aside className="bk-related" aria-label="함께 보면 좋은 부킹 안내">
          <h2>함께 보면 좋은 부킹 안내</h2>
          <ul>
            {related.map((r) => (
              <li key={r.slug}>
                <a href={bookingPath(r.slug)}>
                  {r.name}
                  <span>{r.region}</span>
                </a>
              </li>
            ))}
            {/* ★ 2026-08-25 — 주소를 손으로 조립하지 않는다.
                 주소교체로 night 슬러그가 바뀌었는데 여기 값이 낡아 있어
                 링크 4개가 404 였다(2026-08-25 실측).
                 이제 night 쪽에 실제로 있는 가게일 때만 걸고, 주소는 nightPath() 로만 만든다. */}
            {venue.nightSlug && NIGHT_BY_SLUG[venue.nightSlug] ? (
              <li>
                <a href={nightPath(venue.nightSlug)}>
                  {venue.name} 위치·이용 안내
                  <span>같은 업소의 기본 정보 페이지</span>
                </a>
              </li>
            ) : null}
            <li>
              <a href={BOOKING_BASE}>
                전국 나이트 부킹 안내 40
                <span>지역별 전체 목록 보기</span>
              </a>
            </li>
          </ul>
        </aside>

        <p className="bk-note">
          이 페이지는 나이트클럽의 부킹 흐름과 매너를 정리한 안내 문서입니다. 주소, 층,
          영업시간처럼 공개 자료로 교차 확인되지 않은 항목은 추측해서 적지 않고 확인 불가로
          두었습니다. 본문에서 다루는 부킹 흐름은 나이트클럽 일반의 진행 방식이며, 실제 운영
          방침은 업소마다 다를 수 있습니다.
          {venue.contact
            ? " 정확한 내용은 위 문의처로 확인해 주세요."
            : " 이 페이지에는 손님 응대용 연락처가 등록되어 있지 않습니다."}
        </p>
      </main>

      <NightFooter />
      <BookingBar venue={venue} />
    </>
  );
}
