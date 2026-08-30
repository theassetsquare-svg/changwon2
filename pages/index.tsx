import Head from "next/head";
import type { GetStaticProps } from "next";
import { SITE_URL } from "@/lib/site";

const PATH = "/";
const TITLE = "새벽 4시 40분 — 무너진 자리에서 다시 일어선 세 사람의 기록";
const DESCRIPTION =
  "재능도 운도 아니었다. 바닥에서 다시 시작한 세 사람이 공통으로 지켜낸 것은 딱 하나였다. 끝까지 읽고 나면 오늘 밤이 조금 달라지는 이야기.";
const PUBLISHED = "2026-08-18";

export const getStaticProps: GetStaticProps<{ dateModified: string }> = async () => ({
  props: { dateModified: new Date().toISOString().slice(0, 10) },
});

const CSS = `
.story-root{
  min-height:100vh;
  background:
    radial-gradient(1100px 620px at 50% -8%, rgba(124,77,255,.16), transparent 62%),
    radial-gradient(900px 520px at 92% 8%, rgba(255,46,166,.10), transparent 60%),
    #08060d;
  color:#efe9f7;
  padding:clamp(38px,8vw,96px) 20px clamp(64px,10vw,120px);
  -webkit-font-smoothing:antialiased;
}
.story{
  max-width:720px;margin:0 auto;
  font-family:"Pretendard","Apple SD Gothic Neo","Noto Sans KR",system-ui,-apple-system,"Malgun Gothic",sans-serif;
  font-size:clamp(17px,1.15rem,19px);
  line-height:2.0;
  letter-spacing:-.01em;
  word-break:keep-all;
}
.story .kicker{
  display:block;font-size:.78rem;letter-spacing:.28em;text-transform:uppercase;
  color:#b79bff;margin-bottom:18px;font-weight:700;
}
.story h1{
  font-size:clamp(1.85rem,6.2vw,2.9rem);
  line-height:1.32;font-weight:800;letter-spacing:-.035em;
  margin:0 0 20px;color:#fff;
}
.story h1 em{
  font-style:normal;
  background:linear-gradient(100deg,#ff6fc0,#b98bff 55%,#6fd6ff);
  -webkit-background-clip:text;background-clip:text;color:transparent;
}
.story .standfirst{
  font-size:clamp(1.02rem,3.6vw,1.16rem);color:#c9bce0;line-height:1.95;
  margin:0 0 34px;padding-bottom:30px;border-bottom:1px solid rgba(255,255,255,.12);
}
.story h2{
  font-size:clamp(1.24rem,4.4vw,1.55rem);font-weight:800;color:#fff;
  letter-spacing:-.03em;line-height:1.45;
  margin:56px 0 18px;padding-top:8px;
}
.story h2 .no{
  display:block;font-size:.72rem;letter-spacing:.24em;color:#ff86c9;
  font-weight:700;margin-bottom:9px;
}
.story p{margin:0 0 22px;color:#e4dcf2;}
.story p.tight{margin-bottom:12px;}
.story strong{color:#fff;font-weight:700;}
.story .mark{
  color:#fff;font-weight:700;
  box-shadow:inset 0 -.52em 0 rgba(255,46,166,.22);
}
.story blockquote{
  margin:34px 0;padding:22px 24px;
  border-left:3px solid #ff2ea6;
  background:rgba(255,255,255,.045);
  border-radius:0 14px 14px 0;
  font-size:clamp(1.05rem,3.8vw,1.22rem);
  line-height:1.85;color:#fff;font-weight:600;letter-spacing:-.02em;
}
.story blockquote span{display:block;margin-top:10px;font-size:.9rem;font-weight:500;color:#b6a6d0;}
.story hr{
  border:0;height:1px;margin:52px auto;width:120px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);
}
.story ol.rules{list-style:none;margin:26px 0 8px;padding:0;counter-reset:r;}
.story ol.rules li{
  counter-increment:r;position:relative;
  padding:18px 20px 18px 60px;margin-bottom:14px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.09);
  border-radius:14px;line-height:1.85;
}
.story ol.rules li::before{
  content:counter(r);
  position:absolute;left:20px;top:17px;
  width:26px;height:26px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:.82rem;font-weight:800;color:#0a0410;
  background:linear-gradient(135deg,#ffd166,#ff2ea6);
}
.story ol.rules li b{display:block;color:#fff;font-size:1.02rem;margin-bottom:4px;letter-spacing:-.02em;}
.story .close{
  margin-top:58px;padding:28px 24px;
  border:1px solid rgba(255,255,255,.14);border-radius:18px;
  background:linear-gradient(180deg,rgba(124,77,255,.14),rgba(255,46,166,.07));
}
.story .close p:last-child{margin-bottom:0;}
.story .sign{
  margin-top:44px;text-align:center;color:#9c8cba;font-size:.86rem;letter-spacing:.04em;
}
@media (max-width:480px){
  .story{line-height:1.95;}
  .story blockquote{padding:18px 18px;}
}
`;

