import Head from "next/head";

const SITE_URL = "https://changwon2.pages.dev";
const TITLE =
  "창원 룰루랄라 나이트 짱구 솔직 후기 - 상남동 No.1 (마디미로43번길)";
const DESCRIPTION =
  "창원 룰루랄라 나이트 짱구 직통 안내. 상남동 모아엔트몰 지하 3층. 매일 19:00~05:00. 부킹/룸 예약. 19세 이상 성인 영업.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NightClub",
  name: "창원 룰루랄라 나이트클럽",
  alternateName: ["창원 룰루랄라", "룰루랄라 나이트"],
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "마디미로43번길 10, 모아엔트몰 지하 3층",
    addressLocality: "창원시 성산구",
    addressRegion: "경상남도",
    postalCode: "",
    addressCountry: "KR",
  },
  telephone: "+82-10-3854-6887",
  openingHours: "Mo-Su 19:00-05:00",
  areaServed: "창원시",
  publicAccess: false,
  smokingAllowed: true,
  sameAs: [
    "https://www.instagram.com/rulruralra_nightclub_/",
    "https://www.instagram.com/lulu__lala._.cw/",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "창원 룰루랄라 나이트 어디에 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "경상남도 창원시 성산구 마디미로43번길 10, 모아엔트몰 지하 3층입니다.",
      },
    },
    {
      "@type": "Question",
      name: "영업시간은?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "매일 19:00 ~ 다음날 05:00 영업합니다.",
      },
    },
    {
      "@type": "Question",
      name: "부킹 예약은 어떻게?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "짱구 매니저 직통 010-3854-6887로 전화 예약하시면 됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "입장 가능 연령?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "만 19세 이상 성인만 입장 가능합니다.",
      },
    },
    {
      "@type": "Question",
      name: "면적은 얼마나?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "약 457평(1,508.46㎡)으로 창원 최대 규모입니다.",
      },
    },
    {
      "@type": "Question",
      name: "룸 종류는?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "짱구 매니저에게 문의하시면 상세 안내받으실 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "주차 가능한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "모아엔트몰 건물 지하 주차장 이용 가능합니다.",
      },
    },
    {
      "@type": "Question",
      name: "가까운 지하철은?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "창원 상남동 중심부로 대중교통 편리합니다.",
      },
    },
    {
      "@type": "Question",
      name: "단체 예약 가능한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "짱구 매니저 010-3854-6887로 사전 문의 부탁드립니다.",
      },
    },
    {
      "@type": "Question",
      name: "영업 허가는 정상?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "행정안전부 영업허가번호 5670140-102-2019-00002, 2019년부터 정상 영업 중입니다.",
      },
    },
    {
      "@type": "Question",
      name: "인스타 계정은?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "@rulruralra_nightclub_ 또는 @lulu__lala._.cw 팔로우 가능합니다.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index,follow" />
        <meta name="rating" content="adult" />
        <meta
          name="keywords"
          content="창원 룰루랄라 나이트, 창원 룰루랄라, 룰루랄라 나이트, 짱구, 창원 나이트, 상남동 나이트, 마디미로43번길, 모아엔트몰"
        />
        <link rel="canonical" href={SITE_URL + "/"} />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={SITE_URL + "/"} />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:site_name" content="창원 룰루랄라 나이트클럽" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </Head>

      <header className="hero">
        <div className="hero-inner">
          <span className="eyebrow">CHANGWON · SANGNAM-DONG</span>
          <h1>
            창원 룰루랄라 나이트 짱구 솔직 후기 - 상남동 No.1
            (마디미로43번길)
          </h1>
          <p className="lead">
            창원에서 진짜 놀 만한 데를 찾고 계신 분께. 상남동 한복판,
            모아엔트몰 지하 3층에 있는 창원 룰루랄라 나이트를 다녀온 솔직한
            후기를 한 페이지에 정리했습니다. 매니저 짱구 직통 번호는 글
            마지막에 다시 한 번 적어두었으니 끝까지 봐주세요.
          </p>

          <div className="cta">
            <a className="btn btn-primary" href="tel:01038546887">
              짱구 직통 010-3854-6887
            </a>
            <a
              className="btn btn-ghost"
              href="https://www.instagram.com/rulruralra_nightclub_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              인스타 @rulruralra_nightclub_
            </a>
          </div>

          <div className="fact-card">
            <dl>
              <dt>상호</dt>
              <dd>창원 룰루랄라 나이트클럽</dd>
              <dt>주소</dt>
              <dd>
                경상남도 창원시 성산구 마디미로43번길 10 (상남동 22-4)
                모아엔트몰 지하 3층
              </dd>
              <dt>영업</dt>
              <dd>매일 19:00 ~ 다음날 05:00</dd>
              <dt>면적</dt>
              <dd>457.1평 (1,508.46㎡)</dd>
              <dt>허가</dt>
              <dd>5670140-102-2019-00002 (행정안전부)</dd>
              <dt>연령</dt>
              <dd>만 19세 이상 성인 입장</dd>
            </dl>
          </div>
        </div>
      </header>

      <main className="wrap">
        <section>
          <h2>위치 - 창원 상남동 한복판</h2>
          <p>
            창원 룰루랄라 나이트 주소는 경상남도 창원시 성산구 마디미로43번길
            10이고, 지번 주소로는 상남동 22-4입니다. 모아엔트몰 건물 지하
            3층 전체를 쓰고 있어서 입구 찾기가 어렵지 않습니다. 상남동 메인
            거리 안쪽이라 1차 끝나고 도보로 넘어오기 좋은 위치고, 차로 오시는
            분은 모아엔트몰 지하 주차장을 그대로 이용하시면 됩니다. 창원시청에서
            차로 5분, KTX 창원역에서 차로 15분 정도 거리라 외지에서 오시는
            분들도 동선이 단순합니다.
          </p>

          <div className="gallery">
            <img
              className="ph wide"
              src="/images/1-exterior.svg"
              alt="창원 룰루랄라 나이트 모아엔트몰 외관"
              width={1600}
              height={900}
              loading="lazy"
            />
            <img
              className="ph"
              src="/images/2-mainhall.svg"
              alt="창원 룰루랄라 나이트 메인홀 457평"
              width={1200}
              height={900}
              loading="lazy"
            />
            <img
              className="ph"
              src="/images/3-room.svg"
              alt="창원 룰루랄라 나이트 프라이빗 룸"
              width={1200}
              height={900}
              loading="lazy"
            />
            <img
              className="ph"
              src="/images/4-dj.svg"
              alt="창원 룰루랄라 나이트 DJ 부스"
              width={1200}
              height={900}
              loading="lazy"
            />
            <img
              className="ph"
              src="/images/5-bar.svg"
              alt="창원 룰루랄라 나이트 바 카운터"
              width={1200}
              height={900}
              loading="lazy"
            />
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
            ※ 일러스트형 플레이스홀더. 실제 매장 사진은 받는 대로 교체 예정.
          </p>
        </section>

        <section>
          <h2>매장 규모 - 약 457평, 창원 최대 규모</h2>
          <p>
            창원 룰루랄라 나이트의 매장 면적은 457.1평(1,508.46㎡)으로, 창원
            시내 나이트클럽 중에서도 가장 큰 축에 듭니다. 메인 홀이 워낙 넓어서
            평일 저녁에도 답답하다는 느낌이 없고, 주말 골든타임에 사람이 가득
            차도 동선이 막히지 않습니다. 천장이 높아서 사운드가 위에서 묵직하게
            떨어지는 느낌이 좋고, 룸과 메인 홀이 자연스럽게 이어져 있어서
            일행끼리 흩어졌다 다시 모이기 편한 구조입니다.
          </p>
        </section>

        <section>
          <h2>영업시간 - 매일 저녁 7시부터 새벽 5시까지</h2>
          <p>
            창원 룰루랄라 나이트는 매일 19:00부터 다음날 05:00까지 영업합니다.
            휴무일 따로 없고, 명절 연휴에도 정상 영업합니다. 영업허가번호
            5670140-102-2019-00002로 행정안전부에 정식 등록된 합법 영업장이라
            안심하고 방문하셔도 됩니다. 2019년 11월 13일 오픈 이후 같은 자리에서
            꾸준히 운영 중이고, 만 19세 이상 성인만 입장이 가능합니다. 신분증
            꼭 챙겨오세요.
          </p>
        </section>

        <section>
          <h2>매니저 짱구 - 직통 010-3854-6887</h2>
          <p>
            창원 룰루랄라 나이트에서 가장 많이 찾는 매니저가 바로 짱구입니다.
            손님 한 명 한 명 챙기는 스타일이라, 처음 오시는 분도 어색하지 않게
            자리부터 부킹까지 흐름을 잡아줍니다. 단골손님이 많은 이유가 따로
            있는 게 아니라, 그날 그날 분위기를 읽고 맞는 자리로 안내해주기
            때문입니다. 자리 잡기 어려운 주말 골든타임에도 짱구한테 미리 한
            통이면 동선이 완전히 달라집니다. 짱구 직통은 010-3854-6887이고,
            카톡보다는 전화가 가장 빠릅니다.
          </p>
        </section>

        <section>
          <h2>분위기와 음악</h2>
          <p>
            창원 룰루랄라 나이트는 최신 EDM, K-팝, 힙합을 그날 분위기에 맞춰
            믹스합니다. DJ 부스가 메인 홀을 정면으로 마주보고 있어서 비트
            떨어질 때 플로어 전체가 한 호흡으로 같이 움직이는 느낌이 좋고,
            조명은 LED 무빙 헤드와 레이저 위주라 사진·영상이 잘 받습니다.
            룸은 조명을 살짝 낮춰서 일행끼리 대화하기에도 편한 톤입니다. 메인
            음악이 너무 셀 때는 룸에서 음량을 따로 조절할 수 있어서, 친구들끼리
            조용히 한잔하다가 메인 홀로 나가는 흐름도 자연스럽습니다.
          </p>
        </section>

        <section>
          <h2>부킹과 룸 안내</h2>
          <p>
            창원 룰루랄라 나이트의 부킹은 짱구 매니저 라인이 가장 빠르고
            정확합니다. 룸 종류와 위치는 인원·연령대·콘셉트에 따라 달라지니,
            미리 짱구에게 인원과 분위기만 알려주시면 그날 자리 중에서 가장
            잘 어울리는 룸으로 매칭해 줍니다. 단체 손님(8명 이상)은 사전
            예약이 사실상 필수이고, 생일·송별·모임 콘셉트에 맞춘 자리 세팅도
            미리 부탁하실 수 있습니다.
          </p>
        </section>

        <section>
          <h2>자리 추천</h2>
          <p>
            처음 오시는 분은 메인 플로어가 잘 보이는 사이드 쪽 룸을 추천합니다.
            분위기 다 보면서 천천히 적응할 수 있고, 부킹 흐름도 자연스럽게
            잡힙니다. 진하게 놀고 싶은 그룹은 DJ 부스 근처 자리가 사운드와
            조명을 가장 진하게 즐길 수 있는 위치고, 일행끼리 대화 위주로
            가시는 분은 안쪽 프라이빗 룸이 베스트입니다. 어떤 자리든 짱구
            010-3854-6887로 미리 잡고 가시는 게 가장 확실합니다.
          </p>
          <p>
            <span className="tag">#창원나이트</span>
            <span className="tag">#상남동나이트</span>
            <span className="tag">#룰루랄라나이트</span>
            <span className="tag">#짱구매니저</span>
            <span className="tag">#모아엔트몰</span>
          </p>
        </section>

        <section>
          <h2>자주 묻는 질문 (FAQ)</h2>

          <div className="faq-item">
            <p className="faq-q">Q1. 창원 룰루랄라 나이트 어디에 있나요?</p>
            <p className="faq-a">
              경상남도 창원시 성산구 마디미로43번길 10, 모아엔트몰 지하 3층입니다.
            </p>
          </div>

          <div className="faq-item">
            <p className="faq-q">Q2. 영업시간은?</p>
            <p className="faq-a">매일 19:00 ~ 다음날 05:00 영업합니다.</p>
          </div>

          <div className="faq-item">
            <p className="faq-q">Q3. 부킹 예약은 어떻게?</p>
            <p className="faq-a">
              짱구 매니저 직통 010-3854-6887로 전화 예약하시면 됩니다.
            </p>
          </div>

          <div className="faq-item">
            <p className="faq-q">Q4. 입장 가능 연령?</p>
            <p className="faq-a">만 19세 이상 성인만 입장 가능합니다.</p>
          </div>

          <div className="faq-item">
            <p className="faq-q">Q5. 면적은 얼마나?</p>
            <p className="faq-a">
              약 457평(1,508.46㎡)으로 창원 최대 규모입니다.
            </p>
          </div>

          <div className="faq-item">
            <p className="faq-q">Q6. 룸 종류는?</p>
            <p className="faq-a">
              짱구 매니저에게 문의하시면 상세 안내받으실 수 있습니다.
            </p>
          </div>

          <div className="faq-item">
            <p className="faq-q">Q7. 주차 가능한가요?</p>
            <p className="faq-a">
              모아엔트몰 건물 지하 주차장 이용 가능합니다.
            </p>
          </div>

          <div className="faq-item">
            <p className="faq-q">Q8. 가까운 지하철은?</p>
            <p className="faq-a">
              창원 상남동 중심부로 대중교통 편리합니다.
            </p>
          </div>

          <div className="faq-item">
            <p className="faq-q">Q9. 단체 예약 가능한가요?</p>
            <p className="faq-a">
              짱구 매니저 010-3854-6887로 사전 문의 부탁드립니다.
            </p>
          </div>

          <div className="faq-item">
            <p className="faq-q">Q10. 영업 허가는 정상?</p>
            <p className="faq-a">
              행정안전부 영업허가번호 5670140-102-2019-00002, 2019년부터 정상
              영업 중입니다.
            </p>
          </div>

          <div className="faq-item">
            <p className="faq-q">Q11. 인스타 계정은?</p>
            <p className="faq-a">
              @rulruralra_nightclub_ 또는 @lulu__lala._.cw 팔로우 가능합니다.
            </p>
          </div>
        </section>

        <section className="ps">
          <h3 style={{ marginTop: 0 }}>P.S. 짱구 직통 한 번 더</h3>
          <p>
            창원 룰루랄라 나이트 짱구 매니저 직통은{" "}
            <a href="tel:01038546887">010-3854-6887</a>입니다. 부킹·룸·단체
            모두 한 번에 정리되니, 출발 전에 미리 한 통 부탁드립니다.
            인스타그램{" "}
            <a
              href="https://www.instagram.com/rulruralra_nightclub_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @rulruralra_nightclub_
            </a>{" "}
            또는{" "}
            <a
              href="https://www.instagram.com/lulu__lala._.cw/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @lulu__lala._.cw
            </a>
            에서 최근 분위기 사진도 확인할 수 있습니다. 매일 19:00 ~ 05:00
            영업, 만 19세 이상 성인만 입장 가능합니다.
          </p>
          <div className="social">
            <a
              className="btn btn-primary"
              href="tel:01038546887"
              style={{ fontSize: 14, padding: "10px 14px" }}
            >
              📞 010-3854-6887 전화하기
            </a>
          </div>
        </section>

        <footer className="footer">
          <p>
            창원 룰루랄라 나이트클럽 · 경상남도 창원시 성산구 마디미로43번길
            10, 모아엔트몰 지하 3층 · 영업허가 5670140-102-2019-00002
          </p>
          <p>
            본 페이지는 만 19세 이상 성인을 대상으로 하는 합법 유흥주점 안내
            페이지입니다.
          </p>
        </footer>
      </main>
    </>
  );
}
