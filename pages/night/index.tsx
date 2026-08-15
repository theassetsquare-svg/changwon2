import NightHead from "@/components/night/NightHead";
import NightStyles from "@/components/night/NightStyles";
import NightFooter from "@/components/night/NightFooter";
import { SITE_URL } from "@/lib/site";
import { VENUES, nightPath, NIGHT_BASE, AD_KAKAO } from "@/lib/night/venues";
import { ogImagePath } from "@/lib/night/seo";

const TITLE = "전국 나이트 업소 안내 목록";
const DESCRIPTION =
  "서울·경기·충청·영남 13개 나이트 업소의 위치와 이용 안내를 지역별로 정리한 목록입니다. 출입 연령 기준이 따로 있는 업소는 목록에서 바로 확인할 수 있습니다.";

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: TITLE,
  itemListElement: VENUES.map((v, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: v.name,
    url: SITE_URL + nightPath(v.slug),
  })),
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL + "/" },
    { "@type": "ListItem", position: 2, name: "나이트", item: SITE_URL + NIGHT_BASE },
  ],
};

export default function NightIndex() {
  return (
    <>
      <NightHead
        title={TITLE}
        description={DESCRIPTION}
        path={NIGHT_BASE}
        image={ogImagePath("index")}
        imageAlt="전국 나이트 업소 안내 목록 카드"
        jsonLd={[itemListSchema, breadcrumb]}
      />
      <NightStyles />

      <div className="night-top">
        <a href="/">홈</a>
      </div>

      <main className="night-wrap">
        <nav aria-label="Breadcrumb" className="night-crumb">
          <ol>
            <li>
              <a href="/">홈</a>
            </li>
            <li aria-current="page">나이트</li>
          </ol>
        </nav>

        <h1>전국 나이트 업소 안내</h1>

        <div className="answer-box">
          <p>
            서울과 경기, 충청, 영남 지역 13개 나이트 업소의 위치와 이용 안내를 지역 단위로
            정리한 목록입니다. 확인되지 않은 주소나 영업시간은 싣지 않으며, 출입 연령 기준이
            별도로 있는 업소는 목록에 표시해 두었습니다.
          </p>
        </div>

        <ul className="night-list">
          {VENUES.map((v) => (
            <li key={v.slug}>
              <a href={nightPath(v.slug)}>
                <strong>{v.name}</strong>
                <span>
                  {v.region}
                  {v.ageBadge ? ` · ${v.ageBadge}` : ""}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="night-note">
          업소를 운영하시는 사장님의 광고·제휴 입점 문의는 카카오톡 {AD_KAKAO} 로 받습니다.
          손님 예약이나 이용 문의를 받는 채널이 아닙니다.
        </p>
      </main>

      <NightFooter />

      <div className="callbar" role="complementary" aria-label="광고 제휴 문의">
        <span>
          광고·제휴 입점 문의 카톡 <b>{AD_KAKAO}</b>
        </span>
      </div>
    </>
  );
}