const OG_IMAGE = SITE_URL + "/og/index-og.png";

export default function Home({ dateModified }: { dateModified: string }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    inLanguage: "ko",
    datePublished: PUBLISHED,
    dateModified,
    mainEntityOfPage: { "@type": "WebPage", "@id": SITE_URL + PATH },
    author: { "@type": "Person", name: "기록하는 사람" },
  };

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta name="theme-color" content="#08060d" />
        <link rel="canonical" href={SITE_URL + PATH} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={SITE_URL + PATH} />
        <meta property="og:locale" content="ko_KR" />
        {/* ★ 2026-08-25 — 홈에 썸네일이 아예 없었다.
            홈은 이 사이트에서 제일 중요한 페이지인데, 네이버·카카오가 미리보기를 못 만들고
            검색 결과에도 그림 없이 나온다. 그림 파일(public/og/index-og.png)은 이미 있었는데
            연결만 빠져 있었다. 1200x1200 확인함.
            네이버는 상대경로 og:image 를 못 읽으므로 반드시 전체 주소로 넣는다. */}
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:secure_url" content={OG_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:image:alt" content={TITLE} />
        {/* 네이버 썸네일 수집용 */}
        <meta name="thumbnail" content={OG_IMAGE} />
        {/* 1:1 그림이라 summary. summary_large_image 는 좌우가 잘린다. */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <link rel="icon" href="/favicon.ico" />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      </Head>

      <div className="story-root">
        <article className="story">
          <span className="kicker">TRUE STORY · 읽는 데 7분</span>

          <h1>
            새벽 4시 40분,
            <br />
            <em>무너진 자리</em>에서
            <br />
            다시 일어선 세 사람
          </h1>

          <p className="standfirst">
            이 글에는 유명한 사람이 한 명도 나오지 않습니다. 상장한 회사도, 억대 연봉도, 벤츠 키를
            흔드는 장면도 없습니다. 대신 아무도 보지 않는 시간에 혼자 셔터를 올렸던 사람들이 나옵니다.
            저는 성공에 관한 어떤 강연보다 이 세 사람의 하루가 정확하다고 믿습니다. 끝까지 읽어 주세요.
            마지막 문단은 지금 힘든 당신을 위해 남겨 두었습니다.
          </p>

          <p>
            세상에서 가장 조용한 시간은 새벽 4시 40분입니다. 술자리는 끝났고, 마지막 택시는 떠났고,
            첫차는 아직 오지 않은 그 20분. 이 시간에 깨어 있는 사람은 두 부류입니다. 아직 어제를
            끝내지 못한 사람과, 남보다 오늘을 먼저 시작한 사람. 이상하게도 이 둘은 대개 같은
            사람이었습니다.
          </p>
          <p>
            저는 그 시간에 도시를 자주 걸었습니다. 그러다 늘 같은 자리에서 불이 켜지는 창문 몇 개를
            알게 됐습니다. 이건 그 창문 뒤에 있던 사람들의 이야기입니다.
          </p>

          <h2>
            <span className="no">STORY ONE</span>
            3년치 계산기를 버린 국밥집 사장
          </h2>
          <p>
            그는 마흔둘에 가게를 열었습니다. 퇴직금 전부와 형에게 빌린 돈으로. 개업 첫날 손님은
            열한 명이었고, 그중 넷은 친구였습니다. 셋째 달에 그는 계산기를 하나 샀습니다. 매일 문을
            닫고 나면 그날 매출에서 재료비, 월세, 가스비, 카드 수수료를 빼고 남은 숫자를 노트에
            적었습니다. <strong>연속 197일 동안 그 숫자는 마이너스였습니다.</strong>
          </p>
          <p>
            198일째 되는 밤, 그는 계산기를 쓰레기통에 버렸습니다. 포기해서가 아니었습니다. 그의
            말은 이랬습니다.
          </p>
          <blockquote>
            “숫자를 보면 내일 국물 맛이 달라지더라고요. 아까워서 뼈를 덜 넣게 되고, 손이 줄고,
            그러면 손님이 먼저 알아요. 그래서 그날부터 숫자는 한 달에 한 번만 보기로 했습니다.
            나머지 스물아홉 날은 국물만 봤어요.”
            <span>— 개업 8년 차, 지금은 새벽 5시에 줄이 서는 가게</span>
          </blockquote>
          <p>
            결과부터 말하면 그는 성공했습니다. 그런데 그가 바꾼 건 메뉴도, 인테리어도, 광고도
            아니었습니다. <span className="mark">자기가 매일 무엇을 쳐다볼지</span>를 바꿨을
            뿐입니다. 사람은 자기가 매일 보는 것을 닮습니다. 통장 잔고를 매일 보면 잔고를 닮은
            사람이 되고, 만드는 물건을 매일 보면 그 물건을 닮은 사람이 됩니다. 이건 정신승리가
            아니라 실무 전략입니다.
          </p>

          <hr />

          <h2>
            <span className="no">STORY TWO</span>
            마흔일곱 번 떨어진 스물아홉의 방
          </h2>
          <p>
            두 번째 사람은 스물아홉의 여성이었습니다. 지방대 졸업, 전공 무관 지원, 서류 탈락
            마흔일곱 번. 마흔일곱 번째 불합격 메일을 받은 날, 그는 엄마에게 “나 진짜 안 되나 봐”라고
            문자를 보내려다 지웠습니다. 대신 A4 한 장을 꺼내 <strong>떨어진 회사 47곳의 이름을 전부
            적었습니다.</strong> 그리고 각 이름 옆에 한 줄씩 썼습니다. “여긴 왜 나를 안 뽑았을까.”
          </p>
          <p className="tight">
            서른 개쯤 쓰고 나니 같은 문장이 반복되고 있었습니다.
          </p>
          <p>
            <em>“내가 무엇을 잘하는지 이 사람들은 알 방법이 없었다.”</em> 그는 자기 실력을 증명한
            적이 한 번도 없었습니다. 증명하겠다고 말했을 뿐이었습니다. 그래서 그는 취업 준비를
            멈추고 90일 동안 딱 하나만 했습니다. 지원하고 싶은 업계의 실제 문제를 하나 골라, 아무도
            시키지 않은 결과물을 혼자 만들어 인터넷에 올린 것입니다. 조회수 200이 안 되는 글
            열두 편. 그중 아홉 번째 글을 읽은 사람이 메일을 보냈습니다.
          </p>
          <blockquote>
            “이력서는 나를 설명하는 종이였고, 그 글들은 나를 보여주는 증거였어요. 세상은 설명을
            믿지 않지만 증거는 못 이기더라고요.”
          </blockquote>
          <p>
            지금 그는 그 업계에서 6년째 일합니다. 후배들에게 늘 같은 말을 합니다.
            <strong> 이력서를 쉰 번 고치는 시간에, 아무도 안 시킨 결과물 하나를 만들어라.</strong>
            떨어진 마흔일곱 번은 실패가 아니라, 방향이 틀렸다는 걸 마흔일곱 번 알려준 알람이었습니다.
          </p>

          <hr />

          <h2>
            <span className="no">STORY THREE</span>
            하루 11분, 1,400일
          </h2>
          <p>
            세 번째 사람은 지금 마흔여섯입니다. 그는 서른아홉에 이혼했고, 마흔에 몸무게가 103kg,
            마흔하나에 회사에서 밀려났습니다. 인생이 한 번에 무너지는 사람은 대부분 이런 식으로
            무너집니다. 하나가 아니라 도미노처럼.
          </p>
          <p>
            그가 다시 시작한 방식은 우스울 만큼 작았습니다. <span className="mark">매일 11분
            걷기.</span> 왜 하필 11분이냐고 물었더니, 10분은 왠지 대충 정한 숫자 같아서 지키지 않을 것
            같았고, 15분은 힘든 날 못 지킬 것 같았다고 했습니다. 그래서 “못 지킬 핑계가 없는 숫자”로
            11분을 골랐다고요.
          </p>
          <p>
            1년 뒤 그는 11분을 한 번도 빼먹지 않았습니다. 비 오면 지하 주차장을 돌았고, 술 마신
            날엔 새벽에 나갔습니다. 체중은 정확히 4kg 빠졌습니다. 1년에 4kg. 누구도 박수 쳐주지
            않는 숫자입니다. 그런데 <strong>그 1년 동안 그는 “약속을 지키는 사람”이 되어 있었습니다.</strong>
            자기 자신과의 약속을 365번 지킨 사람은, 남과의 약속도 다르게 대합니다.
          </p>
          <p>
            그 신뢰가 먼저 회복됐고, 일은 그 뒤에 따라왔습니다. 지금 그는 작은 팀을 이끌고 있고,
            여전히 11분을 걷습니다. 1,400일째입니다.
          </p>

          <hr />

          <h2>무너지지 않은 사람들의 네 가지 공통점</h2>
          <p>
            세 사람은 서로 모릅니다. 업종도, 나이도, 사연도 다릅니다. 그런데 이야기를 정리하고 나니
            겹치는 것이 네 개 있었습니다.
          </p>
          <ol className="rules">
            <li>
              <b>목표를 줄이고 기준을 올렸다</b>
              크게 벌겠다는 목표는 셋 다 버렸습니다. 대신 오늘 만든 것 하나의 기준을 올렸습니다.
              목표는 통제할 수 없지만 기준은 오늘 당장 통제할 수 있습니다.
            </li>
            <li>
              <b>보는 것을 바꿨다</b>
              잔고, 조회수, 남의 SNS. 매일 보면 마음이 흔들리는 것들에서 눈을 뗐습니다. 대신 자기
              손이 닿는 것 하나만 봤습니다.
            </li>
            <li>
              <b>말 대신 증거를 남겼다</b>
              하겠다고 말한 횟수보다, 남긴 결과물의 개수가 삶을 바꿉니다. 아무도 시키지 않은 것을
              만든 사람만 다음 기회를 받습니다.
            </li>
            <li>
              <b>못 지킬 핑계가 없는 크기로 시작했다</b>
              11분, 한 문단, 한 통의 전화. 작아서 우스운 크기가 유일하게 오래 갑니다. 큰 결심은
              대개 3일을 못 넘깁니다.
            </li>
          </ol>

          <hr />

          <h2>그리고, 지금 이 글을 읽고 있는 당신에게</h2>
          <p>
            새벽에 이런 글을 검색해서 여기까지 읽었다면, 아마 지금 좋은 시기는 아닐 겁니다.
            누군가에게 말하기도 애매하고, 남들은 다 앞서가는 것 같고, 나만 제자리인 것 같은 시기.
            그 마음을 가볍게 위로하지 않겠습니다. 그건 실제로 아픈 일이니까요.
          </p>
          <p>
            다만 한 가지만 기억해 주세요. 위 세 사람의 인생이 바뀐 날은, <strong>기분이 좋아진
            날이 아니었습니다.</strong> 셋 다 기분이 최악인 상태로 아주 작은 행동 하나를 했을
            뿐입니다. 계산기를 버렸고, 종이에 47개를 적었고, 11분을 걸었습니다. 동기부여가 먼저
            오고 행동이 따라오는 게 아니라, 행동이 먼저고 동기부여는 나중에 따라옵니다. 순서가
            거꾸로 알려져 있을 뿐입니다.
          </p>

          <div className="close">
            <p>
              오늘 밤, 딱 하나만 정하세요. 내일 아침에 “아 그거 했지”라고 말할 수 있는, 우스울 만큼
              작은 것 하나. 11분짜리로 충분합니다.
            </p>
            <p>
              그리고 그걸 100번 반복하세요. 100일 뒤의 당신은 지금의 당신보다 대단해져 있지 않을
              수도 있습니다. 하지만 <strong>자기 자신을 신뢰하는 사람</strong>이 되어 있을 겁니다.
              그 신뢰가 나머지 전부를 데려옵니다. 예외를 본 적이 없습니다.
            </p>
            <p>
              당신은 늦지 않았습니다. 그냥 아직 100번을 안 채웠을 뿐입니다.
            </p>
          </div>

          <p className="sign">— 새벽 4시 40분에 켜져 있던 창문들을 기록하며</p>
        </article>
      </div>
      {/* area-guide-link */}
      <footer style={{ maxWidth: 760, margin: '0 auto', padding: '26px 20px 40px', borderTop: '1px solid #e5e7eb', fontSize: '.9rem', lineHeight: 1.8, color: '#6b7280' }}>
        <nav aria-label="사이트 안내">
          <a href="/area/landmark-guide/" style={{ color: '#1f5f8b', textDecoration: 'underline' }}>랜드마크 길찾기</a>
          {' · '}
          {/* 색인된 주소 — 로봇이 홈에서 닿게 하는 허브 링크 (2026-08-31) */}
          <a href="/night/ulsan-champion-night/" style={{ color: '#1f5f8b', textDecoration: 'underline' }}>울산챔피언나이트 방문 순서</a>
        </nav>
      </footer>
      {/* /area-guide-link */}
    </>
  );
}
