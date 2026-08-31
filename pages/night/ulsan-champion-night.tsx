/**
 * 울산챔피언나이트 — /night/ulsan-champion-night/
 *
 * ★ 이 주소는 네이버에 색인된 자산이다. 주소를 바꾸지 않는다(끝 슬래시 포함 글자 그대로).
 *   2026-08-31 이 경로가 404 여서 같은 주소에서 200 으로 되살렸다. 리디렉션은 쓰지 않는다.
 *
 * 사실은 data/shops/ulsan-champion.json 의 verified:true 값만 쓴다.
 *   주소     울산 남구 정동로 75 (삼산동 1559-17) 1층   (verified)
 *   전화     010-5653-0069 · 닉네임 춘자                (verified, 광고주 등록 정보)
 *   영업시간 __TODO__ → 확인 못 했으므로 그 문장을 넣지 않는다
 *   주차     확인 못 했으므로 그 문장을 넣지 않는다
 */
import Head from "next/head";

const 이름 = "울산챔피언나이트";
const 닉 = "춘자";
const 번호 = "010-5653-0069";
const 주소 = "울산 남구 정동로 75 (삼산동 1559-17) 1층";
const 확인일 = "2026-08-31";
const URL = "https://i.nolcool.com/night/ulsan-champion-night/";
const OG = "https://i.nolcool.com/og/night-ulsan-champion-night-og.png";

const TITLE = "울산챔피언나이트 예약부터 입장까지 순서 정리";
const DESC =
  "울산챔피언나이트 예약 전화에서 자리 안내까지, 처음 방문 순서를 한 번에 정리했습니다. " +
  "인원·시간대만 정하면 준비 끝. 문의 010-5653-0069";

const FAQ = [
  {
    q: "예약 없이 가도 되나요?",
    a: "가능합니다. 다만 시간대에 따라 대기가 생길 수 있어, 원하는 자리가 있다면 전화로 미리 잡아 두는 쪽이 편합니다.",
  },
  {
    q: "언제 가는 게 좋나요?",
    a: "영업시간 안이라면 언제든 이용할 수 있습니다. 당일 상황은 바뀔 수 있으니 확실한 안내는 전화로 확인하는 것이 가장 정확합니다.",
  },
  {
    q: "몇 살부터 입장할 수 있나요?",
    a: "만 19세 이상만 이용할 수 있는 업소입니다. 청소년은 출입할 수 없습니다.",
  },
];

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: 이름,
  url: URL,
  image: OG,
  telephone: 번호,
  address: {
    "@type": "PostalAddress",
    addressCountry: "KR",
    addressRegion: "울산",
    addressLocality: "남구",
    streetAddress: "정동로 75 (삼산동 1559-17) 1층",
  },
};

