import Head from "next/head";

const SITE_URL = "https://changwon2.pages.dev";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>페이지를 찾을 수 없습니다 - 창원 룰루랄라 나이트 짱구</title>
        <meta
          name="description"
          content="요청하신 페이지를 찾을 수 없습니다. 창원 룰루랄라 나이트 짱구 매니저 직통은 010-3854-6887, 매일 19:00~05:00 영업, 상남동 모아엔트몰 지하 3층."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={SITE_URL + "/"} />
        <meta property="og:title" content="페이지를 찾을 수 없습니다 - 창원 룰루랄라 나이트" />
        <meta
          property="og:description"
          content="창원 룰루랄라 나이트 짱구 직통 010-3854-6887, 매일 19:00~05:00 영업"
        />
        <meta property="og:url" content={SITE_URL + "/404"} />
        <meta property="og:image" content={SITE_URL + "/images/og-cover.svg"} />
      </Head>
      <main className="wrap">
        <div className="notfound">
          <h1>404 - 페이지를 찾을 수 없습니다</h1>
          <p>
            요청하신 페이지가 이동되었거나 존재하지 않습니다. 창원 룰루랄라
            나이트 메인 페이지에서 매니저 짱구의 직통 번호와 위치, 영업시간을
            확인하실 수 있습니다.
          </p>
          <div className="cta">
            <a className="btn btn-primary" href="/">
              메인 페이지로 돌아가기
            </a>
            <a className="btn btn-ghost" href="tel:01038546887">
              📞 짱구 직통 010-3854-6887
            </a>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            창원 룰루랄라 나이트클럽 · 상남동 모아엔트몰 지하 3층 · 매일 19:00 ~
            05:00 · 만 19세 이상 성인 입장
          </p>
        </div>
      </main>
    </>
  );
}
