import type { GetStaticPaths, GetStaticProps } from "next";
import NightHead from "@/components/night/NightHead";
import NightStyles from "@/components/night/NightStyles";
import NightFooter from "@/components/night/NightFooter";
import CallBar from "@/components/night/CallBar";
import {
  VENUES,
  VENUE_BY_SLUG,
  nightPath,
  NIGHT_BASE,
  type Venue,
} from "@/lib/night/venues";
import {
  breadcrumbSchema,
  faqPageSchema,
  nightClubSchema,
  ogImagePath,
} from "@/lib/night/seo";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: VENUES.map((v) => ({ params: { slug: v.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ venue: Venue }> = async (ctx) => {
  const slug = String(ctx.params?.slug);
  const venue = VENUE_BY_SLUG[slug];
  if (!venue) return { notFound: true };
  return { props: { venue } };
};

export default function NightVenuePage({ venue }: { venue: Venue }) {
  const path = nightPath(venue.slug);
  const related = venue.related
    .map((s) => VENUE_BY_SLUG[s])
    .filter(Boolean) as Venue[];

  return (
    <>
      <NightHead
        title={venue.title}
        description={venue.description}
        path={path}
        image={ogImagePath(venue.slug)}
        imageAlt={venue.ogAlt}
        jsonLd={[nightClubSchema(venue), faqPageSchema(venue), breadcrumbSchema(venue)]}
      />
      <NightStyles />

      <div className="night-top">
        <a href="/">홈</a>
        <a href={NIGHT_BASE}>나이트 목록</a>
      </div>

      <main className="night-wrap">
        <nav aria-label="Breadcrumb" className="night-crumb">
          <ol>
            <li>
              <a href="/">홈</a>
            </li>
            <li>
              <a href={NIGHT_BASE}>나이트</a>
            </li>
            <li aria-current="page">{venue.name}</li>
          </ol>
        </nav>

        <h1>{venue.name}</h1>

        <div className="answer-box">
          <p>{venue.answer}</p>
        </div>

        <ul className="night-facts">
          <li>
            <b>지역</b>
            <span>{venue.region}</span>
          </li>
          <li className={venue.ageBadge ? "night-age" : undefined}>
            <b>출입 연령</b>
            <span>{venue.ageBadge ?? "성인 · 신분증 확인"}</span>
          </li>
          <li>
            <b>상세 주소</b>
            <span>{venue.addressVerified ? venue.region : "확인 불가"}</span>
          </li>
          <li>
            <b>{venue.contact ? "문의" : "광고·제휴 입점 문의"}</b>
            <span>
              {venue.contact
                ? `${venue.contact.nick} ${venue.contact.phone}`
                : "카카오톡 besta12"}
            </span>
          </li>
        </ul>

        {venue.sections.map((s, i) => (
          <section key={i}>
            <h2>{s.h2}</h2>
            {s.body.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </section>
        ))}

        <section className="night-related">
          <h2>같이 보면 좋은 지역 안내</h2>
          <ul>
            {related.map((r) => (
              <li key={r.slug}>
                <a href={nightPath(r.slug)}>
                  {r.name} — {r.region}
                </a>
              </li>
            ))}
            <li>
              <a href={NIGHT_BASE}>전체 목록 보기</a>
            </li>
          </ul>
        </section>

        <p className="night-note">
          이 페이지는 업소 정보를 정리해 제공하는 안내 문서입니다. 영업시간, 가격, 상세
          번지처럼 공개 자료로 확인되지 않은 항목은 추측해서 적지 않고 비워 두었습니다.
          {venue.contact
            ? " 정확한 내용은 위 문의처로 확인해 주세요."
            : " 이 페이지에는 손님 응대용 연락처가 등록되어 있지 않습니다."}
        </p>
      </main>

      <NightFooter />
      <CallBar venue={venue} />
    </>
  );
}