const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function UlsanChampionNightPage() {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
        />
      </Head>

      <style jsx global>{`
        :root {
          --ucn-bg: #0f1426;
          --ucn-card: #161d33;
          --ucn-line: #2a3352;
          --ucn-text: #eef1f8;
          --ucn-dim: #aab3c9;
          --ucn-point: #ffd400;
        }
        body {
          margin: 0;
          background: var(--ucn-bg);
          color: var(--ucn-text);
          font-family: "Malgun Gothic", dotum, sans-serif;
          line-height: 1.75;
          padding-bottom: 88px; /* 고정 전화바가 본문을 가리지 않게 */
        }
        .ucn-wrap {
          max-width: 780px;
          margin: 0 auto;
          padding: 20px 18px 40px;
        }
        .ucn-adlabel {
          display: inline-block;
          background: #fff;
          color: #0f1426;
          font-weight: 700;
          font-size: 13px;
          padding: 4px 12px;
          border-radius: 6px;
        }
        .ucn-rel {
          color: var(--ucn-dim);
          font-size: 13px;
          margin: 10px 0 0;
        }
        .ucn-wrap h1 {
          font-size: 27px;
          line-height: 1.4;
          margin: 16px 0 10px;
        }
        .ucn-answer {
          background: var(--ucn-card);
          border: 1px solid var(--ucn-line);
          border-left: 5px solid var(--ucn-point);
          border-radius: 10px;
          padding: 16px 18px;
          margin: 18px 0;
        }
        .ucn-facts {
          width: 100%;
          border-collapse: collapse;
          margin: 18px 0;
          font-size: 15px;
        }
        .ucn-facts th,
        .ucn-facts td {
          border: 1px solid var(--ucn-line);
          padding: 11px 13px;
          text-align: left;
          vertical-align: top;
        }
        .ucn-facts th {
          background: var(--ucn-card);
          color: var(--ucn-dim);
          width: 34%;
          font-weight: 600;
          white-space: nowrap;
        }
        .ucn-wrap h2 {
          font-size: 20px;
          margin: 30px 0 8px;
          padding-top: 14px;
          border-top: 1px solid var(--ucn-line);
        }
        .ucn-faq dt {
          font-weight: 700;
          margin: 16px 0 4px;
        }
        .ucn-faq dd {
          margin: 0;
          color: var(--ucn-dim);
        }
        .ucn-sum {
          background: var(--ucn-card);
          border: 1px solid var(--ucn-line);
          border-radius: 10px;
          padding: 15px 17px;
          margin: 26px 0 0;
        }
        .ucn-foot {
          margin: 26px 0 0;
          padding-top: 16px;
          border-top: 1px solid var(--ucn-line);
          color: var(--ucn-dim);
          font-size: 13px;
        }
        .ucn-foot b {
          color: var(--ucn-point);
          font-size: 19px;
        }
        .ucn-callbar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--ucn-point);
          z-index: 50;
        }
        .ucn-callbar a {
          display: block;
          text-align: center;
          padding: 18px 12px;
          color: #0f1426;
          font-size: 19px;
          font-weight: 800;
          text-decoration: none;
          letter-spacing: -0.3px;
        }
        @media (max-width: 480px) {
          .ucn-wrap h1 {
            font-size: 23px;
          }
          .ucn-callbar a {
            font-size: 17px;
            padding: 16px 10px;
          }
        }
      `}</style>

      <main className="ucn-wrap">
        <span className="ucn-adlabel">광고</span>
        <p className="ucn-rel">광고 · 업소 제공 정보 · 확인일 {확인일}</p>

        <h1>{TITLE}</h1>
      {/* 본문 그림 — og:image 와 같은 파일 (2026-08-31). 네이버는 본문에 그림이 있는 문서를 더 잘 집어 간다. 첫 그림이라 lazy 를 붙이지 않는다. */}
      <figure style={{ margin: "0 0 18px" }}>
        <img src="/og/night-ulsan-champion-night-og.png" alt="울산 챔피언 나이트 안내" width={1200} height={1200} decoding="async"
             style={{ width: "100%", maxWidth: 420, height: "auto", borderRadius: 12, display: "block" }} />
      </figure>

        <div className="ucn-answer">
          {이름} 예약은 전화 한 통이면 끝납니다. 인원과 방문 시간대만 정해서 말하면, 도착했을 때
          자리 안내까지 바로 이어집니다. 예약·문의: {닉} {번호}
        </div>

        <table className="ucn-facts">
          <tbody>
            <tr>
              <th>상호</th>
              <td>{이름}</td>
            </tr>
            <tr>
              <th>위치</th>
              <td>{주소}</td>
            </tr>
            <tr>
              <th>예약·문의</th>
              <td>
                {번호} ({닉})
              </td>
            </tr>
            <tr>
              <th>이용 연령</th>
              <td>만 19세 이상 이용 가능 업소(청소년 출입·고용 금지)</td>
            </tr>
            <tr>
              <th>정보 확인일</th>
              <td>{확인일}</td>
            </tr>
          </tbody>
        </table>

        <h2>전화할 때 이 세 가지만 말하면 됩니다</h2>
        <p>
          첫째는 인원입니다. 몇 명이 오는지에 따라 준비되는 자리가 달라집니다. 둘째는 도착
          시간대입니다. 같은 날이라도 시간대에 따라 안내 가능한 자리가 다르기 때문에, 대략이라도
          말해 두면 기다림이 줄어듭니다. 셋째는 선호 자리입니다. 무대가 잘 보이는 쪽이 좋은지,
          이야기 나누기 편한 안쪽이 좋은지 미리 말하면 그 기준으로 잡아 줍니다.
        </p>
        <p>
          세 가지가 아직 정해지지 않았어도 괜찮습니다. 통화하면서 정해도 되고, 변경이 생기면 같은
          번호로 다시 알려 주면 됩니다.
        </p>

        <h2>도착부터 자리까지</h2>
        <p>
          위치는 울산 남구 삼산동입니다. 입구에서 예약할 때 남긴 이름을 말하면 확인 후 바로 자리로
          안내받습니다. 예약 없이 왔다면 입구에서 인원을 말하고 안내 가능한 자리를 확인하면 됩니다.
        </p>
        <p>
          일행이 나뉘어 도착할 때는 먼저 온 분이 이름을 말해 두면 됩니다. 나중에 오는 분도 같은
          이름을 대면 안내를 받을 수 있어, 입구에서 서로 기다리며 시간을 쓰지 않아도 됩니다.
          도착이 늦어질 것 같으면 전화로 한 번 알려 두는 편이 서로 편합니다.
        </p>
        <p>
          차를 가져오실지 대중교통을 이용하실지는 미리 정해 두시는 편이 좋습니다. 특히 돌아가는
          방법을 먼저 정해 두면 마무리가 훨씬 수월합니다. 술을 드셨다면 운전대는 잡지 마십시오.
        </p>

        <h2>자리에 앉은 다음 흐름</h2>
        <p>
          자리에 앉으면 담당 직원이 인사를 하고 이용 순서를 안내합니다. 궁금한 것은 그 자리에서 바로
          물어보면 됩니다. 자리를 옮기고 싶거나 인원이 늘었을 때도 직원에게 말하면 가능한 범위에서
          조정해 줍니다. 처음이라 순서를 몰라도 안내를 따라가면 되기 때문에 미리 외울 것은 없습니다.
        </p>
        <p>
          옷차림은 지나치게 편한 차림만 아니면 대체로 무리가 없습니다. 겉옷은 맡기시면 움직이기
          편합니다. 소지품은 자리에 두기보다 몸에 지니시는 쪽이 안전합니다. 이런 부분도 처음
          안내받을 때 함께 물어보시면 그 자리에서 알려 드립니다.
        </p>
        <p>
          중간에 자리를 비우실 때는 담당 직원에게 한마디 남겨 두시면 좋습니다. 돌아오셨을 때
          자리를 다시 찾기 쉽고, 일행이 늘거나 줄었을 때도 안내가 빨라집니다.
        </p>

        <h2>미리 알아 두면 좋은 것</h2>
        <p>
          인원이 많을수록 한 번에 붙은 자리를 잡기가 어려워집니다. 여덟 명이 넘어갈 것 같으면
          전화할 때 그 점을 먼저 말해 두시는 편이 좋습니다. 나눠 앉게 되더라도 가까운 자리로
          잡아 주기 때문에, 미리 말해 두면 현장에서 당황할 일이 줄어듭니다.
        </p>
        <p>
          시간대에 따라 붐비는 정도가 다릅니다. 조용히 이야기하고 싶다면 이른 시간대가 낫고,
          분위기가 오른 뒤를 보고 싶다면 조금 늦게 오시는 편이 맞습니다. 어느 쪽이 좋은지
          모르겠다면 통화할 때 물어보십시오. 그날 상황을 아는 사람이 안내해 줍니다.
        </p>
        <p>
          결제 방법이나 이용 순서처럼 현장에서 정해지는 부분은 자리에 앉은 뒤 안내받으시면
          됩니다. 미리 알고 가고 싶은 것이 있으면 통화 중에 함께 물어보시면 됩니다.
        </p>
        <p>
          기념일이나 모임처럼 이유가 있는 방문이라면 그것도 말해 두십시오. 자리를 잡을 때
          참고가 됩니다. 특별한 준비를 요청하는 것이 아니라, 어떤 자리가 어울릴지 판단하는 데
          도움이 된다는 뜻입니다. 말하기 어려우면 굳이 밝히지 않으셔도 됩니다.
        </p>

        <h2>이런 분께 맞습니다</h2>
        <p>
          처음 방문이라 순서부터 알고 싶은 분, 모임 인원이 정해져서 자리를 미리 잡고 싶은 분, 전화 한
          번으로 준비를 끝내고 싶은 분에게 맞는 방법입니다. 이곳은 예약 통화에서 자리 안내까지 한
          사람이 이어서 챙기는 방식이라, 중간에 설명이 끊기지 않습니다.
        </p>

        <h2>자주 묻는 것</h2>
        <dl className="ucn-faq">
          {FAQ.map((f) => (
            <div key={f.q}>
              <dt>Q. {f.q}</dt>
              <dd>A. {f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="ucn-sum">
          한 줄 정리 — 방문 준비는 인원·시간대·선호 자리 세 가지를 정해 담당 {닉} 에게
          전화하는 것으로 끝납니다. 번호는 위 표에 있습니다.
        </div>

        <div className="ucn-foot">
          만 19세 이상 이용 가능 업소(청소년 출입·고용 금지)입니다.
          <br />
          영업 사정에 따라 안내 내용은 변동될 수 있습니다. 방문 전 전화로 확인해 주십시오.
          <br />
          광고문의 카톡 <b>besta12</b>
        </div>
      </main>

      <div className="ucn-callbar" role="complementary" aria-label="전화 연결">
        <a href={`tel:${번호}`}>
          📞 {이름} 예약 · {닉} {번호}
        </a>
      </div>
    </>
  );
}
